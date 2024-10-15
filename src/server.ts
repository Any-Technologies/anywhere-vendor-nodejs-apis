import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import { conn } from "./configs/database.config";
import { HotelRoute } from "./modules/hotels/hotel.route";
import { WeatherRoute } from "./modules/weather/weather.route";

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: "*",
    methods: ["*"],
    allowedHeaders: ["*"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/vendor/liteapi", new HotelRoute().getRoutes());
app.use("/vendor/openweather", new WeatherRoute().getRoutes());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello World!", status: 200 });
});

(async () => {
    try {
        await conn();
        app.listen(PORT, () => {
            console.log(`Server is running on http://127.0.0.1:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start application:", error);
    }
})();