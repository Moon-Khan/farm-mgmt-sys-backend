import { Request, Response } from "express";
import { BaseController } from "./basecontroller";
import { User } from "../models";
import sequelize from "../config/sequelize";
import { AuthUser } from "../middleware/auth";
import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";

class AuthController extends BaseController {
  private sign(user: AuthUser) {
    const secretEnv = process.env.JWT_SECRET;
    const expiresInEnv = process.env.JWT_EXPIRES_IN;
    if (!secretEnv) {
      throw new Error("JWT_SECRET not set");
    }
    const secret: Secret = secretEnv;
    const expiresIn: SignOptions["expiresIn"] = (expiresInEnv ?? "7d") as SignOptions["expiresIn"];
    return jwt.sign(user, secret, { expiresIn });
  }

  // POST /v1/auth/signup
  async signup(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return this.error(req, res, this.status.BAD_REQUEST, "name, email, password are required");
      }

      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return this.error(req, res, this.status.CONFLICT, "Email already in use");
      }

      // Fail fast if JWT is misconfigured before touching DB
      if (!process.env.JWT_SECRET) {
        return this.error(req, res, this.status.INTERNAL_SERVER_ERROR, "Authentication is misconfigured");
      }

      const t = await sequelize.transaction();
      try {
        const hash = await bcrypt.hash(password, 10);
        const created = await User.create({ name, email, password_hash: hash }, { transaction: t });

        // Attempt to sign token; if this throws, rollback to avoid persisting user
        const token = this.sign({ id: created.id, email: created.email, role: created.role });

        await t.commit();
        return this.success(req, res, this.status.CREATED, {
          token,
          user: { id: created.id, name: created.name, email: created.email, role: created.role }
        }, "Signup successful");
      } catch (err) {
        await t.rollback();
        throw err;
      }
    } catch (e) {
      this.handleServiceError(req, res, e, "Failed to signup");
    }
  }

  // POST /v1/auth/login
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return this.error(req, res, this.status.BAD_REQUEST, "email and password are required");
      }

      const user = await User.findOne({ where: { email } });
      if (!user) return this.error(req, res, this.status.UNAUTHORIZED, "Invalid credentials");

      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) return this.error(req, res, this.status.UNAUTHORIZED, "Invalid credentials");

      const token = this.sign({ id: user.id, email: user.email, role: user.role });
      return this.success(req, res, this.status.OK, {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      }, "Login successful");
    } catch (e) {
      this.handleServiceError(req, res, e, "Failed to login");
    }
  }

  // GET /v1/auth/me
  async me(req: Request, res: Response) {
    try {
      const id = req.user?.id;
      if (!id) return this.error(req, res, this.status.UNAUTHORIZED, "Unauthorized");
      const user = await User.findByPk(id);
      if (!user) return this.error(req, res, this.status.NOT_FOUND, "User not found");
      return this.success(req, res, this.status.OK, {
        id: user.id, name: user.name, email: user.email, role: user.role
      }, "Fetched profile");
    } catch (e) {
      this.handleServiceError(req, res, e, "Failed to fetch profile");
    }
  }

  // PUT /v1/auth/me
  async updateMe(req: Request, res: Response) {
    try {
      const id = req.user?.id;
      if (!id) return this.error(req, res, this.status.UNAUTHORIZED, "Unauthorized");
      const { name, password } = req.body;
      const user = await User.findByPk(id);
      if (!user) return this.error(req, res, this.status.NOT_FOUND, "User not found");

      if (name) user.name = name;
      if (password) user.password_hash = await bcrypt.hash(password, 10);
      await user.save();

      return this.success(req, res, this.status.OK, {
        id: user.id, name: user.name, email: user.email, role: user.role
      }, "Profile updated");
    } catch (e) {
      this.handleServiceError(req, res, e, "Failed to update profile");
    }
  }
}

export default new AuthController();
