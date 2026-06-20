const csvData = `Nombre,Calorias,Proteinas
Manzana,52,0.3
Banano,89,1.1
Pera,57,0.4
Naranja,47,0.9
Mandarina,53,0.8
Piña,50,0.5
Mango,60,0.8
Papaya,43,0.5
Sandia,30,0.6
Melon,34,0.8
Uvas,69,0.7
Fresa,32,0.7
Frambuesa,52,1.2
Mora,43,1.4
Arandanos,57,0.7
Kiwi,61,1.1
Durazno,39,0.9
Ciruela,46,0.7
Cereza,63,1.1
Guayaba,68,2.6
Aguacate,160,2
Coco,354,3.3
Limon,29,1.1
Maracuya,97,2.2
Higo,74,0.8
Tomate,18,0.9
Pepino,15,0.7
Lechuga,15,1.4
Espinaca,23,2.9
Brocoli,34,2.8
Coliflor,25,1.9
Zanahoria,41,0.9
Remolacha,43,1.6
Apio,16,0.7
Pimiento rojo,31,1
Pimiento verde,20,0.9
Cebolla,40,1.1
Ajo,149,6.4
Champiñones,22,3.1
Calabacin,17,1.2
Berenjena,25,1
Repollo,25,1.3
Maiz dulce,86,3.3
Yuca,160,1.4
Camote,86,1.6
Papa,77,2
Pechuga de pollo,165,31
Muslo de pollo,209,26
Pavo,189,29
Res magra,250,26
Cerdo magro,242,27
Cordero,294,25
Jamon,145,21
Tocino,541,37
Salchicha,301,12
Chorizo,455,24
Atun,132,29
Salmon,208,20
Sardinas,208,25
Tilapia,129,26
Bacalao,82,18
Camaron,99,24
Pulpo,82,15
Calamar,92,16
Cangrejo,97,19
Huevo,155,13
Clara de huevo,52,11
Leche entera,61,3.2
Leche descremada,34,3.4
Yogur natural,59,10
Yogur griego,97,10
Queso cheddar,403,25
Queso mozzarella,280,28
Queso parmesano,431,38
Queso cottage,98,11
Mantequilla,717,0.9
Crema de leche,340,2
Helado de vainilla,207,3.5
Arroz blanco cocido,130,2.7
Arroz integral cocido,111,2.6
Avena,389,16.9
Quinoa cocida,120,4.4
Trigo,339,13.2
Cebada,354,12.5
Centeno,335,10.3
Pan blanco,265,9
Pan integral,247,13
Pasta cocida,158,5.8
Cereal de maiz,357,7.5
Granola,471,10
Lentejas cocidas,116,9
Frijoles negros cocidos,132,8.9
Frijoles rojos cocidos,127,8.7
Garbanzos cocidos,164,8.9
Habas cocidas,110,7.6
Soya cocida,173,16.6
Tofu,76,8
Tempeh,193,20
Almendras,579,21.2
Nueces,654,15.2
Mani,567,25.8
Pistachos,562,20.2
Anacardos,553,18.2
Semillas de girasol,584,20.8
Semillas de chia,486,16.5
Semillas de linaza,534,18.3
Aceitunas verdes,145,1
Aceitunas negras,116,0.8
Pizza de queso,266,11
Hamburguesa,295,17
Hot dog,290,11
Papas fritas,312,3.4
Pollo frito,320,23
Tacos de carne,226,12
Burrito,206,8
Lasana,135,8
Empanada de carne,300,10
Croissant,406,8.2
Donut,452,4.9
Galletas de chocolate,502,5.9
Chocolate con leche,535,7.6
Chocolate negro,598,7.8
Barra energetica,379,13
Palomitas de maiz,387,13
Pretzels,380,10
Nachos,489,7
Chips de papa,536,7
Refresco cola,42,0
Jugo de naranja,45,0.7
Cafe negro,1,0.1
Te verde,1,0.2
Bebida energetica,45,0
Cerveza,43,0.5
Vino tinto,85,0.1
Agua de coco,19,0.7
Batido de chocolate,112,3.4
Leche de almendras,15,0.6
Sushi,143,6
Falafel,333,13
Hummus,166,8
Paella,158,7
Cuscus cocido,112,3.8
Kimchi,15,1.1`;

