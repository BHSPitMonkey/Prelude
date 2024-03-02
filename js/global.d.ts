declare const __BUILD__: string;

type TeoriaNote = {
  accidental: () => 'b' | '#' | 'x',
  midi: () => number,
  name: () => string,
  octave: () => number
};