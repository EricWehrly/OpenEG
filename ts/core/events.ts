import { generateId } from "./util";
import EventTypes from './EventTypes';

class Event {
    eventName: string;
    detail: Object;
}

class EventSubscription {

    callback: Function;
    subscriptionId: string;
    before?: string;
    priority?: number;
}

// TODO: extends Listed
export default class Events {

    private static Subscriptions: { [name: string] : EventSubscription[]; } = {};

    private static FiredEvents = {};

    static Context = {};
    private static gameStarted: boolean = false;
    private static eventQueue: Array<{ eventName: EventTypes, detail?: Object, options?: Object }> = [];


    static Subscribe(eventNames: EventTypes[], callback: Function, options?: Object): string;
    static Subscribe(eventNames: EventTypes, callback: Function, options?: Object): string;

    static Subscribe(eventNames: any, callback: Function, options?: Object) : string {

        // TODO: check inputs for bad values

        if (Array.isArray(eventNames)) {
            eventNames.forEach(function (eventName) {
                console.debug(`Subscribing to ${eventName}`);
                Events.subscribe(eventName, callback, options);
            });
            return null;
        } else {
            console.debug(`Subscribing to ${eventNames}`);
            return Events.subscribe(eventNames, callback, options);
        }
    }

    /**
     * @param {String} eventName The enum name from Events.List
     * @param {Object} detail The details of the event (usually the subject of the action). Varies by event type.
     * @param {Object} options 
     * @param {Boolean} options.removeAfterRaise Whether to de-register the event after the first time that it is raised, preventing subsequent calls from resulting in a raised event.
     * @param {Boolean} options.finalFire This is the last time the event will fire. All registrations after will fire immediately.
     */
    static RaiseEvent(eventName: EventTypes, detail?: Object, options?: Object) {

        if (!this.gameStarted && eventName !== EventTypes.GameStart) {
            // If the game hasn't started yet and the event isn't GameStart, add it to the queue
            this.eventQueue.push({ eventName, detail, options });
            return;
        }

        if (eventName === EventTypes.GameStart) {
            // If the event is GameStart, set gameStarted to true and raise all the events in the queue
            this.gameStarted = true;

            for (let event of this.eventQueue) {
                console.debug(`raising event ${event.eventName}`);
                this.RaiseEvent(event.eventName, event.detail, event.options);
            }

            delete this.eventQueue;
        }

        /* TODO:
        if(options?.finalFire == true) {
            if(eventName in Events.FiredEvents) {
                console.warn(`${eventName} already called finalFire`);
            }

            Events.FiredEvents[eventName] = {
                detail,
                options
            };
        }
        */

        var subscribedEvents = Events.Subscriptions[eventName];
        if (!subscribedEvents) return;   // handle no subscriptions
        subscribedEvents = subscribedEvents.slice(0)   // create an unmodified copy, to survive modifications

        for (var subscription of subscribedEvents) {
            Events.Context = detail || {};
            Events.raiseSubscription(subscription.callback, {
                detail: detail || {},
                eventName
            });

            /* TODO: 
            if (subscription.oneTime || options?.removeAfterRaise == true) {
                console.warn("Didn't implement unsubscribe ...");
                // Events.Unsubscribe(subscription.subscriptionId);
            }
            */ 
        }
        Events.Context = {};
    }

    /**
     * @param {Function} callback The callback method of the subscriber.
     * @param {Object} options.detail The details of the event (usually the subject of the action). Varies by event type.
     * @param {String} options.eventName From Events.List
     */
    private static raiseSubscription(callback: Function, options: Event) {

        try {
            callback(options.detail);
        } catch (ex) {
            if(options.eventName) console.error(`Issue firing subscription for event ${options.eventName}`);
            if (callback.name != "") {
                console.log(callback.name);
            }
            console.error(ex);
            debugger;
        }
    }

    // TODO: Unsubscribe

    // TODO: subscribeOnce

    /**
     * @param {*} eventType 
     * @param {*} callback 
     * @param {*} options 
     * @returns the id of the subscription if successful
     * @returns null if the event has already fired for the last time
     * but in that case it fires the subscription immediately
     */
    private static subscribe(eventType: EventTypes, callback: Function, options: Object) : string {

        if(eventType == undefined) debugger;
        
        /* TODO:
        if (eventName in Events.FiredEvents) {
            console.debug(`Immediately firing subscription for already fired event ${eventName}.`);
            const firedEvent = Events.FiredEvents[eventName];
            Events.raiseSubscription(callback, {
                eventName,
                ...firedEvent
            });
            return null;
        }
        */

        const subscriptionId = generateId();

        if (!(eventType in Events.Subscriptions)) Events.Subscriptions[eventType] = [];
        var length = Events.Subscriptions[eventType].push({
            "subscriptionId": subscriptionId,
            "callback": callback
        });
        // these options are not used
        if (options) Object.assign(Events.Subscriptions[eventType][length - 1], options);

        Events.Subscriptions[eventType].sort(Events.sortEventsArray);

        return subscriptionId;
    };

    private static sortEventsArray(first: EventSubscription, second: EventSubscription) {

        if (first.before && second.callback.name && second.callback.name == first.before) {
            return -1;
        }
        if (second.before && first.callback.name && first.callback.name == second.before) {
            return 1;
        }

        if (first.priority > second.priority) return -1;
        else if (second.priority > first.priority) return 1;
        return 0;
    }
}
