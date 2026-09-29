import { MODULE_ID } from "../module-id.js";
import { setCalendarJSON } from "../main.js";
import { HandlebarsApplication, l, mergeClone, setProperty, localizeMonthForDate, formatDayCount, localizeBadgeLabel } from "../lib/utils.js";
import { BADGE_COUNT, openConfiguration } from "../config.js";
import { getSetting, setSetting } from "../settings.js";
import { FormBuilder } from "../lib/formBuilder.js";
import { MOON_PRESETS, WEATHER_PRESETS, CLIMATE_DATA, DEFAULT_PHASE_NAMES } from "../const.js";
import { Curve } from "../curve.js";

export class PF2eTimekeeping extends HandlebarsApplication {
    static get APP_ID() { return MODULE_ID; }
    constructor() {
        super();
        PF2eTimekeeping.localize();
        Hooks.on("updateWorldTime", this.onUpdateWorldTime.bind(this));
        Hooks.on("updateCombat", this.setCombatVisibility.bind(this));
        Hooks.on("createCombat", this.setCombatVisibility.bind(this));
        Hooks.on("deleteCombat", this.setCombatVisibility.bind(this));
        Hooks.on("createJournalEntryPage", this.updateEventPagesList.bind(this));
        Hooks.on("deleteJournalEntryPage", this.updateEventPagesList.bind(this));
        Hooks.on("updateJournalEntryPage", this.updateEventPagesList.bind(this));
        Hooks.on("pauseGame", this.onUpdateWorldTime.bind(this));
        ui.pf2eTimekeeping = this;
        this.eventPages = [];
        this.clockSeconds = getSetting("configuration").clockSeconds ?? 60;
        this.setupClock();
        this._lastDay = this.components.day;
        this._isAfterDawn = this.components.hour >= this.dawn * game.time.calendar.days.hoursPerDay;
        this._isAfterDusk = this.components.hour >= this.dusk * game.time.calendar.days.hoursPerDay;
        this._isAfterMidday = this.components.hour >= 0.5 * game.time.calendar.days.hoursPerDay;
    }

    get calendarData() {
        return CONFIG.time.worldCalendarConfig;
    }

    get worldTime() {
        return game.time.worldTime;
    }

    get components() {
        return game.time.components;
    }

    static localize() {
        this.MOON_PRESETS.forEach(p => {
            p.label = l(p.label)
        })
    }

    static get DEFAULT_OPTIONS() {
        return mergeClone(super.DEFAULT_OPTIONS, {
            classes: [this.APP_ID, "application", "faded-ui", "ui-control"],
            id: this.APP_ID,
            window: {
                title: `${MODULE_ID}.${this.APP_ID}.title`,
                icon: "",
                resizable: false,
                frame: false,
            },
        });
    }

    static get PARTS() {
        return {
            content: {
                template: `modules/${MODULE_ID}/templates/${this.APP_ID}.hbs`,
                classes: ["content"],
                scrollable: [],
            },
        };
    }

    getControls() {
        if (!game.user.isGM) return {
            left: [{
                action: "toggle-events",
                icon: "fas fa-calendar",
                tooltip: `${this.APP_ID}.app.controls.toggle-events.tooltip`
            }],
            right: [],
        }
        return {
            left: [
                {
                    action: "day-back",
                    icon: "fas fa-backward",
                    tooltip: `${this.APP_ID}.app.controls.day-back.tooltip`
                },
                {
                    action: "hour-back",
                    icon: "fas fa-backward-step",
                    tooltip: `${this.APP_ID}.app.controls.hour-back.tooltip`
                },
                {
                    action: "sunrise",
                    icon: "fas fa-sunrise",
                    tooltip: `${this.APP_ID}.app.controls.sunrise.tooltip`
                },
                {
                    action: "midday",
                    icon: "fas fa-sun",
                    tooltip: `${this.APP_ID}.app.controls.midday.tooltip`
                },
                {
                    action: "toggle-events",
                    icon: "fas fa-calendar",
                    tooltip: `${this.APP_ID}.app.controls.toggle-events.tooltip`
                }
            ],
            right: [
                {
                    action: "configure",
                    icon: "fas fa-cog",
                    tooltip: `${this.APP_ID}.app.controls.configure.tooltip`
                },
                {
                    action: "sunset",
                    icon: "fas fa-sunset",
                    tooltip: `${this.APP_ID}.app.controls.sunset.tooltip`
                },
                {
                    action: "midnight",
                    icon: "fas fa-moon-stars",
                    tooltip: `${this.APP_ID}.app.controls.midnight.tooltip`
                },

                {
                    action: "hour-forward",
                    icon: "fas fa-forward-step",
                    tooltip: `${this.APP_ID}.app.controls.hour-forward.tooltip`
                },
                {
                    action: "day-forward",
                    icon: "fas fa-forward",
                    tooltip: `${this.APP_ID}.app.controls.day-forward.tooltip`
                },
            ],
        }
    }

    get moons() {
        const customMoons = getSetting("configuration").customMoons;
        if (customMoons?.length > 10 && getSetting("configuration").useCustomMoons) {
            try {
                const json = JSON.parse(customMoons);
                const moons = json?.moons?.values ?? json ?? [];
                if (!Array.isArray(moons)) throw new Error("Custom moons JSON is not an array");
                return moons;
            } catch (error) {
                ui.notifications.error(l(`${MODULE_ID}.errors.moonsJSON`));
                console.error("Failed to parse custom moons JSON", error);
                return [];
            }
        }
        return this.calendarData?.moons?.values ?? [];
    }

    get currentMonth() {
        return this.calendarData?.months?.values?.[this.components.month] ?? {}
    }

    get eventsJournal() {
        return game.journal.getName(getSetting("configuration").journalEntryEvents);
    }

    get secondsInDay() {
        return game.time.calendar.days.hoursPerDay * this.secondsInHour;
    }

    get secondsInHour() {
        return game.time.calendar.days.minutesPerHour * game.time.calendar.days.secondsPerMinute;
    }

