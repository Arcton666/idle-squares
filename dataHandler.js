const fs = require("fs");
const path = require("path");
const { setUncaughtExceptionCaptureCallback } = require("process");
const fileName = "dataHandler.js";

// ===== internal functions ===== //
function handleError(e){ 
    if(e.code === "ENOENT"){
        return console.error("[ dataHandler.js - handleError ] Error: Database file does not exist.");
    }
    throw new Error("[ dataHandler.js - handleError ] Error:", e);
}
async function checkFile(database){
    try{
        return await fs.promises.access(database, fs.constants.F_OK);
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
let reading = false;
async function readDatabase(database){
    while(reading){
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    reading = true;

    try{
        await checkFile(database)
    }
    catch(e){
        handleError(e);
    }

    try{
        const data = await readFileData(database);

        console.log(`[ ${fileName} | readDatabase ] -- Database:`, data);
        reading = false;
        return data;
    }
    catch(e){
        return handleError(e);
    }
}
let writing = false;
async function writeData(objectKey, dataObject, database){
    while(writing){
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    writing = true;

    let data = {};

    try{
        await checkFile(database);
    }
    catch(e){
        handleError(e);
    }

    try{
        data = await(readFileData(database));
    }
    catch(e){
        throw new Error(`[ ${fileName} | writeData ] -- Error parsing database`, e);
    }

    data[objectKey] = dataObject;

    try{
        await writeFileData(data, database);
        console.log(`[ ${fileName} | writeData] -- Added "${objectKey}" to database.`);
    }
    catch(e){
        console.error(`[ ${fileName} | writeData] -- Couldn't write data.`)
        handleError(e);
    }    

    writing = false;
}

// ===== exports ===== //
module.exports = {readDatabase, writeData};

// lol