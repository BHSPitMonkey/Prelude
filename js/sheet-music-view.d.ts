export default SheetMusicView;
/**
 * Visual display of a snippet of sheet music (wraps an engraving library)
 */
declare class SheetMusicView {
    constructor(props: any);
    /**
     * Redraw the contents of the canvas
     */
    drawMusic(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: any, prevState: any): void;
    teoriaKeysToVexflowKeys(keys: any): any;
    render(): any;
}
declare namespace SheetMusicView {
    namespace defaultProps {
        let width: number;
        let height: number;
        let clef: string;
    }
}
