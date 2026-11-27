
/* =========================================================
   TWO OF US — A LITTLE QUESTION BOOK
   Complete browser application

   Supabase requirements:
   - Supabase Auth registration Edge Function: "register"
   - profiles, rooms, room_members, rounds, answers,
     replay_requests tables
   - RPC functions:
       create_room()
       join_room(p_code text)
       advance_question(p_room_id uuid)
       request_replay(p_room_id uuid)
   - Correct RLS policies and Realtime publication enabled

   Never put a Supabase service-role key in this file.
========================================================= */

const SUPABASE_URL = "https://qfbtduuorxiwawawstdw.supabase.co";
const SUPABASE_KEY = "PASTE_YOUR_DEFAULT_PUBLISHABLE_KEY_HERE";

if (!window.supabase) {
  alert("Supabase did not load. Check your internet connection.");
  throw new Error("Supabase library missing.");
}

if (
  !SUPABASE_KEY ||
  SUPABASE_KEY === "PASTE_YOUR_DEFAULT_PUBLISHABLE_KEY_HERE"
) {
  console.error("Add your Supabase Publishable Key to app.js.");
}

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* =========================================================
   QUESTIONS — 10 STAGES, 10 QUESTIONS EACH
========================================================= */

const STAGES = [
  {
    title: "Funny Beginnings",
    description: "Let's start with laughter and silly questions.",
    questions: [
      "What was your first impression of me?",
      "What is the funniest thing you have ever done?",
      "If we were cartoon characters, who would we be?",
      "What silly nickname would you give me?",
      "What always makes you laugh?",
      "If we opened a comedy show, what would we call it?",
      "What is one funny habit you have?",
      "If you could switch lives with me for a day, what would you do?",
      "What is the most ridiculous thing you believe as a child?",
      "Which one of us would laugh first during a serious moment?"
    ]
  },
  {
    title: "Getting to Know You",
    description: "A little more about the person behind the screen.",
    questions: [
      "What is something people often misunderstand about you?",
      "What makes you feel appreciated?",
      "What is your favourite childhood memory?",
      "What is one thing you are proud of?",
      "What is your perfect relaxing day?",
      "What is something you would love to learn?",
      "What kind of music makes you happy?",
      "What is one thing you cannot live without?",
      "What is your biggest personal dream?",
      "What is something you wish people asked you more often?"
    ]
  },
  {
    title: "Romantic Corner",
    description: "Sweet questions for two people who care about each other.",
    questions: [
      "What is one little thing that makes you feel loved?",
      "What is your favourite way to spend time together?",
      "What makes a relationship feel special to you?",
      "What is the sweetest compliment someone can give you?",
      "What song reminds you of someone special?",
      "What does a thoughtful surprise look like to you?",
      "What is one sweet memory you would like to create?",
      "What makes you feel comfortable opening up?",
      "What does being supportive mean to you?",
      "What is one thing you appreciate about our connection?"
    ]
  },
  {
    title: "Silly & Unfiltered",
    description: "No serious faces allowed!",
    questions: [
      "If you could eat only one meal for a week, what would it be?",
      "Would you rather talk to animals or understand every language?",
      "What is your most unusual talent?",
      "If you became famous tomorrow, what would it be for?",
      "What fictional world would you visit?",
      "What is the strangest food combination you enjoy?",
      "Would you rather always sing or always dance when walking?",
      "What would your personal warning label say?",
      "If you had a robot assistant, what would you name it?",
      "What is something you would never do on a dare?"
    ]
  },
  {
    title: "Our Memories",
    description: "Let's remember the moments that matter.",
    questions: [
      "What conversation of ours do you remember most?",
      "What moment made you smile recently?",
      "What is one moment you wish you could relive?",
      "What is a small detail about us that you remember?",
      "What has been your favourite conversation topic?",
      "What is something new you have learned about me?",
      "What is one moment that surprised you?",
      "Which memory would you put in a scrapbook?",
      "What is one thing we should do together someday?",
      "What memory would you give a special title?"
    ]
  },
  {
    title: "This or That",
    description: "Quick choices. Explain your answers!",
    questions: [
      "Sunrise or sunset?",
      "Beach or mountains?",
      "Movies or music?",
      "Phone calls or messages?",
      "Adventure or peaceful evenings?",
      "Sweet snacks or salty snacks?",
      "A planned day or a spontaneous day?",
      "City life or countryside?",
      "Books or documentaries?",
      "A handwritten letter or a thoughtful gift?"
    ]
  },
  {
    title: "Deep Conversations",
    description: "Take your time. There are no wrong answers.",
    questions: [
      "What does trust mean to you?",
      "What helps you through a difficult day?",
      "What is one lesson life has taught you?",
      "What makes you feel understood?",
      "What is something you are still learning about yourself?",
      "How do you prefer to solve disagreements?",
      "What does genuine friendship mean to you?",
      "What is one value you never want to lose?",
      "What makes you feel safe sharing your thoughts?",
      "What kind of person do you hope to become?"
    ]
  },
  {
    title: "Dreaming Together",
    description: "Imagine the possibilities.",
    questions: [
      "What country would you love to visit?",
      "What is one skill you want to master?",
      "What would your dream home feel like?",
      "What kind of adventure would you enjoy?",
      "What is one goal you want to achieve?",
      "If you could start a project together, what would it be?",
      "What would your perfect holiday look like?",
      "What is one new experience you want to try?",
      "What would you like your future self to thank you for?",
      "What is one dream you would love to celebrate achieving?"
    ]
  },
  {
    title: "Love & Understanding",
    description: "Thoughtful questions about care and communication.",
    questions: [
      "How do you prefer someone to show they care?",
      "What makes an apology meaningful to you?",
      "How can two people support each other's goals?",
      "What does good communication look like?",
      "What helps you feel listened to?",
      "How should people handle misunderstandings?",
      "What is one boundary you think everyone should respect?",
      "What does patience mean in a relationship?",
      "What is one quality you admire in others?",
      "What helps people grow together while remaining themselves?"
    ]
  },
  {
    title: "The Final Chapter",
    description: "One last set of questions before the big review.",
    questions: [
      "What is your favourite thing about this game?",
      "Which stage did you enjoy most?",
      "Which answer surprised you?",
      "What is something you learned about the other person?",
      "What question would you add to this game?",
      "What is one thing you want us to remember?",
      "What should our next little adventure be?",
      "What is one thing you appreciate about yourself?",
      "What would you name this chapter?",
      "In one sentence, describe what this experience meant to you."
    ]
  }
];

