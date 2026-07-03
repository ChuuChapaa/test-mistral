// ============================================
// JEU DE PLATEFORME : CHEVALIER STEAMPUNK
// ============================================

// ==================== CONFIGURATION ====================
const CONFIG = {
    // Taille de l'écran visible
    screenWidth: 1200,
    screenHeight: 800,
    
    // Taille du monde (niveau)
    worldWidth: 3000,
    worldHeight: 800,
    
    // Physique
    gravity: 0.8,
    jumpForce: -12,
    jetpackForce: -0.5,
    maxFallSpeed: 15,
    
    // Joueur
    player: {
        width: 40,
        height: 60,
        speed: 5,
        lives: 3
    },
    
    // Carburant
    fuel: {
        max: 100,
        consumption: 0.5,
        regeneration: 0.1
    },
    
    // Plateformes
    platform: {
        height: 20,
        color: '#5c4a2a'
    },
    
    // Pièces
    coin: {
        size: 20,
        color: '#d4a76a',
        value: 10
    },
    
    // Tonneaux
    barrel: {
        width: 30,
        height: 30,
        color: '#4a3c2a',
        speed: 2,
        spawnRate: 180 // frames (3 secondes à 60 FPS)
    },
    
    // Couleurs
    colors: {
        background: '#121212',
        player: '#3a2e1e',
        helmet: '#5c4a2a',
        jetpack: '#4a3c2a',
        jetpackNozzle: '#d4a76a',
        sword: '#8a8a8a',
        flame: '#ff6b35'
    }
};

// ==================== ÉTAT DU JEU ====================
const state = {
    // Caméra
    camera: {
        x: 0,
        y: 0
    },
    
    // Joueur
    player: {
        x: 100,
        y: 700,
        width: CONFIG.player.width,
        height: CONFIG.player.height,
        velocityX: 0,
        velocityY: 0,
        isOnGround: false,
        facingRight: true,
        lives: CONFIG.player.lives,
        invulnerable: false,
        invulnerabilityTimer: 0
    },
    
    // Contrôles
    keys: {
        left: false,
        right: false,
        up: false,
        space: false,
        shift: false
    },
    
    // Plateformes (niveau grand)
    platforms: [
        // Sol (très large)
        { x: 0, y: 780, width: CONFIG.worldWidth, height: CONFIG.platform.height },
        
        // Niveau 1 - Début (facile)
        { x: 0, y: 700, width: 200, height: CONFIG.platform.height },
        { x: 300, y: 650, width: 200, height: CONFIG.platform.height },
        { x: 600, y: 600, width: 200, height: CONFIG.platform.height },
        { x: 900, y: 550, width: 200, height: CONFIG.platform.height },
        
        // Niveau 2 - Milieu (moyen)
        { x: 1200, y: 500, width: 200, height: CONFIG.platform.height },
        { x: 1500, y: 450, width: 200, height: CONFIG.platform.height },
        { x: 1800, y: 400, width: 200, height: CONFIG.platform.height },
        { x: 2100, y: 350, width: 200, height: CONFIG.platform.height },
        
        // Niveau 3 - Haut (difficile)
        { x: 2400, y: 300, width: 200, height: CONFIG.platform.height },
        { x: 2700, y: 250, width: 200, height: CONFIG.platform.height },
        
        // Plateformes flottantes (pour jetpack)
        { x: 500, y: 400, width: 150, height: CONFIG.platform.height },
        { x: 1000, y: 300, width: 150, height: CONFIG.platform.height },
        { x: 1500, y: 200, width: 150, height: CONFIG.platform.height },
        { x: 2000, y: 150, width: 150, height: CONFIG.platform.height },
        { x: 2500, y: 200, width: 150, height: CONFIG.platform.height },
        
        // Plateformes pour défis
        { x: 700, y: 500, width: 100, height: CONFIG.platform.height },
        { x: 850, y: 450, width: 100, height: CONFIG.platform.height },
        { x: 1000, y: 500, width: 100, height: CONFIG.platform.height },
        { x: 2200, y: 450, width: 100, height: CONFIG.platform.height },
        { x: 2350, y: 400, width: 100, height: CONFIG.platform.height }
    ],
    
    // Pièces à collecter
    coins: [
        // Niveau 1
        { x: 50, y: 680, size: CONFIG.coin.size, collected: false },
        { x: 350, y: 630, size: CONFIG.coin.size, collected: false },
        { x: 650, y: 580, size: CONFIG.coin.size, collected: false },
        { x: 950, y: 530, size: CONFIG.coin.size, collected: false },
        
        // Niveau 2
        { x: 1250, y: 480, size: CONFIG.coin.size, collected: false },
        { x: 1550, y: 430, size: CONFIG.coin.size, collected: false },
        { x: 1850, y: 380, size: CONFIG.coin.size, collected: false },
        { x: 2150, y: 330, size: CONFIG.coin.size, collected: false },
        
        // Niveau 3
        { x: 2450, y: 280, size: CONFIG.coin.size, collected: false },
        { x: 2750, y: 230, size: CONFIG.coin.size, collected: false },
        
        // Plateformes flottantes
        { x: 550, y: 380, size: CONFIG.coin.size, collected: false },
        { x: 1050, y: 280, size: CONFIG.coin.size, collected: false },
        { x: 1550, y: 180, size: CONFIG.coin.size, collected: false },
        { x: 2050, y: 130, size: CONFIG.coin.size, collected: false },
        { x: 2550, y: 180, size: CONFIG.coin.size, collected: false },
        
        // Défis
        { x: 750, y: 480, size: CONFIG.coin.size, collected: false },
        { x: 900, y: 430, size: CONFIG.coin.size, collected: false },
        { x: 1050, y: 480, size: CONFIG.coin.size, collected: false },
        { x: 2250, y: 430, size: CONFIG.coin.size, collected: false },
        { x: 2400, y: 380, size: CONFIG.coin.size, collected: false }
    ],
    
    // Tonneaux
    barrels: [],
    
    // Stats
    fuel: CONFIG.fuel.max,
    score: 0,
    frameCount: 0
};

