import { z } from "zod";

export const HotelBookSchema = z.object({
    holder: z.object({
        firstName: z.string({
            required_error: "First name is required",
        }).min(1, { message: "First name cannot be empty" }),
        lastName: z.string({
            required_error: "Last name is required",
        }).min(1, { message: "Last name cannot be empty" }),
        email: z.string({
            required_error: "Email is required",
        }).email({ message: "Invalid email address" }),
    }),

    payment: z.object({
        method: z.enum(["TRANSACTION_ID"], {
            required_error: "Payment method is required",
        }),
        transactionId: z.string({
            required_error: "Transaction ID is required",
        }).min(1, { message: "Transaction ID cannot be empty" }),
    }),

    prebookId: z.string({
        required_error: "Prebook ID is required",
    }).min(1, { message: "Prebook ID cannot be empty" }),

    clientReference: z.string().optional(),

    guests: z.array(z.object({
        occupancyNumber: z.number({
            required_error: "Occupancy number is required",
        }).min(1, { message: "Occupancy number must be at least 1" }),
        firstName: z.string({
            required_error: "First name is required",
        }).min(1, { message: "First name cannot be empty" }),
        lastName: z.string({
            required_error: "Last name is required",
        }).min(1, { message: "Last name cannot be empty" }),
        email: z.string({
            required_error: "Email is required",
        }).email({ message: "Invalid email address" }),
    })).nonempty({ message: "At least one guest is required" }),
});
