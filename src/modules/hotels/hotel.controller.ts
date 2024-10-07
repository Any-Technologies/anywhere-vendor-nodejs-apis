import { Request, Response } from "express";

export class HotelController {

    constructor() { }

    async getHotels(req: Request, res: Response) {
        return res.status(200).json({ message: "Hotels fetched successfully", status: 200 });
    }
}