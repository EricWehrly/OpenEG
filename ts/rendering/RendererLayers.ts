// Reminder: threejs supports up to 32 layers, and crunches applied ones to a bitmask
enum RendererLayers {
    Terrain = 2,
    Floors = 3,
    Walls = 4,
    Characters = 5,
    Furniture = 6,
    UI = 10
}

export default RendererLayers;

export function getLayerFromMask(bitMask: number): number {
    return Math.log2(bitMask);
}

export function getLayerNameFromMask(bitmask: number) {
    const layerNumber = getLayerFromMask(bitmask);
    return RendererLayers[layerNumber];
}
