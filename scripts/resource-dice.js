const moduleID = 'resource-dice';

const lg = x => console.log(x);

const defaultResourceDiceData = {
    r1: {
        label: 'Resource 1',
        value: 0
    },
    r2: {
        label: 'Resource 2',
        value: 0
    },
    r3: {
        label: 'Resource 3',
        value: 0
    },
    r4: {
        label: 'Resource 4',
        value: 0
    },
    r5: {
        label: 'Resource 5',
        value: 0
    },
    r6: {
        label: 'Resource 6',
        value: 0
    }
};


Hooks.on('getActorSheetHeaderButtons', async (sheet, buttons) => {
    const { actor } = sheet;
    if (!actor) return;
    if (!actor.isOwner) return;

    const resourceDiceButton = {
        class: moduleID,
        icon: 'fa-solid fa-dice',
        label: 'Resources',
        onclick: () => new ResourceDiceApp(actor).render(true)
    };

    buttons.unshift(resourceDiceButton);
});


class ResourceDiceApp extends FormApplication {
    constructor(object) {
        super(object);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [moduleID],
            closeOnSubmit: false,
            editable: true,
            sheetConfig: false,
            submitOnChange: true,
            submitOnClose: true,
            resizable: true,
            template: `modules/${moduleID}/templates/resource-dice-app.hbs`,
            height: 330,
            width: 400
        });
    }

    get title() {
        return `${this.object.name} | Resource Dice`;
    }

    getData() {
        const actor = this.object;
        const data = {
            moduleID,
            actorName: actor.name,
            resourceDice: actor.getFlag(moduleID, 'resourceDiceData') || defaultResourceDiceData,
            resourceDiceOptions: {
                0: '0',
                4: 'd4',
                6: 'd6',
                8: 'd8',
                10: 'd10',
                12: 'd12',
                20: 'd20'
            }
        };

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);

        const html = $html[0];
        html.addEventListener('click', ev => {
            const { target } = ev;
            if (target.tagName !== 'I') return;

            const rd = target.closest('div.resource-dice-rd').dataset.rd;
            const flagRD = this.object.getFlag(moduleID, 'resourceDiceData')?.[rd];
            const d = flagRD?.value;
            if (!d) return;

            return new Roll(`1d${d}`).toMessage({
                speaker: ChatMessage._getSpeakerFromActor({ actor: this.object }),
                flavor: flagRD.label
            });
        });
    }

    async _updateObject(event, formData) {
        this.object.update(formData);
    }
}
