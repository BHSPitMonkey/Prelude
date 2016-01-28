/**
 * A basic synthesizer for playing notes
 */
export default class {
  constructor() {
    this.ctx = new(window.AudioContext || window.webkitAudioContext)();

    this.frequencies = {
      'c': 261.63,
      'c#': 277.18,
      'd': 293.66,
      'd#': 311.13,
      'e': 329.63,
      'f': 349.23,
      'f#': 369.99,
      'g': 392.00,
      'g#': 415.30,
      'a': 440.00,
      'a#': 466.16,
      'b': 493.88,
    };
  }
  play(key, seconds) {
    let oscillator = this.ctx.createOscillator();
    oscillator.connect(this.ctx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.value = this.frequencies[key];

    oscillator.start();
    oscillator.stop(this.ctx.currentTime + seconds);
  }
}
