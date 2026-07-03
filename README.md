# Chevalier Steampunk - Jeu de Plateforme

Un jeu de plateforme 2D où vous incarnez un chevalier médiéval équipé d'un jetpack steampunk ! Collectez des pièces et évitez les tonneaux qui roulent.

## 🎮 Comment jouer

1. **Ouvrir le jeu** :
   - Téléchargez ou clonez ce dépôt.
   - Ouvrez le fichier `index.html` dans votre navigateur web (Chrome, Firefox, Edge, etc.).
   - Le jeu se lance automatiquement.

2. **Contrôles** :
   - **→ (Flèche droite) ou D** : Se déplacer vers la droite.
   - **← (Flèche gauche) ou A** : Se déplacer vers la gauche.
   - **↑ (Flèche haut), W ou Espace** : Sauter.
   - **Maj (Shift)** : Activer le jetpack (consomme du carburant).
   - **R** : Réinitialiser le niveau (retour à la position de départ).

3. **Objectifs** :
   - **Collectez les sacs de pièces** (💰) : Chaque pièce rapporte **10 points**.
   - **Évitez les tonneaux** (🛢️) : Ils roulent sur les plateformes et peuvent vous blesser !
   - **Survivez** : Vous avez **3 vies**. Si un tonneau vous touche, vous perdez une vie.
   - **Atteignez le haut** : Plus vous montez, plus votre score augmente.


## 🏗️ Structure du projet

```
.
├── index.html          # Structure HTML de la page
├── style.css           # Styles CSS pour l'interface
├── game.js             # Logique du jeu (moteur, collisions, etc.)
└── README.md           # Documentation (ce fichier)
```


## 🎨 Design

- **Thème** : Médiéval steampunk (armure marron, jetpack en cuivre/or).
- **Personnage** : Chevalier avec armure, casque, épée et jetpack steampunk.
- **Pièces** : Sacs dorés avec un symbole `$`.
- **Tonneaux** : Tonneaux en bois avec cercles métalliques, qui roulent et tombent.

### Couleurs :
| Élément          | Couleur       | Code Hex  |
|------------------|---------------|-----------|
| Fond             | Noir profond  | `#121212` |
| Plateformes      | Marron foncé   | `#5c4a2a` |
| Jetpack          | Or/cuivre      | `#d4a76a` |
| Armure           | Marron         | `#3a2e1e` |
| Pièces           | Or             | `#d4a76a` |
| Tonneaux         | Marron clair   | `#4a3c2a` |
| Vies (cœur)      | Orange         | `#ff6b35` |


## 🛠️ Personnalisation

Vous pouvez modifier les paramètres du jeu dans le fichier `game.js` :

### Configuration du jeu
```javascript
const GAME_CONFIG = {
    width: 800,           // Largeur du canvas
    height: 600,          // Hauteur du canvas
    gravity: 0.8,         // Force de la gravité
    jumpForce: -12,       // Force du saut (négatif = vers le haut)
    jetpackForce: -0.5,   // Force du jetpack (négatif = vers le haut)
    maxFuel: 100,         // Carburant maximum
    fuelConsumptionRate: 0.5,  // Taux de consommation du carburant
    fuelRegenerationRate: 0.1, // Taux de régénération du carburant
    playerSpeed: 5,       // Vitesse de déplacement du joueur
    platformHeight: 20,   // Hauteur des plateformes
    platformColor: '#5c4a2a', // Couleur des plateformes
    backgroundColor: '#121212', // Couleur de fond
    playerWidth: 40,      // Largeur du joueur
    playerHeight: 60,     // Hauteur du joueur
    coinSize: 20,         // Taille des pièces
    coinColor: '#d4a76a', // Couleur des pièces
    coinValue: 10,        // Valeur d'une pièce en points
    barrelWidth: 30,      // Largeur des tonneaux
    barrelHeight: 30,     // Hauteur des tonneaux
    barrelColor: '#4a3c2a', // Couleur des tonneaux
    barrelSpeed: 2,       // Vitesse des tonneaux
    barrelSpawnRate: 120, // Frames entre chaque spawn de tonneau (60 FPS = 2 secondes)
    playerLives: 3        // Nombre de vies du joueur
};
```

### Niveaux
Les plateformes sont définies dans `gameState.platforms` :
```javascript
platforms: [
    { x: 0, y: 500, width: 200, height: GAME_CONFIG.platformHeight },
    { x: 250, y: 400, width: 200, height: GAME_CONFIG.platformHeight },
    // Ajoutez ou modifiez les plateformes ici
]
```

### Pièces
Les pièces sont définies dans `gameState.coins` :
```javascript
coins: [
    { x: 50, y: 480, width: GAME_CONFIG.coinSize, height: GAME_CONFIG.coinSize, collected: false },
    // Ajoutez ou modifiez les pièces ici
]
```


## 🎯 Mécaniques de Jeu

### Système de Vies
- Le joueur commence avec **3 vies** (`playerLives: 3`).
- Si un **tonneau** touche le joueur, il perd **1 vie** et devient temporairement **invulnérable** (2 secondes).
- Si le joueur tombe hors de l'écran, il perd **1 vie** et est réinitialisé.
- Si les vies tombent à **0**, le jeu est réinitialisé complètement.

### Système de Pièces
- Chaque **sac de pièces** rapporte **10 points** (`coinValue: 10`).
- Les pièces disparaissent quand elles sont collectées.
- Le score est aussi basé sur la **hauteur** du joueur (plus vous montez, plus le score augmente).

### Système de Tonneaux
- Les tonneaux **spawnent aléatoirement** toutes les `barrelSpawnRate` frames (2 secondes par défaut).
- Ils **roulent** sur les plateformes avec une vitesse de `barrelSpeed` (2 par défaut).
- Ils **tombent** si ils atteignent le bord d'une plateforme.
- Ils **inversent leur direction** s'ils touchent un bord de plateforme ou de l'écran.
- Ils **disparaissent** s'ils tombent hors de l'écran.

### Système de Jetpack
- Le jetpack consomme du **carburant** (`fuelConsumptionRate: 0.5` par frame).
- Le carburant se **régénère lentement** quand le jetpack n'est pas utilisé (`fuelRegenerationRate: 0.1` par frame).
- La barre de carburant change de couleur :
  - **Or** (`#d4a76a`) : Carburant > 50%
  - **Orange** (`#ff9933`) : Carburant entre 20% et 50%
  - **Rouge** (`#ff3333`) : Carburant < 20%


## 🚀 Fonctionnalités futures (idées)

- [ ] Ajouter des **ennemis mobiles** (fantômes, squelettes).
- [ ] Ajouter des **bonus** (carburant supplémentaire, vie supplémentaire).
- [ ] Ajouter des **niveaux multiples** avec des portes.
- [ ] Ajouter des **animations** pour le personnage (course, saut, jetpack).
- [ ] Ajouter des **sons** (saut, jetpack, pièce collectée, tonneau touché).
- [ ] Sauvegarder le **score maximum** dans le localStorage.
- [ ] Ajouter un **menu principal** et un écran de game over.
- [ ] Ajouter des **pièges** (lames, fosses).
- [ ] Ajouter un **système de power-ups** (double saut, jetpack amélioré).


## 📜 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, le modifier et le distribuer comme vous le souhaitez.


## 🙏 Remerciements

- Inspiré par les jeux de plateforme classiques comme *Mario*, *Donkey Kong* et *Celeste*.
- Design steampunk inspiré par l'univers de *Bioshock Infinite* et *Dishonored*.
