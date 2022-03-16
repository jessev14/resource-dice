const moduleName = "resource-dice";

const resourceDefaults = {
    Food: "0",
    Water: "0",
    Arrows: "0",
    Torches: "0",
    Burnout: "0",
    Misc: "0"
};


Hooks.on("renderActorSheet5eCharacter", (app, html, appData) => {
    const defaults = Object.entries(resourceDefaults);
    const options = {
        "0": "0",
        "d6": "d6",
        "d8": "d8",
        "d10": "d10",
        "d12": "d12"
    };

    let data = ``;
    for (let i = 0; i < 6; i++) {
        const resourceName = app.object.getFlag(moduleName, `resource${i}.name`) ?? defaults[i][0];
        const resourceValue = app.object.getFlag(moduleName, `resource${i}.value`) ?? defaults[i][1];

        const selected = {
            hash: {
                selected: resourceValue
            }
        };
        const optionsEl = Handlebars.helpers.selectOptions.call(this, options, selected);

        data += `
            <div>
                <a class="${moduleName}-roll"><i class="fas fa-dice"></i></a>
                <input name="flags.${moduleName}.resource${i}.name" value="${resourceName}" />
                <select name="flags.${moduleName}.resource${i}.value">
                    ${optionsEl}
                </select>
            </div>
        `;

        if (i === 2) {
            data += `<div class="break"></div>`;
        }
    }
    
    data = `<div class="flexrow ${moduleName}">` + data + `</div>`;
    
    html.find(`div.tab.inventory`).append(data);

    html.find(`a.${moduleName}-roll`).click(ev => {
        const $current = $(ev.currentTarget);
        const $input = $current.siblings(`input`);
        const resourceName = $input.val();
        const $select = $current.siblings(`select`);
        const resourceValue = $select.val();

        if (resourceValue === "0") return;

        new Roll(`${resourceValue}`).toMessage({
            speaker: ChatMessage.getSpeaker({actor: app.object}),
            flavor: `Resource Dice - ${resourceName}`
        });
    });
});
