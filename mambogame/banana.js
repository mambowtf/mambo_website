export class Banana {
    constructor(game) {
        this.game = game;
        this.width = 40;
        this.height = 40;
        this.x = this.game.width;
        // spawn at random heights across the screen
        const minY = 50; // Top of screen
        const maxY = this.game.height - this.height - this.game.groundMargin; // Ground level
        this.y = Math.random() * (maxY - minY) + minY;

        this.image = document.getElementById('banana');
        this.markedForDeletion = false;
    }

    update() {
        this.x -= this.game.gameSpeed;
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        if (this.game.debug) {
            context.strokeStyle = 'yellow';
            context.lineWidth = 2;
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

