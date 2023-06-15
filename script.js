let urlCache;
const errText = document.getElementById("err");
const profileText = document.getElementById("profileName");
const profileImg = document.getElementById("profile");
const stratTitle = document.getElementById("stratTitle");
const stratDesc = document.getElementById("stratDesc");

let currentBackpack = {};

const strategies = {
    "General": [
        {name: "The Jester", desc: "Taunt after every kill. Every. Kill."},
        {name: "Melee Only", desc: "You are only allowed to attack with your melee"},
        {name: "Metal Gear Solid", desc: "You can only crouch walk"},
        {name: "Martydom", desc: "Killbind after every kill"},
        {name: "Confusing Callouts", desc: "Talk in chat pretending like you're playing a different game\n(if F2P, just act incredibly paranoid and confused)"},
        {name: "Drunkard", desc: "Always walk around in a circle or backwards"},
        {name: "Mr. Bodyguard", desc: "Select one random person on your team to protect, if they die, you all die."},
        {name: "One Mann's Trash", desc: "Always pick up any weapon you see on the floor for your class"},
        {name: "Celebratory", desc: "After every kill, spin your mouse around and jump like you're celebrating the kill"}
    ],
    "Scout": [
        {name: "Caffeine Overload", desc: "As Scout, always be jumping around no matter what"},
        {name: "Captain Capper", desc: "As Scout, focus solely on the objective, you are not allowed to kill anyone."},
        {name: "Medic's Worst Nightmare", desc: "As Scout, keep calling for Medic, and always steal ammo and health packs whenever you can"},
        {name: "Broken Ankles", desc: "As Scout, you are not allowed to double jump"},
    ],
    "Soldier": [
        {name: "Jumpman", desc: "As Soldier, you can only move by rocket jumping"},
        {name: "Dive Bomber", desc: "As Soldier, you must always rocket jump into the enemies and kill them in the air or shortly after you land"},
        {name: "Professionals Have Standards", desc: "As Soldier, you must stay back and try to snipe with your rockets"},
        {name: "American Patriot", desc: "As Soldier, Proclaim your love for America by shooting 3 shots in the air after every kill"}
    ],
    "Pyro": [
        {name: "W + M1", desc: "As Pyro, you must always be using your flamethrower and holding W"},
        {name: "Mann Repellant", desc: "As Pyro, you are only allowed to use your airblast"},
        {name: "Fresh Combo", desc: "As Pyro, you must go through all 3 of your weapons to kill someone"},
        {name: "Pybro", desc: "As Pyro, you must protect an Engineer (or another teammate if your team has no Engineers) with your life"}
    ],
    "Demoman": [
        {name: "Jumpman", desc: "As Demoman, you can only move by stickybomb jumping"},
        {name: "Setting up Camp", desc: "As Demoman, you must camp an entryway and stay there until someone passes by"},
        {name: "Sticky Maniac", desc: "As Demoman, you must detonate your stickybombs immediately as soon as they can be detonated"}
    ],
    "Demoknight": [
        {name: "Assassin", desc: "As Demoman, you may only charge into someone if they are looking away from you"},
        {name: "Wasteful Management", desc: "As Demoman, you must use your charge as soon as it charges up"},
        {name: "Solarknight Wannabe", desc: "As Demoman, you must attempt to trimp off of every surface that seems trimpable"},
    ],
    "Heavy": [
        {name: "Hoovy the Peacekeeper", desc: "As Heavy, try to make it your goal to turn the server friendly"},
        {name: "Snail's Pace", desc: "As Heavy, always stay revved up when near combat"},
        {name: "A True Comrade", desc: "As Heavy, you must take the fire for your teammates in any fight that you see"},
        {name: "Lunch Lady", desc: "As Heavy, you are not allowed to attack, and you must always throw your lunchbox items to teammates in need as soon as you get them\n(Change your loadout if needed)"}
    ],
    "Engineer": [
        {name: "Shotgun Happy", desc: "As Engineer, do not build any buildings, but just run in with your shotgun and kill the enemies"},
        {name: "Practical Problems", desc: "As Engineer, when your buildings go down immediately find metal and build it right where you are"},
        {name: "Vengeful Spirit", desc:"As Engineer, when your buildings go down, immediately start trying to kill the person who killed your buildings"},
        {name: "Ultra Turtling", desc: "As Engineer, build all of your buildings (with the exception of teleporter entrance) incredibly close to you, and never leave that area"}
    ],
    "Medic": [
        {name: "Übermensch", desc: "As Medic, always attack the enemy your pocket is attacking with your primary or melee"},
        {name: "That Wasn't Medicine", desc: "As Medic, always use your Übercharge as soon as it charges"},
        {name: "Human Dispenser", desc: "As Medic, hang around one place and heal people who come to you. You are not allowed to leave once you have chosen the area."},
        {name: "Helping Others Succeed", desc: "As Medic, you must pocket the lowing scoring person your team until they are no longer the lowest scoring"}
    ],
    "Sniper": [
        {name: "Challenging Work", desc: "As Sniper, always be moving around"},
        {name: "FaZE Sniper", desc: "As Sniper, always do a 360 before you attempt to shoot someone"},
        {name: "No Scope", desc: "As Sniper, do not scope in (or draw all the way back for Huntsman)"}
    ],
    "Spy": [
        {name: "Masquerade", desc: "As Spy, disguise as a Heavy and crouch with your melee in a corner to appear as a Friendly, and kill anyone who comes up to you."},
        {name: "Gun Spy", desc: "As Spy, you are only allowed to use your gun. No disguises or backstabs or sappers"},
        {name: "Traitor's Requiem", desc: "As Spy, you must pretend to be you're part of the enemy team, and you must not kill any of the enemy team"}
    ]
}

