import express from "express"
import cors from "cors"
import ipLookup from "../controllers/ipLookupController";
import integration from "../controllers/integrationController";


const app = express();
app.use(express.json());
app.use(cors());

app.use("/", (req, res) => {
    res.send("Welcome to Telex IP Geolocator")
});
app.get("/integration", integration)
app.post('/ip-lookup', ipLookup)

export default app;