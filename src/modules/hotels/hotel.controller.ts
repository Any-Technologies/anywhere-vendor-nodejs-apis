import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
export class HotelController {

    private liteAPISandboxAPIKey!: string | null;
    private liteAPIBaseAPIURL!: string | null;

    constructor() {
        this.liteAPISandboxAPIKey = String(process.env.LITEAPI_SANDBOX_API_KEY);
        this.liteAPIBaseAPIURL = String(process.env.LITEAPI_API_BASE_URL);
    }

    async getHotels(req: Request, res: Response) {
        const { countryCode, cityName, hotelName, aiSearch, minReviewsCount, zip, longitude, latitude, limit, offset } = req.query;

        let apiUrl = `${this.liteAPIBaseAPIURL}/hotels`;

        const queryParams: string[] = [];

        if (countryCode) queryParams.push(`countryCode=${countryCode}`);
        if (cityName) queryParams.push(`cityName=${cityName}`);
        if (hotelName) queryParams.push(`hotelName=${hotelName}`);
        if (aiSearch) queryParams.push(`aiSearch=${encodeURIComponent(aiSearch as string)}`);
        if (minReviewsCount) queryParams.push(`minReviewsCount=${minReviewsCount}`);
        if (zip) queryParams.push(`zip=${zip}`);
        if (longitude) queryParams.push(`longitude=${longitude}`);
        if (latitude) queryParams.push(`latitude=${latitude}`);
        if (limit) queryParams.push(`limit=${limit}`);
        if (offset) queryParams.push(`offset=${offset}`);

        if (queryParams.length > 0) {
            apiUrl += `?${queryParams.join('&')}`;
        }

        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "X-API-Key": String(this.liteAPISandboxAPIKey),
                    "accept": "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data);
                throw new Error(data?.error?.description);
            }

            return res.status(200).json({
                message: "Hotels fetched successfully",
                data: data?.data,
                status: 200
            });
        } catch (error) {
            console.error("Error fetching hotels:", error);
            return res.status(400).json({
                message: "Error fetching hotels",
                status: 400
            });
        }
    }

}