document.addEventListener('readystatechange', async event => {
    if (event.target.readyState === "complete") {

        randomize()
    }
});

async function randomize() {
    
    const profileID = document.getElementById('steamid').value
    if (urlCache != null && errText.style['display'] != 'none' && profileID == urlCache) {
         if (!errText.textContent.includes("API")) return; // So the error doesn't spam server requests if invalid ID
    }

    if (profileID != urlCache) currentBackpack = {};
    errText.setAttribute("style", "display: none;")
    const selection = document.getElementById("classPicker");
    let chosen = selection.options[selection.selectedIndex].text;

    if (chosen == "Random Class") {
        const mercenaries = ["Scout", "Soldier", "Pyro", "Demoman", "Heavy", "Engineer", "Medic", "Sniper", "Spy"];
        chosen = mercenaries[Math.floor(Math.random() * mercenaries.length)];
    }

    

    const response = await fetch("./items/items.json");
    const data = await response.json();

    if (profileID.length != 0) return getBackpack(data.result.items, chosen, profileID);

    profileText.setAttribute("style", "display: none;")
    profileImg.setAttribute("style", "display: none;")
    let items = data.result.items;

    let primary, secondary, melee
    if (chosen == "Spy") { // Spy has weird equip regions and no "primary"
        primary = items.filter(x => x.item_slot == "secondary" && !x.name.startsWith("Upgradeable") && x.used_by_classes.includes(chosen)&& !x.name.toLowerCase().includes("MVM"))
        secondary = items.filter(x => x.item_slot == "pda2" && !x.name.startsWith("Upgradeable") && x.used_by_classes.includes(chosen)&& !x.name.toLowerCase().includes("MVM"))
        melee = items.filter(x => x.item_slot == "melee" && !x.name.startsWith("Upgradeable") && (!x.hasOwnProperty('used_by_classes') || x.used_by_classes.includes(chosen))&& !x.name.toLowerCase().includes("MVM"));
    } else {
        primary = items.filter(x => x.item_slot == "primary" && !x.name.startsWith("Upgradeable") && x.used_by_classes.includes(chosen) && !x.name.toLowerCase().includes("MVM") && x.name != "Deflector")
        secondary = items.filter(x => x.item_slot == "secondary" && !x.name.startsWith("Upgradeable") && x.used_by_classes.includes(chosen)&& !x.name.toLowerCase().includes("MVM"))
        melee = items.filter(x => x.item_slot == "melee" && !x.name.startsWith("Upgradeable") && (!x.hasOwnProperty('used_by_classes') || x.used_by_classes.includes(chosen))&& !x.name.toLowerCase().includes("MVM"));
    }


    // Filters because some items are exclusive or not even cosmetics
    let cosmetics = items.filter(x =>
        x.item_class === "tf_wearable" &&
        !x.name.includes("UGC") &&
        !x.name.toLowerCase().includes("medal") &&
        !x.name.includes("Duel")
        && !x.name.toLowerCase().includes("mvm")
        && x.item_type_name.startsWith("#TF_Wearable")
        && (!x.hasOwnProperty('used_by_classes') || x.used_by_classes.includes(chosen)));

    randomizeItems(primary, secondary, melee, cosmetics, chosen)
}

function parseID(url) {
    if (!isNaN(parseInt(url))) return parseInt(url);

    if (url.includes("steamcommunity.com/")) {

        if (url.startsWith("http")) url = url.split("://")[1] 
        const id = url.split("/")[2]
        if (id == null) return null;

        return id;
    }

    return null;

}

