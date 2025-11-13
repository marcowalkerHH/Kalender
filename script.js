const phaseData = {
  explore: {
    title: "Explore",
    description:
      "Interviews, Feldnotizen und schnelle Desk-Research-Läufe liefern den Kontext, bevor eine einzige Zeile gebaut wird.",
    actions: [
      "5 Nutzer:innen sprechen, Hypothesen clustern",
      "Opportunities priorisieren und Research-Summary teilen",
      "Team-Canvas für Verantwortlichkeiten updaten",
    ],
    milestone: "Discovery Sprint",
  },
  build: {
    title: "Build",
    description:
      "Design Tokens definieren, Prototyp in Figma/XD umsetzen und anschließend in die bevorzugte Tech-Stack übertragen.",
    actions: [
      "Experience-Flow storyboarden",
      "Komponenten-Bibliothek pflegen",
      "QA-Checkliste automatisieren",
    ],
    milestone: "Build Freeze",
  },
  launch: {
    title: "Launch",
    description:
      "Trainings für Support, Release-Plan schreiben und finale Inhalte veröffentlichen. Alles mit klarer Verantwortlichkeit.",
    actions: [
      "Hand-over Session mit Ops",
      "Beta-Slot für VIPs sichern",
      "Go-Live Broadcast vorbereiten",
    ],
    milestone: "Launch Window",
  },
  impact: {
    title: "Impact",
    description:
      "Daten monitoren, Storytelling-Assets bauen und aus jeder Metrik ein Lernsignal ableiten.",
    actions: [
      "North-Star-Metric tracken",
      "Recaps & Highlights schneiden",
      "Roadmap für Iteration 2.0 ableiten",
    ],
    milestone: "Impact Review",
  },
};

const timelineButtons = document.querySelectorAll(".timeline__step");
const phaseDetail = document.getElementById("phaseDetail");
const nextMilestone = document.getElementById("nextMilestone");

function renderPhase(phaseKey) {
  const data = phaseData[phaseKey];
  if (!data) return;

  timelineButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.phase === phaseKey));
  nextMilestone.textContent = `${data.milestone} – ${phaseKey === "explore" ? "12. Januar" : "Q1"}`;

  phaseDetail.innerHTML = `
    <header>
      <p class="chip-list"><span>${data.milestone}</span></p>
      <h3>${data.title}</h3>
    </header>
    <p>${data.description}</p>
    <ul>${data.actions.map((a) => `<li>${a}</li>`).join("")}</ul>
  `;
}

timelineButtons.forEach((button) =>
  button.addEventListener("click", () => renderPhase(button.dataset.phase))
);
renderPhase("explore");

const boardState = {
  explore: [],
  build: [],
  review: [],
  done: [],
};

const statusOrder = ["explore", "build", "review", "done"];
const lists = {
  explore: document.getElementById("col-explore"),
  build: document.getElementById("col-build"),
  review: document.getElementById("col-review"),
  done: document.getElementById("col-done"),
};

const metrics = {
  open: document.getElementById("openTasks"),
  done: document.getElementById("doneTasks"),
};

const taskForm = document.getElementById("taskForm");
const taskBoard = document.querySelector(".task-board");

const initialTasks = [
  {
    title: "Research-Screener finalisieren",
    owner: "Mira",
    category: "Research",
    status: "explore",
  },
  {
    title: "UI Motion Library",
    owner: "Ben",
    category: "Design",
    status: "build",
  },
  {
    title: "Loadtests dokumentieren",
    owner: "Jo",
    category: "Tech",
    status: "review",
  },
];

initialTasks.forEach(addTask);

function addTask(task) {
  const entry = {
    id: crypto.randomUUID(),
    ...task,
  };
  boardState[entry.status].push(entry);
  renderBoard();
}

