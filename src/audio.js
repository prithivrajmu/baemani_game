import * as Tone from 'tone';

export class AudioManager {
  constructor() {
    this.initialized = false;
    this.synth = null;
    this.distortion = null;
    this.reverb = null;
    this.limoBass = null;
    this.limoFilter = null;
    this.limoPlaying = false;
    this.crashSynth = null;
  }
  
  async init() {
    if (this.initialized) return;
    
    try {
      await Tone.start();
      
      // Create distorted electric guitar sound
      this.synth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 0.5,
        modulationIndex: 20,
        oscillator: {
          type: 'sawtooth'
        },
        envelope: {
          attack: 0.01,
          decay: 0.2,
          sustain: 0.1,
          release: 0.3
        },
        modulation: {
          type: 'square'
        },
        modulationEnvelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0.2,
          release: 0.2
        }
      });
      
      // Add effects for guitar
      this.distortion = new Tone.Distortion(0.8);
      this.reverb = new Tone.Reverb({
        decay: 1.5,
        wet: 0.3
      });
      
      // Connect the guitar chain
      this.synth.chain(this.distortion, this.reverb, Tone.Destination);
      
      // Create crash sound synth
      this.crashSynth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 0.1,
        modulationIndex: 50,
        oscillator: {
          type: 'square'
        },
        envelope: {
          attack: 0.001,
          decay: 0.5,
          sustain: 0.1,
          release: 1.0
        },
        modulation: {
          type: 'sawtooth'
        },
        modulationEnvelope: {
          attack: 0.001,
          decay: 0.3,
          sustain: 0.2,
          release: 0.8
        }
      });
      
      // Create crash effects chain
      this.crashDistortion = new Tone.Distortion(0.9);
      this.crashFilter = new Tone.Filter({
        frequency: 800,
        type: 'lowpass',
        rolloff: -12
      });
      
      // Connect crash chain
      this.crashSynth.chain(this.crashDistortion, this.crashFilter, Tone.Destination);
      
      // Create limousine rumble sound
      this.limoBass = new Tone.Oscillator({
        frequency: 40,
        type: 'sawtooth'
      });
      
      this.limoFilter = new Tone.Filter({
        frequency: 200,
        type: 'lowpass',
        rolloff: -24
      });
      
      // Create a gain node for volume control
      this.limoGain = new Tone.Gain(0.3);
      
      // Connect limousine audio chain
      this.limoBass.chain(this.limoFilter, this.limoGain, Tone.Destination);
      
      this.initialized = true;
      console.log('Audio initialized!');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }
  
  playGuitarRiff() {
    if (!this.initialized || !this.synth) return;
    
    // Create a power chord progression
    const chords = [
      ['E2', 'B2', 'E3'],  // E power chord
      ['A1', 'E2', 'A2'],  // A power chord  
      ['D2', 'A2', 'D3']   // D power chord
    ];
    
    const randomChord = chords[Math.floor(Math.random() * chords.length)];
    
    // Play with slight randomization
    const now = Tone.now();
    randomChord.forEach((note, index) => {
      this.synth.triggerAttackRelease(note, '8n', now + index * 0.01);
    });
    
    // Add some random harmonic squeals
    if (Math.random() < 0.3) {
      setTimeout(() => {
        this.synth.triggerAttackRelease('E5', '16n');
      }, 100);
    }
  }
  
  playCrashSound() {
    if (!this.initialized || !this.crashSynth) return;
    
    // Play a discordant crash chord
    const crashChord = ['C2', 'F#2', 'Bb2', 'E3']; // Very dissonant
    const now = Tone.now();
    
    // Play the messy chord
    crashChord.forEach((note, index) => {
      this.crashSynth.triggerAttackRelease(note, '4n', now + index * 0.02);
    });
    
    // Add a metallic clang sound
    setTimeout(() => {
      this.crashSynth.triggerAttackRelease('G4', '8n');
      this.crashSynth.triggerAttackRelease('C5', '8n', Tone.now() + 0.05);
    }, 200);
    
    // Add some noise burst
    setTimeout(() => {
      const noiseNotes = ['F#3', 'Bb3', 'D4'];
      noiseNotes.forEach((note, index) => {
        this.crashSynth.triggerAttackRelease(note, '16n', Tone.now() + index * 0.03);
      });
    }, 400);
  }
  
  startLimoRumble() {
    if (!this.initialized || !this.limoBass || this.limoPlaying) return;
    
    try {
      this.limoBass.start();
      this.limoPlaying = true;
      
      // Add some variation to the rumble
      this.limoBass.frequency.setValueAtTime(40, Tone.now());
      this.limoBass.frequency.linearRampToValueAtTime(45, Tone.now() + 2);
      this.limoBass.frequency.linearRampToValueAtTime(38, Tone.now() + 4);
      
      // Repeat the frequency modulation
      this.limoRumbleInterval = setInterval(() => {
        if (this.limoPlaying) {
          const baseFreq = 40 + Math.random() * 10 - 5;
          this.limoBass.frequency.setValueAtTime(baseFreq, Tone.now());
          this.limoBass.frequency.linearRampToValueAtTime(baseFreq + 5, Tone.now() + 1);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Failed to start limo rumble:', error);
    }
  }
  
  stopLimoRumble() {
    if (!this.initialized || !this.limoBass || !this.limoPlaying) return;
    
    try {
      this.limoBass.stop();
      this.limoPlaying = false;
      
      if (this.limoRumbleInterval) {
        clearInterval(this.limoRumbleInterval);
        this.limoRumbleInterval = null;
      }
    } catch (error) {
      console.error('Failed to stop limo rumble:', error);
    }
  }
}