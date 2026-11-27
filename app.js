
/* =========================================
   TWO OF US — TEMPORARY LONG-DISTANCE GAME
   No database tables. No permanent answers.
   Supabase Realtime + Anonymous Auth.
========================================= */

const SUPABASE_URL = "https://qfbtduuorxiwawawstdw.supabase.co";
const SUPABASE_KEY = "sb_publishable_H50cKJkig7yKxPy3Tb8L2g_IynrjV7l";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const $ = (id) => document.getElementById(id);

const screens = [
  "welcomeScreen",
  "homeScreen",
  "roomScreen",
  "gameScreen",
  "resultsScreen"
];

let user = null;
let myName = "Comfort";
let isHost = false;
let roomCode = "";
let roomChannel = null;
let currentQuestion = 0;
let answers = {};
let history = [];
let players = [];

const stageTitles = [
  "Getting to know us",
  "Little things about us",
  "Memories and moments",
  "Our personalities",
  "Love and connection",
  "Dreams and plans",
  "The funny side of us",
  "Our future together",
  "Heart-to-heart",
  "Just the two of us"
];

const questions = [
  // STAGE 1
  "What was your first impression of me?",
  "What is one thing you noticed about me first?",
  "What makes you smile when you think of me?",
  "What is your favourite thing about our conversations?",
  "What three words describe me?",
  "What do you think we have in common?",
  "What is something new you have learned about me?",
  "What is one question you have always wanted to ask me?",
  "What makes our connection different?",
  "What is one thing you would like us to do together?",

  // STAGE 2
  "What little thing can instantly improve your day?",
  "What kind of messages make you happiest?",
  "What is your favourite time of day to talk?",
  "What song reminds you of a happy moment?",
  "What is something that always makes you laugh?",
  "What is your favourite way to relax?",
  "Would you rather have a long call or lots of little messages?",
  "What food would you love us to try together?",
  "What is one small thing you wish I knew about you?",
  "What makes an ordinary day special?",

  // STAGE 3
  "What conversation between us do you remember most?",
  "What is one moment that made you feel understood?",
  "What is the funniest thing we have talked about?",
  "What is something I said that stayed in your mind?",
  "Which conversation would you happily repeat?",
  "What is a memory that always makes you smile?",
  "What was a moment when you felt close to me?",
  "What is something we should make a tradition?",
  "What is one thing you hope we never forget?",
  "If we made a scrapbook, what would be on its first page?",

  // STAGE 4
  "Are you more of a planner or a spontaneous person?",
  "What do you do when you need encouragement?",
  "What is something you are secretly proud of?",
  "What is one habit you would like to improve?",
  "Do you prefer listening or talking when upset?",
  "What kind of humour makes you laugh?",
  "What is something people often misunderstand about you?",
  "What helps you feel appreciated?",
  "What is one thing you find difficult to explain?",
  "When do you feel most like yourself?",

  // STAGE 5
  "What does a meaningful connection mean to you?",
  "What makes you feel appreciated?",
  "How do you prefer to solve misunderstandings?",
  "What does being a good listener mean to you?",
  "What is one way we can make distance easier?",
  "What makes you feel comfortable opening up?",
  "What is something you value in a friendship or relationship?",
  "How can two people support each other's goals?",
  "What does trust mean to you?",
  "What is one thing we can always be honest about?",

  // STAGE 6
  "What is one place you dream of visiting?",
  "What is a goal you really want to achieve?",
  "What would your ideal peaceful day look like?",
  "What skill would you love to learn?",
  "What kind of home would make you happy?",
  "What is something you want to experience together?",
  "What are you looking forward to this year?",
  "If you could learn anything instantly, what would it be?",
  "What is one dream you rarely talk about?",
  "What does a successful future look like to you?",

  // STAGE 7
  "If we were characters in a comedy, who would be funnier?",
  "What silly nickname would you give me?",
  "Who would take longer to get ready for a date?",
  "If we opened a restaurant, what would we call it?",
  "What is the funniest thing you have ever done?",
  "If we swapped phones for a day, what would surprise me?",
  "Who is more likely to forget something important?",
  "What would our imaginary pet be called?",
  "If we had a theme song, what would its mood be?",
  "Describe our friendship or connection as a movie title.",

  // STAGE 8
  "What would you like our first day together to look like?",
  "What activity should we try when we meet?",
  "Would you prefer a quiet date or an adventurous one?",
  "What place would you love to show me?",
  "What would our perfect weekend look like?",
  "What is a new tradition we could start?",
  "What would you like us to celebrate together?",
  "What is one adventure you would remember forever?",
  "What would make our first photograph together special?",
  "What are you most excited about experiencing together?",

  // STAGE 9
  "What is something you appreciate but rarely say?",
  "What makes you feel safe sharing your thoughts?",
  "What is one thing you hope I understand about you?",
  "How can I encourage you when things get difficult?",
  "What is something you have learned from knowing me?",
  "What does patience mean to you?",
  "What is one thing you want us to keep improving?",
  "When do you feel most listened to?",
  "What is one promise we can make about communicating?",
  "What would you like to tell me right now?",

  // STAGE 10
  "What is your favourite thing about us?",
  "What is one word you would use for our journey?",
  "What do you hope we are laughing about in five years?",
  "What is something you want to thank me for?",
  "What should we never stop doing?",
  "What is one thing you want to experience with me?",
  "What is your favourite part of this little game?",
  "What did you learn about me today?",
  "What is one question you want to ask me again someday?",
  "If you could leave me one message to remember, what would it be?"
];

