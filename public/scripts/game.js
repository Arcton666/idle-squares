document.addEventListener("DOMContentLoaded", async () => {
    /*
        DO THIS SOMEDAY
        ## auto scale font sizes when things update in the slots
        ## example v v v

        sectionTextSlotUpgrade.style.fontSize = `${17 - slotUpgrade.toString().length}px`;

        sectionTextSlotLevel.style.fontSize = `${17 - slotLevel.toString().length}px`;
    */

    // fetch data
    async function fetchData(url){
        try{
            const res = await fetch(url);
            if(!res.ok){
                throw new Error("Server response status:", res.status);
            }
            const result = await res.json();
            if(result.error){
                throw new Error("Failed parsing response:", result.error);
            }

            return result;
        }
        catch(e){
            throw new Error("Something failed:", e);
        }
    }

    // get slot data
    function getSlotData(database, slotId){
        const slotLevel = database[`slot${slotId}`].level;
        const slotEarning = database[`slot${slotId}`].earning;
        const slotEarned = database[`slot${slotId}`].earned;
        const slotUpgrade = database[`slot${slotId}`].upgrade;
        const slotUpdate = database[`slot${slotId}`].update;

        const slotData = [slotLevel, slotEarning, slotEarned, slotUpgrade, slotUpdate];

        return slotData;
    }

    function setSlotData(slotId, level, earning, earned, upgrade, update){
        const slot = {
            key: `slot${slotId}`,
            value: {
                level: level,
                earning: earning,
                earned: earned,
                upgrade: upgrade,
                update: update
            }
        }

        return slot;
    }

    // auto-scale slot font
    function autoScaleFont(number, object, baseFontSize){
        // base string: Upgrade: $ 
        const numberString = number.toString();
        const newSize = baseFontSize - numberString.length;

        object.style.fontSize = `${newSize}px`;
    }

    // create section
    const sectionBox = document.getElementById("div-slots");
    let identifier = 0;
    async function CreateSection(){
        identifier++;
        // ===== creating new slot data ===== //
        const defaultSlotLevel = 1;
        const defaultSlotEarning = 1;
        const defaultSlotEarned = 0;
        const defaultSlotUpgrade = 100;
        const defaultSlotUpdate = 1000; // NEVER change this to below 10 under ANY circumstance

        const slot = `slot${identifier}`
        const newSlot = {
            key: slot,
            value: {
                level: defaultSlotLevel,
                earning: defaultSlotEarning,
                earned: defaultSlotEarned,
                upgrade: defaultSlotUpgrade,
                update: defaultSlotUpdate
            }
        };

        // writing new slot data into slots database
        let res;
        try{
            res = await fetch("/database/write/slots", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(newSlot)
            });
        }
        catch(e){
            throw new Error(e);
        }
        if(!res.ok){
            console.warn(res);
            return console.error("Failed to fetch url.");
        }

        // ===== creating slot divs ===== //
        const slotLevelText = `Level: ${defaultSlotLevel}`;
        const slotEarningText = `$0`;
        const slotUpgradeText = `Upgrade: $${defaultSlotUpgrade}`;

        // main slot div
        const section = document.createElement("div");
        section.className = "slot";
        section.id = `slot-${identifier}`;
        sectionBox.appendChild(section);

        // slot texts [level, earning]
        const sectionTextSlotLevel = document.createElement("text");
        sectionTextSlotLevel.className = "text-slot-level";
        sectionTextSlotLevel.id = `text-slot-level-${identifier}`;
        sectionTextSlotLevel.innerHTML = slotLevelText;

        const sectionTextSlotEarning = document.createElement("text");
        sectionTextSlotEarning.className = "text-slot-earning";
        sectionTextSlotEarning.id = `text-slot-earning-${identifier}`
        sectionTextSlotEarning.innerHTML = slotEarningText;

        // slot button [upgrade]
        const btnSlotUpgrade = document.createElement("button");
        btnSlotUpgrade.className = "button-slot-upgrade";
        btnSlotUpgrade.id = `button-slot-upgrade-${identifier}`;
        btnSlotUpgrade.innerHTML = slotUpgradeText;

        // divs for slot texts
        for(let i = 0; i < 3; i++){
            const sectionDivSlotText = document.createElement("div");
            sectionDivSlotText.className = "div-slot-text"
            section.appendChild(sectionDivSlotText);

            if(i == 0){
                sectionDivSlotText.appendChild(sectionTextSlotLevel);
            }
            else if(i == 1){
                sectionDivSlotText.appendChild(sectionTextSlotEarning);
            }
            else if(i == 2){
                sectionDivSlotText.appendChild(btnSlotUpgrade);
            }
            else{
                console.warn("increment overflow");
            }
        }

        // assign unique(lol) updater
        UpdateSlot(identifier);

        // debug outputs
        console.log("Section created successfully");
        console.log("ID:", section.id);
        //console.log("Data:", slotDatabase);
        console.log("L:", defaultSlotLevel);
        console.log("E:", defaultSlotEarning);
        console.log("U", defaultSlotUpgrade);
        console.log("U2", defaultSlotUpdate);
        console.log("==========");

    }

    async function UpdateSlot(slotId){
        // increment earned value by the slot's earning
        // fetch every data
        // update every data
        // not efficient but good enough for now

        let slotDatabase;
        try{
            slotDatabase = await fetchData("/database/read/slots");
        }
        catch(e){
            return console.error("[ Couldn't fetch data for updating ]", e);
        }
        const slotLevel = slotDatabase[`slot${slotId}`].level;
        let slotEarning = slotDatabase[`slot${slotId}`].earning;
        let slotEarned = slotDatabase[`slot${slotId}`].earned;
        const slotUpgrade = slotDatabase[`slot${slotId}`].upgrade;
        const slotUpdate = slotDatabase[`slot${slotId}`].update;

        const slotText = document.getElementById(`text-slot-earning-${slotId}`)
        let earned = slotEarned;

        setInterval(async () => {
            slotEarning = slotDatabase[`slot${slotId}`].earning; // refreshing (in case upgrade happens)
            earned += slotEarning
            
            slotText.innerHTML = `$${earned}`

            // prepare slot for update
            const updatedSlot = {
                key: `slot${slotId}`,
                value: {
                    level: slotLevel,
                    earning: slotEarning,
                    earned: earned,
                    upgrade: slotUpgrade,
                    update: slotUpdate
                }
            }

            // update slot
            let res;
            try{
                res = await fetch("/database/write/slots", {
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify(updatedSlot)
                })
            }
            catch(e){
                return console.error("[ Failed to update slot ]", e)
            }
        }, slotUpdate);
    }

    // Create the very first section
    await CreateSection();
    
    Array.from(document.getElementsByClassName("button-slot-upgrade")).forEach(button => {

        //
        const money = 100; // FOR DEBUGGING ONLY
        const earningConstant = 10;
        //

        button.addEventListener("click", async () => {
            const btnId = Number(button.id.match(/\d+/)[0]); // made with ai, its strange, i dont understand it, i just need the ID number man

            let slotDatabase;
            try{
                slotDatabase = await fetchData("/database/read/slots")
            }
            catch(e){
                return console.error("[ Couldn't fetch data for upgrading ]", e);
            }

            const slotData = getSlotData(slotDatabase, btnId);
            
            if(money < slotData[3]){
                return console.warn("Not enough money to upgrade");
            }

            const upgradedEarning = slotData[0] * earningConstant;
            const upgradedUpgrade = slotData[3] * earningConstant;

            const upgradedSlot = setSlotData(btnId, slotData[0], upgradedEarning, slotData[2], upgradedUpgrade, slotData[4]);

            let res;
            try{
                res = await fetch("/database/write/slots", {
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify(upgradedSlot)
                })
            }
            catch(e){
                return console.error("[ Failed to upgrade slot ]", e);
            }

            UpdateSlot(btnId);
        })
    })

    // tmeporal button
    document.getElementById("btn-test").addEventListener("click", async () => {
        try{
            const res = await fetch("/database/read/temp");
            if(!res.ok){
                throw new Error("Server response status:", res.status);
            }
            const result = await res.json();
            if(result.error){
                throw new Error("Failed parsing response:", result.error);
            }

            console.log("[ game.js ] - Database:", result);
        }
        catch(e){
            throw new Error("Something failed:", e);
        }
    })
})
