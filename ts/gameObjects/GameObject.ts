import Vector3 from "../core/Vector3"
import ObjectRenderer from "../rendering/ObjectRenderer";

export default class GameObject {
    static allInstances: Map<Function, GameObject[]> = new Map();

    static getAllByType<T extends GameObject>(type: { new(...args: any[]): T }): T[] {
        const instancesForType = this.allInstances.get(type) || [];
        return instancesForType as T[];
    }

    private _renderer?: ObjectRenderer;
    private _position?: Vector3;

    get position(): Vector3 | undefined {
        return this._position;
    }

    set position(value: Vector3 | undefined) {
        this._position = value;
    }

    get renderer(): ObjectRenderer | undefined {
        return this._renderer;
    }

    set renderer(value: ObjectRenderer | undefined) {
        this._renderer = value;
    }

    constructor(position?: Vector3) {
        this._position = position;

        this.addToCollection();
    }

    private addToCollection() {

        let instancesForType = GameObject.allInstances.get(this.constructor);
        if (!instancesForType) {
            instancesForType = [];
            GameObject.allInstances.set(this.constructor, instancesForType);
        }
        instancesForType.push(this);
    }

    // TODO: destroy method
};