/* =========================================================
   APP STATE
========================================================= */

let currentUser = null;
let currentProfile = null;
let currentRoom = null;
let currentRound = null;
let roomMembers = [];
let myAnswer = null;
let partnerAnswer = null;
let currentStage = 0;
let currentQuestion = 0;
let authMode = "register";
let realtimeChannel = null;
let refreshBusy = false;

const $ = (id) => document.getElementById(id);

function showScreen(name) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  const target = $(name);
  if (target) target.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setMessage(id, message) {
  const element = $(id);
  if (element) element.textContent = message || "";
}

function setButton(id, text, disabled = false) {
  const button = $(id);
  if (!button) return;
  button.textContent = text;
  button.disabled = disabled;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function usernameEmail(username) {
  return `${username.toLowerCase()}@twoofus.invalid`;
}

function getPartner() {
  return roomMembers.find(
    (member) => member.user_id !== currentUser?.id
  );
}

function getMyMember() {
  return roomMembers.find(
    (member) => member.user_id === currentUser?.id
  );
}

/* =========================================================
   AUTHENTICATION
========================================================= */

function setAuthMode(mode) {
  authMode = mode;

  if ($("registerTab")) {
    $("registerTab").classList.toggle("active", mode === "register");
  }

  if ($("loginTab")) {
    $("loginTab").classList.toggle("active", mode === "login");
  }

  setButton(
    "authSubmit",
    mode === "register" ? "Create Account" : "Log In"
  );

  setMessage("authMessage", "");
}

$("registerTab")?.addEventListener("click", () => {
  setAuthMode("register");
});

$("loginTab")?.addEventListener("click", () => {
  setAuthMode("login");
});

$("authForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = $("username")?.value.trim();
  const pin = $("pin")?.value.trim();

  if (!username || !pin) {
    setMessage("authMessage", "Enter your username and PIN.");
    return;
  }

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    setMessage(
      "authMessage",
      "Use 3–20 letters, numbers or underscores for your username."
    );
    return;
  }

  if (!/^\d{6,12}$/.test(pin)) {
    setMessage("authMessage", "Your PIN must contain 6–12 digits.");
    return;
  }

  setButton("authSubmit", "Please wait...", true);
  setMessage("authMessage", "");

  try {
    const email = usernameEmail(username);

    if (authMode === "register") {
      const { error: registerError } = await db.functions.invoke(
        "register",
        {
          body: { username, pin }
        }
      );

      if (registerError) throw registerError;
    }

    const { data, error } = await db.auth.signInWithPassword({
      email,
      password: pin
    });

    if (error) throw error;

    currentUser = data.user;
    await loadProfile(username);

    await openDashboard();
  } catch (error) {
    console.error(error);

    setMessage(
      "authMessage",
      error.message || "Something went wrong. Please try again."
    );
  } finally {
    setButton(
      "authSubmit",
      authMode === "register" ? "Create Account" : "Log In"
    );
  }
});

