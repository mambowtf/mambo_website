export class Sound {
    constructor(src) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioBuffer = null;
        
        fetch(src)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.audioBuffer = audioBuffer;
            })
            .catch(e => console.error("Error with decoding audio data: " + e.err));
    }

    play() {
        if (!this.audioBuffer || this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        if (this.audioBuffer) {
            const source = this.audioContext.createBufferSource();
            source.buffer = this.audioBuffer;
            source.connect(this.audioContext.destination);
            source.start(0);
        }
    }
}

