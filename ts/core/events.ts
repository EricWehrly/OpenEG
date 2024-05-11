import { v4 as generateId } from 'uuid';

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

    static List = {
        "GameStart": "GameStart"
    }

    private static Subscriptions: { [name: string] : EventSubscription[]; } = {};

    private static FiredEvents = {};

    static Context = {};

    static Subscribe(eventNames: string, callback: Function, options: Object) {

        // TODO: check inputs for bad values

        if (Array.isArray(eventNames)) {
            eventNames.forEach(function (eventName) {
                Events.subscribe(eventName, callback, options);
            });
        } else {
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
    static RaiseEvent(eventName: string, detail: Object, options: Object) {

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
            Events.Context = detail;
            Events.raiseSubscription(subscription.callback, {
                detail,
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
     * @param {*} eventName 
     * @param {*} callback 
     * @param {*} options 
     * @returns the id of the subscription if successful
     * @returns null if the event has already fired for the last time
     * but in that case it fires the subscription immediately
     */
    private static subscribe(eventName: string, callback: Function, options: Object) {

        if(eventName == undefined) debugger;
        
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

        if (!(eventName in Events.Subscriptions)) Events.Subscriptions[eventName] = [];
        var length = Events.Subscriptions[eventName].push({
            "subscriptionId": subscriptionId,
            "callback": callback
        });
        // these options are not used
        if (options) Object.assign(Events.Subscriptions[eventName][length - 1], options);

        Events.Subscriptions[eventName].sort(Events.sortEventsArray);

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
