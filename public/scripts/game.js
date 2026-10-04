import {Slot} from "./slot.js";

document.addEventListener("DOMContentLoaded", async () => {
    /*
        DO THIS SOMEDAY
        ## auto scale font sizes when things update in the slots
        ## example v v v

        sectionTextSlotUpgrade.style.fontSize = `${17 - slotUpgrade.toString().length}px`;

        sectionTextSlotLevel.style.fontSize = `${17 - slotLevel.toString().length}px`;
    */

    const globalSaveTimer = 5000;

    let slots = [];
    let identifier = 0;
    const slotsDiv = document.getElementById("div-slots")
    function CreateSlot(){
        identifier++;
        const slot = new Slot(identifier);
        slots.push(slot);

        // ===== creating slot divs ===== //
        const slotLevelText = `Level: ${slot.level}`;
        const slotEarnedText = "$0";
        const slotUpgradeText = `Upgrade: ${slot.upgrade}`;

        // main slot div
        const slotDiv = document.createElement("div");
        slotDiv.className = "slot";
        slotDiv.id = `slot-${identifier}`;
        slotsDiv.appendChild(slotDiv);

        // slot texts [level, earned]
        const slotTextLevel = document.createElement("text");
        slotTextLevel.className = "text-slot-level";
        slotTextLevel.id = `text-slot-level-${identifier}`;
        slotTextLevel.innerHTML = slotLevelText;

        const slotTextEarned = document.createElement("text");
        slotTextEarned.className = "text-slot-earned";
        slotTextEarned.id = `text-slot-earned-${identifier}`;
        slotTextEarned.innerHTML = slotEarnedText;

        // slot button [upgrade]
        const btnSlotUpgrade = document.createElement("button");
        btnSlotUpgrade.className = "button-slot-upgrade";
        btnSlotUpgrade.id = `button-slot-upgrade-${identifier}`;
        btnSlotUpgrade.innerHTML = slotUpgradeText;

        for(let i = 0; i < 3; i++){
            const slotDivText = document.createElement("div");
            slotDivText.className = "div-slot-text";
            slotDiv.appendChild(slotDivText);

            if(i == 0){
                slotDivText.appendChild(slotTextLevel);
            }
            else if(i == 1){
                slotDivText.appendChild(slotTextEarned);
            }
            else if(i == 2){
                slotDivText.appendChild(btnSlotUpgrade);
            }
            else{
                console.warn("Increment overflow!");
            }
        }

        slot.Update(slotTextEarned, true);
    }

    CreateSlot();
    CreateSlot();

    setInterval(() => {
        let i = 0
        slots.forEach(slot => {
            i++
            slot.Save(i)
        })
    }, globalSaveTimer);

    // TEMPORAL
    const money = 1000;
    Array.from(document.getElementsByClassName("button-slot-upgrade")).forEach(btn => {
        btn.addEventListener("click", () => {
            const btnId = Number(btn.id.match(/\d+/)[0]) - 1;

            const slotTextLevel = document.getElementById(`text-slot-level-${btnId + 1}`);
            const slotTextUpgrade = document.getElementById(`button-slot-upgrade-${btnId + 1}`);
            const slotTextEarned = document.getElementById(`text-slot-earned-${btnId + 1}`)

            slots[btnId].Upgrade(money, slotTextLevel, slotTextUpgrade);
            slots[btnId].Update(slotTextEarned, false);
            slots[btnId].Update(slotTextEarned, true);
        })
    });
});