// ==================== ÉLÉMENTS DOM ====================
let canvas, ctx;
let fuelBar, fuelValue, scoreValue, livesValue;

// ==================== INITIALISATION ====================
function init() {
    // Récupérer les éléments DOM
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    fuelBar = document.getElementById('fuel-bar');
    fuelValue = document.getElementById('fuel-value');
    scoreValue = document.getElementById('score-value');
    livesValue = document.getElementById('lives-value');
    
    // Configurer le canvas
    canvas.width = CONFIG.screenWidth;
    canvas.height = CONFIG.screenHeight;
    
    // Initialiser l'UI
    updateUI();
    
    // Démarrer la boucle de jeu
    console.log('Jeu initialisé. Canvas:', canvas.width, 'x', canvas.height);
    requestAnimationFrame(gameLoop);
}

// ==================== MISE À JOUR UI ====================
function updateUI() {
    if (fuelBar) fuelBar.value = state.fuel;
    if (fuelValue) fuelValue.textContent = `${Math.round(state.fuel)}%`;
    if (scoreValue) scoreValue.textContent = state.score;
    if (livesValue) livesValue.textContent = `❤️ ${state.player.lives}`;
    
    // Couleur de la barre de carburant
    if (state.fuel < 20) {
        fuelBar.style.accentColor = '#ff3333';
    } else if (state.fuel < 50) {
        fuelBar.style.accentColor = '#ff9933';
    } else {
        fuelBar.style.accentColor = '#d4a76a';
    }
}

// ==================== CAMÉRA ====================
function updateCamera() {
    const playerCenter = state.player.x + state.player.width / 2;
    const cameraCenter = state.camera.x + CONFIG.screenWidth / 2;
    
    // Suivre le joueur avec une marge
    const margin = 200;
    if (playerCenter > cameraCenter + margin) {
        state.camera.x = playerCenter - CONFIG.screenWidth / 2;
    } else if (playerCenter < cameraCenter - margin) {
        state.camera.x = playerCenter - CONFIG.screenWidth / 2;
    }
    
    // Limiter la caméra aux bords du monde
    state.camera.x = Math.max(0, Math.min(state.camera.x, CONFIG.worldWidth - CONFIG.screenWidth));
    state.camera.y = 0; // Pas de défilement vertical
}

