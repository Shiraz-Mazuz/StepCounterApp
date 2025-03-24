require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("server is running...");
});

app.get("/api/conversion-config",(req,res)=>{
    res.json({
      stepsPerThreshold: 1000, 
      coinsPerThreshold: 10,  
    });
  });

app.post("/updateCoins",async(req,res)=>{
    const { PlayFabId, coins } = req.body;
    if(!PlayFabId || !coins){
        return res.status(400).json({error: "Missing PlayFabId or coins"});
    } try{
        const response = await axios.post(
            "https://607AC.playfabapi.com/Server/AddUserVirtualCurrency",
            {
                PlayFabId,
                VirtualCurrency: "GC",
                Amount: coins
            }, {
                headers: {
                    "X-SecretKey":  process.env.PLAYFAB_SECRET_KEY,
                    "Content-Type": "application/json"
                }
            }

        );

        res.json({ success: true, data: response.data});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})




app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}`);
})