function showScreen(screenId) {
  screens.forEach(id => $(id).classList.add("hidden"));
  $(screenId).classList.remove("hidden");
}

function setMessage(id, message) {
  $(id).textContent = message;
}

function makeRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function ensureGuest() {
  const { data: sessionData, error: sessionError } =
    await db.auth.getSession();

  if (sessionError) throw sessionError;

  if (sessionData.session) {
    user = sessionData.session.user;
    return;
  }

  const { data, error } = await db.auth.signInAnonymously();

  if (error) throw error;

  user = data.user;
}

function installPlayerChoice() {
  const home = $("homeScreen");
  if ($("playerChoice")) return;

  const wrapper = document.createElement("div");
  wrapper.id = "playerChoice";
  wrapper.style.width = "100%";
  wrapper.style.maxWidth = "340px";
  wrapper.style.textAlign = "left";

  const label = document.createElement("label");
  label.textContent = "Who is playing?";
  label.style.display = "block";
  label.style.marginBottom = "8px";
  label.style.fontWeight = "600";

  const select = document.createElement("select");
  select.id = "playerNameSelect";
  select.style.width = "100%";
  select.style.padding = "15px";
  select.style.borderRadius = "13px";
  select.style.border = "1px solid #e7d9d0";
  select.style.background = "white";
  select.style.color = "#594b43";

  select.innerHTML = `
    <option value="Comfort">Comfort</option>
    <option value="Felix">Felix</option>
  `;

  select.addEventListener("change", () => {
    myName = select.value;
  });

  wrapper.append(label, select);
  home.insertBefore(wrapper, $("createRoomButton"));
}

function updatePlayers() {
  if (!roomChannel) return;

  const state = roomChannel.presenceState();
  players = Object.values(state).flat();

  const list = $("playersList");
  list.replaceChildren();

  ["Comfort", "Felix"].forEach(name => {
    const line = document.createElement("p");
    const present = players.some(player => player.name === name);
    line.textContent = `${present ? "●" : "○"} ${name} ${
      present ? "is here" : "hasn't joined yet"
    }`;
    list.appendChild(line);
  });

  $("startGameButton").disabled =
    !isHost || players.length !== 2;

  if (players.length >= 2) {
    setMessage("roomStatus", "Both players are here! ♡");
  } else {
    setMessage("roomStatus", "Waiting for the other player...");
  }
}

