// script.js

document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("card-container");
  const counterDisplay = document.getElementById("moves-counter");
  const bestScoreDisplay = document.getElementById("best-score");
  const chrono = document.getElementById("chrono");
  const resetBtn = document.getElementById("reset");

  let movesCounter = 0;
  let flippedCards = [];
  let matchedPairs = 0;

  let heures = 0;
  let minutes = 0;
  let secondes = 0;
  let timeout;
  let estArrete = true;

  let bestScore = localStorage.getItem("bestScore");
  bestScoreDisplay.textContent = bestScore ? bestScore : "--";

  const demarrerChrono = () => {
    if (estArrete) {
      estArrete = false;
      defilerTemps();
    }
  };

  const arreterChrono = () => {
    estArrete = true;
    clearTimeout(timeout);
  };

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

    const minStr = minutes < 10 ? "0" + minutes : minutes;
    const secStr = secondes < 10 ? "0" + secondes : secondes;
    chrono.textContent = `${minStr}:${secStr}`;

    timeout = setTimeout(defilerTemps, 1000);
  };

  const resetChrono = () => {
    chrono.textContent = "00:00";
    estArrete = true;
    heures = 0;
    minutes = 0;
    secondes = 0;
    clearTimeout(timeout);
  };

  function generateImageCards() {
    const cardImages = [
      "image/cartes_classiques/2c.gif",
      "image/cartes_classiques/3c.gif",
      "image/cartes_classiques/4c.gif",
      "image/cartes_classiques/5c.gif",
      "image/cartes_classiques/6c.gif",
      "image/cartes_classiques/7c.gif",
      "image/cartes_classiques/8c.gif",
      "image/cartes_classiques/9c.gif",
      "image/cartes_classiques/10c.gif",
      "image/cartes_classiques/Jc.gif",
      "image/cartes_classiques/Qc.gif",
      "image/cartes_classiques/Kc.gif",
      "image/cartes_classiques/Ac.gif",
      "image/cartes_classiques/2d.gif",
      "image/cartes_classiques/3d.gif",
      "image/cartes_classiques/4d.gif",
      "image/cartes_classiques/5d.gif",
      "image/cartes_classiques/6d.gif",
      "image/cartes_classiques/7d.gif",
      "image/cartes_classiques/8d.gif",
      "image/cartes_classiques/9d.gif",
      "image/cartes_classiques/10d.gif",
      "image/cartes_classiques/Jd.gif",
      "image/cartes_classiques/Qd.gif",
      "image/cartes_classiques/Kd.gif",
      "image/cartes_classiques/Ad.gif",
      "image/cartes_classiques/2h.gif",
      "image/cartes_classiques/3h.gif",
      "image/cartes_classiques/4h.gif",
      "image/cartes_classiques/5h.gif",
      "image/cartes_classiques/6h.gif",
      "image/cartes_classiques/7h.gif",
      "image/cartes_classiques/8h.gif",
      "image/cartes_classiques/9h.gif",
      "image/cartes_classiques/10h.gif",
      "image/cartes_classiques/Jh.gif",
      "image/cartes_classiques/Qh.gif",
      "image/cartes_classiques/Kh.gif",
      "image/cartes_classiques/Ah.gif",
      "image/cartes_classiques/2s.gif",
      "image/cartes_classiques/3s.gif",
      "image/cartes_classiques/4s.gif",
      "image/cartes_classiques/5s.gif",
      "image/cartes_classiques/6s.gif",
      "image/cartes_classiques/7s.gif",
      "image/cartes_classiques/8s.gif",
      "image/cartes_classiques/9s.gif",
      "image/cartes_classiques/10s.gif",
      "image/cartes_classiques/Js.gif",
      "image/cartes_classiques/Qs.gif",
      "image/cartes_classiques/Ks.gif",
      "image/cartes_classiques/As.gif",
      "image/cartes_classiques/2j.gif",
      "image/cartes_classiques/3j.gif",
      "image/cartes_classiques/4j.gif",
      "image/cartes_classiques/5j.gif",
      "image/cartes_classiques/6j.gif",
      "image/cartes_classiques/7j.gif",
      "image/cartes_classiques/8j.gif",
      "image/cartes_classiques/9j.gif",
      "image/cartes_classiques/10j.gif",
      "image/cartes_classiques/Jj.gif",
      "image/cartes_classiques/Qj.gif",
      "image/cartes_classiques/Kj.gif",
      "image/cartes_classiques/Aj.gif",
      
    ];

    const selectedImages = cardImages.slice(0, 8);
    const imagePairs = [...selectedImages, ...selectedImages];
    imagePairs.sort(() => Math.random() - 0.5);

    cardContainer.innerHTML = "";
    movesCounter = 0;
    matchedPairs = 0;
    counterDisplay.textContent = movesCounter;
    flippedCards = [];
    resetChrono();
    estArrete = true;

    imagePairs.forEach((imgSrc) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.value = imgSrc;

      card.innerHTML = `
        <div class='card-inner'>
          <div class='card-front'>?</div>
          <div class='card-back'><img src="${imgSrc}" alt="carte" style="width: 80px; height: 100px;" /></div>
        </div>`;

      card.addEventListener("click", function () {
        if (estArrete) {
          demarrerChrono();
        }

        if (card.classList.contains("flipped") || flippedCards.length >= 2)
          return;

        card.classList.add("flipped");
        flippedCards.push(card);

        if (flippedCards.length === 2) {
          movesCounter++;
          counterDisplay.textContent = movesCounter;

          const [card1, card2] = flippedCards;

          if (card1.dataset.value === card2.dataset.value) {
            matchedPairs++;
            flippedCards = [];

            if (matchedPairs === 8) {
              arreterChrono();
              if (bestScore === null || movesCounter < parseInt(bestScore)) {
                localStorage.setItem("bestScore", movesCounter);
                bestScoreDisplay.textContent = movesCounter;
                alert(`Félicitations ! Nouveau meilleur score : ${movesCounter} coups.`);
              } else {
                alert(`Bravo ! Tu as terminé en ${movesCounter} coups.`);
              }
              generateImageCards();
            }
          } else {
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
  }

  resetBtn.addEventListener("click", () => {
    arreterChrono();
    resetChrono();
    generateImageCards();
  });

  generateImageCards();
});
