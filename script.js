// Attend que le DOM soit entièrement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("card-container");
  const counterDisplay = document.getElementById("moves-counter");
  const bestScoreDisplay = document.getElementById("best-score");
  const chrono = document.getElementById("chrono");
  const resetBtn = document.getElementById("reset");
  const scoreDisplay = document.getElementById("score-counter");

// Variables de jeu
  let movesCounter = 0;   // Compteur de coups
  let flippedCards = [];  // Cartes retournées
  let matchedPairs = 0;   // Nombre de paires trouvées
  let score = 0; // Score 

// Variables de chronomètre
  let heures = 0;
  let minutes = 0;
  let secondes = 0;
  let timeout;
  let estArrete = true; // Indicateur d'arrêt du chronomètre

// Affichage du meilleur score
  let bestScore = localStorage.getItem("bestScore");
  bestScoreDisplay.textContent = bestScore ? bestScore : "--";

// Démarre le chronomètre si ce n'est pas déjà fait
  const demarrerChrono = () => {
    if (estArrete) {
      estArrete = false;
      defilerTemps();
    }
  };

// Arrête le chronomètre
  const arreterChrono = () => {
    estArrete = true;
    clearTimeout(timeout);
  };

// Fonction pour faire défiler le temps
  const defilerTemps = () => {
    if (estArrete) return;

    secondes++;
    if (secondes === 60) {
      minutes++;
      secondes = 0;
    }
    if (minutes === 60) {
      heures++;
      minutes = 0;
    }

// Formatage de l'affichage du chronomètre
    const minStr = minutes < 10 ? "0" + minutes : minutes;
    const secStr = secondes < 10 ? "0" + secondes : secondes;
    chrono.textContent = `${minStr}:${secStr}`;

    timeout = setTimeout(defilerTemps, 1000);
  };

// Réinitialise le chronomètre
  const resetChrono = () => {
    chrono.textContent = "00:00";
    estArrete = true;
    heures = 0;
    minutes = 0;
    secondes = 0;
    clearTimeout(timeout);
  };

  // Ajouter un score variable à chaque paire trouvée
const ajouterScoreVariable = () => {
  const totalSeconds = heures * 3600 + minutes * 60 + secondes;
  const points = Math.max(150 - (movesCounter * 2 + totalSeconds / 2), 10);
  score += Math.floor(points);
  scoreDisplay.textContent = score;
};

