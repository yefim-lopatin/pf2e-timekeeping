import { MODULE_ID } from "./module-id.js";
import { getDefaultCalendar, setCalendarJSON } from "./main.js";
import { FormBuilder } from "./lib/formBuilder.js"
import { getSetting, setSetting } from "./settings.js";
import { l, mergeClone } from "./lib/utils.js";
import { CALENDARS } from "./calendars.js";

export function initConfig() { }

export const BADGE_COUNT = 3;

export async function openConfiguration() {
    const r = `${MODULE_ID}.configuration.`;
    const fb = new FormBuilder().object(getSetting("configuration")).title("PF2e Timekeeping: " + l(r + "title")).size({ width: 800 })

    fb.tab({ id: "badges", icon: "fas fa-badge", label: r + "tabs.badges" })
        .text({ name: "weatherLabel", label: r + "weatherLabel.label" })
        .color({ name: "weatherColor", label: r + "weatherColor.label" })
        .text({ name: "moonLabel", label: r + "moonLabel.label" })
        .color({ name: "moonColor", label: r + "moonColor.label" })
        .checkbox({ name: "showFullDate", label: r + "showFullDate.label" })
        .select({
            name: "daysDisplay", label: r + "daysDisplay.label", options: {
                "none": r + "daysDisplay.options.none",
                "sinceEpoch": r + "daysDisplay.options.sinceEpoch",
                "dayOfYear": r + "daysDisplay.options.dayOfYear",
            }
        })
        .number({ name: "dayOffset", label: r + "dayOffset.label", hint: r + "dayOffset.hint" })

    for (let i = 0; i < BADGE_COUNT; i++) {
        fb.html(`<fieldset><legend>${l(r + "customBadge.label") + " " + (i + 1)}</legend>`)
        fb.text({ name: `badge${i}.label`, label: r + "badgeLabel.label" })
        fb.color({ name: `badge${i}.color`, label: r + "badgeColor.label" })
        fb.html(`</fieldset>`)
    }
    fb.tab({ id: "aspect", icon: "fas fa-palette", label: r + "tabs.aspect" })

    fb.html(`<fieldset><legend>${l(r + "seasons.label")}</legend>`)
    for (let i = 0; i < game.time.calendar.seasons.values.length; i++) {
        const season = game.time.calendar.seasons.values[i];
        fb.color({ name: "season" + i, label: season.name })
    }
    fb.html(`</fieldset>`)

    fb.checkbox({ name: "use24HourClock", label: r + "use24HourClock.label" })
    fb.checkbox({ name: "wideLetterSpacing", label: r + "wideLetterSpacing.label" })
    fb.checkbox({ name: "useMonospace", label: r + "useMonospace.label" })
    fb.checkbox({ name: "noPills", label: r + "noPills.label" })
    fb.checkbox({ name: "useFullWidth", label: r + "useFullWidth.label" })
    fb.checkbox({ name: "hideInCombat", label: r + "hideInCombat.label" })
    fb.number({name: "topOffset", label: r + "topOffset.label"})


    fb.tab({ id: "time", icon: "fas fa-clock", label: r + "tabs.time" })
        .number({ name: "secondsPerRealSecond", min: 0, label: r + "secondsPerRealSecond.label" })
        .number({ name: "secondsPerRound", min: 0, step: 1, label: r + "secondsPerRound.label" })
        .number({ name: "clockSeconds", min: 10, step: 1, label: r + "clockSeconds.label" })

    fb.tab({ id: "environment", icon: "fas fa-globe", label: r + "tabs.environment" })
        .color({ name: "dayColor", label: r + "dayColor.label" })
        .color({ name: "nightColor", label: r + "nightColor.label" })
        .number({ name: "hueIntensity", min: 0, max: 1, step: 0.01, label: r + "hueIntensity.label", hint: r + "hueIntensity.hint" })
        .number({ name: "dawn", min: 0, max: 1, step: 0.01, label: r + "dawn.label", hint: r + "dawn.hint" })
        .number({ name: "dusk", min: 0, max: 1, step: 0.01, label: r + "dusk.label", hint: r + "dusk.hint" })
        .select({
            name: "latitude",
            label: r + "latitude.label",
            hint: l(r + "latitude.hint"),
            options: {
                "0": r + "latitude.options.disabled",
                "7": r + "latitude.options.equatorial",
                "15": r + "latitude.options.tropical",
                "22": r + "latitude.options.subtropical",
                "37": r + "latitude.options.mediterranean",
                "45": r + "latitude.options.temperate",
                "52": r + "latitude.options.coolTemperate",
                "60": r + "latitude.options.subpolar",
                "67": r + "latitude.options.boreal"
            }
        })
        .json({ name: "climateData", label: r + "climateData.label", hint: r + "climateData.hint" })
        .html(`<a href="https://wiki.theripper93.com/premium/simple-timekeeping#custom-climate-data" target="_blank">WIKI</a>`)


    const calendarOptions = CALENDARS.reduce((options, calendar) => {
        options[calendar.id] = calendar.name
        return options;
    }, { default: l(r + "calendar.default") + ` (${getDefaultCalendar().name})`, custom: r + "calendar.custom" });

    fb.tab({ id: "calendar", icon: "fas fa-calendar", label: r + "tabs.calendar" })
        .text({ name: "journalEntryEvents", label: r + "journalEntryEvents.label" })
        .checkbox({ name: "hideExpired", label: r + "hideExpired.label" })
        .select({ name: "calendar", label: r + "calendar.label", hint: r + "calendar.hint", options: calendarOptions })
        .json({ name: "customCalendar", label: r + "customCalendar.label", hint: r + "customCalendar.hint" })
        .checkbox({ name: "useCustomMoons", label: r + "useCustomMoons.label" })
        .json({ name: "customMoons", label: r + "customMoons.label", hint: r + "customMoons.hint" })
        .html(`<a href="https://wiki.theripper93.com/premium/simple-timekeeping#sample-calendars" target="_blank">WIKI</a>`)

    fb.tab({ id: "automation", icon: "fas fa-gear", label: r + "tabs.automation" })
        .select({
            name: "darknessSync", label: r + "darknessSync.label", hint: r + "darknessSync.hint", options: {
                "sync": r + "darknessSync.options.sync",
                "weatherOnly": r + "darknessSync.options.weatherOnly",
                "darknessOnly": r + "darknessSync.options.darknessOnly",
                "noSync": r + "darknessSync.options.noSync",
            }
        })
        .checkbox({ name: "moonAutomation", label: r + "moonAutomation.label", hint: r + "moonAutomation.hint" })
        .select({
            name: "genWeather", label: r + "genWeather.label", hint: r + "genWeather.hint", options: {
                "": r + "genWeather.options.no",
                "noTemp": r + "genWeather.options.noTemp",
                "tempC": r + "genWeather.options.tempC",
                "tempF": r + "genWeather.options.tempF",
            }
        })
    fb.html(`<fieldset><legend>${l(r + "macrosFieldset.label")}</legend><p class="hint">${l(r + "macrosFieldset.hint")}</p>`)
        .uuid({ name: "newDayMacros", label: r + "newDayMacros.label", type: "Macro", multiple: true })
        .uuid({ name: "dawnMacros", label: r + "dawnMacros.label", type: "Macro", multiple: true })
        .uuid({ name: "duskMacros", label: r + "duskMacros.label", type: "Macro", multiple: true })
        .uuid({ name: "middayMacros", label: r + "middayMacros.label", type: "Macro", multiple: true })
    fb.html(`</fieldset>`)

    fb.onRender((context, options, element) => {

        if (game.system.id === "pf2e") {
            const warnHtml = `<p class="hint">PF2e Timekeeping использует свой календарь. Часы системы PF2e могут показывать другую дату. Для каждой сцены выбирайте один способ управления освещением.</p>`;
            (element.querySelector(".sheet-tabs.tabs") ?? element.firstElementChild).insertAdjacentHTML("beforebegin", warnHtml);
        }

        const jsonEl = element.querySelector(`[name="customCalendar"]`).closest(".form-fields");
        jsonEl.classList.add("scrollable");
        jsonEl.style.maxHeight = "30vh";
        const updateCalendarDescription = () => {
            const calendarSelect = element.querySelector(`[name="calendar"]`);
            const current = calendarSelect.value;
            const calendarDesc = calendarSelect.closest(".form-group").querySelector(".hint");
            const isDefault = current === "default";
            calendarDesc.innerHTML = isDefault ? l(getDefaultCalendar().description) : l(CALENDARS.find(c => c.id === current)?.description ?? r + "calendar.hint")
            const usesDuskDawn = Number.isFinite(CALENDARS.find(c => c.id === current)?.months?.values?.[0]?.dawn);
            if(usesDuskDawn) calendarDesc.innerHTML += `<hr>${l(`${MODULE_ID}.calendar-dusk-dawn`)}`
            element.querySelector(`[name="customCalendar"]`).closest(".form-group").classList.toggle("hidden", current !== "custom");
        }

        const updateDawnDusk = () => {
            const lat = element.querySelector(`[name="latitude"]`);
            const dusk = element.querySelector(`[name="dusk"]`).closest(".form-group")
            const dawn = element.querySelector(`[name="dawn"]`).closest(".form-group")
            dawn.classList.toggle("hidden", lat.value != 0);
            dusk.classList.toggle("hidden", lat.value != 0);
        }

        updateCalendarDescription();
        updateDawnDusk();
        element.querySelector(`[name="calendar"]`).addEventListener("change", updateCalendarDescription)
        element.querySelector(`[name="latitude"]`).addEventListener("change", updateDawnDusk)


        const updateMoonJsonVisibility = () => {
            const useCustomMoons = element.querySelector(`[name="useCustomMoons"]`);
            const customMoons = element.querySelector(`[name="customMoons"]`).closest(".form-group");
            customMoons.classList.toggle("hidden", !useCustomMoons.checked);
        }
        updateMoonJsonVisibility();
        element.querySelector(`[name="useCustomMoons"]`).addEventListener("change", updateMoonJsonVisibility)
    })

    fb.button({
        label: r + "setDateTime.label", icon: "fas fa-calendar-clock", callback: () => {
            ui.pf2eTimekeeping.setCurrentDateTime();
        }
    })


    const data = await fb.render();

    const prevCalendarJson = getSetting("configuration").customCalendar;
    const newCalendarJson = data.customCalendar;
    const prevCalendarMoons = getSetting("configuration").customMoons;
    const newCalendarMoons = data.customMoons;
    
    if (data) {
        if( data.customCalendar?.length > 10){
            try {
                new CONFIG.time.worldCalendarClass(JSON.parse(newCalendarJson));
            } catch (error) {
                console.error("Invalid calendar JSON:", error);
                ui.notifications.error(l(r + "customCalendar.error"));
                data.customCalendar = prevCalendarJson;
            }
        }

        if (data.customMoons?.length > 10) {
            try {
                JSON.parse(newCalendarMoons);
            } catch (error) {
                console.error("Invalid custom moons JSON:", error);
                ui.notifications.error(l(r + "customMoons.error"));
                data.customMoons = prevCalendarMoons;
            }
        }

        data.latitude = Number(data.latitude);
        await setSetting("configuration", data);
        setCalendarJSON();
    }
}

