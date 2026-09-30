const fs = require("fs");
const path = require("path");
const fileName = "dataHandler.js";

// ===== internal functions ===== //
function handleError(e){ 
    if(e.code === "ENOENT"){
        return console.error("[ dataHandler.js - handleError ] Error: Database file does not exist.");
    }
    return console.error("[ dataHandler.js - handleError ] Error:", e);
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
async function writeFileData(data, database){
    try{
        await fs.promises.writeFile(database, JSON.stringify(data, null, 4));
    }
    catch(e){
        return handleError(e);
    }
}

// ===== public functions ===== //
async function readDatabase(database){
    try{
        if(!await checkFile(database)){
            return;
        }

        const data = await readFileData(database);

        console.log(`[ ${fileName} | readDatabase ] -- Database:`, data);
        return data;
    }
    catch(e){
        return handleError(e);
    }
}
async function writeData(objectKey, dataObject, database){
    let data = {};

    try{
        if(await checkFile(database)){
            try{
                data = await readFileData(database); // getting previous data
            }
            catch(e){
                throw new Error(`[ ${fileName} | writeData ] -- Error parsing database`, e);
            }
        }

        data[objectKey] = dataObject;

        const success = writeFileData(data, database);
        if(success){
            return console.log(`[ ${fileName} | writeData] -- Added "${objectKey}" to database.`);
        }
        else{
            return false;
        }
    }
    catch(e){
        return handleError(e);
    }
}

// ===== exports ===== //
module.exports = {readDatabase, writeData};