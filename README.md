# MidiTheory (working title)

A web application made for practicing reading sheet music, and perhaps more.

This project is still in early development.

## Design Goals

* Sight reading practice mode
  * Show the user a small staff with a clef, key signature, and note
    * The range/difficulty/possibilities can be controlled via settings, i.e. certain key signatures, enable/disable chords/clusters
  * The user is responsible for identifying the notes being played
    * Identification can by made by pressing displayed notes on a connected MIDI input device (preferred)
      * Should work with Chrome for Android/PC
      * Might be possible to support iOS wrapped in a native app with some kind of MIDI shim, low priority
    * Identification can be made either by entry onto an on-screen button array
      * Could possibly look like a small keyboard (maybe just an octave in the selected key)

## License

MIT

## Attribution

This is the work of Stephen Eisenhauer (stepheneisenhauer.com).

Sources made available under the license listed above.
