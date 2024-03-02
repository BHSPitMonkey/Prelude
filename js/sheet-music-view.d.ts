import React from 'react';
type SheetMusicViewProps = {
    clef: 'bass' | 'alto' | 'treble' | 'grand';
    height: number;
    width: number;
    keySignature?: string;
    keys?: TeoriaNote[];
};
/**
 * Visual display of a snippet of sheet music (wraps an engraving library)
 */
declare class SheetMusicView extends React.Component {
    static defaultProps: SheetMusicViewProps;
    props: SheetMusicViewProps;
    constructor(props: SheetMusicViewProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: any, prevState: any): void;
    teoriaKeysToVexflowKeys(keys: TeoriaNote[]): string[];
    /**
     * Redraw the contents of the canvas
     */
    drawMusic(): void;
    render(): React.JSX.Element;
}
export default SheetMusicView;
