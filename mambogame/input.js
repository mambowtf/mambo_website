export class InputHandler {
    constructor(game) {
        this.keys = [];
        this.game = game;
        this.spacePressed = false;
        this.spaceJustPressed = false;
        
        window.addEventListener('keydown', e => {
            if (e.key === ' ') {
                if (this.keys.indexOf('Space') === -1) {
                    this.keys.push('Space');
                    this.spaceJustPressed = true;
                }
                this.spacePressed = true;
                
                if (this.game.currentState === this.game.states.START) {
                    this.game.start();
                } else if (this.game.currentState === this.game.states.GAME_OVER) {
                    this.game.restart();
                }
            } else if (e.key === 'd') {
                this.game.debug = !this.game.debug;
            }
        });
        
        window.addEventListener('keyup', e => {
            if (e.key === ' ') {
                this.keys.splice(this.keys.indexOf('Space'), 1);
                this.spacePressed = false;
            }
        });
    }
    
    getSpaceJustPressed() {
        const result = this.spaceJustPressed;
        this.spaceJustPressed = false; // Reset after reading
        return result;
    }
    
    getSpacePressed() {
        return this.spacePressed;
    }
}