async function connectToRoom(code, host) {
  await ensureGuest();

  if (roomChannel) {
    await db.removeChannel(roomChannel);
    roomChannel = null;
  }

  roomCode = code.toUpperCase();
  isHost = host;

  roomChannel = db.channel(`two-of-us-${roomCode}`, {
    config: {
      broadcast: { self: false },
      presence: { key: user.id }
    }
  });

  roomChannel
    .on("presence", { event: "sync" }, updatePlayers)

    .on("broadcast", { event: "game-start" }, () => {
      history = [];
      setCurrentQuestion(0);
      showScreen("gameScreen");
    })

    .on("broadcast", { event: "question-change" }, ({ payload }) => {
      setCurrentQuestion(payload.index);
    })

    .on("broadcast", { event: "answer" }, ({ payload }) => {
      receiveAnswer(payload);
    })

    .on("broadcast", { event: "game-finished" }, () => {
      showResults();
    })

    .subscribe(async status => {
      if (status === "SUBSCRIBED") {
        await roomChannel.track({
          name: myName,
          userId: user.id
        });

        $("roomCodeDisplay").textContent = roomCode;
        $("startGameButton").disabled = !isHost;
        showScreen("roomScreen");
        updatePlayers();
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        setMessage("roomMessage", "Connection problem. Please try again.");
      }
    });
}

async function createRoom() {
  try {
    myName = $("playerNameSelect").value;
    const code = makeRoomCode();

    setMessage("homeMessage", "Creating your room...");
    await connectToRoom(code, true);
  } catch (error) {
    setMessage("homeMessage", error.message || "Couldn't create room.");
  }
}

async function joinRoom() {
  try {
    myName = $("playerNameSelect").value;

    const code = $("roomCodeInput").value.trim().toUpperCase();

    if (!/^[A-Z0-9]{6}$/.test(code)) {
      setMessage("homeMessage", "Please enter a valid 6-character code.");
      return;
    }

    setMessage("homeMessage", "Joining your room...");
    await connectToRoom(code, false);
  } catch (error) {
    setMessage("homeMessage", error.message || "Couldn't join room.");
  }
}

async function broadcast(event, payload) {
  if (!roomChannel) return;

  const result = await roomChannel.send({
    type: "broadcast",
    event,
    payload
  });

  if (result !== "ok") {
    throw new Error("Message could not be sent. Please try again.");
  }
}

async function startGame() {
  if (!isHost || players.length !== 2) return;

  history = [];
  await broadcast("game-start", {});
  setCurrentQuestion(0);
  showScreen("gameScreen");
}

function setCurrentQuestion(index) {
  currentQuestion = index;
  answers = {};

  if (index >= questions.length) {
    showResults();
    return;
  }

  const stage = Math.floor(index / 10);

  $("stageLabel").textContent = `STAGE ${stage + 1}`;
  $("stageTitle").textContent = stageTitles[stage];
  $("questionCounter").textContent =
    `Question ${index + 1} of ${questions.length}`;
  $("questionText").textContent = questions[index];
  $("progressBar").style.width =
    `${((index + 1) / questions.length) * 100}%`;

  $("myAnswer").value = "";
  $("myAnswer").disabled = false;
  $("submitAnswerButton").disabled = false;

  $("answersDisplay").replaceChildren();
  $("nextQuestionButton").classList.add("hidden");

  setMessage("answerStatus", "");
  setMessage("partnerStatus", "Waiting for both answers...");
}

function addAnswerCard(name, answer) {
  const card = document.createElement("div");
  card.className = "answer-card";

  const heading = document.createElement("h3");
  heading.textContent = name;

  const paragraph = document.createElement("p");
  paragraph.textContent = answer;

  card.append(heading, paragraph);
  $("answersDisplay").appendChild(card);
}

