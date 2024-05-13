import EventTypes from '../core/EventTypes';
import Events from '../core/Events';
import Vector3 from '../core/Vector3';
import GameObject from './GameObject';

class Character extends GameObject {
    position?: Vector3;
    selected: boolean = true;

    constructor(position?: Vector3) {

        super();

        this.position = position;

        Events.RaiseEvent(EventTypes.GameObjectCreated, this);
    }
}

export default Character;
