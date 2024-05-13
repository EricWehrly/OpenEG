import EventTypes from "./EventTypes";
import Events from "./Events";
import { generateId } from "./util";

interface Deferral {
    id: string;
    remainingMs: number;
    callback: Function;
}

const LOOP_METHODS_SLOW: Function[] = [];
const LOOP_METHODS_FAST: Function[] = [];
const DEFERRALS: Deferral[] = [];
let LOOP_METHODS_REQUESTED: Function[] = [];

let LAST_SLOW_LOOP = performance.now();
let LAST_FAST_LOOP = performance.now();

export function RegisterLoopMethod (callback: Function, needsFast = false) {
    if(needsFast == true
        && !LOOP_METHODS_FAST.includes(callback)) {
        LOOP_METHODS_FAST.push(callback);
    } else if(!LOOP_METHODS_SLOW.includes(callback)) {
        LOOP_METHODS_SLOW.push(callback);
    }
}

export function RequestMethod(callback: Function) 
{
    if(!LOOP_METHODS_REQUESTED.includes(callback))
    {
        LOOP_METHODS_REQUESTED.push(callback);
    }
}

// try to act like "setTimeout" but for the game loop
export function Defer(callback: Function, ms: number) {

    const deferralId = generateId();

    DEFERRALS.push({
        id: deferralId,
        remainingMs: ms,
        callback
    } as Deferral);

    return deferralId;
}

export function RemoveDeferral(id: string) {

    for(var index = 0; index < DEFERRALS.length; index++) {
        const deferral = DEFERRALS[index];

        if(deferral.id == id) {
            DEFERRALS.splice(index, 1);
            return;
        }
    }

}

function _slowLoop() {

    var elapsed = performance.now() - LAST_SLOW_LOOP;
    LAST_SLOW_LOOP = performance.now();

    for(var index = 0; index < LOOP_METHODS_SLOW.length; index++) {

        try {
            LOOP_METHODS_SLOW[index](elapsed, LAST_SLOW_LOOP);
        } catch (ex) {
            console.error(ex);
        }
    }

    for(var index = 0; index < DEFERRALS.length; index++) {
        const deferral = DEFERRALS[index];
        deferral.remainingMs -= elapsed;
        if(deferral.remainingMs <= 0) {
            deferral.callback();
            DEFERRALS.splice(index, 1);
            index--;
            continue;
        }
    }

    for(var requestedMethod of LOOP_METHODS_REQUESTED) {
        requestedMethod();
        /*
        try {
        } catch (ex) {
            console.error("Problem in requested method");
            debugger;
        }
        */
    }
    LOOP_METHODS_REQUESTED = [];

    setTimeout(_slowLoop, 300);
}

function _fastLoop() {

    var elapsed = performance.now() - LAST_FAST_LOOP;
    LAST_FAST_LOOP = performance.now();

    for(var index = 0; index < LOOP_METHODS_FAST.length; index++) {
        try {
            LOOP_METHODS_FAST[index](elapsed, LAST_FAST_LOOP);
        } catch (ex) {
            console.error(ex);
        }
    }

    setTimeout(_fastLoop, 30);
}

// TODO: Static / singleton?

Events.Subscribe(EventTypes.GameStart, function() {
    _slowLoop();
    _fastLoop();
});
