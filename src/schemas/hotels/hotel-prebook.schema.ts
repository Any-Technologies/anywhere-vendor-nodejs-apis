import { z } from "zod";

export const HotelPrebookSchema = z.object({
    offerId: z.string({
        required_error: "Offer ID is required"
    }).min(1, { message: "Offer ID cannot be empty" }),

    usePaymentSdk: z.boolean({
        required_error: "Use payment SDK is required"
    }),

    voucherCode: z.string().optional()
});