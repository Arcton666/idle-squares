const express = require("express");
const path = require("path");
const {readDatabase, writeData, wipeData, dataPathTemp} = require("./dataHandler");

const app = express();
const PORT = 6661;

// serving frontend files
app.use(express.static(path.join(__dirname, "public")));

// use express.json lol
app.use(express.json());

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
app.post("/database/write/slots", async (req, res) => {
    try{
        console.log("(server.js) Recieved data: ", req.body);

        const {key, value} = req.body;

        if(!key || !value){
            return res.status(400).json({origin: "server.js", error: "Invalid data format"});
        }
        

        const success = await writeData(key, value, databaseSlots);
        if(success){
            res.status(200).json({origin: "server.js", message: "Data writed to database successfully", data: key});
        }
        else{
            res.status(500).json({origin: "server.js", error: "Failed to write data."}) 
        }  
    }
    catch(e){
        res.status(500).json({origin: "server.js", error: e});
    }
})

// start the server at port
app.listen(PORT, () => {
    console.log(`Server running at [http://localhost:${PORT}].`);
})