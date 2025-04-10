const planets = [
  { name: "Меркурий", order: 1, img: "image/mercuriy.png" },
  { name: "Венера", order: 2, img: "image/venera.png" },
  { name: "Земля", order: 3, img: "image/earth.png" },
  { name: "Марс", order: 4, img: "image/mars.png" },
  // { name: "Пояс", order: 5, img: "image/asteroids.png" },
  { name: "Юпитер", order: 6, img: "image/jupiter.png" },
  { name: "Сатурн", order: 7, img: "image/saturn.png" },
  { name: "Уран", order: 8, img: "image/uran.png" },
  { name: "Нептун", order: 9, img: "image/neptun.png" },
];

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const startButton = document.getElementById("start-button");
const checkButton = document.getElementById("check-button");
const resetButton = document.getElementById("reset-button");
const resultMessage = document.getElementById("result-message");
const planetsContainer = document.getElementById("planets-container");
const solarField = document.getElementById("solar-field");

// Перемешиваем планеты
function shufflePlanets() {
  return [...planets].sort(() => Math.random() - 0.5);
}

// Начать игру
startButton.addEventListener("click", () => {
  startScreen.classList.remove("active");
  gameScreen.classList.add("active");
  startGame();
});

function startGame() {
  resultMessage.textContent = "";
  solarField.innerHTML = "";
  planetsContainer.innerHTML = "";

  const shuffledPlanets = shufflePlanets();
  shuffledPlanets.forEach((planet) => {
    const div = document.createElement("div");
    const title = document.createElement("p");
    title.classList.add("title");
    div.classList.add("planet");

    div.setAttribute("data-order", planet.order);
    div.setAttribute("draggable", "true");
    div.setAttribute(
      "style",
      `background-image: url(${planet.img}); background-size: 100%; background-repeat: no-repeat`
    );
    title.textContent = planet.name;
    div.appendChild(title);
    planetsContainer.appendChild(div);
  });

  enableDragAndDrop();
}

// Сброс планет
resetButton.addEventListener("click", () => {
  startGame();
});

function enableDragAndDrop() {
  let draggedElement = null;
  let offsetX = 0;
  let offsetY = 0;

  planetsContainer.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("planet")) {
      draggedElement = e.target;
      e.target.classList.add("dragging");
    }
  });

  planetsContainer.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("planet")) {
      e.target.classList.remove("dragging");
    }
  });

  solarField.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  solarField.addEventListener("drop", (e) => {
    if (draggedElement) {
      solarField.appendChild(draggedElement);
    }
  });
  // Touch-Drag для сенсорных экранов
  planetsContainer.addEventListener("touchstart", (e) => {
    const touchTarget = e.target.closest(".planet");
    if (touchTarget) {
      draggedElement = touchTarget;
      const touch = e.touches[0];
      const rect = touchTarget.getBoundingClientRect();

      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;

      touchTarget.style.position = "absolute";
      touchTarget.style.zIndex = 1000;
      touchTarget.classList.add("dragging");
      moveAt(touch.clientX, touch.clientY);
    }

    function moveAt(x, y) {
      if (draggedElement) {
        draggedElement.style.left = x - offsetX + "px";
        draggedElement.style.top = y - offsetY + "px";
      }
    }

    const onTouchMove = (e) => {
      const touch = e.touches[0];
      moveAt(touch.clientX, touch.clientY);
    };

    document.addEventListener("touchmove", onTouchMove, { passive: false });

    document.addEventListener(
      "touchend",
      (e) => {
        document.removeEventListener("touchmove", onTouchMove);
        draggedElement.classList.remove("dragging");

        const touch = e.changedTouches[0];
        const dropTarget = document.elementFromPoint(
          touch.clientX,
          touch.clientY
        );
        if (dropTarget && solarField.contains(dropTarget)) {
          solarField.appendChild(draggedElement);
          draggedElement.style.position = "";
          draggedElement.style.left = "";
          draggedElement.style.top = "";
          draggedElement.style.zIndex = "";
        } else {
          // Возврат в исходное положение, если не на поле
          planetsContainer.appendChild(draggedElement);
          draggedElement.style.position = "";
          draggedElement.style.left = "";
          draggedElement.style.top = "";
          draggedElement.style.zIndex = "";
        }

        draggedElement = null;
      },
      { once: true }
    );
  });
}

// Проверка порядка
checkButton.addEventListener("click", () => {
  const currentOrder = [...solarField.children].map((el) =>
    parseInt(el.getAttribute("data-order"))
  );
  const correctOrder = planets.map((p) => p.order);
  console.log(correctOrder);

  if (
    currentOrder.length === correctOrder.length &&
    JSON.stringify(currentOrder) === JSON.stringify(correctOrder)
  ) {
    resultMessage.textContent = "Правильно! Молодец!";
    resultMessage.style.color = "lime";
    setTimeout(() => {
      startScreen.classList.add("active");
      gameScreen.classList.remove("active");
    }, 3000);
  } else {
    resultMessage.textContent = "Неправильно. Попробуй ещё раз.";
    resultMessage.style.color = "red";
  }
});
