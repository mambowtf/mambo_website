export class Obstacle {
    constructor(game) {
        this.game = game;
        this.width = 60;
        this.height = 60;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('obstacle');
        this.speedX = this.game.gameSpeed;
        this.markedForDeletion = false;
    }

    update() {
        this.x -= this.game.gameSpeed;
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        if (this.game.debug) {
            context.strokeStyle = 'blue';
            context.lineWidth = 2;
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

