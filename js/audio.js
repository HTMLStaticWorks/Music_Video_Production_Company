/* Cinematic Web Audio Engine - VORTEX CINEMA */

class VortexAudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.droneOscillators = [];
        this.droneFilter = null;
        this.lfo = null;
        this.isPlaying = false;
        this.isInitialized = false;

        // Settings
        this.droneVolume = 0.12; // Low, non-intrusive volume
        this.clickVolume = 0.05;
        this.chordFrequency = [77.78, 116.54, 196.00, 293.66]; // Eb2, Bb2, G3, D4 (Warm EbMaj9 sound)

        // Read saved setting
        this.muted = localStorage.getItem('vortex-audio-muted') !== 'false'; // Default to muted initially
    }

    init() {
        if (this.isInitialized) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            
            // Master gain
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            // Reverb/Delay unit for spacing
            this.delayNode = this.ctx.createDelay(1.0);
            this.delayNode.delayTime.setValueAtTime(0.35, this.ctx.currentTime);
            
            this.delayGain = this.ctx.createGain();
            this.delayGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

            // Delay feedback loop
            this.delayNode.connect(this.delayGain);
            this.delayGain.connect(this.delayNode); // feedback
            this.delayGain.connect(this.masterGain);

            // Filter for warm, deep sound
            this.droneFilter = this.ctx.createBiquadFilter();
            this.droneFilter.type = 'lowpass';
            this.droneFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);
            this.droneFilter.frequency.setValueAtTime(350, this.ctx.currentTime);
            this.droneFilter.connect(this.masterGain);
            this.droneFilter.connect(this.delayNode);

            // Create Drone Voices
            this.chordFrequency.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                // Detuned triangle and sine mix
                osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                
                // Add minor detuning for thick chorus effect
                osc.detune.setValueAtTime((Math.random() - 0.5) * 15, this.ctx.currentTime);

                const oscGain = this.ctx.createGain();
                // Deeper voices get slightly more volume
                const voiceVol = (1 - (idx * 0.15)) * 0.25;
                oscGain.gain.setValueAtTime(voiceVol, this.ctx.currentTime);

                osc.connect(oscGain);
                oscGain.connect(this.droneFilter);
                osc.start();
                this.droneOscillators.push(osc);
            });

            // Set up slow LFO for filter sweep
            this.lfo = this.ctx.createOscillator();
            this.lfo.type = 'sine';
            this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // 0.08Hz, super slow breathing

            this.lfoGain = this.ctx.createGain();
            this.lfoGain.gain.setValueAtTime(120, this.ctx.currentTime); // sweep range

            this.lfo.connect(this.lfoGain);
            this.lfoGain.connect(this.droneFilter.frequency);
            this.lfo.start();

            // Handle mouse-modulation on filter frequency
            document.addEventListener('mousemove', (e) => {
                if (!this.isPlaying) return;
                const ratio = e.clientY / window.innerHeight;
                // Modulate filter cutoff between 250Hz and 700Hz based on mouse Y
                const targetFreq = 250 + (1 - ratio) * 450;
                this.droneFilter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.5);
            });

            this.isInitialized = true;
            console.log("Vortex Cinematic Audio Engine Initialized");
        } catch (e) {
            console.error("Audio Context Failed to start: ", e);
        }
    }

    startDrone() {
        if (!this.isInitialized) this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        
        // Smoothly fade in master drone volume
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(this.droneVolume, this.ctx.currentTime + 2.5);
        this.isPlaying = true;
    }

    stopDrone() {
        if (!this.isInitialized) return;
        // Smoothly fade out drone volume
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.2);
        this.isPlaying = false;
    }

    // Play subtle high-frequency UI click sound
    playUIClick() {
        if (this.muted || !this.isInitialized) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            // Play a soft high click
            osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5 note
            osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);

            gain.gain.setValueAtTime(this.clickVolume * 0.8, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 0.06);
        } catch (e) {}
    }

    // Play deep sub-bass cinematic swell
    playCinemaSwell() {
        if (this.muted || !this.isInitialized) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(130, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.8);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(150, this.ctx.currentTime);

            gain.gain.setValueAtTime(this.droneVolume * 1.5, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 1.0);
        } catch (e) {}
    }

    // Play preloader sweep sound on complete
    playPreloaderSwell() {
        if (this.muted || !this.isInitialized) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const delay = this.ctx.createDelay();
            const delayGain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 1.5);

            delay.delayTime.setValueAtTime(0.25, this.ctx.currentTime);
            delayGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(this.droneVolume * 1.2, this.ctx.currentTime + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.0);

            osc.connect(delay);
            delay.connect(delayGain);
            delayGain.connect(gain);
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 2.2);
        } catch (e) {}
    }

    // Toggle mute state
    toggleAudio() {
        this.muted = !this.muted;
        localStorage.setItem('vortex-audio-muted', this.muted ? 'true' : 'false');
        
        if (this.muted) {
            this.stopDrone();
        } else {
            this.startDrone();
        }
        
        this.updateButtons();
        return !this.muted;
    }

    // Synchronize UI buttons across pages
    updateButtons() {
        const btns = document.querySelectorAll('.sound-toggle-btn, .sound-toggle-btn-mob');
        btns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (this.muted) {
                btn.classList.remove('playing');
                btn.setAttribute('aria-label', 'Unmute Soundscape');
                if (icon) icon.className = 'fas fa-volume-mute';
            } else {
                btn.classList.add('playing');
                btn.setAttribute('aria-label', 'Mute Soundscape');
                if (icon) icon.className = 'fas fa-volume-up';
            }
        });
    }
}

// Global Single Instance
window.VortexAudio = new VortexAudioEngine();

// Auto setup on click handlers for page interactions
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State Sync
    setTimeout(() => {
        window.VortexAudio.updateButtons();
        // If not muted by default config, start drone after loader finish
        if (!window.VortexAudio.muted) {
            window.VortexAudio.startDrone();
        }
    }, 500);

    // 2. Play Click on elements hover
    document.body.addEventListener('mouseenter', (e) => {
        const target = e.target.closest('a, button, .control-btn, .portfolio-filter-btn, .checkbox-card');
        if (target) {
            window.VortexAudio.playUIClick();
        }
    }, true);

    // 3. Play deep bass swell on showcase clicks
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('.showcase-card, .editorial-showcase-item, .portfolio-list-item');
        if (target) {
            window.VortexAudio.playCinemaSwell();
        }
    }, true);

    // 4. Set up preloader complete listener
    window.addEventListener('preloaderComplete', () => {
        if (!window.VortexAudio.isInitialized) {
            window.VortexAudio.init();
        }
        if (!window.VortexAudio.muted) {
            window.VortexAudio.startDrone();
            window.VortexAudio.playPreloaderSwell();
        }
    });

    // 5. Sound toggle buttons handler
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.sound-toggle-btn, .sound-toggle-btn-mob');
        if (btn) {
            e.preventDefault();
            // User gesture initializes audio context
            window.VortexAudio.init();
            window.VortexAudio.toggleAudio();
        }
    });
});