async function submitAnswer() {
  const answer = $("myAnswer").value.trim();

  if (!answer) {
    setMessage("answerStatus", "Write your answer first ♡");
    return;
  }

  if (answers[myName]) return;

  answers[myName] = answer;
  addAnswerCard(myName, answer);

  $("myAnswer").disabled = true;
  $("submitAnswerButton").disabled = true;

  setMessage("answerStatus", "Your answer has been sent ♡");

  const payload = {
    index: currentQuestion,
    name: myName,
    answer
  };

  try {
    await broadcast("answer", payload);
    checkAnswers();
  } catch (error) {
    setMessage("answerStatus", error.message);
  }
}

function receiveAnswer(payload) {
  if (!payload || payload.index !== currentQuestion) return;
  if (!["Comfort", "Felix"].includes(payload.name)) return;
  if (typeof payload.answer !== "string") return;

  if (answers[payload.name]) return;

  answers[payload.name] = payload.answer;
  addAnswerCard(payload.name, payload.answer);
  checkAnswers();
}

function checkAnswers() {
  const comfortAnswered = Boolean(answers.Comfort);
  const felixAnswered = Boolean(answers.Felix);

  if (comfortAnswered && felixAnswered) {
    setMessage("partnerStatus", "Both answers are in! ♡");

    history[currentQuestion] = {
      question: questions[currentQuestion],
      comfort: answers.Comfort,
      felix: answers.Felix
    };

    $("nextQuestionButton").classList.remove("hidden");
    $("nextQuestionButton").disabled = !isHost;
    $("nextQuestionButton").textContent =
      currentQuestion === 99 ? "See our results ♡" : "Next question →";
  } else {
    const partner = myName === "Comfort" ? "Felix" : "Comfort";
    setMessage("partnerStatus", `Waiting for ${partner}'s answer...`);
  }
}

async function nextQuestion() {
  if (!isHost || !answers.Comfort || !answers.Felix) return;

  if (currentQuestion === questions.length - 1) {
    await broadcast("game-finished", {});
    showResults();
    return;
  }

  const next = currentQuestion + 1;

  await broadcast("question-change", { index: next });
  setCurrentQuestion(next);
}

function showResults() {
  showScreen("resultsScreen");

  $("resultsContent").replaceChildren();

  history.forEach((item, index) => {
    if (!item) return;

    const card = document.createElement("div");
    card.className = "answer-card";

    const number = document.createElement("h3");
    number.textContent = `Question ${index + 1}`;

    const question = document.createElement("p");
    question.textContent = item.question;

    const comfort = document.createElement("p");
    comfort.textContent = `Comfort: ${item.comfort || "No answer"}`;

    const felix = document.createElement("p");
    felix.textContent = `Felix: ${item.felix || "No answer"}`;

    card.append(number, question, comfort, felix);
    $("resultsContent").appendChild(card);
  });

  $("replayButton").disabled = !isHost;

  setMessage(
    "resultsMessage",
    isHost
      ? "You can start another round whenever you're both ready."
      : "Waiting for the room creator to start another round."
  );
}

async function replayGame() {
  if (!isHost) return;

  history = [];
  await broadcast("game-start", {});
  setCurrentQuestion(0);
  showScreen("gameScreen");
}

/* BUTTONS */

$("startButton").addEventListener("click", () => {
  installPlayerChoice();
  showScreen("homeScreen");
});

$("createRoomButton").addEventListener("click", createRoom);
$("joinRoomButton").addEventListener("click", joinRoom);
$("startGameButton").addEventListener("click", startGame);
$("submitAnswerButton").addEventListener("click", submitAnswer);
$("nextQuestionButton").addEventListener("click", nextQuestion);
$("replayButton").addEventListener("click", replayGame);

$("copyRoomButton").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(roomCode);
    $("copyRoomButton").textContent = "Copied! ♡";
  } catch {
    setMessage("roomMessage", `Your room code is ${roomCode}`);
  }
});

/* START */

showScreen("welcomeScreen");
