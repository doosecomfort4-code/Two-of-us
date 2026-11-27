
/* TWO OF US — PAGE NAVIGATION */

function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");

  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  const selectedScreen = document.getElementById(screenId);

  if (selectedScreen) {
    selectedScreen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* REGISTER AND LOGIN TABS */

let authMode = "register";

function setAuthMode(mode) {
  authMode = mode;

  document.getElementById("registerTab")
    .classList.toggle("active", mode === "register");

  document.getElementById("loginTab")
    .classList.toggle("active", mode === "login");

  document.getElementById("authSubmit").textContent =
    mode === "register" ? "Create my account" : "Log in";

  document.getElementById("authMessage").textContent = "";
}

/* ACCOUNT FORM */

document.getElementById("authForm").addEventListener("submit", function(event) {
  event.preventDefault();

  document.getElementById("authMessage").textContent =
    "Your account system is not connected yet. Please wait for the secure setup.";
});

/* TEMPORARY FEATURE MESSAGES */

function createRoom() {
  document.getElementById("roomMessage").textContent =
    "Room creation will be available after connecting the secure database.";
}

function joinRoom() {
  document.getElementById("roomMessage").textContent =
    "Room joining will be available after connecting the secure database.";
}

function logout() {
  showScreen("welcome");
}

function copyRoomCode() {
  alert("Your room code will be available after room setup.");
}

function startStage() {
  alert("The question system is coming next.");
}

function nextQuestion() {
  alert("The question system is coming next.");
}

function nextStage() {
  alert("The stage system is coming next.");
}

function requestReplay() {
  document.getElementById("replayMessage").textContent =
    "Replay will be available after connecting both players.";
}

function reviewAnswers() {
  document.getElementById("reviewContent").textContent =
    "Your saved answers will appear here once the database is connected.";

  showScreen("review");
}