// Fonction pour générer les cartes d'images
  function generateImageCards() {
    const cardImages = [ // Liste complète des images disponibles
      "image/cartes_classiques/2c.gif",
      "image/cartes_classiques/2d.gif",
      "image/cartes_classiques/2h.gif",
      "image/cartes_classiques/2s.gif",
      "image/cartes_classiques/3c.gif",
      "image/cartes_classiques/3d.gif",
      "image/cartes_classiques/3h.gif",
      "image/cartes_classiques/3s.gif",
      "image/cartes_classiques/4c.gif",
      "image/cartes_classiques/4d.gif",
      "image/cartes_classiques/4h.gif",
      "image/cartes_classiques/4s.gif",
      "image/cartes_classiques/5c.gif",
      "image/cartes_classiques/5d.gif",
      "image/cartes_classiques/5h.gif",
      "image/cartes_classiques/5s.gif",
      "image/cartes_classiques/6c.gif",
      "image/cartes_classiques/6d.gif",
      "image/cartes_classiques/6h.gif",
      "image/cartes_classiques/6s.gif",
      "image/cartes_classiques/7c.gif",
      "image/cartes_classiques/7d.gif",
      "image/cartes_classiques/7h.gif",
      "image/cartes_classiques/7s.gif",
      "image/cartes_classiques/8c.gif",
      "image/cartes_classiques/8d.gif",
      "image/cartes_classiques/8h.gif",
      "image/cartes_classiques/8s.gif",
      "image/cartes_classiques/9c.gif",
      "image/cartes_classiques/9d.gif",
      "image/cartes_classiques/9h.gif",
      "image/cartes_classiques/9s.gif",
      "image/cartes_classiques/10c.gif",
      "image/cartes_classiques/10d.gif",
      "image/cartes_classiques/10h.gif",
      "image/cartes_classiques/10s.gif",
      "image/cartes_classiques/Jc.gif",
      "image/cartes_classiques/Jd.gif", 
      "image/cartes_classiques/Jh.gif",
      "image/cartes_classiques/Js.gif",
      "image/cartes_classiques/Qc.gif",
      "image/cartes_classiques/Qd.gif",
      "image/cartes_classiques/Qh.gif",
      "image/cartes_classiques/Qs.gif",
      "image/cartes_classiques/Kc.gif",
      "image/cartes_classiques/Kd.gif",
      "image/cartes_classiques/Kh.gif",
      "image/cartes_classiques/Ks.gif",
      "image/cartes_classiques/Ac.gif",
      "image/cartes_classiques/Ad.gif",
      "image/cartes_classiques/Ah.gif",
      "image/cartes_classiques/As.gif",
    ];

// Sélectionne 8 images aléatoires et les duplique
    const selectedImages = cardImages.slice(0, 8); 
    const imagePairs = [...selectedImages, ...selectedImages]; // Duplique les images pour créer des paires
    imagePairs.sort(() => Math.random() - 0.5); // Mélange les paires d'images

// Réinitialise le conteneur de cartes et les compteurs
    cardContainer.innerHTML = "";
    movesCounter = 0;
    matchedPairs = 0;
    counterDisplay.textContent = movesCounter;
    flippedCards = [];
    resetChrono();
    estArrete = true;

// Crée les cartes et les ajoute au conteneur
    imagePairs.forEach((imgSrc) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.value = imgSrc;

// Ajoute une image de fond pour la carte
      card.innerHTML = `
        <div class='card-inner'>
          <div class='card-front'>?</div>
          <div class='card-back'><img src="${imgSrc}" alt="carte" style="width: 80px; height: 100px;" /></div>
        </div>`;

// Ajoute un événement de clic pour retourner la carte
      card.addEventListener("click", function () {
        // Démarre le chrono au premier clic
        if (estArrete) {
          demarrerChrono();
        }

        // Ignore si la carte est déjà retournée ou si deux cartes sont déjà retournées
        if (card.classList.contains("flipped") || flippedCards.length >= 2)
          return;

        // Retourne la carte et ajoute à la liste des cartes retournées
        card.classList.add("flipped");
        flippedCards.push(card);

        // Si deux cartes sont retournées
        if (flippedCards.length === 2) {
          movesCounter++; // Incrémente le nombre de coups
          counterDisplay.textContent = movesCounter;

          const [card1, card2] = flippedCards;

          // Vérifie si les deux cartes sont identiques
          if (card1.dataset.value === card2.dataset.value) {
            matchedPairs++; // Incrémente le nombre de paires trouvées
            flippedCards = [];
            ajouterScoreVariable(); // Score dynamique ici

            // Si toutes les paires sont trouvées
            if (matchedPairs === 8) {
              arreterChrono(); // Arrête le chronomètre
              // Vérifie si c'est un nouveau meilleur score
              if (bestScore === null || movesCounter < parseInt(bestScore)) {
                localStorage.setItem("bestScore", movesCounter);
                bestScoreDisplay.textContent = movesCounter;
                alert(`Félicitations ! Nouveau meilleur score : ${movesCounter} coups.`);
              } else {
                alert(`Bravo ! Tu as terminé en ${movesCounter} coups.`);
              }
              generateImageCards(); // Relance une nouvelle partie
            }
          } else {
            // Si les cartes ne correspondent pas, les retourne après un délai
            setTimeout(() => {
              card1.classList.remove("flipped");
              card2.classList.remove("flipped");
              flippedCards = [];
            }, 1000);
          }
        }
      });

      // Ajoute la carte au conteneur
      cardContainer.appendChild(card);
    });
  }

// Réinitialise le jeu au clic sur le bouton reset
  resetBtn.addEventListener("click", () => {
    arreterChrono();
    resetChrono();
    generateImageCards();
    score = 0;
    scoreDisplay.textContent = score;
  });

// Génère les cartes au chargement initial
  generateImageCards();
});
