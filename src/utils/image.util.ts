import axios from "axios";
import https from "https";

export const convertImageUrlToBase64 = async (url: string): Promise<string> => {
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        const mimeType = url.includes(".png") ? "image/png" : "image/jpeg";
        const base64Image = Buffer.from(response.data, "binary").toString("base64");

        return `data:${mimeType};base64,${base64Image}`;
    } catch (error) {
        console.error("Error converting image url to Base64:", error);
        throw error;
    }
}