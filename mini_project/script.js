 let gameState = {
            isRunning: false,
            score: 0,
            playerHealth: 100,
            playerX: window.innerWidth / 2 - 40,
            bullets: [],
            missiles: [],
            enemyMissiles: [],
            enemies: [],
            powerups: [],
            explosions: [],
            keys: {},
            lastShot: 0,
            lastMissile: 0,
            fireRate: 150,
            missileRate: 800,
            hasContinuousMissiles: false,
            rapidFire: false,
            rapidFireEnd: 0,
            continuousMissilesEnd: 0,
            bulletSpeed: false,
            bulletSpeedEnd: 0,
            doubleBullets: false,
            doubleBulletsEnd: 0
        };

        // Game elements
        const player = document.getElementById('player');
        const gameArea = document.getElementById('gameArea');
        const scoreDisplay = document.getElementById('score');
        const playerHealthFill = document.getElementById('playerHealthFill');
        const healthPercentage = document.getElementById('healthPercentage');
        const gameOverScreen = document.getElementById('gameOver');
        const startScreen = document.getElementById('startScreen');
        const finalScoreDisplay = document.getElementById('finalScore');

        // Initialize stars
        function createStars() {
            const starsContainer = document.getElementById('stars');
            
            // Static background stars
            for (let i = 0; i < 100; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.width = star.style.height = Math.random() * 3 + 1 + 'px';
                star.style.animationDelay = Math.random() * 2 + 's';
                starsContainer.appendChild(star);
            }
        }

        // Add scrolling stars
        function addScrollingStar() {
            if (!gameState.isRunning) return;
            
            const star = document.createElement('div');
            star.className = 'star scrolling-star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = '-10px';
            star.style.width = star.style.height = Math.random() * 2 + 1 + 'px';
            document.getElementById('stars').appendChild(star);
            
            setTimeout(() => star.remove(), 3000);
        }

        // Event listeners
        document.addEventListener('keydown', (e) => {
            gameState.keys[e.code] = true;
            
            if (e.code === 'Space') {
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            gameState.keys[e.code] = false;
        });

        // Player movement
        function updatePlayer() {
            const speed = 10;
            
            if ((gameState.keys['ArrowLeft'] || gameState.keys['KeyA']) && gameState.playerX > 0) {
                gameState.playerX -= speed;
            }
            if ((gameState.keys['ArrowRight'] || gameState.keys['KeyD']) && gameState.playerX < window.innerWidth - 80) {
                gameState.playerX += speed;
            }
            
            player.style.left = gameState.playerX + 'px';
        }

        // Continuous shooting system
        function handleShooting() {
            if (!gameState.isRunning || !gameState.keys['Space']) return;
            
            const now = Date.now();
            const currentFireRate = gameState.rapidFire ? 75 : gameState.fireRate;
            
            // Shoot bullets
            if (now - gameState.lastShot >= currentFireRate) {
                gameState.lastShot = now;
                shootBullet();
            }
            
            // Shoot missiles continuously when powered up
            if (gameState.hasContinuousMissiles && now - gameState.lastMissile >= gameState.missileRate) {
                gameState.lastMissile = now;
                shootMissile();
            }
        }

        function shootBullet() {
            if (gameState.doubleBullets) {
                // Quad bullets when double bullets is active
                const bullets = [
                    { x: gameState.playerX + 15, y: window.innerHeight - 60 },
                    { x: gameState.playerX + 25, y: window.innerHeight - 60 },
                    { x: gameState.playerX + 51, y: window.innerHeight - 60 },
                    { x: gameState.playerX + 61, y: window.innerHeight - 60 }
                ];
                
                bullets.forEach(bulletData => {
                    const bullet = {
                        x: bulletData.x,
                        y: bulletData.y,
                        element: createBullet()
                    };
                    gameState.bullets.push(bullet);
                });
            } else {
                // Dual bullets from wings (normal)
                const leftBullet = {
                    x: gameState.playerX + 20,
                    y: window.innerHeight - 60,
                    element: createBullet()
                };
                const rightBullet = {
                    x: gameState.playerX + 56,
                    y: window.innerHeight - 60,
                    element: createBullet()
                };
                gameState.bullets.push(leftBullet, rightBullet);
            }
        }

        function shootMissile() {
            const missile = {
                x: gameState.playerX + 37,
                y: window.innerHeight - 60,
                element: createMissile()
            };
            gameState.missiles.push(missile);
        }

        function createBullet() {
            const bullet = document.createElement('div');
            bullet.className = 'bullet';
            gameArea.appendChild(bullet);
            return bullet;
        }

        function createMissile() {
            const missile = document.createElement('div');
            missile.className = 'missile';
            gameArea.appendChild(missile);
            return missile;
        }

        function createEnemyMissile(x, y) {
            const missile = document.createElement('div');
            missile.className = 'enemy-missile';
            gameArea.appendChild(missile);
            return missile;
        }

        // Enemy system
        function spawnEnemy() {
            if (!gameState.isRunning) return;
            
            const types = ['basic', 'strong', 'missile-enemy', 'boss'];
            const weights = [0.4, 0.3, 0.25, 0.05];
            
            let type = 'basic';
            const rand = Math.random();
            let cumulative = 0;
            
            for (let i = 0; i < types.length; i++) {
                cumulative += weights[i];
                if (rand <= cumulative) {
                    type = types[i];
                    break;
                }
            }
            
            const enemy = {
                x: Math.random() * (window.innerWidth - 100),
                y: -100,
                type: type,
                health: type === 'basic' ? 100 : type === 'strong' ? 200 : type === 'missile-enemy' ? 150 : 300,
                maxHealth: type === 'basic' ? 100 : type === 'strong' ? 200 : type === 'missile-enemy' ? 150 : 300,
                speed: type === 'basic' ? 3 : type === 'strong' ? 2 : type === 'missile-enemy' ? 2.5 : 1,
                lastMissile: 0,
                element: createEnemy(type)
            };
            
            gameState.enemies.push(enemy);
        }

        function createEnemy(type) {
            const enemy = document.createElement('div');
            enemy.className = `enemy ${type}`;
            gameArea.appendChild(enemy);
            
            // Add health bar for all enemies
            const healthBar = document.createElement('div');
            healthBar.className = 'enemy-health-bar';
            const healthFill = document.createElement('div');
            healthFill.className = 'enemy-health-fill';
            healthFill.style.width = '100%';
            healthBar.appendChild(healthFill);
            enemy.appendChild(healthBar);
            
            return enemy;
        }

        // Enemy missile shooting
        function updateEnemyBehavior() {
            const now = Date.now();
            gameState.enemies.forEach(enemy => {
                // Missile enemies and bosses can shoot
                if ((enemy.type === 'missile-enemy' || enemy.type === 'boss') && 
                    now - enemy.lastMissile > 2000 && 
                    enemy.y > 50 && enemy.y < window.innerHeight - 200) {
                    
                    enemy.lastMissile = now;
                    const enemyMissile = {
                        x: enemy.x + (enemy.type === 'boss' ? 53 : 25),
                        y: enemy.y + (enemy.type === 'boss' ? 110 : 55),
                        element: createEnemyMissile()
                    };
                    gameState.enemyMissiles.push(enemyMissile);
                }
            });
        }

        // Power-up system with enhanced powers
        function spawnPowerup() {
            if (!gameState.isRunning || Math.random() > 0.15) return;
            
            const types = ['health', 'rapid', 'missile', 'speed', 'double-bullets'];
            const weights = [0.25, 0.2, 0.2, 0.2, 0.15];
            
            let type = 'health';
            const rand = Math.random();
            let cumulative = 0;
            
            for (let i = 0; i < types.length; i++) {
                cumulative += weights[i];
                if (rand <= cumulative) {
                    type = types[i];
                    break;
                }
            }
            
            const powerup = {
                x: Math.random() * (window.innerWidth - 35),
                y: -35,
                type: type,
                element: createPowerup(type)
            };
            
            gameState.powerups.push(powerup);
        }

        function createPowerup(type) {
            const powerup = document.createElement('div');
            powerup.className = `powerup ${type}`;
            
            // Add unique symbols/logos for each power-up
            powerup.style.display = 'flex';
            powerup.style.alignItems = 'center';
            powerup.style.justifyContent = 'center';
            powerup.style.fontWeight = 'bold';
            powerup.style.fontSize = '16px';
            
            if (type === 'health') {
                powerup.innerHTML = '❤️';
                powerup.style.fontSize = '20px';
            } else if (type === 'missile') {
                powerup.innerHTML = '🚀';
                powerup.style.fontSize = '18px';
            } else if (type === 'rapid') {
                powerup.innerHTML = '⚡';
                powerup.style.fontSize = '18px';
            } else if (type === 'speed') {
                powerup.innerHTML = '💨';
                powerup.style.fontSize = '16px';
            } else if (type === 'double-bullets') {
                powerup.innerHTML = '✖️';
                powerup.style.fontSize = '16px';
            }
            
            gameArea.appendChild(powerup);
            return powerup;
        }

        // Enhanced collision detection
        function checkCollisions() {
            // Player bullets vs enemies
            gameState.bullets.forEach((bullet, bulletIndex) => {
                gameState.enemies.forEach((enemy, enemyIndex) => {
                    if (isColliding(bullet, enemy)) {
                        const damage = 25;
                        enemy.health -= damage;
                        showDamage(enemy.x + 20, enemy.y + 10, damage);
                        
                        if (enemy.element.querySelector('.enemy-health-fill')) {
                            const healthPercent = Math.max(0, (enemy.health / enemy.maxHealth) * 100);
                            enemy.element.querySelector('.enemy-health-fill').style.width = healthPercent + '%';
                        }
                        
                        bullet.element.remove();
                        gameState.bullets.splice(bulletIndex, 1);
                        
                        if (enemy.health <= 0) {
                            createExplosion(enemy.x + 30, enemy.y + 30);
                            const points = enemy.type === 'basic' ? 100 : enemy.type === 'strong' ? 250 : enemy.type === 'missile-enemy' ? 200 : 500;
                            gameState.score += points;
                            updateScore();
                            
                            enemy.element.remove();
                            gameState.enemies.splice(enemyIndex, 1);
                        }
                    }
                });
            });
            
            // Player missiles vs enemies (more damage)
            gameState.missiles.forEach((missile, missileIndex) => {
                gameState.enemies.forEach((enemy, enemyIndex) => {
                    if (isColliding(missile, enemy)) {
                        const damage = 60;
                        enemy.health -= damage;
                        showDamage(enemy.x + 20, enemy.y + 10, damage);
                        
                        createExplosion(enemy.x + 30, enemy.y + 30);
                        
                        if (enemy.element.querySelector('.enemy-health-fill')) {
                            const healthPercent = Math.max(0, (enemy.health / enemy.maxHealth) * 100);
                            enemy.element.querySelector('.enemy-health-fill').style.width = healthPercent + '%';
                        }
                        
                        missile.element.remove();
                        gameState.missiles.splice(missileIndex, 1);
                        
                        if (enemy.health <= 0) {
                            const points = enemy.type === 'basic' ? 100 : enemy.type === 'strong' ? 250 : enemy.type === 'missile-enemy' ? 200 : 500;
                            gameState.score += points;
                            updateScore();
                            
                            enemy.element.remove();
                            gameState.enemies.splice(enemyIndex, 1);
                        }
                    }
                });
            });
            
            // Enemy missiles vs player
            gameState.enemyMissiles.forEach((missile, missileIndex) => {
                if (isColliding({x: gameState.playerX, y: window.innerHeight - 130, width: 80, height: 80}, missile)) {
                    createExplosion(gameState.playerX + 40, window.innerHeight - 90);
                    takeDamage(20);
                    
                    missile.element.remove();
                    gameState.enemyMissiles.splice(missileIndex, 1);
                }
            });
            
            // Player vs enemies
            gameState.enemies.forEach((enemy, enemyIndex) => {
                if (isColliding({x: gameState.playerX, y: window.innerHeight - 130, width: 80, height: 80}, enemy)) {
                    createExplosion(gameState.playerX + 40, window.innerHeight - 90);
                    takeDamage(30);
                    
                    enemy.element.remove();
                    gameState.enemies.splice(enemyIndex, 1);
                }
            });
            
            // Player vs powerups
            gameState.powerups.forEach((powerup, powerupIndex) => {
                if (isColliding({x: gameState.playerX, y: window.innerHeight - 130, width: 80, height: 80}, powerup)) {
                    applyPowerup(powerup.type);
                    powerup.element.remove();
                    gameState.powerups.splice(powerupIndex, 1);
                }
            });
        }

        function isColliding(obj1, obj2) {
            const rect1 = {
                x: obj1.x,
                y: obj1.y,
                width: obj1.width || 4,
                height: obj1.height || 15
            };
            
            const rect2 = {
                x: obj2.x,
                y: obj2.y,
                width: obj2.type === 'boss' ? 110 : obj2.type === 'strong' ? 65 : obj2.type === 'missile-enemy' ? 55 : obj2.width || 45,
                height: obj2.type === 'boss' ? 110 : obj2.type === 'strong' ? 65 : obj2.type === 'missile-enemy' ? 55 : obj2.height || 45
            };
            
            return rect1.x < rect2.x + rect2.width &&
                   rect1.x + rect1.width > rect2.x &&
                   rect1.y < rect2.y + rect2.height &&
                   rect1.y + rect1.height > rect2.y;
        }

        function takeDamage(amount) {
            gameState.playerHealth -= amount;
            if (gameState.playerHealth < 0) gameState.playerHealth = 0;
            updatePlayerHealth();
            
            if (gameState.playerHealth <= 0) {
                endGame();
            }
        }

        function showDamage(x, y, damage) {
            const damageEl = document.createElement('div');
            damageEl.className = 'damage-indicator';
            damageEl.textContent = `-${damage}`;
            damageEl.style.left = x + 'px';
            damageEl.style.top = y + 'px';
            gameArea.appendChild(damageEl);
            
            setTimeout(() => damageEl.remove(), 1000);
        }

        function applyPowerup(type) {
            switch (type) {
                case 'health':
                    gameState.playerHealth = Math.min(100, gameState.playerHealth + 30);
                    updatePlayerHealth();
                    break;
                case 'rapid':
                    gameState.rapidFire = true;
                    gameState.rapidFireEnd = Date.now() + 7000;
                    break;
                case 'missile':
                    gameState.hasContinuousMissiles = true;
                    gameState.continuousMissilesEnd = Date.now() + 10000;
                    break;
                case 'speed':
                    gameState.bulletSpeed = true;
                    gameState.bulletSpeedEnd = Date.now() + 8000;
                    break;
                case 'double-bullets':
                    gameState.doubleBullets = true;
                    gameState.doubleBulletsEnd = Date.now() + 6000;
                    break;
            }
        }

        // Explosion effect
        function createExplosion(x, y) {
            const explosion = document.createElement('div');
            explosion.className = 'explosion';
            explosion.style.left = (x - 40) + 'px';
            explosion.style.top = (y - 40) + 'px';
            gameArea.appendChild(explosion);
            
            setTimeout(() => explosion.remove(), 500);
        }

        // Update functions
        function updateBullets() {
            const speed = gameState.bulletSpeed ? 18 : 12;
            gameState.bullets.forEach((bullet, index) => {
                bullet.y -= speed;
                bullet.element.style.left = bullet.x + 'px';
                bullet.element.style.top = bullet.y + 'px';
                
                // Enhanced bullet effects when speed boost is active
                if (gameState.bulletSpeed) {
                    bullet.element.style.boxShadow = '0 0 15px #ffff00, 0 0 25px #ff8000';
                    bullet.element.style.background = 'linear-gradient(to top, #ffff00, #ffffff)';
                }
                
                if (bullet.y < -15) {
                    bullet.element.remove();
                    gameState.bullets.splice(index, 1);
                }
            });
        }

        function updateMissiles() {
            gameState.missiles.forEach((missile, index) => {
                missile.y -= 15;
                missile.element.style.left = missile.x + 'px';
                missile.element.style.top = missile.y + 'px';
                
                if (missile.y < -25) {
                    missile.element.remove();
                    gameState.missiles.splice(index, 1);
                }
            });
        }

        function updateEnemyMissiles() {
            gameState.enemyMissiles.forEach((missile, index) => {
                missile.y += 8;
                missile.element.style.left = missile.x + 'px';
                missile.element.style.top = missile.y + 'px';
                
                if (missile.y > window.innerHeight) {
                    missile.element.remove();
                    gameState.enemyMissiles.splice(index, 1);
                }
            });
        }

        function updateEnemies() {
            gameState.enemies.forEach((enemy, index) => {
                enemy.y += enemy.speed;
                enemy.element.style.left = enemy.x + 'px';
                enemy.element.style.top = enemy.y + 'px';
                
                if (enemy.y > window.innerHeight) {
                    enemy.element.remove();
                    gameState.enemies.splice(index, 1);
                }
            });
        }

        function updatePowerups() {
            gameState.powerups.forEach((powerup, index) => {
                powerup.y += 2;
                powerup.element.style.left = powerup.x + 'px';
                powerup.element.style.top = powerup.y + 'px';
                
                if (powerup.y > window.innerHeight) {
                    powerup.element.remove();
                    gameState.powerups.splice(index, 1);
                }
            });
        }

        function updateScore() {
            scoreDisplay.textContent = gameState.score;
        }

        function updatePlayerHealth() {
            const percentage = Math.max(0, gameState.playerHealth);
            playerHealthFill.style.width = percentage + '%';
            healthPercentage.textContent = Math.round(percentage) + '%';
            
            // Change color based on health
            if (percentage > 60) {
                playerHealthFill.style.background = 'linear-gradient(90deg, #00ff00, #80ff00)';
            } else if (percentage > 30) {
                playerHealthFill.style.background = 'linear-gradient(90deg, #ffff00, #ff8000)';
            } else {
                playerHealthFill.style.background = 'linear-gradient(90deg, #ff0000, #ff4000)';
            }
        }

        // Game control
        function startGame() {
            gameState.isRunning = true;
            startScreen.style.display = 'none';
            gameOverScreen.style.display = 'none';
            
            // Reset game state
            gameState.score = 0;
            gameState.playerHealth = 100;
            gameState.playerX = window.innerWidth / 2 - 40;
            gameState.bullets = [];
            gameState.missiles = [];
            gameState.enemyMissiles = [];
            gameState.enemies = [];
            gameState.powerups = [];
            gameState.rapidFire = false;
            gameState.hasContinuousMissiles = false;
            gameState.bulletSpeed = false;
            gameState.doubleBullets = false;
            
            updateScore();
            updatePlayerHealth();
            
            // Clear game area
            const gameElements = gameArea.querySelectorAll('.bullet, .missile, .enemy-missile, .enemy, .powerup, .explosion, .damage-indicator');
            gameElements.forEach(el => el.remove());
            
            gameLoop();
        }

        function endGame() {
            gameState.isRunning = false;
            finalScoreDisplay.textContent = gameState.score;
            gameOverScreen.style.display = 'flex';
        }

        function restartGame() {
            startGame();
        }

        // Main game loop
        function gameLoop() {
            if (!gameState.isRunning) return;
            
            updatePlayer();
            handleShooting();
            updateBullets();
            updateMissiles();
            updateEnemyMissiles();
            updateEnemies();
            updatePowerups();
            updateEnemyBehavior();
            checkCollisions();
            
            // Check power-up timeouts
            if (gameState.rapidFire && Date.now() > gameState.rapidFireEnd) {
                gameState.rapidFire = false;
            }
            
            if (gameState.hasContinuousMissiles && Date.now() > gameState.continuousMissilesEnd) {
                gameState.hasContinuousMissiles = false;
            }
            
            if (gameState.bulletSpeed && Date.now() > gameState.bulletSpeedEnd) {
                gameState.bulletSpeed = false;
            }
            
            if (gameState.doubleBullets && Date.now() > gameState.doubleBulletsEnd) {
                gameState.doubleBullets = false;
            }
            
            requestAnimationFrame(gameLoop);
        }

        // Spawn timers
        setInterval(() => {
            if (gameState.isRunning) {
                spawnEnemy();
                spawnPowerup();
            }
        }, 1800);

        setInterval(() => {
            addScrollingStar();
        }, 200);

        // Initialize
        createStars();