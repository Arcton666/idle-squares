const fs = require("fs");
const path = require("path");

// ===== internal functions ===== //
function handleError(e){ 
    if(e.code === "ENOENT"){
        return console.error("[ dataHandler.js - handleError() ] Error: Database file does not exist.");
    }
    return console.error("[ dataHandler.js - handleError() ] Error:", e);
}
async function checkFile(database){
    try{
        await fs.promises.access(database, fs.constants.F_OK);
        return true;
    }
    catch(e){
        return handleError(e);
    }
}
async function readFileData(database){
    try{
        const data = await fs.promises.readFile(database, "utf8");
        return JSON.parse(data);
    }
    catch(e){
        handleError(e);
    }
}

// ===== public functions ===== //
async function readDatabase(database){
    try{
        if(!await checkFile(database)){
            return;
        }

        const data = await readFileData(database);

        console.log("Database: ", data);
        return data;
    }
    catch(e){
        return handleError(e);
    }
}

// ===== exports ===== //
module.exports = {readDatabase};