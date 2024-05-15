import EventTypes from '../core/EventTypes';
import Events from '../core/Events';
import Vector3 from '../core/Vector3';
import GameObject from './GameObject';

class Character extends GameObject {
    selected: boolean = true;

    constructor(position?: Vector3) {

        super(position);

        Events.RaiseEvent(EventTypes.GameObjectCreated, this);
    }
}

export default Character;
