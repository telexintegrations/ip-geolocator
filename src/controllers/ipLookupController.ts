import axios from "axios";
import express, { Request, Response } from "express";

const IP_LOOKUP_API = "http://ip-api.com/json/";

interface TelexRequest {
  channel_id: string;
  message: string;
}

interface TelexResponse {
  event_name: string;
  message: string;
  status: string;
  username: string;
}

const ipLookup = async (req: Request, res: Response): Promise<any> => {
  const { channel_id, message }: TelexRequest = req.body;

  if (!message) {
    return res.status(400).json({ error: "Invalid request. 'message' is required." });
  }

  try {
    // Extract IP from message
    const ipMatch = message.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b|\b(?:[a-fA-F0-9:]+:+)+[a-fA-F0-9]+\b/);

    if (!ipMatch) {
      return res.status(200).json({ 
        event_name: "ip_lookup", 
        message: "⚠️ No valid IP address found in the message.", 
        status: "error", 
        username: "ip-lookup-bot" 
      });
    }

    const ip = ipMatch[0];
    const response = await axios.get(`${IP_LOOKUP_API}${ip}`, { timeout: 900 });
    
    // Check if IP lookup failed
    if (response.data.status === "fail") {
      return res.status(200).json({ 
        event_name: "ip_lookup", 
        message: `⚠️ Invalid IP address: ${ip}`, 
        status: "error", 
        username: "ip-lookup-bot" 
      });
    }

    const { country, regionName, city, isp, query, lat, lon } = response.data;

    const formattedMessage = `🌍 IP Lookup Result 🌍\n
🔹 IP Address: ${query}  
📍 Country: ${country || "N/A"}  
🏙️ Region: ${regionName || "N/A"} 
📍 Latitude: ${lat || "N/A"}
📍 Longitude: ${lon || "N/A"}
🌆 City: ${city || "N/A"}  
💻 ISP: ${isp || "N/A"}`;

    const telexResponse: TelexResponse = {
      event_name: "ip_lookup",
      message: formattedMessage,
      status: "success",
      username: "ip-lookup-bot",
    };

    return res.status(200).json(telexResponse);
  } catch (error) {
    return res.status(500).json({ 
      event_name: "ip_lookup", 
      message: "⚠️ Error retrieving IP details.", 
      status: "error", 
      username: "ip-lookup-bot" 
    });
  }
};

export default ipLookup;
