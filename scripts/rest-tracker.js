import { MODULE_ID } from "./module-id.js";

const HOUR = 3600;
const FLAG = "restTracking";
let pendingCheck = Promise.resolve();

function enabled() {
    return game.system.id === "pf2e" && game.settings.get(MODULE_ID, "configuration").restWarnings !== false;
}

// Событие PF2e вызывается у пользователя, подтвердившего завершённый отдых.
// Владелец персонажа может сохранить отметку и без подключённого ведущего.
export async function recordRest(actor) {
    if (actor.type !== "character" || !actor.isOwner) return;
    await actor.setFlag(MODULE_ID, FLAG, {
        cycle: foundry.utils.randomID(),
        endedAt: game.time.worldTime,
        travelWarned: false,
        sleepWarned: false,
    });
}

function trackedCharacters() {
    const actors = new Map(game.actors.contents.map(actor => [actor.uuid, actor]));
    for (const scene of game.scenes) {
        for (const token of scene.tokens) {
            if (!token.actorLink && token.actor?.type === "character") actors.set(token.actor.uuid, token.actor);
        }
    }
    return [...actors.values()].filter(actor => actor.type === "character");
}

function warningContent(actor, stage, elapsed) {
    const key = `${MODULE_ID}.rest.${stage}`;
    const escape = foundry.utils.escapeHTML;
    const hours = new Intl.NumberFormat(game.i18n.lang || "en", { maximumFractionDigits: 1 }).format(elapsed / HOUR);
    const title = escape(game.i18n.localize(`${key}.title`));
    const body = escape(game.i18n.format(`${key}.body`, { actor: actor.name, hours }));
    const note = escape(game.i18n.localize(`${MODULE_ID}.rest.note`));
    const rule = stage === "sleep" ? "2443" : "2820";
    const link = escape(game.i18n.localize(`${MODULE_ID}.rest.rules`));
    return `<section class="pf2e-timekeeping-rest-warning ${stage}">
        <h3><i class="fas fa-triangle-exclamation" aria-hidden="true"></i> ${title}</h3>
        <p><strong>${body}</strong></p>
        <p class="rest-note">${note}</p>
        <a href="https://2e.aonprd.com/Rules.aspx?ID=${rule}" target="_blank" rel="noopener noreferrer">${link}</a>
    </section>`;
}

async function warn(actor, state, stage, elapsed) {
    if (!game.users.activeGM?.isSelf || actor.getFlag(MODULE_ID, FLAG)?.cycle !== state.cycle) return;
    const warningId = `${actor.uuid}:${state.cycle}:${stage}`;
    // Если сообщение сохранилось, а запись отметки не удалась, повтор не нужен.
    const sent = game.messages.contents.some(message => message.getFlag(MODULE_ID, "restWarning") === warningId);
    if (!sent) {
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content: warningContent(actor, stage, elapsed),
            whisper: [],
            blind: false,
            flags: { [MODULE_ID]: { restWarning: warningId } },
        });
    }
    // Новый отдых, завершившийся во время отправки, не должен получить старую отметку.
    if (actor.getFlag(MODULE_ID, FLAG)?.cycle === state.cycle) {
        await actor.update({ [`flags.${MODULE_ID}.${FLAG}.${stage}Warned`]: true });
    }
}

export async function checkRestWarnings() {
    if (!enabled() || !game.users.activeGM?.isSelf) return;
    const now = game.time.worldTime;
    for (const actor of trackedCharacters()) {
        const state = actor.getFlag(MODULE_ID, FLAG);
        if (!state?.cycle || !Number.isFinite(state.endedAt)) continue;
        const elapsed = now - state.endedAt;
        if (elapsed < 0) continue; // Перевод часов назад не создаёт новый отдых.
        if (elapsed > 16 * HOUR && !state.sleepWarned) {
            await warn(actor, state, "sleep", elapsed);
            // При скачке времени сразу за 16 часов достаточно одного сообщения.
            if (actor.getFlag(MODULE_ID, FLAG)?.cycle === state.cycle) {
                await actor.update({ [`flags.${MODULE_ID}.${FLAG}.travelWarned`]: true });
            }
        } else if (elapsed >= 8 * HOUR && !state.travelWarned && !state.sleepWarned) {
            await warn(actor, state, "travel", elapsed);
        }
    }
}

function requestCheck() {
    // Несколько событий обновления времени не должны отправить одно предупреждение дважды.
    pendingCheck = pendingCheck.then(checkRestWarnings).catch(error => console.error(`${MODULE_ID} | Rest warning`, error));
}

export function registerRestTracking() {
    Hooks.on("pf2e.restForTheNight", actor => {
        recordRest(actor).catch(error => {
            console.error(`${MODULE_ID} | Rest tracking`, error);
            ui.notifications.error(game.i18n.localize(`${MODULE_ID}.rest.saveError`));
        });
    });
    Hooks.on("updateWorldTime", requestCheck);
    Hooks.on("updateUser", requestCheck);
    Hooks.on("userConnected", requestCheck);
    Hooks.once("ready", requestCheck);
}