export async function openFirstTimeConfiguration() {
    const r = `${MODULE_ID}.configuration.`;
    const fb = new FormBuilder()
        .object(getSetting("configuration"))
        .title("PF2e Timekeeping: " + l(r + "firstTimeTitle"))
        .size({ width: 600 });

    // Calendar selection
    const calendarOptions = CALENDARS.reduce((options, calendar) => {
        options[calendar.id] = calendar.name;
        return options;
    }, { default: l(r + "calendar.default") + ` (${getDefaultCalendar().name})`, custom: r + "calendar.custom" });

    fb.select({
        name: "calendar",
        label: r + "calendar.label",
        hint: r + "calendar.hint",
        options: calendarOptions
    });

    fb.json({
        name: "customCalendar",
        label: r + "customCalendar.label",
        hint: r + "customCalendar.hint"
    });

    fb.select({
        name: "latitude",
        label: r + "latitude.label",
        hint: l(r + "latitude.hint"),
        options: {
            "0": r + "latitude.options.disabled",
            "7": r + "latitude.options.equatorial",
            "15": r + "latitude.options.tropical",
            "22": r + "latitude.options.subtropical",
            "37": r + "latitude.options.mediterranean",
            "45": r + "latitude.options.temperate",
            "52": r + "latitude.options.coolTemperate",
            "60": r + "latitude.options.subpolar",
            "67": r + "latitude.options.boreal"
        }
    })

    fb.select({
        name: "darknessSync",
        label: r + "darknessSync.label",
        hint: r + "darknessSync.hint",
        options: {
            "sync": r + "darknessSync.options.sync",
            "weatherOnly": r + "darknessSync.options.weatherOnly",
            "darknessOnly": r + "darknessSync.options.darknessOnly",
            "noSync": r + "darknessSync.options.noSync"
        }
    });

    fb.select({
        name: "genWeather",
        label: r + "genWeather.label",
        hint: r + "genWeather.hint",
        options: {
            "": r + "genWeather.options.no",
            "noTemp": r + "genWeather.options.noTemp",
            "tempC": r + "genWeather.options.tempC",
            "tempF": r + "genWeather.options.tempF",
        }
    });

    fb.checkbox({
        name: "moonAutomation",
        label: r + "moonAutomation.label",
        hint: r + "moonAutomation.hint"
    });

    fb.checkbox({
        name: "hideInCombat",
        label: r + "hideInCombat.label"
    });

    fb.onRender((context, options, element) => {
        if (game.system.id === "pf2e") {
            const warnHtml = `<p class="hint">PF2e Timekeeping использует свой календарь. Часы системы PF2e могут показывать другую дату. Для каждой сцены выбирайте один способ управления освещением.</p>`;
            (element.querySelector(".sheet-tabs.tabs") ?? element.firstElementChild).insertAdjacentHTML("beforebegin", warnHtml);
        }
        const updateCalendarDescription = () => {
            const calendarSelect = element.querySelector(`[name="calendar"]`);
            const current = calendarSelect.value;
            const calendarDesc = calendarSelect.closest(".form-group").querySelector(".hint");
            const isDefault = current === "default";
            calendarDesc.innerText = isDefault ? l(getDefaultCalendar().description) : l(CALENDARS.find(c => c.id === current)?.description ?? r + "calendar.hint")
            element.querySelector(`[name="customCalendar"]`).closest(".form-group").classList.toggle("hidden", current !== "custom");
        }
        updateCalendarDescription();
        element.querySelector(`[name="calendar"]`).addEventListener("change", updateCalendarDescription);
    });

    const data = await fb.render();

    const prevCalendarJson = getSetting("configuration").customCalendar;
    const newCalendarJson = data.customCalendar;
    const prevCalendarMoons = getSetting("configuration").customMoons;
    const newCalendarMoons = data.customMoons;
    
    if (data) {
        if( data.customCalendar?.length > 10){
            try {
                new CONFIG.time.worldCalendarClass(JSON.parse(newCalendarJson));
            } catch (error) {
                console.error("Invalid calendar JSON:", error);
                ui.notifications.error(l(r + "customCalendar.error"));
                data.customCalendar = prevCalendarJson;
            }
        }
        
        if (data.customMoons?.length > 10) {
            try {
                JSON.parse(newCalendarMoons);
            } catch (error) {
                console.error("Invalid custom moons JSON:", error);
                ui.notifications.error(l(r + "customMoons.error"));
                data.customMoons = prevCalendarMoons;
            }
        }
                data.latitude = Number(data.latitude);
        await setSetting("configuration", mergeClone(getSetting("configuration"), data));
        setCalendarJSON();
    }
}