    get dateTimeText() {
        const timeText = this.timeComponentsToString({ hour: this.components.hour, minute: this.components.minute });
        const daysDisplay = getSetting("configuration").daysDisplay;
        if (daysDisplay === "none") return timeText;
        else if (daysDisplay === "sinceEpoch") return l(`${MODULE_ID}.day`) + ` ${Math.floor(this.worldTime / this.secondsInDay) + Math.round(getSetting("configuration").dayOffset || 0)} - ${timeText}`
        else if (daysDisplay === "dayOfYear") return l(`${MODULE_ID}.day`) + ` ${this.components.day} - ${timeText}`
        return timeText;
    }

    get fullDateText() {
        return this.getFullDateText();
    }

    timeComponentsToString(components) {
        const { hour, minute, second } = components;
        const use24HourClock = getSetting("configuration").use24HourClock;
        const isPM = hour >= 12;
        const hourValue = use24HourClock ? hour : (hour % 12 || 12);
        const hourText = hourValue < 10 ? `0${hourValue}` : hourValue;
        const minuteText = minute < 10 ? `0${minute}` : minute;
        const secondText = second !== undefined ? second < 10 ? `0${second}` : second : "";
        return `${hourText}:${minuteText}` + (secondText ? `:${secondText}` : "") + (use24HourClock ? "" : ` ${l(`${MODULE_ID}.date.${isPM ? "pm" : "am"}`)}`);
    }

    updateMoonPhase() {
        if (!game.user.isActiveGM || !getSetting("configuration").moonAutomation) return;
        const daysSinceEpoch = this.worldTime / this.secondsInDay;
        const moons = this.moons;
        if (!moons?.length) return;
        const useName = moons.length > 1;
        let moonPhaseTextTooltip = [];
        let moonPhaseText = [];
        for (const moon of moons) {
            const phaseNames = moon.phaseNames?.length ? moon.phaseNames : DEFAULT_PHASE_NAMES;
            const phaseIndex = Math.floor(((daysSinceEpoch + (moon.offset ?? 0)) % (moon.cycleLength || 30)) / ((moon.cycleLength || 30) / phaseNames.length));
            if (useName) moonPhaseTextTooltip.push(`${l(moon.name)} (${l(phaseNames[phaseIndex])})`)
            else moonPhaseTextTooltip.push(phaseNames[phaseIndex]);

            const moonPhaseIcon = this.constructor.MOON_PRESETS.find(p => p.label === l(phaseNames[phaseIndex]))?.icon;
            if (moonPhaseIcon) {
                moonPhaseText.push(`${moonPhaseIcon} ${l(moon.name)}`)
            } else {
                moonPhaseText = moonPhaseTextTooltip;
            }
        }
        if (moonPhaseText) this.setMoonBadge(moonPhaseText.join(" | "), undefined, moonPhaseTextTooltip.join(" | "));
    }

    getFullDateText(components) {
        try {
            components ??= this.components;
            if (Number.isFinite(components)) components = game.time.calendar.timeToComponents(components);
            const { dayOfMonth, dayOfWeek, year, season, month } = components;
            const calendar = game.time.calendar;
            const realDayOfWeek = dayOfWeek < 0 ? calendar.days.values.length + dayOfWeek : dayOfWeek;
            const isIntercalaryMonth = CONFIG.time.worldCalendarConfig.months.values[month].intercalary ?? false;
            let fullDateString = "";
            if (!isIntercalaryMonth) fullDateString += l(calendar.days.values[realDayOfWeek].name) + ", "
            if (!isIntercalaryMonth) fullDateString += (dayOfMonth + 1) + " ";
            fullDateString += (isIntercalaryMonth ? l(calendar.months.values[month].name) : localizeMonthForDate(calendar.months.values[month].name)) + l(`${MODULE_ID}.date.yearSeparator`);
            fullDateString += (year + 1);
            return fullDateString;
        } catch (error) {
            console.error("Failed to generate full date text, please check your calendar JSON for errors.", error)
            return l(`${MODULE_ID}.errors.date`)
        }
    }

    static monthsToDays(month, year) {
        const isLeapYear = game.time.calendar.isLeapYear(year + 1);
        const months = game.time.calendar.months.values.slice(0, month)
        let monthDays = 0;
        months.forEach(m => {
            monthDays += isLeapYear ? m.leapDays ?? m.days : m.days;
        })
        return monthDays;
    }

    getDaysTo(timestamp) {
        const delta = timestamp - this.worldTime;
        return delta / this.secondsInDay;
    }

    setupClock() {
        clearInterval(this._clockInterval);
        if (!game.user.isGM) return;
        this._clockInterval = setInterval(() => this.onInterval(), this.clockSeconds * 1000);
    }

    onInterval() {
        if (!game.user.isActiveGM || game.paused || game.combat?.started || getSetting("paused")) return;
        game.time.advance(Math.round(getSetting("configuration").secondsPerRealSecond * this.clockSeconds))
    }

    get paused() {
        return game.paused || game.combat?.started || getSetting("paused");
    }

    updateDateTimeText() {
        if (!this.element) return;
        const dtText = this.element.querySelector("#date-time-text");
        dtText.innerText = this.dateTimeText;
        dtText.style.backgroundColor = getSkyColor(this.dayTimePercent, getSetting("configuration").nightColor, getSetting("configuration").dayColor, this.dawn, this.dusk);
        const seasonName = game.time.calendar.seasons.values[Math.clamp(0, game.time.calendar.seasons.values.length - 1, this.components.season)]?.name;
        const season = seasonName ? " | " + l(seasonName) : "";
        dtText.dataset.tooltip = this.fullDateText + season;
        const paused = this.paused;
        if (paused) dtText.dataset.tooltip += ` (${l(`${MODULE_ID}.paused`)})`;
        dtText.classList.toggle("paused", paused);
    }

