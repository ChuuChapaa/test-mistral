# Chevalier Steampunk - Jeu de Plateforme

Un jeu de plateforme 2D où vous incarnez un chevalier médiéval équipé d'un jetpack steampunk !

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

3. **Objectif** :
   - Explorez les plateformes et essayez d'atteindre le haut de l'écran pour maximiser votre score.
   - Utilisez le jetpack pour voler temporairement, mais attention à la consommation de carburant !
   - Le carburant se régénère lentement quand le jetpack n'est pas utilisé.


## 🏗️ Structure du projet

```
.
├── index.html          # Structure HTML de la page
├── style.css           # Styles CSS pour l'interface
├── game.js             # Logique du jeu (moteur, collisions, etc.)
└── README.md           # Documentation (ce fichier)
```


## 🛠️ Personnalisation

Vous pouvez modifier les paramètres du jeu dans le fichier `game.js` :

### Configuration du jeu (en haut du fichier `game.js`)
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
    playerHeight: 60      // Hauteur du joueur
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


## 🎨 Design

- **Thème** : Médiéval steampunk (armure marron, jetpack en cuivre/or).
- **Couleurs** :
  - Fond : Noir profond (`#121212`).
  - Plateformes : Marron foncé (`#5c4a2a`).
  - Jetpack : Or/cuivre (`#d4a76a`).
  - Armure : Marron (`#3a2e1e`).


## 🚀 Fonctionnalités futures (idées)

- [ ] Ajouter des ennemis.
- [ ] Ajouter des objets à collecter (pièces, bonus de carburant).
- [ ] Ajouter des niveaux multiples.
- [ ] Ajouter des animations pour le personnage.
- [ ] Ajouter des sons (saut, jetpack, etc.).
- [ ] Sauvegarder le score maximum.


## 📜 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, le modifier et le distribuer comme vous le souhaitez.
