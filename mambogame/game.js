import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { Obstacle } from './obstacle.js';
import { Banana } from './banana.js';
import { Sound } from './sound.js';

window.addEventListener('load', function(){
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 400;

    class PowerUp {
        constructor(game, type) {
            this.game = game;
            this.type = type; // 'feather'
            this.width = 30;
            this.height = 30;
            this.x = this.game.width;
            this.y = Math.random() * (this.game.height - this.height - this.game.groundMargin - 50) + 50;
            this.markedForDeletion = false;
            this.collected = false;
        }

        update() {
            this.x -= this.game.gameSpeed;
            if (this.x + this.width < 0) this.markedForDeletion = true;
        }

        draw(context) {
            context.save();
            context.fillStyle = this.type === 'feather' ? '#ff69b4' : '#00ff00';
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            context.fill();
            
            // Draw feather symbol
            if (this.type === 'feather') {
                context.fillStyle = 'white';
                context.font = '16px Arial';
                context.textAlign = 'center';
                context.fillText('🪶', this.x + this.width/2, this.y + this.height/2 + 5);
            }
            context.restore();
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.5) * 8;
            this.color = color;
            this.life = 1.0;
            this.decay = 0.02;
            this.size = Math.random() * 4 + 2;
        }

        update(deltaTime) {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.2; // gravity
            this.life -= this.decay;
            if (this.life <= 0) {
                this.markedForDeletion = true;
            }
        }

        draw(context) {
            context.save();
            context.globalAlpha = this.life;
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            context.fill();
            context.restore();
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 60;
            this.gameSpeed = 0;
            this.maxSpeed = 5;
            this.speedIncrease = 0.003;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.obstacles = [];
            this.bananas = [];
            this.particles = [];
            this.obstacleTimer = 0;
            this.obstacleInterval = 2000;
            this.bananaTimer = 0;
            this.bananaInterval = 1300;
            this.debug = false;
            this.score = 0;
            this.highScore = parseInt(localStorage.getItem('mamboHighScore')) || 0;
            this.fontColor = 'white';
            this.screenShake = 0;
            this.combo = 0;
            this.lastScoreTime = 0;
            this.speedBoost = 0;
            this.states = {
                START: 0,
                RUNNING: 1,
                GAME_OVER: 2
            };
            this.currentState = this.states.START;
            this.startScreen = document.getElementById('start-screen');
            this.gameOverScreen = document.getElementById('game-over-screen');
            this.finalScoreEl = document.getElementById('final-score');
            this.finalHighScoreEl = document.getElementById('final-high-score');
            this.scoreEl = document.getElementById('score');
            this.highScoreEl = document.getElementById('high-score');
            this.comboEl = document.getElementById('combo');
            this.comboCountEl = document.getElementById('combo-count');
            this.sounds = {
                jump: null,
                collect: null,
                gameOver: null
            };
        }
        
        start() {
            this.currentState = this.states.RUNNING;
            this.gameSpeed = this.maxSpeed;
            this.startScreen.style.display = 'none';
            this.gameOverScreen.style.display = 'none';
            this.highScoreEl.innerText = `High Score: ${this.highScore}`;
        }

        restart() {
            this.player.restart();
            this.obstacles = [];
            this.bananas = [];
            this.particles = [];
            this.score = 0;
            this.combo = 0;
            this.gameSpeed = this.maxSpeed;
            this.scoreEl.innerText = `Score: ${this.score}`;
            this.comboEl.style.display = 'none';
            this.currentState = this.states.RUNNING;
            this.gameOverScreen.style.display = 'none';
        }

        update(deltaTime) {
            if (this.currentState === this.states.RUNNING) {
                // Increase game speed over time AND based on score
                const scoreSpeedBonus = this.score * 0.005; // Much smaller speed increase with score
                this.gameSpeed = Math.min(this.maxSpeed, this.gameSpeed + this.speedIncrease + scoreSpeedBonus + this.speedBoost);
                
                // Continuous score increase based on speed
                this.score += this.gameSpeed * 0.1;
                
                // Decay speed boost
                this.speedBoost = Math.max(0, this.speedBoost - 0.01);
                
                this.background.update();
                this.player.update(this.input, deltaTime);
                
                // Update particles
                this.particles.forEach(particle => particle.update(deltaTime));
                this.particles = this.particles.filter(particle => !particle.markedForDeletion);
                
                // Handle obstacles with much better spacing
                const baseInterval = Math.max(2000, 3000 - (this.score * 0.8));
                if (this.obstacleTimer > this.obstacleInterval) {
                    this.addObstacle();
                    this.obstacleTimer = 0;
                    // More consistent spacing with less randomness
                    this.obstacleInterval = Math.random() * baseInterval * 0.3 + baseInterval * 0.7;
                } else {
                    this.obstacleTimer += deltaTime;
                }
                this.obstacles.forEach(obstacle => {
                    obstacle.update();
                });

                // Handle bananas with dynamic spawning
                const bananaBaseInterval = Math.max(600, 1300 - (this.score * 1.5));
                if (this.bananaTimer > this.bananaInterval) {
                    this.addBanana();
                    this.bananaTimer = 0;
                    this.bananaInterval = Math.random() * bananaBaseInterval + bananaBaseInterval * 0.3;
                } else {
                    this.bananaTimer += deltaTime;
                }
                this.bananas.forEach(banana => {
                    banana.update();
                });
                
                this.checkCollisions();
                this.updateScreenShake(deltaTime);
                
                // Update score display
                this.scoreEl.innerText = `Score: ${Math.floor(this.score)}`;
                
                // Reset combo if no bananas collected recently
                if (Date.now() - this.lastScoreTime > 2000) {
                    this.combo = 0;
                }

                this.obstacles = this.obstacles.filter(obstacle => !obstacle.markedForDeletion);
                this.bananas = this.bananas.filter(banana => !banana.markedForDeletion);
            }
        }

        draw(context) {
            // Apply screen shake
            if (this.screenShake > 0) {
                context.save();
                context.translate(
                    (Math.random() - 0.5) * this.screenShake,
                    (Math.random() - 0.5) * this.screenShake
                );
            }

            this.background.draw(context);
            this.player.draw(context);
            this.obstacles.forEach(obstacle => {
                obstacle.draw(context);
            });
            this.bananas.forEach(banana => {
                banana.draw(context);
            });
            
            // Draw particles
            this.particles.forEach(particle => {
                particle.draw(context);
            });

            if (this.screenShake > 0) {
                context.restore();
            }
        }

        addObstacle() {
            this.obstacles.push(new Obstacle(this));
            // 5% chance to spawn a second obstacle for rare challenge
            if (Math.random() < 0.05) {
                setTimeout(() => {
                    if (this.currentState === this.states.RUNNING) {
                        this.obstacles.push(new Obstacle(this));
                    }
                }, 1000 + Math.random() * 1500);
            }
        }

        addBanana() {
            this.bananas.push(new Banana(this));
        }

        checkCollisions() {
            // Obstacle collision with padding for more forgiving collision
            const padding = 10; // Make collision slightly more forgiving
            this.obstacles.forEach(obstacle => {
                if (
                    this.player.x + padding < obstacle.x + obstacle.width - padding &&
                    this.player.x + this.player.width - padding > obstacle.x + padding &&
                    this.player.y + padding < obstacle.y + obstacle.height - padding &&
                    this.player.y + this.player.height - padding > obstacle.y + padding
                ) {
                    this.addScreenShake(10);
                    this.createParticles(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, '#ff4444');
                    this.gameOver();
                }
            });

            // Banana collision
            this.bananas.forEach(banana => {
                if (
                    !banana.markedForDeletion &&
                    this.player.x < banana.x + banana.width &&
                    this.player.x + this.player.width > banana.x &&
                    this.player.y < banana.y + banana.height &&
                    this.player.y + this.player.height > banana.y
                ) {
                    banana.markedForDeletion = true;
                    this.collectBanana(banana);
                }
            });
        }

        collectBanana(banana) {
            // Bonus points for bananas (more points for higher combos)
            const bonusPoints = 25 + (this.combo * 10);
            this.score += bonusPoints;
            this.combo++;
            this.lastScoreTime = Date.now();
            
            // Speed boost effect
            this.speedBoost = 0.2;
            
            // Create particle effect
            this.createParticles(banana.x + banana.width/2, banana.y + banana.height/2, '#ffdd00');
            
            // Show combo
            if (this.combo > 1) {
                this.comboEl.style.display = 'block';
                this.comboCountEl.innerText = this.combo;
                this.addScreenShake(2);
                
                // Hide combo after a delay
                setTimeout(() => {
                    this.comboEl.style.display = 'none';
                }, 1000);
            }
            
            if (this.sounds.collect) this.sounds.collect.play();
        }

        addScreenShake(intensity) {
            this.screenShake = Math.max(this.screenShake, intensity);
        }

        updateScreenShake(deltaTime) {
            if (this.screenShake > 0) {
                this.screenShake -= deltaTime * 0.1;
                if (this.screenShake < 0) this.screenShake = 0;
            }
        }

        createParticles(x, y, color) {
            for (let i = 0; i < 8; i++) {
                this.particles.push(new Particle(x, y, color));
            }
        }

        gameOver() {
            this.currentState = this.states.GAME_OVER;
            this.gameSpeed = 0;
            this.gameOverScreen.style.display = 'flex';
            this.finalScoreEl.innerText = this.score;
            
            // Update high score
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('mamboHighScore', this.highScore);
            }
            this.finalHighScoreEl.innerText = this.highScore;
            
            if (this.sounds.gameOver) this.sounds.gameOver.play();
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});
