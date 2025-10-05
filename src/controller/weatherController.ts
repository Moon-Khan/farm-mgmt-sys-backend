import { Request, Response } from "express";
import { BaseController } from "./basecontrotller";

class WeatherController extends BaseController {
  // GET /v1/weather?lat=..&lon=.. OR ?city=..
  async getWeather(req: Request, res: Response) {
    try {
      const { lat, lon, city } = req.query as { lat?: string; lon?: string; city?: string };

      // If a fully-formed WEATHER_API URL is provided, use it directly
      const presetUrl = process.env.WEATHER_API;
      let url: string;
      if (presetUrl) {
        url = presetUrl;
      } else {
        // Construct URL using OpenWeather REST if preset not provided
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
          return this.error(
            req,
            res,
            this.status.SERVICE_UNAVAILABLE,
            "Weather service not configured: provide WEATHER_API or OPENWEATHER_API_KEY"
          );
        }

        const base = "https://api.openweathermap.org/data/2.5/weather";
        if (lat && lon) {
          url = `${base}?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=metric&appid=${apiKey}`;
        } else if (city) {
          url = `${base}?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
        } else {
          const defaultCity = process.env.DEFAULT_CITY || "Lahore";
          url = `${base}?q=${encodeURIComponent(defaultCity)}&units=metric&appid=${apiKey}`;
        }
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
