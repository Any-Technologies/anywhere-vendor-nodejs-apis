import axios from "axios";
import https from "https";
import { Readable } from "stream";

export const convertImageUrlToBase64Stream = async (url: string): Promise<string> => {
    try {
        const response = await axios({
            url,
            method: "GET",
            responseType: "stream",
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        const mimeType = url.includes(".png") ? "image/png" : "image/jpeg";
        const chunks: any[] = [];
        return new Promise((resolve, reject) => {
            response.data.on('data', (chunk: any) => chunks.push(chunk));
            response.data.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const base64Image = buffer.toString("base64");
                resolve(`data:${mimeType};base64,${base64Image}`);
            });
            response.data.on('error', reject);
        });
    } catch (error) {
        console.error("Error converting image URL to Base64 (stream):", error);
        throw error;
    }
}