Hooks.on("renderSceneConfig", (app, element) => {
    const current = app.document.getFlag(MODULE_ID, "darknessSync") ?? "default"
    const html = `
    <fieldset>
    <legend>PF2e Timekeeping</legend>
    <div class="form-group">
  <label>${l("pf2e-timekeeping.configuration.darknessSync.label")}</label>
  <div class="form-fields">
    <select name="flags.${MODULE_ID}.darknessSync">
      <option value="default" ${current === "default" ? "selected" : ""}>${l("pf2e-timekeeping.configuration.darknessSync.options.default")}</option>
      <option value="sync" ${current === "sync" ? "selected" : ""}>${l("pf2e-timekeeping.configuration.darknessSync.options.sync")}</option>
        <option value="weatherOnly" ${current === "weatherOnly" ? "selected" : ""}>${l("pf2e-timekeeping.configuration.darknessSync.options.weatherOnly")}</option>
        <option value="darknessOnly" ${current === "darknessOnly" ? "selected" : ""}>${l("pf2e-timekeeping.configuration.darknessSync.options.darknessOnly")}</option>
      <option value="noSync" ${current === "noSync" ? "selected" : ""}>${l("pf2e-timekeeping.configuration.darknessSync.options.noSync")}</option>
    </select>
  </div>
</div>
    </fieldset>
    `
    element.querySelector(`.tab[data-tab="lighting"]`)?.insertAdjacentHTML("beforeend", html)
})

Hooks.on("getHeaderControlsJournalEntryPageSheet", (app, buttons) => {
    buttons.push({
        class: "configure-date",
        icon: "fas fa-calendar",
        label: game.i18n.localize(`${MODULE_ID}.app.create-event.edit.label`),
        onClick: async () => {
            ui.pf2eTimekeeping.createEventDialog(app.document);
        },
    });
});