    generateWeather(latitude, dayOfYear, seasonIndex) {
        latitude ??= getSetting("configuration").latitude;
        dayOfYear ??= this.components.day;
        seasonIndex ??= Math.clamp(0, game.time.calendar.seasons.values.length - 1, this.components.season);

        const season = ["spring", "summer", "autumn", "winter"][seasonIndex];

        const climateZone = Math.abs(latitude) < 23.5
            ? "tropical"
            : Math.abs(latitude) < 40
                ? "subtropical"
                : Math.abs(latitude) < 60
                    ? "temperate"
                    : "polar";

        const climate = this.constructor.CLIMATE_DATA[climateZone] ?? this.constructor.CLIMATE_DATA.default ?? this.constructor.CLIMATE_DATA[Object.keys(this.constructor.CLIMATE_DATA)[0]];
        const seasonWeather = climate.weather[season] ?? climate.weather.default;
        const weightedWeather = [];

        for (const [type, weight] of Object.entries(seasonWeather)) {
            for (let i = 0; i < weight; i++) {
                weightedWeather.push(type);
            }
        }

        const randomType = weightedWeather[Math.floor(Math.random() * weightedWeather.length)];

        const { min, max } = climate.temperature[season] ?? climate.temperature.default;
        const celsius = Math.round(min + Math.random() * (max - min));
        const fahrenheit = Math.round(celsius * 9 / 5 + 32);

        return {
            ...this.constructor.WEATHER_PRESETS.find(w => w.id === randomType),
            celsius: `${celsius}°C`,
            fahrenheit: `${fahrenheit}°F`
        };
    }

    calculateDawnDusk(dayOfYear, latitude) {
        dayOfYear ??= this.components.day;
        latitude ??= getSetting("configuration").latitude;
        const dayNorm = dayOfYear / game.time.calendar.days.daysPerYear;
        const d = dayNorm * 365 + 1;
        const phi = latitude * Math.PI / 180;
        const delta = -23.45 * Math.cos((360 / 365) * (d + 10) * Math.PI / 180) * Math.PI / 180;
        const cosH = (Math.cos(90.833 * Math.PI / 180) - Math.sin(phi) * Math.sin(delta)) /
            (Math.cos(phi) * Math.cos(delta));
        if (cosH > 1) return { sunrise: 0, sunset: 0.0001 };
        if (cosH < -1) return { sunrise: 0, sunset: 1 };
        const hHours = Math.acos(cosH) * 180 / Math.PI / 15;

        const timezoneOffset = 2;
        const standardMeridian = 15;
        const longitude = 11.5;
        const longitudeCorrection = (standardMeridian - longitude) * 4 / 60;

        const totalOffset = timezoneOffset + longitudeCorrection;

        let sunrise = 0.5 - hHours / 24;
        let sunset = 0.5 + hHours / 24;

        sunrise = (sunrise + totalOffset / 24) % 1;
        sunset = (sunset + totalOffset / 24) % 1;

        return { dawn: sunrise, dusk: sunset };
    }


    get useLatitude() {
        return !!getSetting("configuration").latitude;
    }


    get dawn() {
        if (Number.isFinite(this.currentMonth.dawn)) return this.currentMonth.dawn;
        if (this.useLatitude) return this.calculateDawnDusk().dawn;
        return getSetting("configuration").dawn;
    }

    get dusk() {
        if (Number.isFinite(this.currentMonth.dusk)) return this.currentMonth.dusk;
        if (this.useLatitude) return this.calculateDawnDusk().dusk;
        return getSetting("configuration").dusk;
    }

    updateSceneBrightness() {
        if (!game.user.isActiveGM) return;
        const scenes = this.darknessScenes;

        const darknessLevel = 1 - getBrightness(this.dayTimePercent, this.dawn, this.dusk);
        const hueIntensity = getSetting("configuration").hueIntensity;

        const updateData = {
            "environment.darknessLevel": darknessLevel,
            "environment.base.intensity": hueIntensity,
            "environment.dark.intensity": hueIntensity,
            "environment.dark.hue": getHueFromHex(getSetting("configuration").nightColor) / 360,
            "environment.base.hue": getHueFromHex(getSetting("configuration").dayColor) / 360
        };

        for (const scene of scenes) {
            if (!scene) continue;
            const sceneSync = scene.getFlag(MODULE_ID, "darknessSync") ?? "default";
            const sync = sceneSync === "default" ? getSetting("configuration").darknessSync : sceneSync;
            const doSync = sync === "sync" || sync === "darknessOnly";
            if (!doSync) continue;
            scene.update(updateData, { animateDarkness: true })
        }
    }

    updateFullDateText() {
        const fd = this.element.querySelector("#full-date");
        fd.innerText = this.fullDateText;
        fd.classList.toggle("hidden", !getSetting("configuration").showFullDate)
        const seasonColor = getSetting("configuration")[`season${Math.clamp(this.components.season, 0, game.time.calendar.seasons.values.length - 1)}`];
        fd.style.backgroundColor = seasonColor;
    }

    updateWeatherBadge() {
        const label = getSetting("configuration").weatherLabel;
        this.element.querySelector("#weather").innerText = localizeBadgeLabel(label);
        this.element.querySelector("#weather").style.background = getSetting("configuration").weatherColor;
        this.element.querySelector("#weather").classList.toggle("hidden", !label);
    }

    updateMoonBadge() {
        const label = getSetting("configuration").moonLabel;
        this.element.querySelector("#moon-phase").innerText = localizeBadgeLabel(label);
        this.element.querySelector("#moon-phase").style.background = getSetting("configuration").moonColor;
        this.element.querySelector("#moon-phase").dataset.tooltip = getSetting("configuration").moonTooltip ?? "";
        this.element.querySelector("#moon-phase").classList.toggle("hidden", !label);
    }

    async updateBadges() {
        const customBadges = this.customBadges;
        for (const badge of customBadges) {
            const el = this.element.querySelector(`.custom-badge[data-index="${badge.index}"]`)
            el.style.background = badge.color;
            el.innerHTML = await foundry.applications.ux.TextEditor.enrichHTML(badge.label);
            el.classList.toggle("hidden", !badge.label)
        }
        this.updateMoonBadge();
        this.updateWeatherBadge();
    }

