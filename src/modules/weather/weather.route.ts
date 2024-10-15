import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { WeatherController } from "./weather.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";

export class WeatherRoute {

    private router!: Router;
    private weatherController!: WeatherController;
    private authMiddleware!: AuthMiddleware;

    constructor() {
        this.router = Router();
        this.registerRoutes();
        this.weatherController = new WeatherController();
        this.authMiddleware = new AuthMiddleware();
    }

    registerRoutes(): void {
        this.router.get("/weather", (req: Request, res: Response, next: NextFunction) => this.authMiddleware.verifyToken(req, res, next), async (req: Request, res: Response) => {
            await this.weatherController.getCurrentWeather(req, res);
        });
    }

    getRoutes(): Router {
        return this.router;
    }
}
