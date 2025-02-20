import request from "supertest";
import app from "../config/app.config";  // Adjust this path if needed

describe("IP Lookup Telex Integration", () => {
  
  // ✅ Test: Integration details
  it("should return integration details", async () => {
    const res = await request(app).get("/integration");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.descriptions.app_name).toBe("IP Geolocator");
    expect(res.body.data.target_url).toContain("/ip-lookup");
  });

  // ✅ Test: Valid IP lookup
  it("should return geolocation details when a valid IP is provided", async () => {
    const res = await request(app).post("/ip-lookup").send({
      channel_id: "12345",
      message: "Check this IP: 8.8.8.8"
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("event_name", "ip_lookup");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toContain("IP Address: 8.8.8.8");
    expect(res.body).toHaveProperty("status", "success");
  });

  // ❌ Test: No valid IP in message (Should return 400)
  it("should return 400 when no valid IP is found in the message", async () => {
    const res = await request(app).post("/ip-lookup").send({
      channel_id: "12345",
      message: "Hello, how are you?"
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("event_name", "ip_lookup");
    expect(res.body).toHaveProperty("message", "⚠️ No valid IP address found in the message.");
    expect(res.body).toHaveProperty("status", "error");
  });

  // ❌ Test: Missing 'message' field (Should return 400)
  it("should return 400 when 'message' is missing", async () => {
    const res = await request(app).post("/ip-lookup").send({
      channel_id: "12345"
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid request. 'message' is required.");
  });

  // ❌ Test: Invalid IP lookup (Should return 400)
  it("should return 400 for an invalid IP lookup", async () => {
    const res = await request(app).post("/ip-lookup").send({
      channel_id: "12345",
      message: "Check this IP: 999.999.999.999"
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("event_name", "ip_lookup");
    expect(res.body).toHaveProperty("message", "⚠️ Invalid IP address: 999.999.999.999");
    expect(res.body).toHaveProperty("status", "error");
  });

});
