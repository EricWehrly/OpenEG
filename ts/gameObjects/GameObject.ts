import Vector3 from "../core/Vector3"

export default class GameObject {
    position?: Vector3;

    constructor(position?: Vector3) {
        this.position = position;
    }
};
