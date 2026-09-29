document.addEventListener("DOMContentLoaded", () => {
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

    // auto-scale slot font
    function autoScaleFont(number, object, baseFontSize){
        // base string: Upgrade: $ 
        const numberString = number.toString();
        const newSize = baseFontSize - numberString.length;

        object.style.fontSize = `${newSize}px`;
    }

    // create section
    const sectionBox = document.getElementById("div-slots");
    let identifier = 1;
    async function CreateSection(){
        const slotDatabase = await fetchData("/database/read/slots");
        const slotLevel = slotDatabase.slot1.level;
        const slotEarning = slotDatabase.slot1.earning;
        const slotUpgrade = slotDatabase.slot1.upgrade;

        // main slot div
        const section = document.createElement("div");
        section.className = "slot";
        section.id = `slot-${identifier}`;
        sectionBox.appendChild(section);

        // slot texts [level, earning, upgrade]
        const sectionTextSlotLevel = document.createElement("text");
        sectionTextSlotLevel.className = "text-slot-level";
        sectionTextSlotLevel.id = `text-slot-level-${identifier}`;
        sectionTextSlotLevel.innerHTML = `Level: ${slotLevel}`;

        const sectionTextSlotEarning = document.createElement("text");
        sectionTextSlotEarning.className = "text-slot-earning";
        sectionTextSlotEarning.id = `text-slot-earning-${identifier}`
        sectionTextSlotEarning.innerHTML = `$${slotEarning}`;

        const sectionTextSlotUpgrade = document.createElement("text");
        sectionTextSlotUpgrade.className = "text-slot-upgrade";
        sectionTextSlotUpgrade.id = `text-slot-upgrade-${identifier}`;
        sectionTextSlotUpgrade.innerHTML = `Upgrade: $${slotUpgrade}`;

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
                sectionDivSlotText.appendChild(sectionTextSlotUpgrade);
            }
            else{
                console.warn("increment overflow");
            }
        }

        identifier++;

        // debug outputs
        console.log("Section created successfully");
        console.log("ID:", section.id);
        console.log("Data:", slotDatabase);
        console.log("L:", slotLevel);
        console.log("E:", slotEarning);
        console.log("U", slotUpgrade)
        console.log("==========");
    }
    CreateSection();
    CreateSection();
    CreateSection();
    CreateSection();

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