function sendError(error) {
    if (error != null) {
        errText.textContent = error;
        errText.setAttribute("style", "display: visible;")
    }
}
async function getBackpack(itemList, merc, url) {
    
    const id = parseID(url);
    urlCache = url;
    if (id == null) {
        return sendError("ERROR: Invalid ID")
    }

    if (Object.keys(currentBackpack).length == 0) {
        const response = await fetch(`/.netlify/functions/api?id=${id}`)

        const data = await response.json();

        if (Object.keys(data).length == 0) return sendError("ERROR: API Returned an Empty Object. Please try again later!");
        if (data.response != null && data.response.success == 42) return sendError("ERROR: Invalid ID")
        if (Object.keys(data.backpack).length == 0) return sendError("ERROR: API Returned an Empty Object. Please try again later!");
        if (data.backpack.result.status == 15) return sendError("ERROR: Backpack is Private")
        if (data.backpack.result.status == 18 || data.backpack.result.status == 8) return sendError("Error: Invalid ID");

        if (data.profile != {} && data.profile.response.players.length != 0) backpackText(data.profile.response.players[0])
        currentBackpack = data;
     }

      let primaries = []
      let secondaries = []
      let melees = []
      let cosmetics = []
      // For some reason, stock items are not included in backpack
      const weaponNames = { "TF_WEAPON_BAT": "Bat", "TF_WEAPON_BOTTLE": "Bottle", "TF_WEAPON_FIREAXE": "Fire Axe", "TF_WEAPON_CLUB": "Kukiri", "TF_WEAPON_KNIFE": "Knife", "TF_WEAPON_FISTS": "Fists", "TF_WEAPON_SHOVEL": "Shovel", "TF_WEAPON_WRENCH": "Wrench", "TF_WEAPON_BONESAW": "Bonesaw", "TF_WEAPON_SHOTGUN_PRIMARY": "Shotgun", "TF_WEAPON_SHOTGUN_SOLDIER": "Shotgun", "TF_WEAPON_SHOTGUN_PYRO": "Shotgun", "TF_WEAPON_SHOTGUN_HWG": "Shotgun", "TF_WEAPON_SCATTERGUN": "Scattergun", "TF_WEAPON_SNIPERRIFLE": "Sniper Rifle", "TF_WEAPON_MINIGUN": "Minigun", "TF_WEAPON_SMG": "SMG", "TF_WEAPON_SYRINGEGUN_MEDIC": "Syringe Gun", "TF_WEAPON_ROCKETLAUNCHER": "Rocket Launcher", "TF_WEAPON_GRENADELAUNCHER": "Grenade Launcher", "TF_WEAPON_PIPEBOMBLAUNCHER": "Stickybomb Launcher", "TF_WEAPON_FLAMETHROWER": "Flamethrower", "TF_WEAPON_PISTOL": "Pistol", "TF_WEAPON_PISTOL_SCOUT": "Pistol", "TF_WEAPON_REVOLVER": "Revolver", "TF_WEAPON_PDA_ENGINEER_BUILD": "Construction PDA", "TF_WEAPON_PDA_ENGINEER_DESTROY": "Destruction PDA", "TF_WEAPON_PDA_SPY": "Disguise Kit", "TF_WEAPON_MEDIGUN": "Medigun", "TF_WEAPON_INVIS": "Inviswatch", "TF_WEAPON_BUILDER_SPY": "Sapper", "TF_WEAPON_SPELLBOOK": "Spellbook", "TTG Max Pistol - Poker Night": "Lugermorph", "TTG Max Pistol": "Lugermorph" }

      Object.keys(weaponNames).forEach((x, i) => {
        if (x == "TTG Max Pistol - Poker Night" || x == "TF_WEAPON_SPELLBOOK" || x == "TTG Max Pistol") return;
        const foundItem = itemList.find(item => x == item.name)
        if (foundItem.used_by_classes != null && !foundItem.used_by_classes.includes(merc)) return;
        if (merc == "Spy") {
            
            if (foundItem.item_slot == "secondary" && primaries.filter(x => x.name == foundItem.name).length == 0) primaries.push(foundItem);
            if (foundItem.item_slot == "pda2" && secondaries.filter(x => x.name == foundItem.name).length == 0) secondaries.push(foundItem);
            if (foundItem.item_slot == "melee" && melees.filter(x => x.name == foundItem.name).length == 0) melees.push(foundItem);
         } else {
            if (foundItem.item_slot == "primary" && primaries.filter(x => x.name == foundItem.name).length == 0 ) primaries.push(foundItem);
            if (foundItem.item_slot == "secondary" && secondaries.filter(x => x.name == foundItem.name).length == 0) secondaries.push(foundItem);
            if (foundItem.item_slot == "melee" && melees.filter(x => x.name == foundItem.name).length == 0) melees.push(foundItem);
         }
    })

      currentBackpack.backpack.result.items.forEach((item, i) => {
         const foundItem = itemList.find(x => x.defindex == item.defindex)
         if (foundItem == null) return;
         if (foundItem.used_by_classes != null && !foundItem.used_by_classes.includes(merc)) return;
         

         if (["Upgradeable TF_WEAPON_SHOTGUN_PRIMARY", "Festive Shotgun 2014"].includes(foundItem.name) && merc != "Engineer") return secondaries.push(foundItem)
         if (merc == "Spy") {
            
            if (foundItem.item_slot == "secondary" && primaries.filter(x => x.name == foundItem.name).length == 0) primaries.push(foundItem);
            if (foundItem.item_slot == "pda2" && secondaries.filter(x => x.name == foundItem.name).length == 0) secondaries.push(foundItem);
            if (foundItem.item_slot == "melee" && melees.filter(x => x.name == foundItem.name).length == 0) melees.push(foundItem);
         } else {
            if (foundItem.item_slot == "primary" && primaries.filter(x => x.name == foundItem.name).length == 0 ) primaries.push(foundItem);
            if (foundItem.item_slot == "secondary" && secondaries.filter(x => x.name == foundItem.name).length == 0) secondaries.push(foundItem);
            if (foundItem.item_slot == "melee" && melees.filter(x => x.name == foundItem.name).length == 0) melees.push(foundItem);
         }

         if (foundItem.item_slot == "misc" && cosmetics.filter(x => x.name == foundItem.name).length == 0) cosmetics.push(foundItem);
      })

      randomizeItems(primaries, secondaries, melees, cosmetics, merc);
}


