const INTRO_DURATION = 10000;
const INTERMEDIATE_DURATION = 4000;
const DOOR_COUNT = 24;
const QUESTION_FILES = {
    Marvel: 'fragen/marvel.json',
    Fortnite: 'fragen/fortnite.json',
    Woodwalkers: 'fragen/woodwalkers.json',
    Survival: 'fragen/survival.json',
    Physik: 'fragen/physik.json',
    Mathematik: 'fragen/mathematik.json',
    'Star Wars': 'fragen/star_wars.json',
    Minecraft: 'fragen/minecraft.json',
    Sheldon: 'fragen/sheldon.json'
};

const CATEGORY_ICONS = {
    Marvel: '🛡️',
    Fortnite: '🎯',
    Woodwalkers: '🐺',
    Survival: '🧭',
    Physik: '⚡',
    Mathematik: '➗',
    'Star Wars': '🌌',
    Minecraft: '⛏️',
    Sheldon: '🧠'
};

const CHRISTMAS_ICONS = ['🎄', '🎁', '❄️', '⛄', '🕯️', '🧦', '🍬'];

const PLAYLIST = [
    {
        title: 'Dance of the Sugar Plum Fairy',
        url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Classical_Sampler/Kevin_MacLeod_-_06_-_Dance_of_the_Sugar_Plum_Fairy.mp3'
    },
    {
        title: 'We Wish You a Merry Christmas',
        url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Christmas_-_2011/Kevin_MacLeod_-_We_Wish_You_a_Merry_Christmas.mp3'
    },
    {
        title: 'Jingle Bells (Calm)',
        url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Christmas_-_2011/Kevin_MacLeod_-_Jingle_Bells.mp3'
    },
    {
        title: 'O Holy Night (Instrumental)',
        url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Jon_Sayles/Christmas_Carols_2004/Jon_Sayles_-_O_Holy_Night.mp3'
    },
    {
        title: 'Carol of the Bells',
        url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/A_Magnus/Happy_Holidays/A_Magnus_-_Carol_of_the_Bells.mp3'
    }
];

const matrixCanvas = document.getElementById('matrix-canvas');
const loginScreen = document.getElementById('login-screen');
const intermediateScreen = document.getElementById('intermediate-screen');
const calendarScreen = document.getElementById('calendar-screen');
const loginForm = document.getElementById('login-form');
const accessCodeInput = document.getElementById('access-code');
const challengeText = document.getElementById('challenge-text');
const challengeAnswer = document.getElementById('challenge-answer');
const loginError = document.getElementById('login-error');
const calendarGrid = document.getElementById('calendar-grid');
const questionModal = document.getElementById('question-modal');
const modalCloseButton = document.querySelector('.close-modal');
const questionCategory = document.getElementById('question-category');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers');
const feedback = document.getElementById('feedback');
const refreshButton = document.getElementById('refresh-questions');
const calendarTitle = document.getElementById('calendar-title');
const muteToggle = document.getElementById('mute-toggle');
const volumeControl = document.getElementById('volume-control');
const backgroundAudio = document.getElementById('background-audio');

let users = {};
let activeUser = null;
let questionPool = {};
let assignedQuestions = [];
let usedQuestions = new Map();
let currentTrackIndex = 0;
let isMuted = false;

function resizeCanvas() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
}

