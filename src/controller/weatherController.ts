import { Request, Response } from "express";
import { BaseController } from "./basecontrotller";

class WeatherController extends BaseController {
  // GET /v1/weather?lat=..&lon=.. OR ?city=..
  async getWeather(req: Request, res: Response) {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        return this.error(req, res, this.status.SERVICE_UNAVAILABLE, "Weather service not configured");
      }

      const { lat, lon, city } = req.query as { lat?: string; lon?: string; city?: string };

      let url: string;
      if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${apiKey}&units=metric`;
      } else if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      } else {
        // Default city fallback
        const defaultCity = process.env.DEFAULT_CITY || "Lahore";
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(defaultCity)}&appid=${apiKey}&units=metric`;
      }

      const resp = await fetch(url);
      if (!resp.ok) {
        const txt = await resp.text();
        return this.error(req, res, this.status.SERVICE_UNAVAILABLE, `Weather API error: ${txt}`);
      }
      const data = await resp.json();

      const mapped = {
        temperature: data?.main?.temp ?? null,
        humidity: data?.main?.humidity ?? null,
        expectedRain: data?.rain?.["1h"] ?? data?.rain?.["3h"] ?? 0,
        status: data?.weather?.[0]?.description ?? "",
        raw: data,
      };

      return this.success(req, res, this.status.OK, mapped, "Weather fetched");
    } catch (e) {
      this.handleServiceError(req, res, e, "Failed to fetch weather");
    }
  }
}

export default new WeatherController();
