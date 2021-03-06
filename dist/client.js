import * as alt from "alt-client";
const KEYBINDS = {};
class Keybind {
    constructor(key, hold, debounce, onRelease, onPress) {
        this._isHeld = false;
        this._lastDebounce = +new Date();
        this._disabled = false;
        this._id = ++Keybind.currentID;
        this._key = key;
        this._hold = hold;
        this._debounce = debounce;
        this._release = onRelease;
        this._press = onPress;
        if (!(KEYBINDS[this.keyCode]))
            KEYBINDS[this.keyCode] = {};
        KEYBINDS[this.keyCode][this.id] = this;
    }
    get id() {
        return this._id;
    }
    get key() {
        return this._key;
    }
    get keyCode() {
        return this.key.charCodeAt(0);
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(val) {
        this._disabled = val;
    }
    get releaseHandler() {
        return this._release;
    }
    get pressHandler() {
        return this._press;
    }
    get debounce() {
        return this._debounce;
    }
    get hold() {
        return this._hold;
    }
    get isHeld() {
        return this._isHeld;
    }
    onPressed() {
        var _a;
        if (this.disabled || !this.hold)
            return;
        this._isHeld = true;
        (_a = this === null || this === void 0 ? void 0 : this.pressHandler) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    onReleased() {
        var _a;
        if (this.disabled)
            return;
        let date = +new Date();
        if (this._lastDebounce + this._debounce > date)
            return;
        this._lastDebounce = date;
        if (this.hold)
            this._isHeld = false;
        (_a = this === null || this === void 0 ? void 0 : this.releaseHandler) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    static getByKeyCode(keyCode) {
        let binds = [];
        for (let id in KEYBINDS[keyCode]) {
            let bind = KEYBINDS[keyCode][id];
            if (bind.keyCode === keyCode)
                binds.push(bind);
        }
        return binds;
    }
    static getByID(id) {
        for (let keyCode in KEYBINDS) {
            if (KEYBINDS[keyCode][id])
                return KEYBINDS[keyCode][id];
        }
        return null;
    }
}
Keybind.currentID = 0;
alt.on("keyup", (key) => {
    let binds = Keybind.getByKeyCode(key);
    binds.forEach((bind) => bind.onReleased());
});
alt.on("keydown", (key) => {
    let binds = Keybind.getByKeyCode(key);
    binds.forEach((bind) => bind.onPressed());
});
// Exported functions
/**
 * Registers a new keybind
 * @param key Key name (E.g. 'E')
 * @param hold Activate handler on press or release
 * @param debounce Debounce time for keybinds
 * @param onRelease Handler to be executed on key release
 * @param onPress Handler to be executed on key press (Only used when hold is true)
 */
export function registerKeybind(key, hold, debounce, onRelease, onPress) {
    if (!(key === null || key === void 0 ? void 0 : key.length) || key.length > 1)
        return;
    let bind = new Keybind(key.toUpperCase(), hold, debounce, onRelease, onPress);
    return bind === null || bind === void 0 ? void 0 : bind.id;
}
/**
 * Unregisters the specified keybind
 * @param keybindId Keybind id
 */
export function unregisterKeybind(keybindId) {
    let bind = Keybind.getByID(keybindId);
    if (!bind)
        return;
    delete KEYBINDS[bind.keyCode][bind.id];
    if (Object.keys(KEYBINDS[bind.keyCode]).length === 0)
        delete KEYBINDS[bind.keyCode];
}
/**
 * Returns whether the specified keybind is currently held down
 * @param keybindId Keybind id
 */
export function isKeybindHeld(keybindId) {
    let bind = Keybind.getByID(keybindId);
    if (!bind || !bind.hold)
        return false;
    return bind.isHeld;
}
/**
 * Gets all keybind ids with the specified key
 * @param key Key name (E.g. 'E')
 * @returns Array of keybind ids
 */
export function getKeybindsFromKey(key) {
    return Keybind.getByKeyCode(key.toUpperCase().charCodeAt(0)).map((bind) => bind.id);
}
/**
 * Enables/Disables the keybind with the specified id
 * @param keybindId Keybind id
 * @param disabled Should the keybind be disabled
 */
export function setKeybindDisabled(keybindId, disabled) {
    let bind = Keybind.getByID(keybindId);
    if (!bind)
        return;
    bind.disabled = disabled;
}
/**
 * Enables/Disables all keybinds for the specified key
 * @param key Key name (E.g. 'E')
 * @param disabled Should the keybind be disabled
 */
export function setKeyDisabled(key, disabled) {
    let binds = Keybind.getByKeyCode(key.toUpperCase().charCodeAt(0));
    binds.forEach((bind) => bind.disabled = disabled);
}
/**
 * Returns whether the specified keybind is disabled
 * @param keybindId Keybind id
 */
export function isKeybindDisabled(keybindId) {
    let bind = Keybind.getByID(keybindId);
    if (!bind)
        return;
    return bind.disabled;
}