function startMatrixRain() {
    if (!matrixCanvas.getContext) return;
    const ctx = matrixCanvas.getContext('2d');
    const fontSize = 16;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = new Array(columns).fill(1);
    const characters = 'アァカサタナハマヤャラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        ctx.fillStyle = '#1bf2a8';
        ctx.font = fontSize + 'px monospace';

        drops.forEach((y, index) => {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, index * fontSize, y * fontSize);

            if (y * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[index] = 0;
            }
            drops[index] = drops[index] + 1;
        });
    }

    return setInterval(draw, 50);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateChallenge() {
    const operations = ['+', '-', '*'];
    const op = operations[randomInt(0, operations.length - 1)];
    let a = randomInt(3, 12);
    let b = randomInt(2, 10);

    if (op === '-' && b > a) {
        [a, b] = [b, a];
    }

    let solution;
    switch (op) {
        case '+':
            solution = a + b;
            break;
        case '-':
            solution = a - b;
            break;
        default:
            solution = a * b;
            break;
    }

    challengeText.textContent = `${a} ${op} ${b} = ?`;
    challengeAnswer.dataset.solution = String(solution);
    challengeAnswer.value = '';
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function loadUsers() {
    const response = await fetch('data/users.json');
    users = await response.json();
}

async function loadQuestions() {
    const entries = Object.entries(QUESTION_FILES);
    const promises = entries.map(async ([category, path]) => {
        const response = await fetch(path);
        const data = await response.json();
        questionPool[category] = data;
    });
    await Promise.all(promises);
}

function getBalancedCategories(categories, count) {
    const baseCount = Math.floor(count / categories.length);
    let remainder = count % categories.length;
    const allocation = [];

    const shuffledCategories = shuffle(categories);
    shuffledCategories.forEach((category) => {
        const extra = remainder > 0 ? 1 : 0;
        if (remainder > 0) {
            remainder -= 1;
        }
        allocation.push({ category, total: baseCount + extra });
    });

    const result = [];
    allocation.forEach(({ category, total }) => {
        for (let i = 0; i < total; i += 1) {
            result.push(category);
        }
    });

    return shuffle(result);
}

function pickQuestion(category) {
    const available = questionPool[category];
    if (!available) {
        throw new Error(`Keine Fragen für Kategorie ${category} geladen.`);
    }

    if (!usedQuestions.has(category)) {
        usedQuestions.set(category, new Set());
    }

    const usedSet = usedQuestions.get(category);
    const unused = available.map((question, index) => ({ question, index })).filter((item) => !usedSet.has(item.index));

    if (unused.length === 0) {
        usedSet.clear();
        unused.push(...available.map((question, index) => ({ question, index })));
    }

    const selection = unused[Math.floor(Math.random() * unused.length)];
    usedSet.add(selection.index);
    return selection.question;
}

function createDoorElement(number, category, question) {
    const door = document.createElement('div');
    door.className = 'door';
    door.dataset.number = number;
    door.dataset.category = category;

    const numberElement = document.createElement('div');
    numberElement.className = 'door-number';
    numberElement.textContent = number;

    const iconElement = document.createElement('div');
    iconElement.className = 'door-icon';
    const categoryIcon = CATEGORY_ICONS[category] || '🎁';
    const christmasIcon = CHRISTMAS_ICONS[Math.floor(Math.random() * CHRISTMAS_ICONS.length)];
    iconElement.textContent = Math.random() > 0.5 ? categoryIcon : christmasIcon;

    const categoryElement = document.createElement('div');
    categoryElement.className = 'door-category';
    categoryElement.textContent = category;

    door.appendChild(numberElement);
    door.appendChild(iconElement);
    door.appendChild(categoryElement);

    door.addEventListener('click', () => openQuestion(door, question));

    return door;
}

function openQuestion(door, question) {
    if (door.classList.contains('open')) {
        showQuestion(question);
        return;
    }

    showQuestion(question, door);
}

function showQuestion(question, door = null) {
    questionModal.classList.remove('hidden');
    questionCategory.textContent = question.category;
    questionText.textContent = question.question;
    feedback.textContent = '';
    feedback.className = '';

    answersContainer.innerHTML = '';
    const answers = shuffle(question.answers);
    answers.forEach((answer) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'answer-option';
        button.textContent = answer.text;
        button.addEventListener('click', () => {
            const isCorrect = answer.correct === true;
            button.classList.add(isCorrect ? 'correct' : 'wrong');
            feedback.textContent = isCorrect ? 'Stark! Richtige Antwort.' : 'Fast! Versuch es erneut.';
            feedback.classList.toggle('success', isCorrect);
            feedback.classList.toggle('error', !isCorrect);

            if (!isCorrect) {
                setTimeout(() => {
                    button.classList.remove('wrong');
                }, 1200);
                return;
            }

            answersContainer.querySelectorAll('button').forEach((btn) => {
                btn.disabled = true;
                if (btn !== button) {
                    btn.classList.add('correct');
                }
            });

            if (door) {
                door.classList.add('open');
            }

            setTimeout(() => {
                closeModal();
            }, 1500);
        });
        answersContainer.appendChild(button);
    });
}

function closeModal() {
    questionModal.classList.add('hidden');
}

