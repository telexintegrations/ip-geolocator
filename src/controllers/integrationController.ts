import { Request, Response, NextFunction } from "express";

const integration = (req: Request, res: Response, next: NextFunction) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    res.json({
        data: {
            descriptions: {
                app_name: "IP Geolocator",
                app_description: "Extracts IP addresses from messages and retrieves location details.",
                app_url: baseUrl,
                app_logo: "https://img.freepik.com/premium-vector/ip-address-vector-icon-can-be-used-web-hosting-iconset_717774-90046.jpg",
                background_color: "#ffffff"
            },
            integration_type: "modifier",
            integration_category: "Monitoring & Logging",
            key_features: [
                "Automatically detects IPv4 and IPv6 addresses in messages.",
                "Fetches geolocation details including country, region, city, and ISP.",
                "Sends formatted IP details back to the Telex channel.",
                "Provides instant and automated IP intelligence."
            ],
            settings: [],
            target_url: `${baseUrl}/ip-lookup`,
        }
    });
}

export default integration;
