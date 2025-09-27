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
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const token = header.slice(7);
  try {
    const secret = process.env.JWT_SECRET as string;
    if (!secret) throw new Error("JWT_SECRET not set");
    const payload = jwt.verify(token, secret) as AuthUser;
    req.user = payload;
    return next();
  } catch (e) {
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
