// ============================================
// Jeu de Plateforme : Chevalier Steampunk
// ============================================

// Configuration du jeu
const GAME_CONFIG = {
    width: 800,
    height: 600,
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
    playerHeight: 60
};

// État du jeu
const gameState = {
    player: {
        x: 100,
        y: 300,
        width: GAME_CONFIG.playerWidth,
        height: GAME_CONFIG.playerHeight,
        velocityX: 0,
        velocityY: 0,
        isJumping: false,
        isOnGround: false,
        facingRight: true
    },
    platforms: [
        { x: 0, y: 500, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 250, y: 400, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 500, y: 300, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 300, y: 200, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 100, y: 150, width: 200, height: GAME_CONFIG.platformHeight },
        { x: 600, y: 450, width: 150, height: GAME_CONFIG.platformHeight },
        { x: 0, y: 580, width: 800, height: GAME_CONFIG.platformHeight } // Sol
    ],
    fuel: GAME_CONFIG.maxFuel,
    score: 0,
    keys: {
        left: false,
        right: false,
        up: false,
        space: false,
        shift: false
    },
    lastTime: 0
};

// Éléments DOM
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const fuelBar = document.getElementById('fuel-bar');
const fuelValue = document.getElementById('fuel-value');
const scoreValue = document.getElementById('score-value');

// Initialisation du canvas
canvas.width = GAME_CONFIG.width;
canvas.height = GAME_CONFIG.height;

// ============================================
// Dessiner le joueur (chevalier avec jetpack)
// ============================================
function drawPlayer() {
    const { x, y, width, height, facingRight } = gameState.player;
    
    // Corps du chevalier
    ctx.fillStyle = '#3a2e1e'; // Marron foncé pour l'armure
    ctx.fillRect(x, y, width, height);
    
    // Casque
    ctx.fillStyle = '#5c4a2a';
    ctx.fillRect(x + 5, y - 10, width - 10, 15);
    
    // Visière du casque
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x + 15, y - 5, 10, 5);
    
    // Jetpack (steampunk)
    ctx.fillStyle = '#4a3c2a'; // Marron métallique
    ctx.fillRect(x + 5, y + height - 5, width - 10, 25);
    
    // Détail du jetpack (tuyères)
    ctx.fillStyle = '#d4a76a'; // Or/cuivre
    if (facingRight) {
        ctx.fillRect(x + width - 15, y + height, 10, 15);
        ctx.fillRect(x + width - 20, y + height + 5, 5, 5);
    } else {
        ctx.fillRect(x, y + height, 10, 15);
        ctx.fillRect(x + 5, y + height + 5, 5, 5);
    }
    
    // Bras
    ctx.fillStyle = '#3a2e1e';
    if (facingRight) {
        ctx.fillRect(x + width - 5, y + 15, 10, 15); // Bras droit
        ctx.fillRect(x - 5, y + 15, 10, 15); // Bras gauche
    } else {
        ctx.fillRect(x + width - 5, y + 15, 10, 15); // Bras gauche
        ctx.fillRect(x - 5, y + 15, 10, 15); // Bras droit
    }
    
    // Jambes
    ctx.fillStyle = '#3a2e1e';
    ctx.fillRect(x + 5, y + height - 20, 10, 20); // Jambe gauche
    ctx.fillRect(x + width - 15, y + height - 20, 10, 20); // Jambe droite
    
    // Épée (accrochée à la ceinture)
    ctx.fillStyle = '#8a8a8a';
    if (facingRight) {
        ctx.fillRect(x + width - 5, y + 25, 5, 20);
    } else {
        ctx.fillRect(x - 5, y + 25, 5, 20);
    }
    
    // Flamme du jetpack (si activé)
    if (gameState.keys.shift && gameState.fuel > 0) {
        ctx.fillStyle = '#ff6b35';
        if (facingRight) {
            ctx.beginPath();
            ctx.moveTo(x + width - 10, y + height + 15);
            ctx.lineTo(x + width - 20, y + height + 25);
            ctx.lineTo(x + width - 15, y + height + 30);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(x + 10, y + height + 15);
            ctx.lineTo(x + 20, y + height + 25);
            ctx.lineTo(x + 15, y + height + 30);
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
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Ajouter des détails pour un look steampunk
        ctx.strokeStyle = '#8a7b5a';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        
        // Boulons sur les plateformes
        ctx.fillStyle = '#3a3a3a';
        for (let i = 0; i < platform.width; i += 30) {
            ctx.beginPath();
            ctx.arc(platform.x + i + 10, platform.y + 10, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// ============================================
// Dessiner le fond
// ============================================
function drawBackground() {
    // Fond principal
    ctx.fillStyle = GAME_CONFIG.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Étoiles ou éléments de fond
    ctx.fillStyle = 'rgba(212, 167, 106, 0.1)';
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Lignes de fond pour donner de la profondeur
    ctx.strokeStyle = 'rgba(92, 74, 42, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
        const y = i * 60;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
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
// Vérifier les collisions
// ============================================
function checkCollisions() {
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
    
    // Vérifier si le joueur tombe hors de l'écran
    if (player.y > canvas.height) {
        resetPlayer();
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
// Réinitialiser le joueur
// ============================================
function resetPlayer() {
    gameState.player.x = 100;
    gameState.player.y = 300;
    gameState.player.velocityX = 0;
    gameState.player.velocityY = 0;
    gameState.fuel = GAME_CONFIG.maxFuel;
    gameState.score = 0;
}

// ============================================
// Mettre à jour le jeu
// ============================================
function updateGame(timestamp) {
    const deltaTime = timestamp - gameState.lastTime;
    gameState.lastTime = timestamp;
    
    const player = gameState.player;
    
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
    if (gameState.keys.shift && gameState.fuel > 0 && !player.isOnGround) {
        player.velocityY += GAME_CONFIG.jetpackForce;
        gameState.fuel -= GAME_CONFIG.fuelConsumptionRate;
        
        // Limiter la vitesse verticale avec le jetpack
        if (player.velocityY < -5) {
            player.velocityY = -5;
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
    if (player.velocityY > 10) {
        player.velocityY = 10;
    }
    
    // Mettre à jour la position du joueur
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // Empêcher le joueur de sortir de l'écran horizontalement
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
    
    // Vérifier les collisions
    checkCollisions();
    
    // Mettre à jour le score (basé sur la hauteur)
    gameState.score = Math.max(0, Math.floor((canvas.height - player.y) / 10));
    
    // Mettre à jour l'interface utilisateur
    updateUI();
}

// ============================================
// Dessiner le jeu
// ============================================
function drawGame() {
    drawBackground();
    drawPlatforms();
    drawPlayer();
}

// ============================================
// Boucle principale du jeu
// ============================================
function gameLoop(timestamp) {
    updateGame(timestamp);
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
// Initialisation du jeu
// ============================================
function initGame() {
    setupEventListeners();
    updateUI();
    requestAnimationFrame(gameLoop);
}

// Démarrer le jeu quand la page est chargée
window.addEventListener('load', initGame);