const state = {
  foods: parseCsv(csvData),
  metric: "calories",
  left: null,
  right: null,
  score: 0,
  bestScore: Number(localStorage.getItem("foodGameBestScore") || 0),
  rounds: 1,
  locked: false,
  lastLoss: null,
};

const metricConfig = {
  calories: {
    csvKey: "Calorias",
    label: "calorías",
    unit: "kcal",
  },
  protein: {
    csvKey: "Proteinas",
    label: "proteína",
    unit: "g",
  },
};

const els = {
  score: document.querySelector("#score"),
  bestScore: document.querySelector("#bestScore"),
  roundCount: document.querySelector("#roundCount"),
  question: document.querySelector("#question"),
  cards: document.querySelectorAll(".food-card"),
  metricButtons: document.querySelectorAll(".metric-button"),
  themeToggle: document.querySelector(".theme-toggle"),
  dialog: document.querySelector("#gameOverDialog"),
  lossTitle: document.querySelector("#lossTitle"),
  lossDetail: document.querySelector("#lossDetail"),
  restartButton: document.querySelector("#restartButton"),
  form: document.querySelector("#foodForm"),
  downloadCsv: document.querySelector("#downloadCsv"),
};

function parseCsv(csv) {
  const [headerLine, ...lines] = csv.trim().split(/\r?\n/);
  const headers = headerLine.split(",");

  return lines.map((line) => {
    const cells = line.split(",");
    const row = Object.fromEntries(headers.map((header, index) => [header, cells[index]]));

    return {
      name: row.Nombre.trim(),
      calories: Number(row.Calorias),
      protein: Number(row.Proteinas),
    };
  });
}

function formatValue(food) {
  const config = metricConfig[state.metric];
  const value = food[state.metric];
  return `${value.toLocaleString("es-GT", { maximumFractionDigits: 1 })} ${config.unit}`;
}

function getRandomFood(excludeName = "") {
  const pool = state.foods.filter((food) => food.name !== excludeName);
  return pool[Math.floor(Math.random() * pool.length)];
}

function imageUrl(foodName) {

  return "imagenes/" +
         foodName
           .toLowerCase()
           .replaceAll(" ", "_")
           + ".jpg";

}