// ==================== DESSIN ====================

// Dessiner le fond
function drawBackground() {
    ctx.fillStyle = CONFIG.colors.background;
    ctx.fillRect(0, 0, CONFIG.screenWidth, CONFIG.screenHeight);
    
    // Étoiles de fond
    ctx.fillStyle = 'rgba(212, 167, 106, 0.15)';
    for (let i = 0; i < 200; i++) {
        const x = (i * 15 + state.camera.x * 0.3) % CONFIG.screenWidth;
        const y = Math.random() * CONFIG.screenHeight;
        const size = Math.random() * 1.5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Lignes de profondeur
    ctx.strokeStyle = 'rgba(92, 74, 42, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 14; i++) {
        const y = i * 60;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CONFIG.screenWidth, y);
        ctx.stroke();
    }
}

// Dessiner les plateformes
function drawPlatforms() {
    ctx.fillStyle = CONFIG.platform.color;
    
    state.platforms.forEach(platform => {
        const x = platform.x - state.camera.x;
        const y = platform.y - state.camera.y;
        
        // Ne dessiner que si visible
        if (x + platform.width < 0 || x > CONFIG.screenWidth) return;
        if (y + platform.height < 0 || y > CONFIG.screenHeight) return;
        
        // Plateforme
        ctx.fillRect(x, y, platform.width, platform.height);
        
        // Bordure
        ctx.strokeStyle = '#8a7b5a';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, platform.width, platform.height);
        
        // Boulons
        ctx.fillStyle = '#3a3a3a';
        for (let i = 20; i < platform.width; i += 40) {
            ctx.beginPath();
            ctx.arc(x + i, y + 10, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// Dessiner les pièces
function drawCoins() {
    state.coins.forEach(coin => {
        if (coin.collected) return;
        
        const x = coin.x - state.camera.x;
        const y = coin.y - state.camera.y;
        
        // Ne dessiner que si visible
        if (x + coin.size < 0 || x > CONFIG.screenWidth) return;
        if (y + coin.size < 0 || y > CONFIG.screenHeight) return;
        
        // Sac de pièces
        ctx.fillStyle = CONFIG.coin.color;
        ctx.beginPath();
        ctx.arc(x + coin.size/2, y + coin.size/2, coin.size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Bordure du sac
        ctx.strokeStyle = '#8a7b5a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + coin.size/2, y + coin.size/2, coin.size/2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Cordon
        ctx.strokeStyle = '#5c4a2a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + coin.size/2, y);
        ctx.lineTo(x + coin.size/2, y - 5);
        ctx.stroke();
        
        // Symbole $
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', x + coin.size/2, y + coin.size/2);
    });
}

// Dessiner les tonneaux
function drawBarrels() {
    state.barrels.forEach(barrel => {
        const x = barrel.x - state.camera.x;
        const y = barrel.y - state.camera.y;
        
        // Ne dessiner que si visible
        if (x + barrel.width < 0 || x > CONFIG.screenWidth) return;
        if (y + barrel.height < 0 || y > CONFIG.screenHeight) return;
        
        // Corps du tonneau
        ctx.fillStyle = CONFIG.barrel.color;
        ctx.beginPath();
        ctx.arc(x + barrel.width/2, y + barrel.height/2, barrel.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Cercles métalliques
        ctx.strokeStyle = '#3a3a3a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + barrel.width/2, y + barrel.height/2, barrel.width/2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Cercle intérieur
        ctx.strokeStyle = '#8a7b5a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x + barrel.width/2, y + barrel.height/2, barrel.width/2 - 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Lignes verticales
        ctx.strokeStyle = '#5c4a2a';
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x1 = x + barrel.width/2 + Math.cos(angle) * (barrel.width/2 - 3);
            const y1 = y + barrel.height/2 + Math.sin(angle) * (barrel.height/2 - 3);
            const x2 = x + barrel.width/2 + Math.cos(angle) * (barrel.width/2 + 3);
            const y2 = y + barrel.height/2 + Math.sin(angle) * (barrel.height/2 + 3);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    });
}

// Dessiner le joueur
function drawPlayer() {
    const p = state.player;
    const x = p.x - state.camera.x;
    const y = p.y - state.camera.y;
    
    // Clignotement si invulnérable
    if (p.invulnerable && state.frameCount % 10 < 5) {
        return;
    }
    
    // Corps
    ctx.fillStyle = CONFIG.colors.player;
    ctx.fillRect(x, y, p.width, p.height);
    
    // Casque
    ctx.fillStyle = CONFIG.colors.helmet;
    ctx.fillRect(x + 5, y - 10, p.width - 10, 15);
    
    // Visière
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x + 15, y - 5, 10, 5);
    
    // Jetpack
    ctx.fillStyle = CONFIG.colors.jetpack;
    ctx.fillRect(x + 5, y + p.height - 5, p.width - 10, 25);
    
    // Tuyères du jetpack
    ctx.fillStyle = CONFIG.colors.jetpackNozzle;
    if (p.facingRight) {
        ctx.fillRect(x + p.width - 15, y + p.height, 10, 15);
        ctx.fillRect(x + p.width - 20, y + p.height + 5, 5, 5);
    } else {
        ctx.fillRect(x, y + p.height, 10, 15);
        ctx.fillRect(x + 5, y + p.height + 5, 5, 5);
    }
    
    // Bras
    ctx.fillStyle = CONFIG.colors.player;
    if (p.facingRight) {
        ctx.fillRect(x + p.width - 5, y + 15, 10, 15); // Bras droit
        ctx.fillRect(x - 5, y + 15, 10, 15); // Bras gauche
    } else {
        ctx.fillRect(x + p.width - 5, y + 15, 10, 15); // Bras gauche
        ctx.fillRect(x - 5, y + 15, 10, 15); // Bras droit
    }
    
    // Jambes
    ctx.fillRect(x + 5, y + p.height - 20, 10, 20); // Jambe gauche
    ctx.fillRect(x + p.width - 15, y + p.height - 20, 10, 20); // Jambe droite
    
    // Épée
    ctx.fillStyle = CONFIG.colors.sword;
    if (p.facingRight) {
        ctx.fillRect(x + p.width - 5, y + 25, 5, 20);
    } else {
        ctx.fillRect(x - 5, y + 25, 5, 20);
    }
    
    // Flamme du jetpack
    if (state.keys.shift && state.fuel > 0) {
        ctx.fillStyle = CONFIG.colors.flame;
        if (p.facingRight) {
            ctx.beginPath();
            ctx.moveTo(x + p.width - 10, y + p.height + 15);
            ctx.lineTo(x + p.width - 20, y + p.height + 25);
            ctx.lineTo(x + p.width - 15, y + p.height + 30);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(x + 10, y + p.height + 15);
            ctx.lineTo(x + 20, y + p.height + 25);
            ctx.lineTo(x + 15, y + p.height + 30);
            ctx.closePath();
            ctx.fill();
        }
    }
}

// ==================== COLLISIONS ====================

// Vérifier les collisions avec les plateformes
function checkPlatformCollisions() {
    const p = state.player;
    p.isOnGround = false;
    
    for (const platform of state.platforms) {
        if (
            p.x < platform.x + platform.width &&
            p.x + p.width > platform.x &&
            p.y < platform.y + platform.height &&
            p.y + p.height > platform.y
        ) {
            // Collision par le bas (atterrissage)
            if (p.velocityY > 0 && p.y + p.height >= platform.y && p.y + p.height <= platform.y + 10) {
                p.y = platform.y - p.height;
                p.velocityY = 0;
                p.isOnGround = true;
            }
            // Collision par le haut
            else if (p.velocityY < 0 && p.y <= platform.y + platform.height && p.y >= platform.y) {
                p.y = platform.y + platform.height;
                p.velocityY = 0;
            }
            // Collision à gauche
            if (p.velocityX < 0 && p.x <= platform.x + platform.width && p.x >= platform.x) {
                p.x = platform.x - p.width;
                p.velocityX = 0;
            }
            // Collision à droite
            if (p.velocityX > 0 && p.x + p.width >= platform.x && p.x <= platform.x) {
                p.x = platform.x + platform.width;
                p.velocityX = 0;
            }
        }
    }
    
    // Chute hors du monde
    if (p.y > CONFIG.worldHeight) {
        p.lives--;
        if (p.lives <= 0) {
            resetGame();
        } else {
            resetPlayer();
        }
    }
}

// Vérifier les collisions avec les pièces
function checkCoinCollisions() {
    const p = state.player;
    
    state.coins.forEach(coin => {
        if (coin.collected) return;
        
        if (
            p.x < coin.x + coin.size &&
            p.x + p.width > coin.x &&
            p.y < coin.y + coin.size &&
            p.y + p.height > coin.y
        ) {
            coin.collected = true;
            state.score += CONFIG.coin.value;
        }
    });
}

// Vérifier les collisions avec les tonneaux
function checkBarrelCollisions() {
    const p = state.player;
    
    for (let i = state.barrels.length - 1; i >= 0; i--) {
        const barrel = state.barrels[i];
        
        // Collision avec le joueur
        if (
            p.x < barrel.x + barrel.width &&
            p.x + p.width > barrel.x &&
            p.y < barrel.y + barrel.height &&
            p.y + p.height > barrel.y
        ) {
            if (!p.invulnerable) {
                p.lives--;
                p.invulnerable = true;
                p.invulnerabilityTimer = 120; // 2 secondes
                
                if (p.lives <= 0) {
                    resetGame();
                } else {
                    // Reculer le joueur
                    if (p.x + p.width/2 < barrel.x + barrel.width/2) {
                        p.x = barrel.x - p.width - 5;
                    } else {
                        p.x = barrel.x + barrel.width + 5;
                    }
                    p.velocityY = -5;
                }
            }
            state.barrels.splice(i, 1);
        }
        
        // Collision avec les plateformes
        let onPlatform = false;
        for (const platform of state.platforms) {
            if (
                barrel.x < platform.x + platform.width &&
                barrel.x + barrel.width > platform.x &&
                barrel.y + barrel.height >= platform.y &&
                barrel.y + barrel.height <= platform.y + 10
            ) {
                barrel.y = platform.y - barrel.height;
                barrel.velocityY = 0;
                onPlatform = true;
                
                // Inverser la direction aux bords
                if (barrel.x <= platform.x || barrel.x + barrel.width >= platform.x + platform.width) {
                    barrel.velocityX *= -1;
                }
            }
        }
        
        // Gravité si pas sur plateforme
        if (!onPlatform) {
            barrel.velocityY += CONFIG.gravity * 0.5;
        }
        
        // Bords du monde
        if (barrel.x <= 0 || barrel.x + barrel.width >= CONFIG.worldWidth) {
            barrel.velocityX *= -1;
        }
        
        // Hors du monde
        if (barrel.y > CONFIG.worldHeight) {
            state.barrels.splice(i, 1);
        }
    }
}

// ==================== MISE À JOUR ====================

// Réinitialiser le jeu
function resetGame() {
    state.player.x = 100;
    state.player.y = 700;
    state.player.velocityX = 0;
    state.player.velocityY = 0;
    state.player.lives = CONFIG.player.lives;
    state.player.invulnerable = false;
    state.player.invulnerabilityTimer = 0;
    
    state.fuel = CONFIG.fuel.max;
    state.score = 0;
    state.barrels = [];
    state.camera.x = 0;
    
    // Réinitialiser les pièces
    state.coins.forEach(coin => coin.collected = false);
}

// Réinitialiser le joueur
function resetPlayer() {
    state.player.x = Math.max(100, state.camera.x + 100);
    state.player.y = 700;
    state.player.velocityX = 0;
    state.player.velocityY = 0;
    state.player.invulnerable = true;
    state.player.invulnerabilityTimer = 120;
}

// Spawner un tonneau
function spawnBarrel() {
    // Plateforme aléatoire (sauf le sol)
    const platformIndex = Math.floor(Math.random() * (state.platforms.length - 1));
    const platform = state.platforms[platformIndex];
    
    const x = platform.x + Math.random() * (platform.width - CONFIG.barrel.width);
    const y = platform.y - CONFIG.barrel.height;
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    state.barrels.push({
        x: x,
        y: y,
        width: CONFIG.barrel.width,
        height: CONFIG.barrel.height,
        velocityX: CONFIG.barrel.speed * direction,
        velocityY: 0
    });
}

// Mettre à jour le joueur
function updatePlayer() {
    const p = state.player;
    
    // Invulnérabilité
    if (p.invulnerable) {
        p.invulnerabilityTimer--;
        if (p.invulnerabilityTimer <= 0) {
            p.invulnerable = false;
        }
    }
    
    // Déplacement horizontal
    if (state.keys.left) {
        p.velocityX = -CONFIG.player.speed;
        p.facingRight = false;
    } else if (state.keys.right) {
        p.velocityX = CONFIG.player.speed;
        p.facingRight = true;
    } else {
        p.velocityX = 0;
    }
    
    // Saut
    if ((state.keys.up || state.keys.space) && p.isOnGround) {
        p.velocityY = CONFIG.jumpForce;
        p.isOnGround = false;
    }
    
    // Jetpack
    if (state.keys.shift && state.fuel > 0) {
        p.velocityY += CONFIG.jetpackForce;
        state.fuel -= CONFIG.fuel.consumption;
        if (p.velocityY < -8) p.velocityY = -8;
    } else if (state.fuel < CONFIG.fuel.max) {
        state.fuel += CONFIG.fuel.regeneration;
        if (state.fuel > CONFIG.fuel.max) state.fuel = CONFIG.fuel.max;
    }
    
    // Gravité
    if (!p.isOnGround) {
        p.velocityY += CONFIG.gravity;
    }
    
    // Limiter la vitesse de chute
    if (p.velocityY > CONFIG.maxFallSpeed) {
        p.velocityY = CONFIG.maxFallSpeed;
    }
    
    // Mettre à jour la position
    p.x += p.velocityX;
    p.y += p.velocityY;
    
    // Limites du monde
    p.x = Math.max(0, Math.min(p.x, CONFIG.worldWidth - p.width));
}

// Mettre à jour les tonneaux
function updateBarrels() {
    state.barrels.forEach(barrel => {
        barrel.x += barrel.velocityX;
        barrel.y += barrel.velocityY;
    });
}

// ==================== BOUCLE PRINCIPALE ====================
function gameLoop() {
    state.frameCount++;
    
    // Spawner des tonneaux
    if (state.frameCount % CONFIG.barrel.spawnRate === 0) {
        spawnBarrel();
    }
    
    // Mettre à jour
    updatePlayer();
    updateBarrels();
    updateCamera();
    
    // Collisions
    checkPlatformCollisions();
    checkCoinCollisions();
    checkBarrelCollisions();
    
    // Score basé sur la hauteur
    state.score = Math.max(0, Math.floor((CONFIG.worldHeight - state.player.y) / 3));
    
    // UI
    updateUI();
    
    // Dessiner
    drawBackground();
    drawPlatforms();
    drawCoins();
    drawBarrels();
    drawPlayer();
    
    // Continuer la boucle
    requestAnimationFrame(gameLoop);
}

// ==================== CONTRÔLES ====================
function setupControls() {
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft': case 'a': state.keys.left = true; break;
            case 'ArrowRight': case 'd': state.keys.right = true; break;
            case 'ArrowUp': case 'w': case ' ': 
                state.keys.up = true;
                state.keys.space = true;
                break;
            case 'Shift': state.keys.shift = true; break;
            case 'r': case 'R': resetGame(); break;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'ArrowLeft': case 'a': state.keys.left = false; break;
            case 'ArrowRight': case 'd': state.keys.right = false; break;
            case 'ArrowUp': case 'w': state.keys.up = false; break;
            case ' ': state.keys.space = false; break;
            case 'Shift': state.keys.shift = false; break;
        }
    });
}

// ==================== DÉMARRAGE ====================
// Attendre que le DOM soit prêt
window.addEventListener('DOMContentLoaded', () => {
    init();
    setupControls();
});

// Fallback au cas où
window.addEventListener('load', () => {
    init();
    setupControls();
});