    updateEventPagesList(existingPage, updates) {
        if (existingPage && existingPage.flags[MODULE_ID]?.eventTime === undefined) return;
        this.element?.querySelector(`button[data-action="create-event"]`)?.classList.toggle("hidden", !(game.user.isGM || game.journal.getName(getSetting("configuration").journalEntryEvents)?.isOwner))
        const current = this.eventPages.map(p => p.uuid).join("")
        this.eventPages = [];
        game.journal.forEach(j => {
            j.pages.forEach(page => {
                const perm = page.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED);
                const eventTime = page.flags?.[MODULE_ID]?.eventTime;
                if (perm && eventTime !== undefined) this.eventPages.push(page);
            })
        })
        this.eventPages = this.eventPages.sort((a, b) => (a.getFlag(MODULE_ID, "eventTime") ?? 0) > (b.getFlag(MODULE_ID, "eventTime") ?? 0)).reverse()
        const updated = updates && ("name" in updates || "flags" in updates);
        if (!updated && this.eventPages.map(p => p.uuid).join("") === current) return;
        this.updateEventsList();
    }

    adjustTimestampForRepeat(timestamp, repeat, offset = 0) {
        if (!repeat || !timestamp) return timestamp;
        const now = this.worldTime - offset;
        if (timestamp > now) return timestamp;

        const components = game.time.calendar.timeToComponents(timestamp);
        const currentComponents = game.time.calendar.timeToComponents(now);
        const calendar = game.time.calendar;

        switch (repeat) {
            case "day":
                components.year = currentComponents.year;
                components.month = currentComponents.month;
                components.day = currentComponents.day;
                if (game.time.calendar.componentsToTime(components) <= now) {
                    components.day++;
                }
                break;
            case "week":
                const daysInWeek = calendar.days.values.length;
                const daysUntilNext = (components.dayOfWeek - currentComponents.dayOfWeek + daysInWeek) % daysInWeek;
                components.year = currentComponents.year;
                components.month = currentComponents.month;
                components.day = currentComponents.day + (daysUntilNext || daysInWeek);
                break;
            case "month":
                components.year = currentComponents.year;
                components.month = currentComponents.month;
                const dayOfMonth = components.dayOfMonth;
                if (dayOfMonth < currentComponents.dayOfMonth) {
                    components.month++;
                    if (components.month >= calendar.months.values.length) {
                        components.month = 0;
                        components.year++;
                    }
                }
                components.day = this.constructor.monthsToDays(components.month, components.year + 1) + dayOfMonth;
                break;
            case "year":
                components.year = currentComponents.year;
                if (game.time.calendar.componentsToTime(components) <= now) {
                    components.year++;
                }
                break;
        }

        return game.time.calendar.componentsToTime(components);
    }

    prepareEventData() {
        const eventData = [];
        const nonGMs = game.users.filter(u => !u.isGM);
        const now = this.worldTime;
        const hideExpired = getSetting("configuration").hideExpired;
        this.eventPages.forEach(page => {
            const eventTime = page.getFlag(MODULE_ID, "eventTime") ?? 0;
            const eventEnd = page.getFlag(MODULE_ID, "eventEnd") || undefined;
            const repeat = page.getFlag(MODULE_ID, "repeat");
            const duration = (eventEnd ?? eventTime) - eventTime;
            const adjustedEventEnd = this.adjustTimestampForRepeat(eventEnd, repeat);
            const inProgress = adjustedEventEnd && (now < (adjustedEventEnd) && now > (adjustedEventEnd - duration));
            const adjustedEventTime = this.adjustTimestampForRepeat(eventTime, repeat);
            const expired = now > (adjustedEventEnd ?? adjustedEventTime);
            if (hideExpired && expired) return;
            eventData.push({
                event: page,
                eventTime: adjustedEventTime,
                daysToEvent: Math.round((adjustedEventTime - now) / this.secondsInDay),
                eventEnd: adjustedEventEnd,
                repeatInProgress: repeat && inProgress,
                hasPlayerViewer: game.user.isGM && nonGMs.some(u => page.testUserPermission(u, CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED)),
                isObserver: game.user.isGM || page.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER)
            })
        })
        return eventData.sort((a, b) => (a.eventTime ?? 0) - (b.eventTime ?? 0))
    }

    timestamp(time){
        const brokenTimestamp = game.time.calendar.format(time);
        const components = Number.isFinite(time) ? game.time.calendar.timeToComponents(time) : time;
        const year = (components.year + 1).paddedString(4);
        return brokenTimestamp.replace(/^\d{4}/, year);
    }

    updateEventsList() {
        const now = this.worldTime;
        const search = this.element.querySelector("#search").value.toLowerCase();
        const eventDataList = this.prepareEventData().filter(ed => !search || ed.event.name.toLowerCase().includes(search))
        const container = this.element.querySelector("#events-list");
        let showNotification = false;
        let html = "";
        for (const eventData of eventDataList) {
            const { event, eventTime, eventEnd, hasPlayerViewer, isObserver, repeatInProgress, daysToEvent } = eventData
            const hasPlayerViewerIcon = hasPlayerViewer ? `<i class="fas fa-eye"></i>` : `<i style="opacity: 0" class="fas fa-eye"></i>`;
            const expiration = eventEnd ?? eventTime;
            const inProgress = eventEnd && (repeatInProgress || (now < eventEnd && now > eventTime));
            let timeText = inProgress ? l(MODULE_ID + ".in-progress") : this.timestamp(eventTime);
            if (eventEnd) timeText += ` - ${this.timestamp(eventEnd)}`
            const soon = inProgress || (expiration - now < this.secondsInDay && eventTime - now > 0) || (eventEnd !== undefined && now > eventTime && now < eventEnd);
            const daysLeft = now > expiration || soon ? "" : ` - ${formatDayCount(daysToEvent)}`
            if (soon) showNotification = true;
            html += `<li class="${now > expiration ? "expired" : ""} ${soon ? "soon" : ""}" ${now > expiration ? `style="order: 9999"` : ""} data-uuid="${event.uuid}"><span class="name">${event.name + daysLeft}</span><span class="timestamp ${isObserver ? "" : "hidden"}">[${timeText}]</span>${hasPlayerViewerIcon}</li>`
        }
        container.innerHTML = html;
        container.querySelectorAll("li").forEach(li => li.addEventListener("click", (e) => {
            const page = fromUuidSync(li.dataset.uuid)
            page.parent.sheet.render(true, { pageId: page.id })
        }))
        const eventButton = this.element.querySelector(`button[data-action="toggle-events"]`);
        eventButton.innerHTML = "";
        if (showNotification) {
            eventButton.innerHTML = `<i class="icon fas fa-circle"></i>`
        }
    }

    updateClasses() {
        const config = getSetting("configuration");
        this.element.classList.toggle("wide-letter-spacing", config.wideLetterSpacing);
        this.element.classList.toggle("use-monospace", config.useMonospace);
        this.element.classList.toggle("use-full-width", config.useFullWidth);
        this.element.classList.toggle("no-pills", config.noPills);
        this.element.style.marginTop = config.topOffset + "px";
    }

    static MOON_PRESETS = MOON_PRESETS;

    static WEATHER_PRESETS = WEATHER_PRESETS;

    static get CLIMATE_DATA() {
        const json = getSetting("configuration").climateData;
        if (json?.length < 10) return CLIMATE_DATA;
        try {
            const custom = JSON.parse(json);
            return custom;
        } catch (e) {
            ui.notifications.error(l(`${MODULE_ID}.errors.climateJSON`))
            console.error(e);
            return CLIMATE_DATA;
        }
    }


    get dayTimePercent() {
        const hoursInDay = game.time.calendar.days.hoursPerDay;
        const minutesInHour = game.time.calendar.days.minutesPerHour;
        const minutesInDay = hoursInDay * minutesInHour;
        const timeOfDayMinutes = this.components.hour * minutesInHour + this.components.minute;
        const dayProgressPercent = timeOfDayMinutes / minutesInDay;
        return dayProgressPercent;
    }

    get customBadges() {
        const config = getSetting("configuration");
        const badges = [];
        for (let i = 0; i < BADGE_COUNT; i++) {
            const badge = config[`badge${i}`] ?? {}
            badges.push({ label: badge.label ?? "", color: badge.color || "#ffffff", index: i })
        }
        return badges;
    }

    get scene() {
        return game.scenes.active ?? game.scenes.viewed
    }

    get weatherScenes() {
        return game.scenes.filter((scene) => {
            const sceneSync = scene.getFlag(MODULE_ID, "darknessSync") ?? "default";
            const sync = sceneSync === "default" ? getSetting("configuration").darknessSync : sceneSync;
            if (sync === "sync" || sync === "weatherOnly") return true;
            return false;
        })
    }

    get darknessScenes() {
        return this.viewedScenes.filter((scene) => {
            const sceneSync = scene.getFlag(MODULE_ID, "darknessSync") ?? "default";
            const sync = sceneSync === "default" ? getSetting("configuration").darknessSync : sceneSync;
            if (sync === "sync" || sync === "darknessOnly") return true;
            return false;
        })
    }

    get viewedScenes() {
        return Array.from(new Set([game.scenes.active?.id, ...game.users.map(u => u.viewedScene)].filter(s => s).map(s => game.scenes.get(s))))
    }

    async setWeatherBadge(label, color, weatherEffect, weatherEffect3d) {
        const currentSettings = getSetting("configuration");
        currentSettings.weatherLabel = l(label);
        currentSettings.weatherColor = color;
        setSetting("configuration", currentSettings);
        let updateData = {};
        if (weatherEffect3d) {
            updateData = { flags: { "levels-3d-preview": { particlePreset2: weatherEffect3d } } }
        }
        if (weatherEffect) {
            if (weatherEffect == "none") weatherEffect = "";
            updateData.weather = weatherEffect;
        }
        if (Object.keys(updateData).length) game.scenes.updateAll(updateData, s => this.weatherScenes.includes(s))
    }

    async setMoonBadge(label, color, tooltip) {
        const currentSettings = getSetting("configuration");
        currentSettings.moonLabel = l(label);
        currentSettings.moonColor = color ?? currentSettings.moonColor;
        currentSettings.moonTooltip = tooltip ?? "";
        setSetting("configuration", currentSettings);
    }

    async setCustomBadge(id, label, color) {
        id = parseInt(id);
        if (id > BADGE_COUNT) return ui.notifications.error(game.i18n.format(`${MODULE_ID}.errors.badgeNumber`, { max: BADGE_COUNT }))

        const config = getSetting("configuration");
        if (label !== undefined) setProperty(config, `badge${id - 1}.label`, label)
        if (color !== undefined) setProperty(config, `badge${id - 1}.color`, color)

        return setSetting("configuration", config)
    }

    getCustomBadge(id) {
        id = parseInt(id);
        if (id < 1 || id > BADGE_COUNT) return ui.notifications.error(game.i18n.format(`${MODULE_ID}.errors.badgeNumber`, { max: BADGE_COUNT }))
        const config = getSetting("configuration");
        const badge = config[`badge${id - 1}`] ?? {};
        return {
            label: badge.label ?? "",
            color: badge.color || "#ffffff",
            index: id - 1
        };
    }

    async createEventDialog(page) {

        const fb = new FormBuilder().object(page?.flags?.[MODULE_ID] ?? {}).title(page ? l(`${MODULE_ID}.app.create-event.edit.label`) + `: ${page.name}` : `${this.APP_ID}.app.controls.create-event.tooltip`)

        fb.number({ name: "eventTime", label: `${MODULE_ID}.app.create-event.eventTime.label`, hint: "[datetime]" })
        fb.number({ name: "eventEnd", label: `${MODULE_ID}.app.create-event.eventEnd.label`, hint: "[datetime]" })
        fb.select({
            name: "repeat", label: `${MODULE_ID}.app.create-event.repeat.label`, options: {
                "": `${MODULE_ID}.app.create-event.repeat.options.none`,
                "day": `${MODULE_ID}.app.create-event.repeat.options.day`,
                "week": `${MODULE_ID}.app.create-event.repeat.options.week`,
                "month": `${MODULE_ID}.app.create-event.repeat.options.month`,
                "year": `${MODULE_ID}.app.create-event.repeat.options.year`
            }, value: ""
        })
        fb.onRender((context, options, element) => {
            element.querySelectorAll("input").forEach(i => this.constructor.injectDatePickerButton(i))
        })

        const data = await fb.render();

        if (!data || !Number.isFinite(data.eventTime)) return;

        if (!page && !this.eventsJournal) return;

        if (!page) {
            const documents = await this.eventsJournal.createEmbeddedDocuments("JournalEntryPage", [{
                name: l(`${MODULE_ID}.defaults.newEvent`),
                [`flags.${MODULE_ID}`]: { ...data }
            }])
            console.log(documents)
            page = documents[0]
            page.sheet.render(true);
        }

        if (page) await page.update({
            [`flags.${MODULE_ID}`]: { ...data }
        })
    }

    async onNewDay() {
        if (game.user.isActiveGM) {
            if (getSetting("configuration").genWeather) this.generateAndSetWeather();
        }
    }

    generateAndSetWeather() {
        const genWeather = getSetting("configuration").genWeather;
        const weather = this.generateWeather();
        let tempLabel = "";
        if (genWeather === "tempC") tempLabel = ` | ${weather.celsius}`;
        else if (genWeather === "tempF") tempLabel = ` | ${weather.fahrenheit}`;
        return this.setWeatherBadge(l(weather.label ?? `pf2e-timekeeping.weather.${weather.id}`) + tempLabel, weather.color, weather.weatherEffect, weather.weatherEffect3d)
    }

    _getContextEntries() {
        const getDocument = (el) => fromUuidSync(el.dataset.uuid);
        return [
            {
                name: "SIDEBAR.Edit",
                icon: '<i class="far fa-edit"></i>',
                condition: (el) => getDocument(el).isOwner,
                callback: (el) => getDocument(el).sheet.render(true),
            },
            {
                name: `${MODULE_ID}.app.create-event.edit.label`,
                icon: '<i class="far fa-edit"></i>',
                condition: (el) => getDocument(el).isOwner,
                callback: (el) => this.createEventDialog(getDocument(el)),
            },
            {
                name: "SIDEBAR.Delete",
                icon: '<i class="far fa-trash"></i>',
                condition: (el) => getDocument(el).isOwner,
                callback: (el) => getDocument(el).deleteDialog(),
            },
            {
                name: "SIDEBAR.Duplicate",
                icon: '<i class="far fa-copy"></i>',
                condition: (el) => getDocument(el).isOwner,
                callback: (el) => getDocument(el).clone({ name: `${getDocument(el)._source.name} (Copy)` }, { save: true, addSource: true }),
            },
            {
                name: "OWNERSHIP.Configure",
                icon: '<i class="far fa-lock"></i>',
                condition: () => game.user.isGM,
                callback: (el) => new foundry.applications.apps.DocumentOwnershipConfig({ document: getDocument(el) }).render(true),
            },
        ];
    }

    _getWeatherContextEntries() {
        return [{
            name: `${MODULE_ID}.app.weather.generate`,
            icon: `<i class="fas fa-dice"></i>`,
            callback: () => this.generateAndSetWeather()
        }, ...this.constructor.WEATHER_PRESETS.map(preset => ({
            name: preset.label ?? `pf2e-timekeeping.weather.${preset.id}`,
            icon: `<i class="${preset.icon}"></i>`,
            callback: () => this.setWeatherBadge(preset.label ?? `pf2e-timekeeping.weather.${preset.id}`, preset.color, preset.weatherEffect, preset.weatherEffect3d)
        }))]
    }

    _getMoonContextEntries() {
        return this.constructor.MOON_PRESETS.map(preset => ({
            name: preset.label,
            icon: preset.icon,
            callback: () => this.setMoonBadge(preset.icon + " " + l(preset.label), preset.color)
        }))
    }

    async _prepareContext(options) {
        const data = {};
        let eventsJournal = this.eventsJournal;
        if (!eventsJournal && game.user.isActiveGM) {
            eventsJournal = await JournalEntry.create({ name: getSetting("configuration").journalEntryEvents });
        }
        return { data, controls: this.getControls(), dateTimeText: this.dateTimeText, fullDateText: this.fullDateText, customBadges: this.customBadges, events: Array.from(eventsJournal?.pages ?? []), isGM: game.user.isGM };
    }

    _onRender(context, options) {
        super._onRender(context, options);
        document.querySelector("#ui-top").prepend(this.element);
        this.element.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", this.onNavAction.bind(this))
        });
        this.element.querySelector("#search").addEventListener("input", () => { this.updateEventsList() })
        new foundry.applications.ux.ContextMenu.implementation(this.element, "[data-uuid]", this._getContextEntries(), { jQuery: false, fixed: true });

        if (game.user.isGM) {
            this.element.querySelector("#weather").style.cursor = "pointer"
            new foundry.applications.ux.ContextMenu.implementation(this.element, "#weather", this._getWeatherContextEntries(), { jQuery: false, fixed: true });
            new foundry.applications.ux.ContextMenu.implementation(this.element, "#weather", this._getWeatherContextEntries(), { jQuery: false, fixed: true, eventName: "click" });
            if (!getSetting("configuration").moonAutomation || !this.moons.length) {
                this.element.querySelector("#moon-phase").style.cursor = "pointer"
                new foundry.applications.ux.ContextMenu.implementation(this.element, "#moon-phase", this._getMoonContextEntries(), { jQuery: false, fixed: true });
                new foundry.applications.ux.ContextMenu.implementation(this.element, "#moon-phase", this._getMoonContextEntries(), { jQuery: false, fixed: true, eventName: "click" });
            }

            this.element.querySelectorAll(".custom-badge").forEach(badge => {
                badge.style.cursor = "pointer";
                badge.addEventListener("pointerdown", this.onCustomBadgePointerDown.bind(this));
            })

            this.element.querySelector("#date-time-text").style.cursor = "pointer";
            this.element.querySelector("#date-time-text").addEventListener("click", () => {
                ui.notifications.info(!getSetting("paused") ? l(`${MODULE_ID}.paused-info`) : l(`${MODULE_ID}.unpaused-info`));
                setSetting("paused", !getSetting("paused"));
            })
        }

        this.onUpdateWorldTime();
        this.setCombatVisibility();
        this.updateEventPagesList();
        this.updateEventsList();
    }

    async onCustomBadgePointerDown(event) {

        const index = event.currentTarget.dataset.index;

        function modifyLastNumber(str, increase = true) {
            const matches = [...str.matchAll(/\d+/g)];
            if (matches.length === 0) return str;

            const lastMatch = matches[matches.length - 1];
            const start = lastMatch.index;
            const end = start + lastMatch[0].length;
            const num = parseInt(lastMatch[0], 10);
            const newNum = increase ? num + 1 : num - 1;

            return str.slice(0, start) + newNum + str.slice(end);
        }

        if (event.shiftKey) {
            const label = this.customBadges[index].label;
            const newLabel = modifyLastNumber(label, event.button === 0);
            return await this.setCustomBadge(parseInt(index) + 1, newLabel, this.customBadges[index].color);
        }

        if (event.button !== 0) return;


        const data = await new FormBuilder().object(this.customBadges[index]).title(this.customBadges[index].label)
            .text({ name: "label", label: `${MODULE_ID}.configuration.badgeLabel.label` })
            .color({ name: "color", label: `${MODULE_ID}.configuration.badgeColor.label` })
            .render();
        if (!data) return;
        await this.setCustomBadge(parseInt(index) + 1, data.label, data.color);
    }

    openConfiguration() {
        return openConfiguration();
    }

    async onNavAction(event) {
        const action = event.currentTarget.dataset.action;
        const isCtrl = event.ctrlKey || event.metaKey;
        const isShift = event.shiftKey;
        const isAlt = event.altKey;

        switch (action) {
            case "create-event":
                this.createEventDialog();
                break;
            case "configure":
                openConfiguration()
                break;
            case "toggle-events":
                this.element.querySelector("#events").classList.toggle("collapsed")
                break;
            case "day-back":
                if (isCtrl) game.time.advance(- this.secondsInDay * 7);
                else if (isShift) game.time.advance(- this.secondsInDay * 3);
                else if (isAlt) game.time.advance(- this.secondsInDay * 2);
                else game.time.advance(- this.secondsInDay);
                break;
            case "hour-back":
                if (isCtrl) game.time.advance(- this.secondsInHour / 2);
                else if (isShift) game.time.advance(- this.secondsInHour / 6);
                else if (isAlt) game.time.advance(- this.secondsInHour / 12);
                else game.time.advance(- this.secondsInHour);
                break;
            case "day-forward":
                if (isCtrl) game.time.advance(this.secondsInDay * 7);
                else if (isShift) game.time.advance(this.secondsInDay * 3);
                else if (isAlt) game.time.advance(this.secondsInDay * 2);
                else game.time.advance(this.secondsInDay);
                break;
            case "hour-forward":
                if (isCtrl) game.time.advance(this.secondsInHour / 2);
                else if (isShift) game.time.advance(this.secondsInHour / 6);
                else if (isAlt) game.time.advance(this.secondsInHour / 12);
                else game.time.advance(this.secondsInHour);
                break;
            case "sunrise":
                this.advanceToTimePercent(this.dawn)
                break;
            case "sunset":
                this.advanceToTimePercent(this.dusk)
                break;
            case "midday":
                this.advanceToTimePercent(0.5)
                break;
            case "midnight":
                this.advanceToTimePercent(0)
                break;
            default:
                ui.notifications.warn(game.i18n.format(`${MODULE_ID}.errors.action`, { action }))
        }
    }

    advanceToTimePercent(timeToAdvance) {
        const sunriseTime = timeToAdvance;
        const dayTime = this.dayTimePercent;
        const delta = sunriseTime - dayTime;
        if (Math.abs(delta) < 0.01) return;
        if (delta > 0) {
            game.time.advance(this.secondsInDay * Math.abs(delta))
        } else {
            game.time.advance(this.secondsInDay - this.secondsInDay * Math.abs(delta))
        }
    }

    _onClose(options) {
        super._onClose(options);
    }

    setCombatVisibility() {
        this.updateFullDateText();
        this.element.classList.toggle("hidden", !!game.combat?.started && getSetting("configuration").hideInCombat);
    }

    onUpdateWorldTime() {
        this.updateSceneBrightness();
        this.computeTimeOfDayEvents();
        if (!this.element) return;
        this.updateDateTimeText();
        this.updateFullDateText();
        this.updateBadges();
        this.updateMoonPhase();
        this.updateEventsList();
        this.updateClasses();
    }

    computeTimeOfDayEvents() {
        const isNewDay = this.components.day !== this._lastDay;
        if (isNewDay) {
            this.onNewDay();
            this._isAfterDawn = false;
            this._isAfterDusk = false;
            this._isAfterMidday = false;
        }
        const isAfterDawn = this.components.hour >= this.dawn * game.time.calendar.days.hoursPerDay;
        const isAfterDusk = this.components.hour >= this.dusk * game.time.calendar.days.hoursPerDay;
        const isAfterMidday = this.components.hour >= 0.5 * game.time.calendar.days.hoursPerDay;

        if (isNewDay) this.executeTimeOfDayMacros("newDayMacros");
        if (isAfterDawn && !this._isAfterDawn) this.executeTimeOfDayMacros("dawnMacros");
        if (isAfterDusk && !this._isAfterDusk) this.executeTimeOfDayMacros("duskMacros");
        if (isAfterMidday && !this._isAfterMidday) this.executeTimeOfDayMacros("middayMacros");

        this._lastDay = this.components.day;
        this._isAfterDawn = isAfterDawn;
        this._isAfterDusk = isAfterDusk;
        this._isAfterMidday = isAfterMidday;
    }

    async executeTimeOfDayMacros(time) {
        const macros = getSetting("configuration")[time];
        for (const macroUuid of macros) {
            const macro = await fromUuid(macroUuid);
            if (game.user.isActiveGM && macro?.canExecute) await macro.execute();
        }
    }

    pickDateTime(...args) {
        return this.constructor.pickDateTime(...args);
    }

    async resetCustomCalendar() {
        const setting = getSetting("configuration");
        setting.customCalendar = "";
        await setSetting("configuration", setting);
        return setCalendarJSON();
    }

    async setCurrentDateTime() {
        const newDateTime = await this.pickDateTime();
        if (!Number.isFinite(newDateTime)) return;
        return game.time.set(newDateTime);
    }

    static injectDatePickerButton(input) {
        const button = document.createElement("button")
        button.type = "button";
        button.className = "fas fa-calendar icon";
        input.after(button);
        let originalText = "";
        const hint = input.closest(".form-group")?.querySelector(".hint");
        const setHint = (timestamp) => {
            if (!hint) return;
            if (!originalText) originalText = hint.innerText;
            const value = timestamp ? `${ui.pf2eTimekeeping.getFullDateText(parseInt(timestamp))} - [${ui.pf2eTimekeeping.timestamp(parseInt(timestamp))}]` : "";
            hint.innerText = originalText.replace("[datetime]", value);
        }
        setHint(input.value);
        button.addEventListener("click", async () => {
            const timestamp = await this.pickDateTime(input.valueAsNumber || undefined);
            if (Number.isFinite(timestamp)) input.value = timestamp;
            setHint(input.value);
        })
    }

    static async pickDateTime(components, format = "timestamp") {
        components ??= ui.pf2eTimekeeping.components;
        if (!Number.isFinite(components)) components = game.time.calendar.componentsToTime(components);
        components = game.time.calendar.timeToComponents(components);
        const calendar = game.time.calendar;

        const months = calendar.months.values;
        const hoursPerDay = calendar.days.hoursPerDay;
        const minutesPerHour = calendar.days.minutesPerHour;

        const monthOptions = months.map((m, i) => {
            const selected = i === (components.month) ? "selected" : "";
            return `<option value="${i}" ${selected}>${l(m.name)}</option>`;
        }).join("");

        const updateDayOptions = (monthIndex, year = components.year + 1, selectedDay = components.dayOfMonth + 1) => {
            const month = months[monthIndex];
            const daysInMonth = calendar.isLeapYear(year) ? (month.leapDays ?? month.days) : month.days;
            selectedDay = Math.min(selectedDay, daysInMonth);
            return Array.from({ length: daysInMonth }, (_, i) => {
                const selected = i + 1 === selectedDay ? "selected" : "";
                return `<option value="${i + 1}" ${selected}>${i + 1}</option>`;
            }).join("");
        };

        const content = document.createElement("div");
        content.innerHTML = `
    <form>
      <div>
        <label>${l(`${MODULE_ID}.date.year`)}: <input type="number" name="year" value="${components.year + 1}" /></label>
      </div>
      <div>
        <label>${l(`${MODULE_ID}.date.month`)}:
          <select name="month">${monthOptions}</select>
        </label>
      </div>
      <div>
        <label>${l(`${MODULE_ID}.date.day`)}:
          <select name="day">${updateDayOptions(components.month)}</select>
        </label>
      </div>
      <div>
        <label>${l(`${MODULE_ID}.date.hour`)}:
          <input type="number" name="hour" value="${components.hour}" min="0" max="${hoursPerDay - 1}" />
        </label>
      </div>
      <div>
        <label>${l(`${MODULE_ID}.date.minute`)}:
          <input type="number" name="minute" value="${components.minute}" min="0" max="${minutesPerHour - 1}" />
        </label>
      </div>
    </form>
  `;
        const result = await foundry.applications.api.DialogV2.prompt({
            window: { title: l(`${MODULE_ID}.date.title`) },
            content,
            modal: true,
            ok: {
                label: l(`${MODULE_ID}.actions.confirm`),
                default: true,
                callback: (event, button, dialog) => {
                    const form = button.form;
                    const year = Number(form.year.value) - 1;
                    const month = Number(form.month.value);
                    const day = Number(form.day.value) + this.monthsToDays(month, year) - 1;
                    const hour = Number(form.hour.value);
                    const minute = Number(form.minute.value);
                    const second = 0;
                    return format === "timestamp" ? calendar.componentsToTime({ year, day, hour, minute, second }) : calendar.timeToComponents(calendar.componentsToTime({ year, month, day, hour, minute, second }));
                }
            },
            cancel: {
                label: l(`${MODULE_ID}.actions.cancel`)
            },
            render: (event) => {
                const element = event.target.element;
                const refreshDays = () => {
                    const monthIndex = Number(element.querySelector('[name="month"]').value);
                    const year = Number(element.querySelector('[name="year"]').value);
                    const daySelect = element.querySelector('[name="day"]');
                    daySelect.innerHTML = updateDayOptions(monthIndex, year, Number(daySelect.value));
                };
                element.querySelector('[name="month"]').addEventListener("change", refreshDays);
                element.querySelector('[name="year"]').addEventListener("change", refreshDays);
            },
            rejectClose: false
        });

        return result;
    }

}

