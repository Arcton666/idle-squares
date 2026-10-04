document.addEventListener("DOMContentLoaded", async () => {
    /*
        DO THIS SOMEDAY
        ## auto scale font sizes when things update in the slots
        ## example v v v

        sectionTextSlotUpgrade.style.fontSize = `${17 - slotUpgrade.toString().length}px`;

        sectionTextSlotLevel.style.fontSize = `${17 - slotLevel.toString().length}px`;
    */

    // ===== [ get / set ] data functions, NOT fetching ===== //
    function getSlotData(database, id){
        return [
            database[`slot${id}`].level,
            database[`slot${id}`].earning,
            database[`slot${id}`].earned,
            database[`slot${id}`].upgrade,
            database[`slot${id}`].update
        ];
    }
    function setSlotData(id, l, e, e2, u, u2){
        return {
            key: `slot${id}`,
            value: {
                level: l,
                earning: e,
                earned: e2,
                upgrade: u,
                update: u2
            }
        }
    }

    // ===== create slot ===== //
    const sectionBox = document.getElementById("div-slots");
    let identifier = 0;
    async function CreateSection(){
        identifier++;

        //creating new slot data
        const defaultSlotLevel = 1;
        const defaultSlotEarning = 1;
        const defaultSlotEarned = 0;
        const defaultSlotUpgrade = 100;
        const defaultSlotUpdate = 1000; // NEVER change this to below 10 under ANY circumstance
        
        const newSlot = setSlotData(
            identifier,
            defaultSlotLevel,
            defaultSlotEarning,
            defaultSlotEarned,
            defaultSlotUpgrade,
            defaultSlotUpdate
        )

        // writing new slot data into slots database
        try{
            const res = await fetch("/database/write/slots", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(newSlot)
            });
            if(!res.ok){
                console.warn(res);
                return console.error("Failed to fetch url. Status code:", res.status);
            }
        }
        catch(e){
            throw new Error(e);
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

        // debug outputs
        console.log("Section created successfully");
        console.log("Class:", section.className)
        console.log("ID:", section.id);
        console.log("L:", defaultSlotLevel);
        console.log("E:", defaultSlotEarning);
        console.log("U", defaultSlotUpgrade);
        console.log("U2", defaultSlotUpdate);
        console.log("==========");

    }

    async function UpdateSlot(){
        // increment earned value by the slot's earning
        // fetch every data
        // update every data
        // not efficient but good enough for now

        setInterval(async () => {
            let slotDatabase;
            try{
                const res = await fetch("/database/read/slots");
                if(!res.ok){
                    console.warn(res);
                    return console.error("Failed to fetch url. Status code:", res.status);
                }
                
                slotDatabase = await res.json();
                if(slotDatabase.error){
                    return console.error("Failed parsing response:", slotDatabase.error);
                }
            }
            catch(e){
                return console.error("[ Couldn't fetch database for UpdateSlot ]", e);
            }

            Array.from(document.getElementsByClassName("slot")).forEach(async slot => {
                const slotId = Number(slot.id.match(/\d+/)[0]); // made with ai

                // ========== get data ========== //
                const slotData = getSlotData(slotDatabase, slotId);

                // do stuff with data
                const earned = slotData[2] += slotData[1];
                document.getElementById(`text-slot-earning-${slotId}`).innerHTML = `$${earned}`;

                // ========== set data ========== //
                const updatedSlot = setSlotData(slotId, slotData[0], slotData[1], earned, slotData[3], slotData[4]);

                try{
                    await fetch("/database/write/slots", {
                        method: "POST",
                        headers: {"Content-Type" : "application/json"},
                        body: JSON.stringify(updatedSlot)
                    });
                }
                catch(e){
                    return console.error("[ Failed to update slot ]", e);
                }
            })
        }, 1000);
    }

    // Create the very first section
    await CreateSection();
    // more for debugging
    await CreateSection();

    // update delayed for debugging
    setTimeout(async () => {
        await UpdateSlot();
    }, 1000);
    
    
    Array.from(document.getElementsByClassName("button-slot-upgrade")).forEach(button => {

        // FOR DEBUGGING ONLY
        const money = 1000; 
        const earningConstant = 10;
        //

        button.addEventListener("click", async () => {
            const btnId = Number(button.id.match(/\d+/)[0]); // made with ai

            let slotDatabase;
            try{
                const res = await fetch("/database/read/slots");
                if(!res.ok){
                    console.warn(res);
                    return console.error("Failed to fetch url. Status code:", res.status);
                }

                slotDatabase = await res.json();
                if(slotDatabase.error){
                    return console.error("Failed parsing response:", slotDatabase.error);
                }
            }
            catch(e){
                return console.error("[ Couldn't fetch database for upgrading ]", e);
            }

            // ========== get data ========== //
            const slotData = getSlotData(slotDatabase, btnId);
            
            // do stuff with data
            if(money < slotData[3]){
                return console.warn("Not enough money to upgrade");
            }

            const upgradedLevel = slotData[0] + 1;
            const upgradedEarning = (upgradedLevel - 1) * earningConstant;

            document.getElementById(`text-slot-level-${btnId}`).innerHTML = `Level: ${upgradedLevel}`;

            // ========== set data ========== //
            const upgradedSlot = setSlotData(btnId, upgradedLevel, upgradedEarning, slotData[2], slotData[3], slotData[4]);

            try{
                await fetch("/database/write/slots", {
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify(upgradedSlot)
                })
            }
            catch(e){
                return console.error("[ Failed to upgrade slot ]", e);
            }
        })
    })
})