async function loadProfile(usernameFallback) {
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .single();

  if (error) {
    throw new Error(
      "Your profile could not be loaded. Check the profiles table and its access policies."
    );
  }

  currentProfile = data;
  currentProfile.username =
    data.username || usernameFallback || "Player";
}

/* =========================================================
   DASHBOARD
========================================================= */

async function openDashboard() {
  if ($("playerName")) {
    $("playerName").textContent =
      currentProfile?.username || "Player";
  }

  await findMyRoom();
  showScreen("dashboard");
}

async function findMyRoom() {
  const { data: membership, error } = await db
    .from("room_members")
    .select("room_id")
    .eq("user_id", currentUser.id)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(error);
    return;
  }

  if (!membership) {
    currentRoom = null;
    setMessage("roomMessage", "Create a room or join a room.");
    return;
  }

  await loadRoom(membership.room_id);
}

$("createRoom")?.addEventListener("click", createRoom);
$("joinRoom")?.addEventListener("click", joinRoom);
$("logout")?.addEventListener("click", logout);

async function createRoom() {
  setMessage("roomMessage", "Creating your private room...");

  try {
    const { data, error } = await db.rpc("create_room");

    if (error) throw error;

    const room = Array.isArray(data) ? data[0] : data;
    const roomId = room?.room_id || room?.id;

    if (!roomId) {
      throw new Error("The create_room function did not return a room ID.");
    }

    await loadRoom(roomId);
  } catch (error) {
    console.error(error);
    setMessage("roomMessage", error.message);
  }
}

async function joinRoom() {
  const code = prompt("Enter the room invitation code:");

  if (!code) return;

  setMessage("roomMessage", "Joining room...");

  try {
    const { data, error } = await db.rpc("join_room", {
      p_code: code.trim().toUpperCase()
    });

    if (error) throw error;

    const result = Array.isArray(data) ? data[0] : data;
    const roomId = result?.room_id || result?.id;

    if (!roomId) {
      throw new Error("The join_room function did not return a room ID.");
    }

    await loadRoom(roomId);
  } catch (error) {
    console.error(error);
    setMessage("roomMessage", error.message);
  }
}

/* =========================================================
   ROOM LOADING AND MEMBERS
========================================================= */

async function loadRoom(roomId) {
  const { data: room, error: roomError } = await db
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .single();

  if (roomError) throw roomError;

  currentRoom = room;

  const { data: members, error: memberError } = await db
    .from("room_members")
    .select("user_id, profiles(username)")
    .eq("room_id", roomId);

  if (memberError) throw memberError;

  roomMembers = members || [];

  if (roomMembers.length > 2) {
    throw new Error("This room has more than two members. Please contact support.");
  }

  if (!roomMembers.some((member) => member.user_id === currentUser.id)) {
    throw new Error("You are not a member of this room.");
  }

  if ($("inviteCode")) {
    $("inviteCode").textContent = room.code || "Loading...";
  }

  await refreshRound();

  subscribeToRoom(roomId);

  if (roomMembers.length < 2) {
    updateWaitingScreen();
    showScreen("waiting");
  } else {
    await openGameFromRoom();
  }
}

