class Slot{
    level = 1;
    earning = 1;
    earned = 0;
    upgrade = 100;
    update = 1000;
    updater = 0;

    constructor(updater){
        this.updater = updater;
    }

    Update(earnedText, running){
        if(running){
            this.updater = setInterval(() => {
                this.earned += this.earning
                earnedText.innerHTML = `$${this.earned}`;
            }, this.update);
        }
        else{
            clearInterval(this.updater);
        }
        
    }

    Upgrade(money, levelText, upgradeText){
        if(money < this.upgrade){
            return console.warn("Not enough money");
        }

        this.level += 1;
        this.earning += 10;
        this.upgrade += 100;
        this.update -= 50;

        if(this.update < 10){
            this.update = 10;
        }

        levelText.innerHTML = `Level: ${this.level}`;
        upgradeText.innerHTML = `Upgrade: ${this.upgrade}`;
    }

    async Save(id){
        try{
            await fetch("/database/write/slots", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({
                    key: `slot${id}`,
                    value: {
                        level: this.level,
                        earning: this.earning,
                        earned: this.earned,
                        upgrade: this.upgrade,
                        update: this.update,
                        updater: this.updater
                    }
                })
            })
        }
        catch(e){
            console.error(e);
        }
    }
}

export {Slot};