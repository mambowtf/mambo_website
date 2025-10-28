class Layer {
    constructor(game, width, height, speedModifier, image) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = image;
        this.x = 0;
        this.y = 0;
    }
    update() {
        if (this.x < -this.width) this.x = 0;
        else this.x -= this.game.gameSpeed * this.speedModifier;
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

export class Background {
    constructor(game) {
        this.game = game;
        this.width = 800;
        this.height = 400;
        this.backgroundImage = document.getElementById('background_layer_1');
        this.backgroundLayer = new Layer(this.game, this.width, this.height, 1, this.backgroundImage);
        this.backgroundLayers = [this.backgroundLayer];
    }
    update() {
        this.backgroundLayers.forEach(layer => {
            layer.update();
        });
    }
    draw(context) {
        this.backgroundLayers.forEach(layer => {
            layer.draw(context);
        });
    }
}
