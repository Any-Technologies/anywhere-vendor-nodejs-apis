import { Request, Response } from "express";
import dotenv from "dotenv";
import { ZodError } from "zod";
import { HotelRateSchema } from "../../schemas/hotels/hotel-rate.schema";
import { HotelPrebookSchema } from "../../schemas/hotels/hotel-prebook.schema";
import { HotelBookSchema } from "../../schemas/hotels/hotel-book.schema";
import { convertImageUrlToBase64Stream } from "../../utils/image.util";

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

        let apiUrl = `${this.liteAPIBaseAPIURL}/data/hotels`;

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

    async getHotelDetails(req: Request, res: Response) {
        const { hotelId } = req.query;

        let apiUrl = `${this.liteAPIBaseAPIURL}/data/hotel`;

        const queryParams: string[] = [];

        if (hotelId) queryParams.push(`hotelId=${hotelId}`);
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

            const imageUrlsToConvert: any[] = [];

            if (data?.data?.main_photo) {
                imageUrlsToConvert.push(
                    convertImageUrlToBase64Stream(data.data.main_photo).then(base64 => {
                        data.data.main_photo = base64;
                    })
                );
            }
            if (data?.data?.thumbnail) {
                imageUrlsToConvert.push(
                    convertImageUrlToBase64Stream(data.data.thumbnail).then(base64 => {
                        data.data.thumbnail = base64;
                    })
                );
            }
            if (data?.data?.hotelImages && Array.isArray(data.data.hotelImages)) {
                for (const image of data.data.hotelImages) {
                    if (image.urlHd) {
                        imageUrlsToConvert.push(
                            convertImageUrlToBase64Stream(image.urlHd).then(base64 => {
                                image.urlHd = base64;
                            })
                        );
                    }
                }
            }
            await Promise.all(imageUrlsToConvert);
            return res.status(200).json({
                message: "Hotel details fetched successfully",
                data: data?.data,
                status: 200
            });
        } catch (error) {
            console.error("Error fetching hotel details:", error);
            return res.status(400).json({
                message: "Error fetching hotel details",
                status: 400
            });
        }
    }

    async getHotelReviews(req: Request, res: Response) {
        const { hotelId, limit, offset } = req.query;

        let apiUrl = `${this.liteAPIBaseAPIURL}/data/reviews`;

        const queryParams: string[] = [];

        if (hotelId) queryParams.push(`hotelId=${hotelId}`);
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
                message: "Hotel reviews fetched successfully",
                data: data?.data,
                status: 200
            });
        } catch (error) {
            console.error("Error fetching hotel reviews:", error);
            return res.status(400).json({
                message: "Error fetching hotel reviews",
                status: 400
            });
        }
    }

    async getHotelRates(req: Request, res: Response) {
        let apiUrl = `${this.liteAPIBaseAPIURL}/hotels/rates`;

        try {
            const validatedRequestBody = HotelRateSchema.parse(req.body);
            const { hotelIds, occupancies, currency, guestNationality, checkin, checkout } = validatedRequestBody;

            const payload = {
                hotelIds: hotelIds,
                occupancies: occupancies,
                currency: currency,
                guestNationality: guestNationality,
                checkin: checkin,
                checkout: checkout
            };

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "X-API-Key": String(this.liteAPISandboxAPIKey),
                    "accept": "application/json",
                    "content-type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data);
                throw new Error(data?.error?.description);
            }

            return res.status(200).json({
                message: "Hotel rates fetched successfully",
                data: data?.data,
                status: 200
            });
        } catch (error) {
            console.error("Error fetching hotel rates:", error);
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: error.errors,
                    status: 400,
                });
            }
            return res.status(400).json({
                message: "Error fetching hotel rates",
                status: 400
            });
        }
    }

    async initiateHotelPrebooking(req: Request, res: Response) {
        let apiUrl = `${this.liteAPIBaseAPIURL}/rates/prebook`;

        try {
            const validatedRequestBody = HotelPrebookSchema.parse(req.body);
            const { offerId, usePaymentSdk } = validatedRequestBody;

            const payload = {
                offerId: offerId,
                usePaymentSdk: usePaymentSdk
            };

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "X-API-Key": String(this.liteAPISandboxAPIKey),
                    "accept": "application/json",
                    "content-type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data);
                throw new Error(data?.error?.description);
            }

            return res.status(200).json({
                message: "Hotel prebooking initiated successfully",
                data: data?.data,
                status: 200
            });
        } catch (error) {
            console.error("Error initiating hotel prebooking:", error);
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: error.errors,
                    status: 400,
                });
            }
            return res.status(400).json({
                message: "Error initiating hotel prebooking",
                status: 400
            });
        }
    }

    async initiateHotelBooking(req: Request, res: Response) {
        let apiUrl = `${this.liteAPIBaseAPIURL}/rates/book`;

        try {
            const validatedRequestBody = HotelBookSchema.parse(req.body);
            const { holder, payment, prebookId, clientReference, guests } = validatedRequestBody;

            const payload = {
                holder: holder,
                payment: payment,
                prebookId: prebookId,
                clientReference: clientReference,
                guests: guests
            };

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "X-API-Key": String(this.liteAPISandboxAPIKey),
                    "accept": "application/json",
                    "content-type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data);
                throw new Error(data?.error?.description);
            }

            return res.status(200).json({
                message: "Hotel booking initiated successfully",
                data: data?.data,
                status: 200
            });
        } catch (error) {
            console.error("Error initiating hotel booking:", error);
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: error.errors,
                    status: 400,
                });
            }
            return res.status(400).json({
                message: "Error initiating hotel booking",
                status: 400
            });
        }
    }
}