/**
 * Various helpful bits for working with MIDI data
 */

// Possible types of MIDI events (as supplied by onMidiMessage in Web MIDI)
export const Types = {
  NoteOff: 0x80,
  NoteOn: 0x90,
  PolyphonicAftertouch: 0xA0,
  ControlChange: 0xB0,
  ProgramChange: 0xC0,
  ChannelAftertouch: 0xD0,
  PitchWheel: 0xE0,
};
