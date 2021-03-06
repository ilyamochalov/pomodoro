'use strict';
const electron = require('electron');
const { ipcRenderer } = electron;
const BrowserWindow = require('electron').remote.BrowserWindow;

let startButton = document.getElementById('start_button');
let pauseButton = document.getElementById('pause_button');
let resetButton = document.getElementById('reset_button');
let settingsButton = document.getElementById('settings_button');
let settingsBox = document.querySelector('.settings-box');
let countdownMinutes = document.getElementById('countdown_minutes');
let countdownSeconds = document.getElementById('countdown_seconds');
let radioButtons = document.getElementsByName("clockMode");
let draggablePart = document.querySelector(".draggable");
let annoyingNotificationsCheckBox = document.getElementById("annoyingNotifications");

let isPaused = false;
let defaultDuration = {
    work: 1500,
    rest: 300,
};
let currentCountdown = 0;
let isActive = false; // global status (true when has a countdown, false otherwise)

updateCountdownHTML(toMinutesAndSeconds(defaultDuration[checkForMode()]));

startButton.addEventListener('click', countdownRoutine);

pauseButton.addEventListener('click', pauseCountdown);

resetButton.addEventListener('click', resetCountdown);

settingsButton.addEventListener('click', toggleSettings);


for (let button of radioButtons) {
    button.addEventListener('click', function (event) {
        resetCountdown()
    })
}

// send notifications every minute to remind user to rest or work 
setInterval(function () {
    if (!isActive && annoyingNotificationsCheckBox.checked) {
        notify('What are you up to? Are you working or resting?')
    }
}, 1000 * 60);

function countdownRoutine() {
    // remove pause 
    isPaused = false;
    isActive = true;

    currentCountdown = currentCountdown || defaultDuration[checkForMode()];

    let timeout_for_countdown = setInterval(function () {

        if (currentCountdown > 0 && !isPaused) { //counting down
            currentCountdown -= 1;
            updateCountdownHTML(toMinutesAndSeconds(currentCountdown));
        } else if (currentCountdown > 0) { // paused
            clearInterval(timeout_for_countdown);
            isActive = false;
        } else { // time is up
            notify(`Time is up for ${checkForMode()}`);
            clearInterval(timeout_for_countdown);
            isActive = false;
        }
    }, 1000);
}

function pauseCountdown() {
    isPaused = true
}

function resetCountdown() {
    pauseCountdown();
    currentCountdown = defaultDuration[checkForMode()];
    updateCountdownHTML(toMinutesAndSeconds(currentCountdown));
}

/**
 * Returns an object with keys minutes, seconds 
 *
 * @param {*} seconds - number of seconds
 */
function toMinutesAndSeconds(totalSeconds) {
    let totalSecondsInt = parseInt(totalSeconds);
    let minutes = Math.floor(totalSecondsInt / 60);
    let seconds = totalSecondsInt - (minutes * 60);

    return {
        minutes,
        seconds
    }
}

/**
 *
 *
 * @param {*} minutes
 * @param {*} seconds
 * @returns integer representation of total seconds
 */
function toSeconds(minutes, seconds) {
    let minutesInt = parseInt(minutes);
    let secondsInt = parseInt(seconds);

    return ((minutesInt * 60) + secondsInt)
}

/**
 * Refreshes HTML countdown text
 *
 * @param {*} countdown object with minutes and seconds
 */
function updateCountdownHTML(countdown) {
    countdownMinutes.innerHTML = countdown.minutes < 10 ? "0" + countdown.minutes : countdown.minutes;
    countdownSeconds.innerHTML = countdown.seconds < 10 ? "0" + countdown.seconds : countdown.seconds;
}


/**
 * Trigger a notification
 *
 * @param {*} message A string to show in notification body
 */
function notify(message) {
    ipcRenderer.sendSync('notification', message)
}


/**
 * Check current mode
 *
 * @returns string name of current mode (work or rest)
 */
function checkForMode() {
    for (const button of radioButtons) {
        if (button.checked) return button.value
    }
}

function toggleSettings() {
    resetCountdown();
    if (settingsBox.style.display === 'block') {
        settingsBox.style.display = 'none'
        draggablePart.style.webkitAppRegion = 'drag'
    } else {
        settingsBox.style.display = 'block'
        draggablePart.style.webkitAppRegion = 'no-drag'
    }
}