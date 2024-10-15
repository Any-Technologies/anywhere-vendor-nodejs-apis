import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export class WeatherController {

    private openWeatherAPIKey!: string | null;
    private openWeatherBaseAPIURL!: string | null;

    constructor() {
        this.openWeatherAPIKey = String(process.env.OPENWEATHER_API_KEY);
        this.openWeatherBaseAPIURL = String(process.env.OPENWEATHER_API_BASE_URL);
    }

    async getCurrentWeather(req: Request, res: Response) {
        const { lat, lon } = req.query;

        let apiUrl = `${this.openWeatherBaseAPIURL}/weather?appid=${this.openWeatherAPIKey}&lat=${lat}&lon=${lon}`;

        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "accept": "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data);
                throw new Error(data?.error?.description);
            }

            return res.status(200).json({
                message: "Weather data fetched successfully",
                data: data,
                status: 200
            });
        } catch (error) {
            console.error("Error fetching weather data:", error);
            return res.status(400).json({
                message: "Error fetching weather data",
                status: 400
            });
        }
    }
}