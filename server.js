const express = require("express");
const path = require("path");
const {readDatabase, writeData, wipeData, dataPathTemp} = require("./dataHandler");

const app = express();
const PORT = 6661;

// serving frontend files
app.use(express.static(path.join(__dirname, "public")));

// get requests
const databaseTemp = path.join(__dirname, "data/temp.json")
app.get("/database/read/temp", async (req, res) => {
    try{
        const data = await readDatabase(databaseTemp);
        if(data !== null && data !== false){
            return res.json(data);
        }
        else{
            return res.status(500).json({origin: "server.js", error: "Unable to read database [temp.json]"});
        }
    }
    catch(e){
        return res.status(500).json({origin: "server.js", error: e.message});
    }
})
const databaseSlots = path.join(__dirname, "data/slots.json");
app.get("/database/read/slots", async (req, res) => {
    try{
        const data = await readDatabase(databaseSlots);
        if(data !== null && data !== false){
            return res.json(data);
        }
        else{
            return res.status(500).json({origin: "server.js", error: "Unable to read database [slots.json]"})
        }
    }
    catch(e){
        return res.status(500).json({origin: "server.js", error: e.message});
    }
})

// post requests

// start the server at port
app.listen(PORT, () => {
    console.log(`Server running at [http://localhost:${PORT}].`);
})