document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("card-container");

  function generateRandomCards() {
    const cards = [];
    const values = [];

    for (let i = 0; i < 8; i++) { // 8 paires
      const randomValue = Math.floor(Math.random() * 100);
      values.push(randomValue, randomValue);
    }

    values.sort(() => Math.random() - 0.5);

    values.forEach(value => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<div class='card-inner'><div class='card-front'>?</div><div class='card-back'>${value}</div></div>`;
      card.addEventListener('click', function() {
        card.classList.toggle('flipped');
      });
      cardContainer.appendChild(card);
    });
  }

  generateRandomCards();
});
