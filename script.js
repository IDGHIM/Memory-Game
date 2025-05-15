document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("card-container");

  function generateRandomCards() {
    const cards = [];
    const values = [];

    // Générer au moins deux paires
    for (let i = 0; i < 2; i++) {
      const randomValue = Math.floor(Math.random() * 100);
      values.push(randomValue, randomValue); // Ajouter la paire
    }

    // Remplir le reste des cartes de manière aléatoire
    for (let i = 0; i < 8; i++) {
      values.push(Math.floor(Math.random() * 100));
    }

    // Mélanger les cartes
    values.sort(() => Math.random() - 0.5);

    values.forEach(value => {
      const card = document.createElement("div");
      card.className = "card";
      card.textContent = value;
      cards.push(card);
      cardContainer.appendChild(card);
    });
  }

  generateRandomCards();
});