function backpackText(profile) {

    profileText.textContent = profile.personaname + "'s Backpack"
    profileImg.src = profile.avatar;
    profileImg.href = profile.profileurl;

    profileText.setAttribute("style", "display: visible;")
    profileImg.setAttribute("style", "display: visible;")
    
}

function randomizeItems(primaries, secondaries, melees, cosmeticList, merc) {
    let pChoose = primaries[Math.floor(Math.random() * primaries.length)]
    let sChoose = secondaries[Math.floor(Math.random() * secondaries.length)]
    let mChoose = melees[Math.floor(Math.random() * melees.length)]

    let cChoose1, cChoose2, cChoose3
    if (cosmeticList.length >= 3) {
        cChoose1 = cosmeticList[Math.floor(Math.random() * cosmeticList.length)]
        cChoose2 = cosmeticList[Math.floor(Math.random() * cosmeticList.length)]
        cChoose3 = cosmeticList[Math.floor(Math.random() * cosmeticList.length)]

        while (cChoose1.name == cChoose2.name || cChoose2.name == cChoose3.name) {
            cChoose2 = cosmeticList[Math.floor(Math.random() * cosmeticList.length)] 
        }
        while (cChoose1.name == cChoose3.name || cChoose2.name == cChoose3.name) {
             cChoose3 = cosmeticList[Math.floor(Math.random() * cosmeticList.length)]
        }
    } else {
        cChoose1 = cosmeticList[0]
        cChoose2 = cosmeticList[1]
        cChoose3 = cosmeticList[2]
    }
    manageText([pChoose, sChoose, mChoose, cChoose1, cChoose2, cChoose3], merc)
}

