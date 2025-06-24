import * as Tone from 'tone';

export class AudioManager {
  constructor() {
    this.initialized = false;
    this.synths = {};
    this.effects = {};
    this.vehicleRumble = null;
    this.rumblePlaying = false;
  }
  
  async init() {
    if (this.initialized) return;
    
    try {
      await Tone.start();
      
      // Guitar synth for goth character
      this.synths.guitar = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 0.5,
        modulationIndex: 20,
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 }
      });
      
      this.effects.guitarDistortion = new Tone.Distortion(0.8);
      this.effects.guitarReverb = new Tone.Reverb({ decay: 1.5, wet: 0.3 });
      this.synths.guitar.chain(this.effects.guitarDistortion, this.effects.guitarReverb, Tone.Destination);
      
      // Heroic synth for superman
      this.synths.heroic = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.8 }
      });
      this.synths.heroic.toDestination();
      
      // Zen synth for yoga teacher
      this.synths.zen = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.2, decay: 0.5, sustain: 0.3, release: 1.0 }
      });
      
      this.effects.zenReverb = new Tone.Reverb({ decay: 3.0, wet: 0.5 });
      this.synths.zen.chain(this.effects.zenReverb, Tone.Destination);
      
      // Crash sound
      this.synths.crash = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 0.1,
        modulationIndex: 50,
        oscillator: { type: 'square' },
        envelope: { attack: 0.001, decay: 0.5, sustain: 0.1, release: 1.0 }
      });
      
      this.effects.crashDistortion = new Tone.Distortion(0.9);
      this.synths.crash.chain(this.effects.crashDistortion, Tone.Destination);
      
      // Success sound
      this.synths.success = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'square' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 }
      });
      this.synths.success.toDestination();
      
      // Typewriter sound
      this.synths.typewriter = new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
      });
      this.synths.typewriter.toDestination();
      
      // Vehicle rumble
      this.vehicleRumble = new Tone.Oscillator({
        frequency: 45,
        type: 'sawtooth'
      });
      
      this.effects.rumbleFilter = new Tone.Filter({
        frequency: 200,
        type: 'lowpass',
        rolloff: -24
      });
      
      this.effects.rumbleGain = new Tone.Gain(0.2);
      this.vehicleRumble.chain(this.effects.rumbleFilter, this.effects.rumbleGain, Tone.Destination);
      
      this.initialized = true;
      console.log('Audio initialized!');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }
  
  playMoveSound(characterType) {
    if (!this.initialized) return;
    
    switch (characterType) {
      case 'goth':
        this.playGuitarRiff();
        break;
      case 'superman':
        this.playHeroicSound();
        break;
      case 'yoga':
        this.playZenSound();
        break;
    }
  }
  
  playGuitarRiff() {
    if (!this.synths.guitar) return;
    
    const chords = [
      ['E2', 'B2', 'E3'],
      ['A1', 'E2', 'A2'],
      ['D2', 'A2', 'D3']
    ];
    
    const randomChord = chords[Math.floor(Math.random() * chords.length)];
    const now = Tone.now();
    
    randomChord.forEach((note, index) => {
      this.synths.guitar.triggerAttackRelease(note, '8n', now + index * 0.01);
    });
  }
  
  playHeroicSound() {
    if (!this.synths.heroic) return;
    
    const heroicChord = ['C4', 'E4', 'G4', 'C5'];
    const now = Tone.now();
    
    heroicChord.forEach((note, index) => {
      this.synths.heroic.triggerAttackRelease(note, '4n', now + index * 0.05);
    });
  }
  
  playZenSound() {
    if (!this.synths.zen) return;
    
    const zenNotes = ['C4', 'D4', 'E4', 'G4', 'A4'];
    const randomNote = zenNotes[Math.floor(Math.random() * zenNotes.length)];
    
    this.synths.zen.triggerAttackRelease(randomNote, '2n');
  }
  
  playCrashSound() {
    if (!this.synths.crash) return;
    
    const crashChord = ['C2', 'F#2', 'Bb2', 'E3'];
    const now = Tone.now();
    
    crashChord.forEach((note, index) => {
      this.synths.crash.triggerAttackRelease(note, '4n', now + index * 0.02);
    });
  }
  
  playSuccessSound() {
    if (!this.synths.success) return;
    
    // Triumphant ascending melody
    const melody = ['C4', 'E4', 'G4', 'C5', 'E5'];
    const now = Tone.now();
    
    melody.forEach((note, index) => {
      this.synths.success.triggerAttackRelease(note, '8n', now + index * 0.1);
    });
  }
  
  playTypewriterSound() {
    if (!this.synths.typewriter) return;
    
    const frequency = 800 + Math.random() * 200;
    this.synths.typewriter.frequency.setValueAtTime(frequency, Tone.now());
    this.synths.typewriter.triggerAttackRelease('16n');
  }
  
  startVehicleRumble() {
    if (!this.initialized || !this.vehicleRumble || this.rumblePlaying) return;
    
    try {
      this.vehicleRumble.start();
      this.rumblePlaying = true;
      
      // Add frequency variation
      this.vehicleRumble.frequency.setValueAtTime(45, Tone.now());
      this.vehicleRumble.frequency.linearRampToValueAtTime(50, Tone.now() + 2);
      
      this.rumbleInterval = setInterval(() => {
        if (this.rumblePlaying) {
          const baseFreq = 45 + Math.random() * 10 - 5;
          this.vehicleRumble.frequency.setValueAtTime(baseFreq, Tone.now());
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to start vehicle rumble:', error);
    }
  }
  
  stopVehicleRumble() {
    if (!this.initialized || !this.vehicleRumble || !this.rumblePlaying) return;
    
    try {
      this.vehicleRumble.stop();
      this.rumblePlaying = false;
      
      if (this.rumbleInterval) {
        clearInterval(this.rumbleInterval);
        this.rumbleInterval = null;
      }
    } catch (error) {
      console.error('Failed to stop vehicle rumble:', error);
    }
  }
}