function getSkyColor(time, nightColor, dayColor, dawn = 0.23, dusk = 0.77) {
    if (dawn >= dusk) throw new Error("Dawn must be less than dusk");

    const brightnessCurve = new Curve([
        { x: 0, y: 0 },
        { x: Math.max(0, dawn - 0.05), y: 0 },
        { x: dawn, y: 0.75 },
        { x: 0.5, y: 1.0 },
        { x: dusk, y: 0.25 },
        { x: Math.min(1.0, dusk + 0.05), y: 0 },
        { x: 1.0, y: 0 }
    ]);

    return interpolateColor(nightColor, dayColor, brightnessCurve.getValue(time));
}

function getBrightness(time, dawn = 0.23, dusk = 0.77) {
    if (dawn >= dusk) throw new Error("Dawn must be less than dusk");

    const brightnessCurve = new Curve([
        { x: 0, y: 0 },
        { x: Math.max(0, dawn - 0.05), y: 0 },
        { x: dawn, y: 0.75 },
        { x: 0.5, y: 1.0 },
        { x: dusk, y: 0.25 },
        { x: Math.min(1.0, dusk + 0.05), y: 0 },
        { x: 1.0, y: 0 }
    ]);

    return brightnessCurve.getValue(time)
}

function interpolateColor(color1, color2, factor) {
    const parseColor = (c) => {
        if (c.startsWith('#')) {
            const bigint = parseInt(c.slice(1), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return [r, g, b];
        }
        throw new Error('Only hex colors supported');
    };

    const [r1, g1, b1] = parseColor(color1);
    const [r2, g2, b2] = parseColor(color2);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `rgb(${r}, ${g}, ${b})`;
}

function getHueFromHex(hex) {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse r, g, b values
    const bigint = parseInt(hex, 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h;

    if (max === min) {
        h = 0; // achromatic
    } else {
        const d = max - min;
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }

    return h;
}