function initials(foodName) {
  return foodName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function setCard(side, food, reveal = false) {
  document.querySelector(`#${side}Name`).textContent = food.name;
  document.querySelector(`#${side}Value`).textContent = reveal ? formatValue(food) : "Elige para revelar";

  const image = document.querySelector(`#${side}Image`);
  const fallback = document.querySelector(`#${side}Fallback`);

  image.classList.remove("hidden");
  image.alt = food.name;
  image.src = imageUrl(food.name);
  image.onerror = () => image.classList.add("hidden");
  fallback.textContent = initials(food.name);
}

function updateScore() {
  els.score.textContent = state.score;
  els.bestScore.textContent = state.bestScore;
  els.roundCount.textContent = state.rounds;
}

function newRound(keepLeft = false) {
  state.locked = false;
  els.cards.forEach((card) => card.classList.remove("correct", "wrong"));

  if (!keepLeft || !state.left) {
    state.left = getRandomFood();
  }

  state.right = getRandomFood(state.left.name);
  const config = metricConfig[state.metric];
  els.question.textContent = `¿Cuál alimento tiene más ${config.label}?`;

  setCard("left", state.left);
  setCard("right", state.right);
  updateScore();
}

function revealValues() {
  document.querySelector("#leftValue").textContent = formatValue(state.left);
  document.querySelector("#rightValue").textContent = formatValue(state.right);
}

function chooseLossMessage(score) {
  if (score === 0) {
    return "Suerte la proxima";
  }

  if (score > 0 && score < 15) {
    return "Muy bien, sigue que puedes mejorar";
  }

  if (score >= 15) {
    return `Increible, es muy dificil llegar a ${score}. Felicidades`;
  }

  return "Sigue jugando";
}

function classifyFood(food) {
  const sortedFoods = [...state.foods].sort((a, b) => b[state.metric] - a[state.metric]);
  const position = sortedFoods.findIndex((item) => item.name === food.name) + 1;

  if (position === 0) {
    return `${food.name} no esta en el documento`;
  }

  const total = sortedFoods.length;
  const value = food[state.metric];
  const percentile = position / total;
  const config = metricConfig[state.metric];
  const valueLabel = `${value.toLocaleString("es-GT", { maximumFractionDigits: 1 })} ${config.unit}`;
  const topCount = Math.max(1, Math.floor(total * 0.2));

  if (percentile <= 0.2) {
    return `${food.name} esta entre los ${topCount} con mas ${config.label} (${valueLabel})`;
  }

  if (percentile <= 0.5) {
    return `${food.name} esta en la parte alta del ranking de ${config.label} (${valueLabel})`;
  }

  if (percentile <= 0.8) {
    return `${food.name} esta en la parte media del ranking de ${config.label} (${valueLabel})`;
  }

  return `${food.name} es de los ${topCount} con menos ${config.label} (${valueLabel})`;
}

function pick(side) {
  if (state.locked) return;
  state.locked = true;

  const selected = side === "left" ? state.left : state.right;
  const other = side === "left" ? state.right : state.left;
  const isCorrect = selected[state.metric] >= other[state.metric];
  const selectedCard = document.querySelector(`[data-choice="${side}"]`);

  revealValues();
  selectedCard.classList.add(isCorrect ? "correct" : "wrong");

  if (isCorrect) {
    state.score += 1;
    state.bestScore = Math.max(state.bestScore, state.score);
    localStorage.setItem("foodGameBestScore", String(state.bestScore));
    state.rounds += 1;
    updateScore();
    setTimeout(() => {
      state.left = selected;
      newRound(true);
    }, 900);
    return;
  }

  state.lastLoss = { selected, other };
  setTimeout(showGameOver, 520);
}

function showGameOver() {
  const loss = state.lastLoss;
  const metricLabel = metricConfig[state.metric].label;

  els.lossTitle.textContent = chooseLossMessage(state.score);
  els.lossDetail.textContent = loss
    ? `Elegiste ${loss.selected.name}, pero ${loss.other.name} tenia mas ${metricLabel}. ${classifyFood(loss.selected)}. Puntaje: ${state.score}. Mejor racha: ${state.bestScore}.`
    : `Puntaje: ${state.score}. Mejor racha: ${state.bestScore}.`;
  els.dialog.showModal();
}

function resetGame() {
  state.score = 0;
  state.rounds = 1;
  state.left = null;
  state.right = null;
  state.lastLoss = null;
  els.dialog.close();
  newRound();
}

function addFood(event) {
  event.preventDefault();
  const formData = new FormData(els.form);
  const newFood = {
    name: formData.get("foodName").trim(),
    calories: Number(formData.get("foodCalories")),
    protein: Number(formData.get("foodProtein")),
  };

  if (!newFood.name || Number.isNaN(newFood.calories) || Number.isNaN(newFood.protein)) return;

  state.foods.push(newFood);
  els.form.reset();
  newRound();
}

function downloadCsv() {
  const rows = [
    "Nombre,Calorias,Proteinas",
    ...state.foods.map((food) => `${food.name},${food.calories},${food.protein}`),
  ];
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "alimentos_higher_or_lower_actualizado.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function switchMetric(metric) {
  state.metric = metric;
  els.metricButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.metric === metric);
  });
  resetGame();
}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("foodGameTheme", nextTheme);
}

function wireEvents() {
  els.cards.forEach((card) => {
    card.addEventListener("click", () => pick(card.dataset.choice));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        pick(card.dataset.choice);
      }
    });
  });

  els.metricButtons.forEach((button) => {
    button.addEventListener("click", () => switchMetric(button.dataset.metric));
  });

  els.themeToggle.addEventListener("click", toggleTheme);
  els.restartButton.addEventListener("click", resetGame);
  els.form.addEventListener("submit", addFood);
  els.downloadCsv.addEventListener("click", downloadCsv);
}

function initTheme() {
  const savedTheme = localStorage.getItem("foodGameTheme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = savedTheme || (prefersDark ? "dark" : "light");
}

initTheme();
wireEvents();
newRound();
