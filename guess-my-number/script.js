// Game variables
let secretNumber
let attempts = 0
let maxNumber = 100 // Default for medium difficulty
const bestScore = localStorage.getItem("bestScore")
  ? JSON.parse(localStorage.getItem("bestScore"))
  : {
      easy: "-",
      medium: "-",
      hard: "-",
    }
let currentDifficulty = "medium"
let gameActive = true

// DOM Elements
const guessInput = document.getElementById("guess-input")
const guessBtn = document.getElementById("guess-btn")
const restartBtn = document.getElementById("restart-btn")
const numberDisplay = document.getElementById("number-value")
const feedback = document.getElementById("feedback")
const attemptsDisplay = document.getElementById("attempts")
const bestScoreDisplay = document.getElementById("best-score")
const historyList = document.getElementById("history-list")
const rangeText = document.getElementById("range-text")

// Difficulty selectors
const easyBtn = document.getElementById("easy")
const mediumBtn = document.getElementById("medium")
const hardBtn = document.getElementById("hard")

// Initialize the game
function initGame() {
  // Set up difficulty listeners
  easyBtn.addEventListener("change", () => setDifficulty("easy"))
  mediumBtn.addEventListener("change", () => setDifficulty("medium"))
  hardBtn.addEventListener("change", () => setDifficulty("hard"))

  // Set up game buttons
  guessBtn.addEventListener("click", checkGuess)
  restartBtn.addEventListener("click", restartGame)

  // Allow Enter key to submit guess
  guessInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      checkGuess()
    }
  })

  // Initialize with current difficulty
  updateBestScoreDisplay()
  generateNewNumber()
}

// Set difficulty level
function setDifficulty(difficulty) {
  if (!gameActive) {
    currentDifficulty = difficulty

    switch (difficulty) {
      case "easy":
        maxNumber = 50
        rangeText.textContent = "1 and 50"
        break
      case "medium":
        maxNumber = 100
        rangeText.textContent = "1 and 100"
        break
      case "hard":
        maxNumber = 200
        rangeText.textContent = "1 and 200"
        break
    }

    guessInput.setAttribute("max", maxNumber)
    updateBestScoreDisplay()
    restartGame()
  } else {
    // If game is active, show confirmation
    if (confirm("Changing difficulty will start a new game. Continue?")) {
      currentDifficulty = difficulty

      switch (difficulty) {
        case "easy":
          maxNumber = 50
          rangeText.textContent = "1 and 50"
          break
        case "medium":
          maxNumber = 100
          rangeText.textContent = "1 and 100"
          break
        case "hard":
          maxNumber = 200
          rangeText.textContent = "1 and 200"
          break
      }

      guessInput.setAttribute("max", maxNumber)
      updateBestScoreDisplay()
      restartGame()
    } else {
      // Reset the radio button to current difficulty
      document.getElementById(currentDifficulty).checked = true
    }
  }
}

// Generate a new secret number
function generateNewNumber() {
  secretNumber = Math.floor(Math.random() * maxNumber) + 1
  console.log(`Secret number: ${secretNumber}`) // For debugging
}

// Update the best score display
function updateBestScoreDisplay() {
  bestScoreDisplay.textContent = bestScore[currentDifficulty]
}

// Check the user's guess
function checkGuess() {
  if (!gameActive) return

  const userGuess = Number(guessInput.value)

  if (!userGuess || userGuess < 1 || userGuess > maxNumber) {
    setFeedback(`Please enter a valid number between 1 and ${maxNumber}.`, "error")
    guessInput.value = ""
    return
  }

  attempts++
  attemptsDisplay.textContent = attempts

  // Add to history
  addToHistory(userGuess)

  if (userGuess === secretNumber) {
    // Correct guess
    numberDisplay.textContent = secretNumber
    document.querySelector(".number-display").classList.add("correct")
    setFeedback(`Correct! You guessed it in ${attempts} attempts.`, "correct")

    // Update best score
    if (bestScore[currentDifficulty] === "-" || attempts < bestScore[currentDifficulty]) {
      bestScore[currentDifficulty] = attempts
      localStorage.setItem("bestScore", JSON.stringify(bestScore))
      updateBestScoreDisplay()
    }

    endGame()
  } else if (userGuess < secretNumber) {
    // Too low
    setFeedback("Too low! Try a higher number.", "too-low")
  } else {
    // Too high
    setFeedback("Too high! Try a lower number.", "too-high")
  }

  // Clear input and focus
  guessInput.value = ""
  guessInput.focus()
}

// Set feedback message with appropriate styling
function setFeedback(message, type) {
  feedback.textContent = message

  // Remove all classes
  feedback.classList.remove("feedback-too-low", "feedback-too-high", "feedback-correct", "feedback-error")

  // Add appropriate class
  feedback.classList.add(`feedback-${type}`)

  // Add pulse animation
  feedback.classList.add("pulse")
  setTimeout(() => {
    feedback.classList.remove("pulse")
  }, 500)
}

// Add guess to history
function addToHistory(guess) {
  const historyItem = document.createElement("span")
  historyItem.textContent = guess
  historyItem.classList.add("history-item")

  if (guess < secretNumber) {
    historyItem.classList.add("too-low")
  } else if (guess > secretNumber) {
    historyItem.classList.add("too-high")
  } else {
    historyItem.classList.add("correct")
  }

  historyList.appendChild(historyItem)

  // Scroll to bottom of history
  historyList.scrollTop = historyList.scrollHeight
}

// End the game
function endGame() {
  gameActive = false
  guessBtn.disabled = true
  guessInput.disabled = true
}

// Restart the game
function restartGame() {
  gameActive = true
  attempts = 0
  attemptsDisplay.textContent = attempts

  guessInput.disabled = false
  guessBtn.disabled = false
  guessInput.value = ""
  guessInput.focus()

  numberDisplay.textContent = "?"
  document.querySelector(".number-display").classList.remove("correct")

  setFeedback("", "")

  // Clear history
  historyList.innerHTML = ""

  // Generate new number
  generateNewNumber()
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", initGame)