function manageText(itemList, merc) {
    returnToDefault();
    console.log(itemList)
    const tag = document.getElementById("mercenary")
    tag.src = `assets/classes/${merc.toLowerCase()}.png`;
    tag.classList.add("merc");
    tag.classList.add(merc.toLowerCase())
    
    const orderTag = ["primary", "secondary", "melee", "cosmetic1", "cosmetic2", "cosmetic3"]
    const weaponNames = { "TF_WEAPON_BAT": "Bat", "TF_WEAPON_BOTTLE": "Bottle", "TF_WEAPON_FIREAXE": "Fire Axe", "TF_WEAPON_CLUB": "Kukiri", "TF_WEAPON_KNIFE": "Knife", "TF_WEAPON_FISTS": "Fists", "TF_WEAPON_SHOVEL": "Shovel", "TF_WEAPON_WRENCH": "Wrench", "TF_WEAPON_BONESAW": "Bonesaw", "TF_WEAPON_SHOTGUN_PRIMARY": "Shotgun", "TF_WEAPON_SHOTGUN_SOLDIER": "Shotgun", "TF_WEAPON_SHOTGUN_PYRO": "Shotgun", "TF_WEAPON_SHOTGUN_HWG": "Shotgun", "TF_WEAPON_SCATTERGUN": "Scattergun", "TF_WEAPON_SNIPERRIFLE": "Sniper Rifle", "TF_WEAPON_MINIGUN": "Minigun", "TF_WEAPON_SMG": "SMG", "TF_WEAPON_SYRINGEGUN_MEDIC": "Syringe Gun", "TF_WEAPON_ROCKETLAUNCHER": "Rocket Launcher", "TF_WEAPON_GRENADELAUNCHER": "Grenade Launcher", "TF_WEAPON_PIPEBOMBLAUNCHER": "Stickybomb Launcher", "TF_WEAPON_FLAMETHROWER": "Flamethrower", "TF_WEAPON_PISTOL": "Pistol", "TF_WEAPON_PISTOL_SCOUT": "Pistol", "TF_WEAPON_REVOLVER": "Revolver", "TF_WEAPON_PDA_ENGINEER_BUILD": "Construction PDA", "TF_WEAPON_PDA_ENGINEER_DESTROY": "Destruction PDA", "TF_WEAPON_PDA_SPY": "Disguise Kit", "TF_WEAPON_MEDIGUN": "Medigun", "TF_WEAPON_INVIS": "Inviswatch", "TF_WEAPON_BUILDER_SPY": "Sapper", "TF_WEAPON_SPELLBOOK": "Spellbook", "TTG Max Pistol - Poker Night": "Lugermorph", "TTG Max Pistol": "Lugermorph" }

    itemList.forEach((item, i) => {
        const img = document.getElementById(orderTag[i] + "img")
        const s = document.getElementById(orderTag[i])
        if (item == null) {
            img.src = null;

            img.setAttribute("style", "visibility: hidden;")
            s.setAttribute("style", "color: gray; transform: translate(-50%, 50%);")
            s.textContent = "< empty >"
            return;
        }
        if (item.name.startsWith("TF_WEAPON") || item.name.startsWith("TTG Max")) item.name = weaponNames[item.name]
        if (item.name.startsWith("Upgradeable TF_")) {
            item.name = weaponNames[item.name.split(" ")[1]]
        }
        
        const font = getCanvasFont(s)
        s.textContent = item.name
        if (displayTextWidth(item.name, font) > 228) {
            s.setAttribute("style", "transform: translate(-50%, -240%)")
        }

        if (displayTextWidth(item.name, font) > 400) {
            s.setAttribute("style", "transform: translate(-50%, -190%)")
        }

        

        let url = item.image_url;
        if (url != null) url = url.replace("http", "https")
        img.src = url;
    })
    changeStrat(merc)
}


function changeStrat(merc) {
    const generalOrSpecific = Math.floor(Math.random() * 100) + 1;

    if (generalOrSpecific <= 50) { // Will randomize a generic strategy
        const stratList = strategies["General"]
        const index = stratList[Math.floor(Math.random() * stratList.length)]

        stratTitle.textContent = index.name;
        stratDesc.textContent = index.desc;
    } else {

        let chosenMerc = merc;
        if (merc == "Demoman") {
            const secondary = document.getElementById("secondary");
            if (["The Chargin' Targe", "The Splendid Screen", "The Tide Turner", "Festive Targe 2014"].includes(secondary.textContent)) chosenMerc = "Demoknight"
        }

        const stratList = strategies[chosenMerc]
        const index = stratList[Math.floor(Math.random() * stratList.length)]

        stratTitle.textContent = index.name;
        stratDesc.textContent = index.desc;
    }
}
function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFont(el) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = getCssStyle(el, 'font-size') || '16px';
    const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';

    return `${fontWeight} ${fontSize} ${fontFamily}`;
}

function displayTextWidth(text, font) {
    let canvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    context.font = font;
    let metrics = context.measureText(text);
    return metrics.width;
}

function returnToDefault() {
    const orderTag = ["primary", "secondary", "melee", "cosmetic1", "cosmetic2", "cosmetic3"]

    orderTag.forEach(t => {
        const tag = document.getElementById(t);
        const img = document.getElementById(t + "img");
        tag.setAttribute("style", "transform: translate(-50%, -330%)")
        tag.textContent = "";

        img.setAttribute("style", "visibility: visible; transform: translateY(-30%) scale(85%)")
        img.src = "https://media.steampowered.com/apps/440/icons/c_picket.154051b579a1f9930968b832f55db42476ffb555.png" // Placeholder
    });
}

document.getElementById("randomize").onclick = function() {
    randomize();
};  