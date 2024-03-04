import React from 'react';
import * as ReactDOM from 'react-dom';
import { Note as TonalNote } from '@tonaljs/pitch-note';
import Vex from 'vexflow';

type SheetMusicViewProps = {
  clef: 'bass' | 'alto' | 'treble' | 'grand',
  height?: number,
  width?: number,
  keySignature?: string,
  keys?: TeoriaNote[], // Deprecated, migrate to tonalNotes instead
  tonalNotes?: TonalNote[], // Replaces 'keys'
};

/**
 * Visual display of a snippet of sheet music (wraps an engraving library)
 */
class SheetMusicView extends React.Component {
  static defaultProps: SheetMusicViewProps;
  props: SheetMusicViewProps;
  constructor(props: SheetMusicViewProps) {
    super(props);

    // Prebind custom methods
    this.drawMusic = this.drawMusic.bind(this);
  }

  componentDidMount() {
    this.drawMusic();
  }

  componentDidUpdate(prevProps, prevState) {
    this.drawMusic();
  }

  teoriaKeysToVexflowKeys(keys: TeoriaNote[]) {
    const sorted = keys.toSorted((a, b) => a.midi() - b.midi());
    return sorted.map(function (note) {
      let accidental: string = note.accidental();
      // VexFlow and Teoria represent double-sharps differently
      if (accidental == 'x') {
        accidental = '##';
      }
      return note.name() + accidental + "/" + note.octave();
    });
  }

  tonalNoteNamesToVexflowKeys(notes: TonalNote[]) {
    // Enforce octaves
    notes.forEach(note => {
      if (note.oct === null) {
        throw Error("Note given to SheetMusicView missing octave information");
      }
    });

    const sorted = notes.toSorted((a, b) => a.midi - b.midi);
    return sorted.map(function (note) {
      return note.pc + "/" + note.oct;
    });
  }

  /**
   * Redraw the contents of the canvas
   */
  drawMusic() {
    // Clear the canvas
    var container = ReactDOM.findDOMNode(this);
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }

    // Prepare drawing objects
    var renderer = new Vex.Flow.Renderer(
      container,
      Vex.Flow.Renderer.Backends.SVG
    );
    var ctx = renderer.getContext();
    const isGrand = this.props.clef === 'grand';
    ctx.resize(this.props.width, isGrand ? this.props.height * 1.5 : this.props.height);

    // Set up and draw stave/clef/key
    var stave = new Vex.Flow.Stave(0, 0, this.props.width-1);
    stave.addClef(isGrand ? 'treble' : this.props.clef);
    var keySig = new Vex.Flow.KeySignature(this.props.keySignature);
        keySig.addToStave(stave);
    stave.setContext(ctx).draw();

    // If clef=grand, set up a second stave
    let stave2 = null;
    if (isGrand) {
      stave2 = new Vex.Flow.Stave(0, 62, this.props.width-1);
      stave2.addClef('bass');
      keySig.addToStave(stave2);

      var lineLeft = new Vex.Flow.StaveConnector(stave, stave2).setType(1);
      var lineRight = new Vex.Flow.StaveConnector(stave, stave2).setType(6);
      stave2.setContext(ctx).draw();
      lineLeft.setContext(ctx).draw();
      lineRight.setContext(ctx).draw();
    }

    // The StaveNote can have one or more keys (i.e. mono- or polyphonic)
    if (this.props.tonalNotes.length > 0 || this.props.keys.length > 0) {
      const staveNotes = [];

      // Come up with a StaveNote for each staff
      if (isGrand) {
        if (this.props.tonalNotes.length > 0) {
          // Use new Tonal note set
          var upperKeys = this.tonalNoteNamesToVexflowKeys(this.props.tonalNotes.filter(note => note.oct >= 4));
          var lowerKeys = this.tonalNoteNamesToVexflowKeys(this.props.tonalNotes.filter(note => note.oct < 4));
        } else {
          // Use old Teoria note set
          var upperKeys = this.teoriaKeysToVexflowKeys(this.props.keys.filter(teoriaKey => teoriaKey.octave() >= 4));
          var lowerKeys = this.teoriaKeysToVexflowKeys(this.props.keys.filter(teoriaKey => teoriaKey.octave() < 4));
        }

        if (upperKeys.length > 0) {
          staveNotes.push((new Vex.Flow.StaveNote({
            clef: 'treble',
            keys: upperKeys,
            duration: "q",
            auto_stem: true
          })).setStave(stave));
        }
        if (lowerKeys.length > 0) {
          staveNotes.push((new Vex.Flow.StaveNote({
            clef: 'bass',
            keys: lowerKeys,
            duration: "q",
            auto_stem: true
          })).setStave(stave2));
        }
      } else {
        if (this.props.tonalNotes.length > 0) {
          var keys = this.tonalNoteNamesToVexflowKeys(this.props.tonalNotes);
        } else {
          var keys = this.teoriaKeysToVexflowKeys(this.props.keys);
        }
        staveNotes.push((new Vex.Flow.StaveNote({
          clef: this.props.clef,
          keys: keys,
          duration: "q",
          auto_stem: true,
        })).setStave(stave));
      }

      // Create a Voice in 1/4
      var voice = new Vex.Flow.Voice({
        num_beats: 1,
        beat_value: 4,
        resolution: Vex.Flow.RESOLUTION,
      });

      // Add the StaveNotes from earlier to the Voice
      voice.setMode(Vex.Flow.Voice.Mode.SOFT);
      voice.addTickables(staveNotes);

      // Apply accidentals
      Vex.Flow.Accidental.applyAccidentals([voice], this.props.keySignature);

      // Format and justify the notes to 500 pixels
      var formatter = new Vex.Flow.Formatter().
        joinVoices([voice]).format([voice], (this.props.width-1)/2);

      // Render voice (to appropriate stave)
      voice.draw(ctx);
    }
  }

  render() {
    return (
      <div className="rx-sheet-music-view"></div>
    );
  }
}
SheetMusicView.defaultProps = {
  width: 150,
  height: 140,
  clef: "treble",
  keys: [],
  tonalNotes: [],
};
export default SheetMusicView;
