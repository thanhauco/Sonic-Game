export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    playJump() {
        this.beep(600, 800, 0.1, 'sine');
    }

    playRing() {
        this.beep(1200, 1500, 0.1, 'sine');
    }

    playSpring() {
        this.beep(400, 1200, 0.2, 'square');
    }

    playHit() {
        this.beep(200, 50, 0.3, 'sawtooth');
    }

    playExplosion() {
        this.beep(150, 20, 0.5, 'sawtooth');
    }

    playSpin() {
        this.beep(200, 800, 0.2, 'triangle');
    }

    beep(startFreq, endFreq, duration, type) {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
}
