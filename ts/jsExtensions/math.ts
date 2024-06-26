interface Math {
    clamp(value: number, min: number, max: number): number;
}

Math.clamp = function(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