function renderBoard() {
  statusOrder.forEach((status) => {
    const fragment = document.createDocumentFragment();
    boardState[status].forEach((task) => {
      fragment.appendChild(createTaskElement(task));
    });
    lists[status].replaceChildren(fragment);
  });
  updateMetrics();
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task";
  li.dataset.id = task.id;
  li.dataset.status = task.status;
  li.innerHTML = `
    <span class="task__category">${task.category}</span>
    <strong>${task.title}</strong>
    <span class="muted">${task.owner || "Unassigned"}</span>
  `;

  const actionBar = document.createElement("div");
  actionBar.className = "task__actions";
  const index = statusOrder.indexOf(task.status);
  if (index > 0) {
    const backBtn = document.createElement("button");
    backBtn.dataset.direction = "back";
    backBtn.textContent = "◀";
    actionBar.appendChild(backBtn);
  }
  if (index < statusOrder.length - 1) {
    const forwardBtn = document.createElement("button");
    forwardBtn.dataset.direction = "forward";
    forwardBtn.textContent = "▶";
    actionBar.appendChild(forwardBtn);
  } else {
    const removeBtn = document.createElement("button");
    removeBtn.dataset.action = "remove";
    removeBtn.textContent = "✕";
    actionBar.appendChild(removeBtn);
  }
  li.appendChild(actionBar);
  return li;
}

function updateMetrics() {
  const open = boardState.explore.length + boardState.build.length + boardState.review.length;
  metrics.open.textContent = open;
  metrics.done.textContent = boardState.done.length;
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(taskForm);
  const title = formData.get("title").trim();
  if (!title) return;
  const owner = formData.get("owner").trim();
  const category = formData.get("category") || "Research";
  addTask({ title, owner, category, status: "explore" });
  taskForm.reset();
});

function moveTask(id, direction) {
  const currentStatus = statusOrder.find((status) => boardState[status].some((task) => task.id === id));
  if (!currentStatus) return;
  const tasks = boardState[currentStatus];
  const index = tasks.findIndex((task) => task.id === id);
  const [task] = tasks.splice(index, 1);
  if (direction === "remove") {
    renderBoard();
    return;
  }
  const currentPosition = statusOrder.indexOf(currentStatus);
  const nextIndex = direction === "forward" ? currentPosition + 1 : currentPosition - 1;
  const nextStatus = statusOrder[Math.max(0, Math.min(statusOrder.length - 1, nextIndex))];
  task.status = nextStatus;
  boardState[nextStatus].push(task);
  renderBoard();
}

taskBoard.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const taskElement = button.closest(".task");
  if (!taskElement) return;
  const id = taskElement.dataset.id;
  if (button.dataset.direction) {
    moveTask(id, button.dataset.direction);
  } else if (button.dataset.action === "remove") {
    moveTask(id, "remove");
  }
});

const ideaTag = document.getElementById("ideaTag");
const ideaTitle = document.getElementById("ideaTitle");
const ideaDescription = document.getElementById("ideaDescription");
const shuffleButton = document.getElementById("shuffleIdea");

const ideaPool = [
  {
    tag: "Workshop",
    title: "Lightning-Decision-Session",
    description: "60-Minuten-Runde: Pain Points sammeln, voten, erste Experimente definieren.",
  },
  {
    tag: "Prototype",
    title: "Micro-Interaction Reel",
    description: "Kurzen Screenflow aufzeichnen und mit Motion-Captions erklären – perfekt fürs Team-Update.",
  },
  {
    tag: "Community",
    title: "Build in Public",
    description: "Zeige täglich einen Screenshot oder eine Erkenntnis. Audience hilft bei Priorisierung.",
  },
  {
    tag: "Ops",
    title: "Service Blueprint Light",
    description: "User Journey plus Backstage-Aktivitäten auf einem A3 Board skizzieren.",
  },
];

function shuffleIdea() {
  const idea = ideaPool[Math.floor(Math.random() * ideaPool.length)];
  ideaTag.textContent = idea.tag;
  ideaTitle.textContent = idea.title;
  ideaDescription.textContent = idea.description;
}

shuffleButton.addEventListener("click", shuffleIdea);
shuffleIdea();

const teamPulse = document.getElementById("teamPulse");
const pulseValue = 78 + Math.round(Math.random() * 8);
teamPulse.textContent = `${pulseValue}%`;
