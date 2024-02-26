/**
 * A basic synthesizer for playing notes
 */
export default class {
    ctx: AudioContext;
    comp: DynamicsCompressorNode;
    readonly frequencies: {
        c: number;
        'c#': number;
        d: number;
        'd#': number;
        e: number;
        f: number;
        'f#': number;
        g: number;
        'g#': number;
        a: number;
        'a#': number;
        b: number;
    };
    constructor();
    play(key: any, seconds: any): void;
}