function updateWaitingScreen() {
  const first = roomMembers[0];
  const second = roomMembers[1];

  if ($("roomCode")) {
    $("roomCode").textContent = currentRoom?.code || "------";
  }

  if ($("firstPlayer")) {
    $("firstPlayer").textContent =
      first?.profiles?.username || "Waiting...";
  }

  if ($("secondPlayer")) {
    $("secondPlayer").textContent =
      second?.profiles?.username || "Waiting for player two...";
  }

  setMessage(
    "waitingMessage",
    roomMembers.length === 2
      ? "Both players are here. Let the game begin!"
      : "Share your invitation code with one person."
  );
}

$("copyRoomCode")?.addEventListener("click", async () => {
  const code = currentRoom?.code;

  if (!code) return;

  try {
    await navigator.clipboard.writeText(code);
    setMessage("waitingMessage", "Invitation code copied!");
  } catch {
    setMessage("waitingMessage", `Your invitation code is ${code}`);
  }
});

/* =========================================================
   ROUND AND QUESTION STATE
========================================================= */

async function refreshRound() {
  if (!currentRoom) return;

  const { data, error } = await db
    .from("rounds")
    .select("*")
    .eq("room_id", currentRoom.id)
    .eq("status", "active")
    .order("round_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  currentRound = data;

  if (currentRound) {
    currentStage = Number(currentRound.current_stage || 0);
    currentQuestion = Number(currentRound.current_question || 0);
  }
}

async function openGameFromRoom() {
  if (roomMembers.length < 2) {
    updateWaitingScreen();
    showScreen("waiting");
    return;
  }

  if (!currentRound) {
    showStageIntro();
    return;
  }

  if (currentStage >= STAGES.length) {
    await showFinishedScreen();
    return;
  }

  await loadQuestion();
}

function showStageIntro() {
  const stage = STAGES[currentStage];

  if (!stage) {
    showFinishedScreen();
    return;
  }

  if ($("stageNumber")) {
    $("stageNumber").textContent = `Stage ${currentStage + 1} of 10`;
  }

  if ($("stageTitle")) {
    $("stageTitle").textContent = stage.title;
  }

  if ($("stageDescription")) {
    $("stageDescription").textContent = stage.description;
  }

  showScreen("stageIntro");
}

$("startStage")?.addEventListener("click", async () => {
  if (!currentRound) {
    setMessage("stageDescription", "The game round has not been created yet.");
    return;
  }

  await loadQuestion();
});

/* =========================================================
   ANSWERS
========================================================= */

async function loadQuestion() {
  if (!currentRound || roomMembers.length !== 2) return;

  if (currentStage >= STAGES.length) {
    await showFinishedScreen();
    return;
  }

  if (currentQuestion >= 10) {
    showStageComplete();
    return;
  }

  const stage = STAGES[currentStage];
  const question = stage.questions[currentQuestion];

  if ($("stageLabel")) {
    $("stageLabel").textContent =
      `Stage ${currentStage + 1}: ${stage.title}`;
  }

  if ($("questionCount")) {
    $("questionCount").textContent =
      `Question ${currentQuestion + 1} of 10`;
  }

  if ($("progressBar")) {
    $("progressBar").style.width =
      `${((currentQuestion + 1) / 10) * 100}%`;
  }

  if ($("gameCategory")) {
    $("gameCategory").textContent = stage.title;
  }

  if ($("questionText")) {
    $("questionText").textContent = question;
  }

  if ($("myName")) {
    $("myName").textContent =
      currentProfile?.username || "You";
  }

  if ($("partnerName")) {
    $("partnerName").textContent =
      getPartner()?.profiles?.username || "Partner";
  }

  if ($("myAnswer")) {
    $("myAnswer").value = "";
    $("myAnswer").disabled = false;
  }

  myAnswer = null;
  partnerAnswer = null;

  await loadExistingAnswers();
  showScreen("game");
}

async function loadExistingAnswers() {
  if (!currentRound) return;

  const questionNumber = currentStage * 10 + currentQuestion;

  const { data, error } = await db
    .from("answers")
    .select("user_id, answer")
    .eq("round_id", currentRound.id)
    .eq("question_number", questionNumber);

  if (error) {
    console.error(error);
    return;
  }

  const mine = data.find(
    (answer) => answer.user_id === currentUser.id
  );

  const partner = data.find(
    (answer) => answer.user_id !== currentUser.id
  );

  if (mine) {
    myAnswer = mine.answer;
    if ($("myAnswer")) {
      $("myAnswer").value = mine.answer;
      $("myAnswer").disabled = true;
    }
  }

  if (partner) {
    partnerAnswer = partner.answer;
  }

  updateAnswerStatus();
}

async function submitAnswer() {
  const answer = $("myAnswer")?.value.trim();

  if (!answer) {
    setMessage("gameMessage", "Write your answer first.");
    return;
  }

  if (!currentRound) return;

  const questionNumber = currentStage * 10 + currentQuestion;

  setMessage("gameMessage", "Saving your answer...");

  const { error } = await db
    .from("answers")
    .upsert(
      {
        round_id: currentRound.id,
        room_id: currentRoom.id,
        question_number: questionNumber,
        user_id: currentUser.id,
        answer
      },
      {
        onConflict: "round_id,question_number,user_id"
      }
    );

  if (error) {
    console.error(error);
    setMessage("gameMessage", error.message);
    return;
  }

  myAnswer = answer;

  if ($("myAnswer")) {
    $("myAnswer").disabled = true;
  }

  setMessage("gameMessage", "Your answer has been saved!");
  await loadExistingAnswers();
  updateAnswerStatus();
}

function updateAnswerStatus() {
  const mineDone = Boolean(myAnswer);
  const partnerDone = Boolean(partnerAnswer);

  if ($("myStatus")) {
    $("myStatus").textContent =
      mineDone ? "Your answer is saved ✓" : "Your answer is pending";
  }

  if ($("partnerStatus")) {
    $("partnerStatus").textContent =
      partnerDone ? "Partner has answered ✓" : "Waiting for partner...";
  }

  if ($("partnerAnswer")) {
    $("partnerAnswer").textContent =
      partnerDone ? partnerAnswer : "Waiting for their answer...";
  }

  const next = $("nextButton");
  if (next) {
    next.disabled = !(mineDone && partnerDone);
  }
}

if ($("myAnswer")) {
  const submit = document.createElement("button");
  submit.type = "button";
  submit.id = "submitAnswerButton";
  submit.textContent = "Save My Answer";
  submit.addEventListener("click", submitAnswer);
  $("myAnswer").insertAdjacentElement("afterend", submit);
}

/* =========================================================
   NEXT QUESTION — SERVER VALIDATES BOTH ANSWERS
========================================================= */

$("nextButton")?.addEventListener("click", async () => {
  if (!myAnswer || !partnerAnswer) {
    setMessage("gameMessage", "Both players must answer first.");
    return;
  }

  setButton("nextButton", "Moving...", true);

  try {
    const { error } = await db.rpc("advance_question", {
      p_room_id: currentRoom.id
    });

    if (error) throw error;

    await refreshRound();

    if (currentQuestion >= 10) {
      showStageComplete();
    } else {
      await loadQuestion();
    }
  } catch (error) {
    console.error(error);
    setMessage("gameMessage", error.message);
  } finally {
    setButton("nextButton", "Next Question", false);
    updateAnswerStatus();
  }
});

/* =========================================================
   STAGE COMPLETION
========================================================= */

function showStageComplete() {
  const stage = STAGES[currentStage];

  if ($("stageCompleteText")) {
    $("stageCompleteText").textContent =
      `You completed ${stage.title}!`;
  }

  showScreen("stageComplete");
}

$("nextStage")?.addEventListener("click", async () => {
  await refreshRound();

  if (currentStage >= STAGES.length) {
    await showFinishedScreen();
  } else {
    showStageIntro();
  }
});

/* =========================================================
   FINAL SCREEN AND ANSWER REVIEW
========================================================= */

async function showFinishedScreen() {
  setMessage(
    "replayMessage",
    "You completed all ten stages. You can review your answers or request another round together."
  );

  showScreen("finished");
}

$("reviewAnswers")?.addEventListener("click", showReview);

async function showReview() {
  if (!currentRound) return;

  const { data, error } = await db
    .from("answers")
    .select("question_number, user_id, answer")
    .eq("round_id", currentRound.id)
    .order("question_number");

  if (error) {
    setMessage("reviewContent", error.message);
    return;
  }

  const grouped = {};

  (data || []).forEach((answer) => {
    const number = answer.question_number;
    if (!grouped[number]) grouped[number] = {};
    grouped[number][answer.user_id] = answer.answer;
  });

  let html = "";

  STAGES.forEach((stage, stageIndex) => {
    html += `<h3>${escapeHTML(stage.title)}</h3>`;

    stage.questions.forEach((question, questionIndex) => {
      const number = stageIndex * 10 + questionIndex;
      const item = grouped[number] || {};

      html += `
        <article class="review-question">
          <strong>${escapeHTML(question)}</strong>
          <p><b>${escapeHTML(currentProfile.username)}:</b>
          ${escapeHTML(item[currentUser.id] || "No answer")}</p>
          <p><b>${escapeHTML(getPartner()?.profiles?.username || "Partner")}:</b>
          ${escapeHTML(
            item[getPartner()?.user_id] || "No answer"
          )}</p>
        </article>
      `;
    });
  });

  if ($("reviewContent")) {
    $("reviewContent").innerHTML = html;
  }

  showScreen("review");
}

/* =========================================================
   REPLAY — BOTH PLAYERS MUST REQUEST
========================================================= */

$("requestReplay")?.addEventListener("click", async () => {
  if (!currentRoom) return;

  setButton("requestReplay", "Sending request...", true);

  try {
    const { data, error } = await db.rpc("request_replay", {
      p_room_id: currentRoom.id
    });

    if (error) throw error;

    const result = Array.isArray(data) ? data[0] : data;

    if (result?.started) {
      setMessage("replayMessage", "A new round has started!");
      await refreshRound();
      await loadQuestion();
    } else {
      setMessage(
        "replayMessage",
        "Your replay request is saved. Waiting for the other player to agree."
      );
    }
  } catch (error) {
    console.error(error);
    setMessage("replayMessage", error.message);
  } finally {
    setButton("requestReplay", "Request Replay", false);
  }
});

/* =========================================================
   REALTIME — KEEP BOTH SCREENS UPDATED
========================================================= */

function subscribeToRoom(roomId) {
  if (realtimeChannel) {
    db.removeChannel(realtimeChannel);
  }

  realtimeChannel = db
    .channel(`two-of-us-room-${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "answers",
        filter: `room_id=eq.${roomId}`
      },
      async () => {
        if (refreshBusy) return;
        refreshBusy = true;

        try {
          await loadExistingAnswers();
          updateAnswerStatus();
        } finally {
          refreshBusy = false;
        }
      }
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "room_members",
        filter: `room_id=eq.${roomId}`
      },
      async () => {
        await loadRoom(roomId);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "rounds",
        filter: `room_id=eq.${roomId}`
      },
      async () => {
        await refreshRound();
        await openGameFromRoom();
      }
    )
    .subscribe();
}

/* =========================================================
   LOGOUT
========================================================= */

async function logout() {
  if (realtimeChannel) {
    await db.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }

  await db.auth.signOut();

  currentUser = null;
  currentProfile = null;
  currentRoom = null;
  currentRound = null;
  roomMembers = [];

  showScreen("welcome");
}

/* =========================================================
   SESSION RESTORE
========================================================= */

async function restoreSession() {
  try {
    const { data, error } = await db.auth.getSession();

    if (error) throw error;

    const session = data.session;

    if (!session) {
      showScreen("welcome");
      return;
    }

    currentUser = session.user;

    await loadProfile();
    await openDashboard();
  } catch (error) {
    console.error("Session restore:", error);
    showScreen("welcome");
  }
}

/* =========================================================
   INITIALISE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  restoreSession();
});
