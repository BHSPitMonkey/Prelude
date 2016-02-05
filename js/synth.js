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
    let now = this.ctx.currentTime;

    // Use gain to hide the start/stop click artifacts
    let gain = this.ctx.createGain();
    let maxGain = 0.4; // Any higher and you get clipping from polyphonic interference
    gain.connect(this.ctx.destination);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.00);
    gain.gain.exponentialRampToValueAtTime(maxGain, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(maxGain, now + seconds - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + seconds);

    let oscillator = this.ctx.createOscillator();
    oscillator.connect(gain);
    oscillator.type = 'sine';
    oscillator.frequency.value = this.frequencies[key];
    oscillator.start();
    oscillator.stop(now + seconds);
  }
}
