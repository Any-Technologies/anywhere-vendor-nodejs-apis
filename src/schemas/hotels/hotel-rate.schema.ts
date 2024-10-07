import { z } from "zod";
import validator from "validator";

export const HotelRateSchema = z.object({
    hotelIds: z
        .array(z.string({
            required_error: "Hotel ID is required"
        }).min(1, { message: "Hotel ID cannot be empty" }))
        .nonempty({ message: "At least one hotel ID is required" }),

    occupancies: z.array(
        z.object({
            adults: z.number({
                required_error: "Adults is required"
            }).min(1, { message: "At least 1 adult is required" }),
            children: z.array(z.number().min(0)).optional(),
        })
    ).nonempty({ message: "At least one occupancy is required" }),

    currency: z
        .string({
            required_error: "Currency is required"
        })
        .length(3, { message: "Currency must be a 3-letter code" }),

    guestNationality: z
        .string({
            required_error: "Guest nationality is required"
        })
        .length(2, { message: "Guest nationality must be a 2-letter country code" }),

    checkin: z
        .string({
            required_error: "Check-in date is required"
        })
        .refine((value) => validator.isDate(value, { format: "YYYY-MM-DD" }), {
            message: "Check-in date must be in the format YYYY-MM-DD",
        }),

    checkout: z
        .string({
            required_error: "Check-out date is required"
        })
        .refine((value) => validator.isDate(value, { format: "YYYY-MM-DD" }), {
            message: "Check-out date must be in the format YYYY-MM-DD",
        }),
});