function renderCalendar() {
    assignedQuestions = [];
    usedQuestions = new Map();
    calendarGrid.innerHTML = '';

    const numbers = shuffle(Array.from({ length: DOOR_COUNT }, (_, i) => i + 1));
    const categories = getBalancedCategories(activeUser.categories, DOOR_COUNT);

    numbers.forEach((number, index) => {
        const category = categories[index % categories.length];
        const rawQuestion = pickQuestion(category);
        const question = { ...rawQuestion, category };
        assignedQuestions.push({ number, category, question });
    });

    assignedQuestions.forEach(({ number, category, question }) => {
        const door = createDoorElement(number, category, question);
        calendarGrid.appendChild(door);
    });
}

function scheduleScreens() {
    loginScreen.classList.remove('hidden');
    generateChallenge();
}

async function initialise() {
    resizeCanvas();
    let rainInterval = startMatrixRain();

    window.addEventListener('resize', resizeCanvas);

    await loadUsers();
    await loadQuestions();

    setTimeout(() => {
        clearInterval(rainInterval);
        document.getElementById('matrix-intro').classList.add('hidden');
        loginScreen.classList.remove('hidden');
        generateChallenge();
    }, INTRO_DURATION);
}

async function handleLogin(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    const accessCode = accessCodeInput.value.trim();
    const challengeSolution = challengeAnswer.dataset.solution;

    if (!users[name]) {
        loginError.textContent = 'Unbekannter Benutzer. Zugriff verweigert.';
        generateChallenge();
        return;
    }

    const user = users[name];
    if (user.birthdate !== birthdate) {
        loginError.textContent = 'Geburtsdatum stimmt nicht überein.';
        generateChallenge();
        return;
    }

    if (user.accessCode && accessCode !== user.accessCode) {
        loginError.textContent = 'Zugangscode ungültig.';
        generateChallenge();
        return;
    }

    if (challengeAnswer.value.trim() !== challengeSolution) {
        loginError.textContent = 'Rechenaufgabe falsch. Bitte erneut versuchen.';
        generateChallenge();
        return;
    }

    loginError.textContent = '';
    activeUser = user;
    calendarTitle.textContent = user.calendarTitle || 'Dein Adventskalender';

    accessCodeInput.value = '';
    loginScreen.classList.add('hidden');
    intermediateScreen.classList.remove('hidden');

    setTimeout(() => {
        intermediateScreen.classList.add('hidden');
        calendarScreen.classList.remove('hidden');
        renderCalendar();
        startMusic();
    }, INTERMEDIATE_DURATION);
}

function refreshCalendar() {
    renderCalendar();
}

function startMusic() {
    if (!PLAYLIST.length) return;
    currentTrackIndex = 0;
    playTrack(currentTrackIndex);
}

function playTrack(index) {
    const track = PLAYLIST[index % PLAYLIST.length];
    backgroundAudio.src = track.url;
    backgroundAudio.volume = parseFloat(volumeControl.value);
    if (isMuted) {
        backgroundAudio.muted = true;
    }
    backgroundAudio.play().catch(() => {
        // playback might require interaction; ignore errors
    });
}

function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    playTrack(currentTrackIndex);
}

function toggleMute() {
    isMuted = !isMuted;
    backgroundAudio.muted = isMuted;
    muteToggle.textContent = isMuted ? '🔈' : '🔊';
}

function updateVolume(event) {
    backgroundAudio.volume = parseFloat(event.target.value);
    if (backgroundAudio.volume === 0) {
        backgroundAudio.muted = true;
        muteToggle.textContent = '🔈';
        isMuted = true;
    } else if (isMuted) {
        backgroundAudio.muted = false;
        muteToggle.textContent = '🔊';
        isMuted = false;
    }
}

document.addEventListener('DOMContentLoaded', initialise);
loginForm.addEventListener('submit', handleLogin);
challengeAnswer.addEventListener('focus', () => challengeAnswer.select());
refreshButton.addEventListener('click', refreshCalendar);
modalCloseButton.addEventListener('click', closeModal);
questionModal.addEventListener('click', (event) => {
    if (event.target === questionModal) {
        closeModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !questionModal.classList.contains('hidden')) {
        closeModal();
    }
});

backgroundAudio.addEventListener('ended', playNextTrack);
muteToggle.addEventListener('click', toggleMute);
volumeControl.addEventListener('input', updateVolume);
