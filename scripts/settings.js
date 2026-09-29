import { CALENDARS } from "./calendars.js";
import { openConfiguration } from "./config.js";
import { CLIMATE_DATA } from "./const.js";
import { deepClone, HandlebarsApplication, mergeClone } from "./lib/utils.js";
import { MODULE_ID } from "./module-id.js";
import { setCalendarJSON } from "./main.js";

const SETTING_CACHE = {};
const DEFAULT_CACHE = true;

class ButtonApplication extends HandlebarsApplication {

    static get PARTS() {
        return {
        };
    }

    _onRender() {
        this.element.style.display = "none";
        openConfiguration();
        this.close();
    }
}

export function registerSettings() {

    const defaultCalendar = CALENDARS.find(c => c.system === game.system.id)?.id ?? (game.system.id === "pf2e" ? "golarion" : undefined);

    const settings = {
        "configuration": {
            type: Object,
            scope: "world",
            useCache: true,
            default: {
                weatherLabel: `${MODULE_ID}.defaults.weather`,
                weatherColor: "#ffffff",
                moonLabel: `${MODULE_ID}.defaults.moon`,
                moonColor: "#ffffff",
                daysDisplay: "sinceEpoch",
                showFullDate: true,
                moonAutomation: true,
                wideLetterSpacing: true,
                useMonospace: true,
                noPills: false,
                hideInCombat: false,
                use24HourClock: true,
                useCustomMoons: false,
                useFullWidth: false,
                topOffset: 16,
                customMoons: `[
                {
                    "name": "Moon",
                    "cycleLength": 30,
                    "offset": 0
                }
                ]`,
                latitude: 45,
                genWeather: "",
                dayColor: "#e2c018",
                nightColor: "#3a4883",
                hueIntensity: 0.3,
                dawn: 0.23,
                dusk: 0.77,
                secondsPerRealSecond: 10,
                secondsPerRound: 6,
                clockSeconds: 60,
                dayOffset: 0,
                newDayMacros: [],
                dawnMacros: [],
                duskMacros: [],
                middayMacros: [],
                calendar: defaultCalendar ?? "custom",
                customCalendar: "",
                climateData: "",
                journalEntryEvents: "PF2eTimekeeping",
                darknessSync: "sync",
                season0: "#00ff04",
                season1: "#e6c700",
                season2: "#753900",
                season3: "#009dff"
            },

            onChange: () => {
                setCalendarJSON();
                const app = ui.pf2eTimekeeping;
                if (!app) return;
                const seconds = getSetting("configuration").clockSeconds ?? 60;
                if (seconds !== app.clockSeconds) {
                    app.clockSeconds = seconds;
                    app.setupClock();
                }
                app.onUpdateWorldTime();
            }
        },
        "firstTimeSetupShown": {
            type: Boolean,
            default: false,
            scope: "world",
            config: false,
            useCache: false,
        },
        "paused": {
            type: Boolean,
            default: false,
            scope: "world",
            config: false,
            useCache: true,
            onChange: () => {
                ui.pf2eTimekeeping?.onUpdateWorldTime();
            }
        }
    };

    registerSettingsArray(settings);


    game.settings.registerMenu(MODULE_ID, "config-menu", {
        name: `${MODULE_ID}.settings.config-menu.name`,
        label: `${MODULE_ID}.settings.config-menu.label`,
        hint: `${MODULE_ID}.settings.config-menu.hint`,
        icon: "fas fa-cogs",
        scope: "world",
        restricted: true,
        type: ButtonApplication,
    });
}

export function getSetting(key) {
    return SETTING_CACHE[key] ?? game.settings.get(MODULE_ID, key);
}

export async function setSetting(key, value) {
    return await game.settings.set(MODULE_ID, key, value);
}

function registerSettingsArray(settings) {
    for (const [key, value] of Object.entries(settings)) {
        if (!value.name) value.name = `${MODULE_ID}.settings.${key}.name`
        if (!value.hint) value.hint = `${MODULE_ID}.settings.${key}.hint`
        if (value.useCache === undefined) value.useCache = DEFAULT_CACHE;
        const useValue = typeof value.default !== "object";
        if (value.useCache) {
            const unwrappedOnChange = value.onChange;
            if (value.onChange) value.onChange = (value) => {
                SETTING_CACHE[key] = useValue ? value : mergeClone(game.settings.settings.get(MODULE_ID + "." + key).default, value);
                if (unwrappedOnChange) unwrappedOnChange(value);
            }
        }
        game.settings.register(MODULE_ID, key, value);
        if (value.useCache) SETTING_CACHE[key] = useValue ? getSetting(key) : mergeClone(game.settings.settings.get(MODULE_ID + "." + key).default, getSetting(key));
    }
}