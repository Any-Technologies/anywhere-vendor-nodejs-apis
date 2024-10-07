import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { HotelController } from "./hotel.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";

export class HotelRoute {

    private router!: Router;
    private hotelController!: HotelController;
    private authMiddleware!: AuthMiddleware;

    constructor() {
        this.router = Router();
        this.registerRoutes();
        this.hotelController = new HotelController();
        this.authMiddleware = new AuthMiddleware();
    }

    registerRoutes(): void {
        this.router.get("/hotels", (req: Request, res: Response, next: NextFunction) => this.authMiddleware.verifyToken(req, res, next), async (req: Request, res: Response) => {
            await this.hotelController.getHotels(req, res);
        });
    }

    getRoutes(): Router {
        return this.router;
    }
}
