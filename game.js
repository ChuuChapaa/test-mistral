// ============================================
// Jeu de Plateforme : Chevalier Steampunk
// ============================================

// Configuration du jeu
const GAME_CONFIG = {
    width: 1200,         // Largeur du canvas
    height: 800,         // Hauteur du canvas
    gravity: 0.8,
    jumpForce: -12,
    jetpackForce: -0.5,
    maxFuel: 100,
    fuelConsumptionRate: 0.5,
    fuelRegenerationRate: 0.1,
    playerSpeed: 5,
    platformHeight: 20,
    platformColor: '#5c4a2a',
    backgroundColor: '#121212',
    playerWidth: 40,
    playerHeight: 60,
    coinSize: 20,
    coinColor: '#d4a76a',
    coinValue: 10,
    barrelWidth: 30,
    barrelHeight: 30,
    barrelColor: '#4a3c2a',
    barrelSpeed: 2,
    barrelSpawnRate: 180, // Frames entre chaque spawn de tonneau (3 secondes à 60 FPS)
    playerLives: 3,
    camera: {
        x: 0,
        y: 0,
        width: 1200,
        height: 800
    }
};

// État du jeu
const gameState = {
    player: {
        x: 100,
        y: 600,
        width: GAME_CONFIG.playerWidth,
        height: GAME_CONFIG.playerHeight,
        velocityX: 0,
        velocityY: 0,
        isJumping: false,
        isOnGround: false,
        facingRight: true,
        lives: GAME_CONFIG.playerLives,
        invulnerable: false,
        invulnerabilityTimer: 0
    },
    // Niveau plus grand avec plus de plateformes
    platforms: [
        // Sol
        { x: 0, y: 780, width: 2400, height: GAME_CONFIG.platformHeight },
        
        // Niveau 1 (bas)
        { x: 0, y: 700, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 300, y: 650, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 600, y: 600, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 900, y: 550, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 1200, y: 500, width: 200, height: GAME_CONFIG.platformHeight },
        
        // Niveau 2 (milieu-bas)
        { x: 1500, y: 450, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 1800, y: 400, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 2100, y: 350, width: 200, height: GAME_CONFIG.platformHeight },
        
        // Niveau 3 (milieu)
        { x: 0, y: 300, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 300, y: 250, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 600, y: 200, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 900, y: 150, width: 200, height: GAME_CONFIG.platformHeight },
        
        // Niveau 4 (milieu-haut)
        { x: 1200, y: 100, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 1500, y: 50, width: 200, height: GAME_CONFIG.platformHeight },
        
        // Plateformes flottantes pour le jetpack
        { x: 1800, y: 200, width: 150, height: GAME_CONFIG.platformHeight },
        { x: 2000, y: 100, width: 150, height: GAME_CONFIG.platformHeight },
        { x: 2200, y: 250, width: 150, height: GAME_CONFIG.platformHeight },
        
        // Plateformes pour les défis
        { x: 400, y: 400, width: 100, height: GAME_CONFIG.platformHeight },
        { x: 500, y: 350, width: 100, height: GAME_CONFIG.platformHeight },
        { x: 700, y: 450, width: 100, height: GAME_CONFIG.platformHeight }
    ],
    coins: [
        // Niveau 1
        { x: 50, y: 680, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        { x: 350, y: 630, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        { x: 650, y: 580, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        { x: 950, y: 530, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        { x: 1250, y: 480, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        
        // Niveau 2
        { x: 1550, y: 430, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        { x: 1850, y: 380, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        { x: 2150, y: 330, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        
        // Niveau 3
        { x: 50, y: 280, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        { x: 350, y: 230, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        { x: 650, y: 180, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        { x: 950, y: 130, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        
        // Niveau 4
        { x: 1250, y: 80, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        { x: 1550, y: 30, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        
        // Plateformes flottantes
        { x: 1850, y: 180, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        { x: 2050, y: 80, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        { x: 2250, y: 230, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        
        // Défis
        { x: 450, y: 380, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        { x: 550, y: 330, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
        { x: 750, y: 430, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false }
    ],
    barrels: [],
    fuel: GAME_CONFIG.maxFuel,
    score: 0,
    keys: {
        left: false,
        right: false,
        up: false,
        space: false,
        shift: false
    },
    lastTime: 0,
    frameCount: 0,
    livesElement: null,
    worldWidth: 2400,  // Largeur totale du monde
    worldHeight: 800  // Hauteur totale du monde
};

// Éléments DOM
let canvas, ctx, fuelBar, fuelValue, scoreValue, livesValue;

// ============================================
// Initialisation du jeu
// ============================================
function initGame() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    fuelBar = document.getElementById('fuel-bar');
    fuelValue = document.getElementById('fuel-value');
    scoreValue = document.getElementById('score-value');
    livesValue = document.getElementById('lives-value');
    
    // Définir la taille du canvas
    canvas.width = GAME_CONFIG.camera.width;
    canvas.height = GAME_CONFIG.camera.height;
    
    // Initialiser l'affichage des vies
    livesValue.textContent = `❤️ ${gameState.player.lives}`;
    
    // Démarrer la boucle de jeu
    requestAnimationFrame(gameLoop);
}

// ============================================
// Dessiner le joueur (chevalier avec jetpack)
// ============================================
function drawPlayer() {
    const { x, y, width, height, facingRight, invulnerable } = gameState.player;
    
    // Clignotement si invulnérable
    if (invulnerable && Math.floor(gameState.frameCount / 10) % 2 === 0) {
        return; // Ne pas dessiner le joueur une frame sur deux
    }
    
    // Position relative à la caméra
    const drawX = x - GAME_CONFIG.camera.x;
    const drawY = y - GAME_CONFIG.camera.y;
    
    // Corps du chevalier
    ctx.fillStyle = '#3a2e1e'; // Marron foncé pour l'armure
    ctx.fillRect(drawX, drawY, width, height);
    
    // Casque
    ctx.fillStyle = '#5c4a2a';
    ctx.fillRect(drawX + 5, drawY - 10, width - 10, 15);
    
    // Visière du casque
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(drawX + 15, drawY - 5, 10, 5);
    
    // Jetpack (steampunk)
    ctx.fillStyle = '#4a3c2a'; // Marron métallique
    ctx.fillRect(drawX + 5, drawY + height - 5, width - 10, 25);
    
    // Détail du jetpack (tuyères)
    ctx.fillStyle = '#d4a76a'; // Or/cuivre
    if (facingRight) {
        ctx.fillRect(drawX + width - 15, drawY + height, 10, 15);
        ctx.fillRect(drawX + width - 20, drawY + height + 5, 5, 5);
    } else {
        ctx.fillRect(drawX, drawY + height, 10, 15);
        ctx.fillRect(drawX + 5, drawY + height + 5, 5, 5);
    }
    
    // Bras
    ctx.fillStyle = '#3a2e1e';
    if (facingRight) {
        ctx.fillRect(drawX + width - 5, drawY + 15, 10, 15); // Bras droit
        ctx.fillRect(drawX - 5, drawY + 15, 10, 15); // Bras gauche
    } else {
        ctx.fillRect(drawX + width - 5, drawY + 15, 10, 15); // Bras gauche
        ctx.fillRect(drawX - 5, drawY + 15, 10, 15); // Bras droit
    }
    
    // Jambes
    ctx.fillStyle = '#3a2e1e';
    ctx.fillRect(drawX + 5, drawY + height - 20, 10, 20); // Jambe gauche
    ctx.fillRect(drawX + width - 15, drawY + height - 20, 10, 20); // Jambe droite
    
    // Épée (accrochée à la ceinture)
    ctx.fillStyle = '#8a8a8a';
    if (facingRight) {
        ctx.fillRect(drawX + width - 5, drawY + 25, 5, 20);
    } else {
        ctx.fillRect(drawX - 5, drawY + 25, 5, 20);
    }
    
    // Flamme du jetpack (si activé)
    if (gameState.keys.shift && gameState.fuel > 0) {
        ctx.fillStyle = '#ff6b35';
        if (facingRight) {
            ctx.beginPath();
            ctx.moveTo(drawX + width - 10, drawY + height + 15);
            ctx.lineTo(drawX + width - 20, drawY + height + 25);
            ctx.lineTo(drawX + width - 15, drawY + height + 30);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(drawX + 10, drawY + height + 15);
            ctx.lineTo(drawX + 20, drawY + height + 25);
            ctx.lineTo(drawX + 15, drawY + height + 30);
            ctx.closePath();
            ctx.fill();
        }
    }
}

// ============================================
// Dessiner les plateformes
// ============================================
function drawPlatforms() {
    ctx.fillStyle = GAME_CONFIG.platformColor;
    gameState.platforms.forEach(platform => {
        const drawX = platform.x - GAME_CONFIG.camera.x;
        const drawY = platform.y - GAME_CONFIG.camera.y;
        
        // Ne dessiner que les plateformes visibles à l'écran
        if (drawX + platform.width < 0 || drawX > GAME_CONFIG.camera.width) return;
        if (drawY + platform.height < 0 || drawY > GAME_CONFIG.camera.height) return;
        
        ctx.fillRect(drawX, drawY, platform.width, platform.height);
        
        // Ajouter des détails pour un look steampunk
        ctx.strokeStyle = '#8a7b5a';
        ctx.lineWidth = 2;
        ctx.strokeRect(drawX, drawY, platform.width, platform.height);
        
        // Boulons sur les plateformes
        ctx.fillStyle = '#3a3a3a';
        for (let i = 0; i < platform.width; i += 30) {
            ctx.beginPath();
            ctx.arc(drawX + i + 10, drawY + 10, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// ============================================
// Dessiner les pièces
// ============================================
function drawCoins() {
    gameState.coins.forEach(coin => {
        if (!coin.collected) {
            const drawX = coin.x - GAME_CONFIG.camera.x;
            const drawY = coin.y - GAME_CONFIG.camera.y;
            
            // Ne dessiner que les pièces visibles à l'écran
            if (drawX + coin.width < 0 || drawX > GAME_CONFIG.camera.width) return;
            if (drawY + coin.height < 0 || drawY > GAME_CONFIG.camera.height) return;
            
            // Corps de la pièce (sac)
            ctx.fillStyle = GAME_CONFIG.coinColor;
            ctx.beginPath();
            ctx.arc(drawX + coin.width / 2, drawY + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Détail du sac
            ctx.strokeStyle = '#8a7b5a';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(drawX + coin.width / 2, drawY + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
            ctx.stroke();
            
            // Cordon du sac
            ctx.strokeStyle = '#5c4a2a';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(drawX + coin.width / 2, drawY);
            ctx.lineTo(drawX + coin.width / 2, drawY - 5);
            ctx.stroke();
            
            // Symbole de pièce sur le sac
            ctx.fillStyle = '#1a1a1a';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('$', drawX + coin.width / 2, drawY + coin.height / 2 + 3);
        }
    });
}

// ============================================
// Dessiner les tonneaux
// ============================================
function drawBarrels() {
    gameState.barrels.forEach(barrel => {
        const drawX = barrel.x - GAME_CONFIG.camera.x;
        const drawY = barrel.y - GAME_CONFIG.camera.y;
        
        // Ne dessiner que les tonneaux visibles à l'écran
        if (drawX + barrel.width < 0 || drawX > GAME_CONFIG.camera.width) return;
        if (drawY + barrel.height < 0 || drawY > GAME_CONFIG.camera.height) return;
        
        // Corps du tonneau
        ctx.fillStyle = GAME_CONFIG.barrelColor;
        ctx.beginPath();
        ctx.arc(drawX + barrel.width / 2, drawY + barrel.height / 2, barrel.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Cercles métalliques du tonneau
        ctx.strokeStyle = '#3a3a3a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(drawX + barrel.width / 2, drawY + barrel.height / 2, barrel.width / 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Détail des cercles
        ctx.strokeStyle = '#8a7b5a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(drawX + barrel.width / 2, drawY + barrel.height / 2, barrel.width / 2 - 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Lignes verticales pour un look tonneau
        ctx.strokeStyle = '#5c4a2a';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const x1 = drawX + barrel.width / 2 + Math.cos(angle) * (barrel.width / 2 - 3);
            const y1 = drawY + barrel.height / 2 + Math.sin(angle) * (barrel.height / 2 - 3);
            const x2 = drawX + barrel.width / 2 + Math.cos(angle) * (barrel.width / 2 + 3);
            const y2 = drawY + barrel.height / 2 + Math.sin(angle) * (barrel.height / 2 + 3);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    });
}

// ============================================
// Dessiner le fond
// ============================================
function drawBackground() {
    // Fond principal
    ctx.fillStyle = GAME_CONFIG.backgroundColor;
    ctx.fillRect(0, 0, GAME_CONFIG.camera.width, GAME_CONFIG.camera.height);
    
    // Étoiles ou éléments de fond
    ctx.fillStyle = 'rgba(212, 167, 106, 0.1)';
    for (let i = 0; i < 100; i++) {
        const x = (i * 24) % GAME_CONFIG.camera.width;
        const y = Math.random() * GAME_CONFIG.camera.height;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Lignes de fond pour donner de la profondeur
    ctx.strokeStyle = 'rgba(92, 74, 42, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 14; i++) {
        const y = i * 60;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(GAME_CONFIG.camera.width, y);
        ctx.stroke();
    }
}

// ============================================
// Mettre à jour l'interface utilisateur
// ============================================
function updateUI() {
    fuelBar.value = gameState.fuel;
    fuelValue.textContent = `${Math.round(gameState.fuel)}%`;
    scoreValue.textContent = gameState.score;
    livesValue.textContent = `❤️ ${gameState.player.lives}`;
    
    // Changer la couleur de la barre de carburant en fonction du niveau
    if (gameState.fuel < 20) {
        fuelBar.style.accentColor = '#ff3333';
    } else if (gameState.fuel < 50) {
        fuelBar.style.accentColor = '#ff9933';
    } else {
        fuelBar.style.accentColor = '#d4a76a';
    }
}

// ============================================
// Mettre à jour la caméra
// ============================================
function updateCamera() {
    const player = gameState.player;
    
    // Centrer la caméra sur le joueur (horizontalement)
    const centerX = player.x + player.width / 2;
    const cameraCenterX = GAME_CONFIG.camera.x + GAME_CONFIG.camera.width / 2;
    
    // Déplacer la caméra pour suivre le joueur
    if (centerX > cameraCenterX + 100) {
        GAME_CONFIG.camera.x = centerX - GAME_CONFIG.camera.width / 2;
    } else if (centerX < cameraCenterX - 100) {
        GAME_CONFIG.camera.x = centerX - GAME_CONFIG.camera.width / 2;
    }
    
    // Limiter la caméra aux limites du monde
    if (GAME_CONFIG.camera.x < 0) {
        GAME_CONFIG.camera.x = 0;
    }
    if (GAME_CONFIG.camera.x + GAME_CONFIG.camera.width > gameState.worldWidth) {
        GAME_CONFIG.camera.x = gameState.worldWidth - GAME_CONFIG.camera.width;
    }
    
    // Limiter la caméra verticalement (le monde fait 800px de haut)
    if (GAME_CONFIG.camera.y < 0) {
        GAME_CONFIG.camera.y = 0;
    }
    if (GAME_CONFIG.camera.y + GAME_CONFIG.camera.height > gameState.worldHeight) {
        GAME_CONFIG.camera.y = gameState.worldHeight - GAME_CONFIG.camera.height;
    }
}

// ============================================
// Vérifier les collisions avec les pièces
// ============================================
function checkCoinCollisions() {
    const player = gameState.player;
    
    gameState.coins.forEach(coin => {
        if (!coin.collected) {
            if (
                player.x < coin.x + coin.width &&
                player.x + player.width > coin.x &&
                player.y < coin.y + coin.height &&
                player.y + player.height > coin.y
            ) {
                coin.collected = true;
                gameState.score += GAME_CONFIG.coinValue;
            }
        }
    });
}

// ============================================
// Vérifier les collisions avec les tonneaux
// ============================================
function checkBarrelCollisions() {
    const player = gameState.player;
    
    for (let i = gameState.barrels.length - 1; i >= 0; i--) {
        const barrel = gameState.barrels[i];
        
        // Collision avec le joueur
        if (
            player.x < barrel.x + barrel.width &&
            player.x + player.width > barrel.x &&
            player.y < barrel.y + barrel.height &&
            player.y + player.height > barrel.y
        ) {
            if (!player.invulnerable) {
                player.lives--;
                player.invulnerable = true;
                player.invulnerabilityTimer = 120; // 2 secondes d'invulnérabilité (60 FPS)
                
                // Réinitialiser le joueur s'il n'a plus de vies
                if (player.lives <= 0) {
                    resetPlayer();
                } else {
                    // Faire reculer le joueur
                    if (player.x + player.width / 2 < barrel.x + barrel.width / 2) {
                        player.x = barrel.x - player.width - 5;
                    } else {
                        player.x = barrel.x + barrel.width + 5;
                    }
                    player.velocityY = -5; // Petit saut pour éviter le tonneau
                }
            }
            
            // Retirer le tonneau après collision
            gameState.barrels.splice(i, 1);
        }
        
        // Collision avec les plateformes (pour que les tonneaux roulent)
        let onPlatform = false;
        for (const platform of gameState.platforms) {
            if (
                barrel.x < platform.x + platform.width &&
                barrel.x + barrel.width > platform.x &&
                barrel.y + barrel.height >= platform.y &&
                barrel.y + barrel.height <= platform.y + 10
            ) {
                // Le tonneau est sur une plateforme
                barrel.y = platform.y - barrel.height;
                barrel.velocityY = 0;
                onPlatform = true;
                
                // Inverser la direction si le tonneau atteint le bord d'une plateforme
                if (barrel.x <= platform.x || barrel.x + barrel.width >= platform.x + platform.width) {
                    barrel.velocityX *= -1;
                }
            }
        }
        
        // Si le tonneau n'est pas sur une plateforme, appliquer la gravité
        if (!onPlatform) {
            barrel.velocityY += GAME_CONFIG.gravity * 0.5;
        }
        
        // Collision avec les bords de l'écran (monde)
        if (barrel.x <= 0 || barrel.x + barrel.width >= gameState.worldWidth) {
            barrel.velocityX *= -1;
        }
        
        // Si le tonneau tombe hors de l'écran, le retirer
        if (barrel.y > gameState.worldHeight) {
            gameState.barrels.splice(i, 1);
        }
    }
}

// ============================================
// Vérifier les collisions avec les plateformes
// ============================================
function checkPlatformCollisions() {
    const player = gameState.player;
    let isOnGround = false;
    
    // Réinitialiser l'état de saut et de sol
    player.isOnGround = false;
    
    // Vérifier les collisions avec les plateformes
    for (const platform of gameState.platforms) {
        // Collision horizontale
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y
        ) {
            // Collision par le bas (atterrissage sur la plateforme)
            if (player.velocityY > 0 && player.y + player.height >= platform.y && player.y + player.height <= platform.y + 10) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isOnGround = true;
                isOnGround = true;
            }
            
            // Collision par le haut
            if (player.velocityY < 0 && player.y <= platform.y + platform.height && player.y >= platform.y) {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
            }
            
            // Collision à gauche
            if (player.velocityX < 0 && player.x <= platform.x + platform.width && player.x >= platform.x) {
                player.x = platform.x - player.width;
                player.velocityX = 0;
            }
            
            // Collision à droite
            if (player.velocityX > 0 && player.x + player.width >= platform.x && player.x <= platform.x) {
                player.x = platform.x + platform.width;
                player.velocityX = 0;
            }
        }
    }
    
    // Vérifier si le joueur tombe hors du monde
    if (player.y > gameState.worldHeight) {
        player.lives--;
        if (player.lives <= 0) {
            resetPlayer();
        } else {
            resetPlayerPosition();
        }
    }
    
    // Mettre à jour l'état de saut
    if (!isOnGround && player.velocityY >= 0) {
        player.isJumping = true;
    } else {
        player.isJumping = false;
    }
    
    // Mettre à jour l'état au sol
    player.isOnGround = isOnGround;
}

// ============================================
// Vérifier toutes les collisions
// ============================================
function checkCollisions() {
    checkPlatformCollisions();
    checkCoinCollisions();
    checkBarrelCollisions();
}

// ============================================
// Réinitialiser le joueur complètement
// ============================================
function resetPlayer() {
    gameState.player.x = 100;
    gameState.player.y = 600;
    gameState.player.velocityX = 0;
    gameState.player.velocityY = 0;
    gameState.player.lives = GAME_CONFIG.playerLives;
    gameState.player.invulnerable = false;
    gameState.player.invulnerabilityTimer = 0;
    gameState.fuel = GAME_CONFIG.maxFuel;
    gameState.score = 0;
    gameState.barrels = [];
    GAME_CONFIG.camera.x = 0;
    GAME_CONFIG.camera.y = 0;
    
    // Réinitialiser les pièces
    gameState.coins.forEach(coin => {
        coin.collected = false;
    });
}

// ============================================
// Réinitialiser seulement la position du joueur
// ============================================
function resetPlayerPosition() {
    gameState.player.x = Math.max(100, GAME_CONFIG.camera.x + 100);
    gameState.player.y = 600;
    gameState.player.velocityX = 0;
    gameState.player.velocityY = 0;
    gameState.player.invulnerable = true;
    gameState.player.invulnerabilityTimer = 120;
}

// ============================================
// Spawner un tonneau
// ============================================
function spawnBarrel() {
    // Choisir une plateforme aléatoire (sauf le sol)
    const platformIndex = Math.floor(Math.random() * (gameState.platforms.length - 1));
    const platform = gameState.platforms[platformIndex];
    
    // Position aléatoire sur la plateforme
    const x = platform.x + Math.random() * (platform.width - GAME_CONFIG.barrelWidth);
    const y = platform.y - GAME_CONFIG.barrelHeight;
    
    // Direction aléatoire
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    gameState.barrels.push({
        x: x,
        y: y,
        width: GAME_CONFIG.barrelWidth,
        height: GAME_CONFIG.barrelHeight,
        velocityX: GAME_CONFIG.barrelSpeed * direction,
        velocityY: 0
    });
}

// ============================================
// Mettre à jour les tonneaux
// ============================================
function updateBarrels() {
    gameState.barrels.forEach(barrel => {
        barrel.x += barrel.velocityX;
        barrel.y += barrel.velocityY;
    });
}

// ============================================
// Mettre à jour le joueur
// ============================================
function updatePlayer() {
    const player = gameState.player;
    
    // Gérer l'invulnérabilité
    if (player.invulnerable) {
        player.invulnerabilityTimer--;
        if (player.invulnerabilityTimer <= 0) {
            player.invulnerable = false;
        }
    }
    
    // Déplacement horizontal
    if (gameState.keys.left) {
        player.velocityX = -GAME_CONFIG.playerSpeed;
        player.facingRight = false;
    } else if (gameState.keys.right) {
        player.velocityX = GAME_CONFIG.playerSpeed;
        player.facingRight = true;
    } else {
        player.velocityX = 0;
    }
    
    // Saut
    if ((gameState.keys.up || gameState.keys.space) && player.isOnGround) {
        player.velocityY = GAME_CONFIG.jumpForce;
        player.isOnGround = false;
        player.isJumping = true;
    }
    
    // Jetpack
    if (gameState.keys.shift && gameState.fuel > 0) {
        player.velocityY += GAME_CONFIG.jetpackForce;
        gameState.fuel -= GAME_CONFIG.fuelConsumptionRate;
        
        // Limiter la vitesse verticale avec le jetpack
        if (player.velocityY < -8) {
            player.velocityY = -8;
        }
    } else {
        // Régénérer le carburant lentement quand le jetpack n'est pas utilisé
        if (gameState.fuel < GAME_CONFIG.maxFuel) {
            gameState.fuel += GAME_CONFIG.fuelRegenerationRate;
            if (gameState.fuel > GAME_CONFIG.maxFuel) {
                gameState.fuel = GAME_CONFIG.maxFuel;
            }
        }
    }
    
    // Appliquer la gravité
    if (!player.isOnGround) {
        player.velocityY += GAME_CONFIG.gravity;
    }
    
    // Limiter la vitesse de chute
    if (player.velocityY > 15) {
        player.velocityY = 15;
    }
    
    // Mettre à jour la position du joueur
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // Empêcher le joueur de sortir des limites du monde horizontalement
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > gameState.worldWidth) {
        player.x = gameState.worldWidth - player.width;
    }
}

// ============================================
// Mettre à jour le jeu
// ============================================
function updateGame() {
    gameState.frameCount++;
    
    // Spawner un tonneau périodiquement
    if (gameState.frameCount % GAME_CONFIG.barrelSpawnRate === 0) {
        spawnBarrel();
    }
    
    // Mettre à jour le joueur
    updatePlayer();
    
    // Mettre à jour les tonneaux
    updateBarrels();
    
    // Mettre à jour la caméra
    updateCamera();
    
    // Vérifier les collisions
    checkCollisions();
    
    // Mettre à jour le score (basé sur la hauteur + pièces)
    gameState.score = Math.max(0, Math.floor((gameState.worldHeight - gameState.player.y) / 5));
    
    // Mettre à jour l'interface utilisateur
    updateUI();
}

// ============================================
// Dessiner le jeu
// ============================================
function drawGame() {
    drawBackground();
    drawPlatforms();
    drawCoins();
    drawBarrels();
    drawPlayer();
}

// ============================================
// Boucle principale du jeu
// ============================================
function gameLoop() {
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// ============================================
// Gestion des entrées clavier
// ============================================
function setupEventListeners() {
    // Touches enfoncées
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
                gameState.keys.left = true;
                break;
            case 'ArrowRight':
            case 'd':
                gameState.keys.right = true;
                break;
            case 'ArrowUp':
            case 'w':
            case ' ':
                gameState.keys.up = true;
                gameState.keys.space = true;
                break;
            case 'Shift':
                gameState.keys.shift = true;
                break;
            case 'r':
            case 'R':
                resetPlayer();
                break;
        }
    });
    
    // Touches relâchées
    document.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
                gameState.keys.left = false;
                break;
            case 'ArrowRight':
            case 'd':
                gameState.keys.right = false;
                break;
            case 'ArrowUp':
            case 'w':
                gameState.keys.up = false;
                break;
            case ' ':
                gameState.keys.space = false;
                break;
            case 'Shift':
                gameState.keys.shift = false;
                break;
        }
    });
}

// ============================================
// Démarrer le jeu
// ============================================
window.addEventListener('load', () => {
    initGame();
    setupEventListeners();
});
