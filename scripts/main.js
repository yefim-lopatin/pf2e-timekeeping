import { PF2eTimekeeping } from "./app/PF2eTimekeeping.js";
import { CalendarClass } from "./CalendarClass.js";
import { CALENDARS } from "./calendars.js";
import { initConfig, openConfiguration, openFirstTimeConfiguration } from "./config.js";
import { getSetting, registerSettings, setSetting } from "./settings.js";

import { MODULE_ID } from "./module-id.js";
export { MODULE_ID };

let DEFAULT_CALENDAR;

let defaultChanged = false;

export function getDefaultCalendar() {
    return DEFAULT_CALENDAR;
}

Hooks.on("init", () => {
    registerSettings();
    PF2eTimekeeping.CALENDARS = CALENDARS;
    DEFAULT_CALENDAR = CONFIG.time.worldCalendarConfig;
    CONFIG.time.worldCalendarClass = CalendarClass;
    setCalendarJSON(true);
});

Hooks.once("ready", async () => {
    initConfig();
    Hooks.callAll(`initPF2eTimekeeping`, PF2eTimekeeping)
    const app = new PF2eTimekeeping();
    game.modules.get(MODULE_ID).api = app;
    await app.render({ force: true });

    if (game.user.isGM && !getSetting("firstTimeSetupShown")) {
        openFirstTimeConfiguration();
        setSetting("firstTimeSetupShown", true);
    }
});

export function setCalendarJSON(firstTime = false) {
    const config = getSetting("configuration")
    const configNumber = Number.isFinite(config.secondsPerRound) ? config.secondsPerRound : 0;
    CONFIG.time.roundTime = configNumber || CONFIG.time.roundTime;
    if (PF2eTimekeeping.CALENDARS.find(c => c.id === config.calendar)) {
        CONFIG.time.worldCalendarConfig = PF2eTimekeeping.CALENDARS.find(c => c.id === config.calendar);
        defaultChanged = true;
    }
    else if (config.customCalendar.length > 10 && config.calendar === "custom") {
        try {
            let json;
            try {
                json = JSON.parse(config.customCalendar);
            } catch (e) {
                setTimeout(() => ui.notifications.error("PF2e Timekeeping: Invalid Calendar JSON.", { permanent: true }), 1000)
            }

            // Validate JSON structure
            new CONFIG.time.worldCalendarClass(json);

            const daysInYear = json.months.values.reduce((acc, v) => acc += v.days, 0);
            const daysInYearJson = json.days.daysPerYear;
            if (daysInYear !== daysInYearJson) {
                setTimeout(() => ui.notifications.error(`PF2e Timekeeping: Calendar JSON definition states ${daysInYearJson} Days in one year, but months add up to ${daysInYear} Days. Please fix the calendar json accordingly.`, { permanent: true }), 1000)
                json.days.daysPerYear = daysInYear;
            }

            if (!json.seasons) {
                json.seasons = {
                    values: [
                        {
                            "name": "Missing Seasons",
                            "monthStart": 0,
                            "monthEnd": 999
                        },
                    ]
                }
            }
            if (json.moons?.values?.length) {
                json.moons.values.forEach(moon => {
                    if (!moon.phaseNames?.length) {
                        moon.phaseNames = [
                            `${MODULE_ID}.moonPhase.new`,
                            `${MODULE_ID}.moonPhase.waxingCrescent`,
                            `${MODULE_ID}.moonPhase.firstQuarter`,
                            `${MODULE_ID}.moonPhase.waxingGibbous`,
                            `${MODULE_ID}.moonPhase.full`,
                            `${MODULE_ID}.moonPhase.waningGibbous`,
                            `${MODULE_ID}.moonPhase.lastQuarter`,
                            `${MODULE_ID}.moonPhase.waningCrescent`
                        ]
                    }
                })
            }
            CONFIG.time.worldCalendarConfig = json;
            defaultChanged = true;
        } catch (e) {
            setTimeout(() => ui.notifications.error("PF2e Timekeeping: Failed to set custom calendar, please review your calendar JSON.", { permanent: true }), 1000)
            console.error(e)
        }
    } else {
        if (defaultChanged) CONFIG.time.worldCalendarConfig = DEFAULT_CALENDAR;
    }
    if (!firstTime) game.time.initializeCalendar();
}