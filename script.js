// Attend que le DOM soit entièrement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("card-container");
  const counterDisplay = document.getElementById("moves-counter");
  const bestScoreDisplay = document.getElementById("best-score");
  const chrono = document.getElementById("chrono");
  const resetBtn = document.getElementById("reset");
  const scoreDisplay = document.getElementById("score-counter");
  const difficultySelect = document.getElementById("difficulty-select"); // Sélecteur de difficulté

  // Préparation des effets sonores
  const flipSound = new Audio("sound/return_card.wav");
  const matchSound = new Audio("sound/valid_pair.wav");
  const mismatchSound = new Audio("sound/fail_pair.mp3");

  // Fonction utilitaire pour rejouer un son sans coupure
  function playSound(sound) {
    const clone = sound.cloneNode();
    clone.play();
  }

  // Variables de jeu
  let movesCounter = 0;   // Compteur de coups
  let flippedCards = [];  // Cartes retournées
  let matchedPairs = 0;   // Nombre de paires trouvées
  let score = 0;          // Score actuel

  // Variables de chronomètre
  let heures = 0;
  let minutes = 0;
  let secondes = 0;
  let timeout;
  let estArrete = true;   // Indicateur d'arrêt du chronomètre

  // --- Gestion du meilleur score selon la difficulté sélectionnée ---
  function getBestScoreKey() {
    // Clé unique en localStorage selon le niveau (facile, normal, difficile)
    return `bestScore_${difficultySelect.value}`;
  }

  // Récupère et affiche le meilleur score pour la difficulté courante
  function loadBestScore() {
    let bestScore = localStorage.getItem(getBestScoreKey());
    bestScore = bestScore ? parseInt(bestScore) : 0;
    bestScoreDisplay.textContent = bestScore > 0 ? bestScore : "--";
    return bestScore;
  }

  let bestScore = 0; // Variable globale pour le meilleur score

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

  // Fonction pour générer les cartes d'images selon la difficulté choisie
  function generateImageCards() {
    const cardImages = [
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

    // Définit le nombre de paires selon la difficulté sélectionnée
    let pairsCount = 10; // Par défaut Normal
    if (difficultySelect.value === "facile") pairsCount = 8;
    else if (difficultySelect.value === "difficile") pairsCount = 12;

    // Nombre de colonnes fixes (par exemple 4)
    let cols = 4;

    // --- Nouvelle logique ---
    // Plus il y a de paires, plus la largeur des colonnes augmente
    let colWidth;
    if (pairsCount <= 8) colWidth = "140px";       // Facile : colonnes larges
    else if (pairsCount <= 10) colWidth = "160px"; // Normal : colonnes moyennes
    else colWidth = "180px";                        // Difficile : colonnes encore plus larges

    // Application des styles CSS dynamiques pour la grille
    cardContainer.style.display = "grid";
    cardContainer.style.gridTemplateColumns = `repeat(${cols}, ${colWidth})`;

    // Hauteur des lignes proportionnelle à la largeur (ex: 1.25 fois la largeur)
    const colWidthNum = parseInt(colWidth);
    cardContainer.style.gridAutoRows = `${Math.floor(colWidthNum * 1.25)}px`;

    // Sélection des images à utiliser
    const selectedImages = cardImages.slice(0, pairsCount);
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
    score = 0;
    scoreDisplay.textContent = score;

    // Crée les cartes et les ajoute au conteneur
    imagePairs.forEach((imgSrc) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.value = imgSrc;

      card.innerHTML = `
        <div class='card-inner'>
          <div class='card-front'>?</div>
          <div class='card-back'><img src="${imgSrc}" alt="carte" style="width: 80px; height: 100px;" /></div>
        </div>`;

      // Ajoute un événement de clic pour retourner la carte
      card.addEventListener("click", function () {
        // Démarre le chrono au premier clic
        if (estArrete) demarrerChrono();

        // Ignore si la carte est déjà retournée ou si deux cartes sont déjà retournées
        if (card.classList.contains("flipped") || flippedCards.length >= 2) return;

        // Retourne la carte et ajoute à la liste des cartes retournées
        card.classList.add("flipped");
        flippedCards.push(card);
        playSound(flipSound); // Joue le son de retournement

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
            playSound(matchSound); // Joue le son de correspondance

            // Si toutes les paires sont trouvées
            if (matchedPairs === pairsCount) {
              arreterChrono(); // Arrête le chronomètre

              // Vérifie si c'est un nouveau meilleur score pour cette difficulté
              if (score > bestScore) {
                localStorage.setItem(getBestScoreKey(), score);
                bestScore = score;
                bestScoreDisplay.textContent = score;
                alert(`Félicitations ! Nouveau meilleur score (${difficultySelect.value}) : ${score} points !`);
              } else {
                alert(`Bravo ! Tu as terminé avec ${score} points.`);
              }

              generateImageCards(); // Relance une nouvelle partie
            }
          } else {
            // Si les cartes ne correspondent pas, les retourne après 1 seconde
            playSound(mismatchSound);
            setTimeout(() => {
              card1.classList.remove("flipped");
              card2.classList.remove("flipped");
              flippedCards = [];
            }, 1000);
          }
        }
      });

      cardContainer.appendChild(card);
    });

    // Met à jour le meilleur score affiché
    bestScore = loadBestScore();
  }

  // Initialise le jeu à la première ouverture
  generateImageCards();

  // Relance le jeu à chaque changement de difficulté
  difficultySelect.addEventListener("change", () => {
    generateImageCards();
  });

  // Bouton reset pour recommencer la partie
  resetBtn.addEventListener("click", () => {
    generateImageCards();
  });
});
