import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  id: number;
  email: string;
  role: 'admin' | 'user';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
} 

export function auth(req: Request, res: Response, next: NextFunction) {
  console.log("🔐 Auth middleware called for:", req.method, req.path);
  console.log("🔐 Authorization header:", req.headers.authorization ? "Present" : "Missing");

  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    console.log("❌ No Bearer token provided");
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const token = header.slice(7);
  console.log("🔐 Token length:", token.length);

  try {
    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
      console.log("❌ JWT_SECRET not set");
      throw new Error("JWT_SECRET not set");
    }
    const payload = jwt.verify(token, secret) as AuthUser;
    console.log("✅ Token verified for user:", payload.email);
    req.user = payload;
    return next();
  } catch (e) {
    console.log("❌ Token verification failed:", (e as Error).message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

export function requireRole(...roles: Array<'admin' | 'user'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    return next();
  };
}
