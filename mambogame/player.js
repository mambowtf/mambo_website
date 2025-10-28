export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91;
        this.x = 50;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 0.3;
        this.jumpStrength = 10;
        this.doubleJumpStrength = 8;
        this.airTime = 0;
        this.maxAirTime = 1000; // 1 second max air time for double jump
        this.minAirTime = 100; // Minimum time before double jump allowed
        this.canDoubleJump = false;
        this.hasDoubleJumped = false;
        this.lastSpacePress = 0;
        this.image = document.getElementById('monkey');
        this.runningImage = document.getElementById('monkey_running');
        this.animationTimer = 0;
        this.animationSpeed = 150; // milliseconds between frames
    }

    update(input, deltaTime) {
        const currentTime = Date.now();
        const spaceJustPressed = input.getSpaceJustPressed();
        const spacePressed = input.getSpacePressed();
        
        // First jump from ground (works with held or fresh press)
        if ((spaceJustPressed || spacePressed) && this.onGround()) {
            this.vy = -this.jumpStrength;
            this.airTime = 0;
            this.canDoubleJump = true;
            this.hasDoubleJumped = false;
            this.lastSpacePress = currentTime;
            console.log('FIRST JUMP! vy:', this.vy);
            if (this.game.sounds.jump) this.game.sounds.jump.play();
        }
        
        // Double jump while in air (check for space press with cooldown)
        if (spacePressed && this.canDoubleJump && !this.onGround() && !this.hasDoubleJumped && 
            this.airTime > this.minAirTime && this.airTime < this.maxAirTime &&
            currentTime - this.lastSpacePress > 200) { // 200ms cooldown
            this.vy = -this.doubleJumpStrength;
            this.canDoubleJump = false;
            this.hasDoubleJumped = true;
            this.lastSpacePress = currentTime;
            console.log('DOUBLE JUMP! vy:', this.vy, 'airTime:', this.airTime);
            if (this.game.sounds.jump) this.game.sounds.jump.play();
        }

        // Track air time
        if (!this.onGround()) {
            this.airTime += deltaTime;
        }
        
        // Update animation timer
        this.animationTimer += deltaTime;

        // Vertical movement
        this.y += this.vy;
        if (!this.onGround()) {
            this.vy += this.weight;
        } else {
            this.vy = 0;
            this.y = this.game.height - this.height - this.game.groundMargin;
            this.airTime = 0;
            this.canDoubleJump = false;
            this.hasDoubleJumped = false;
        }
    }

    draw(context) {
        let imageToUse;
        
        if (this.onGround()) {
            // Simple animation: alternate between two images
            const frame = Math.floor(this.animationTimer / this.animationSpeed) % 2;
            imageToUse = frame === 0 ? this.image : this.runningImage;
        } else {
            // Use static image when jumping
            imageToUse = this.image;
        }
        
        context.drawImage(imageToUse, this.x, this.y, this.width, this.height);
        if (this.game.debug) {
            context.strokeStyle = 'red';
            context.lineWidth = 2;
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    
    restart() {
        this.x = 50;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.airTime = 0;
        this.canDoubleJump = false;
        this.hasDoubleJumped = false;
    }
}

