'use strict';
const electron = require('electron');
const { ipcRenderer } = electron;
const BrowserWindow = require('electron').remote.BrowserWindow;

let startButton = document.getElementById('start_button');
let pauseButton = document.getElementById('pause_button');
let resetButton = document.getElementById('reset_button');
let settingsButton = document.getElementById('settings_button');
let settingsBox = document.getElementsByClassName('settings-box');
let countdownMinutes = document.getElementById('countdown_minutes');
let countdownSeconds = document.getElementById('countdown_seconds');
let radioButtons = document.getElementsByName("clockMode")
let isPaused = false;
let defaultDuration = {
    work: 1500,
    rest: 300,
};
let currentCountdown = 0;
let settingsWindow

updateCountdownHTML(toMinutesAndSeconds(defaultDuration[checkForMode()]));

startButton.addEventListener('click', countdownRoutine);

pauseButton.addEventListener('click', pauseCountdown);

resetButton.addEventListener('click', resetCountdown);

settingsButton.addEventListener('click', openSettings);


for (let button of radioButtons) {
    button.addEventListener('click', function(event){
        resetCountdown()
    })
}

function countdownRoutine() {
    // remove pause 
    isPaused = false

    currentCountdown = currentCountdown || defaultDuration[checkForMode()]

    let timeout_for_countdown = setInterval(function () {

        if (currentCountdown > 0 && !isPaused) {
            currentCountdown -= 1;
            updateCountdownHTML(toMinutesAndSeconds(currentCountdown));
        } else if (currentCountdown > 0){
            clearInterval(timeout_for_countdown);
        } else {
            notify();
            clearInterval(timeout_for_countdown);
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

function notify() {
    ipcRenderer.sendSync('notification', `Time is up for ${checkForMode()}`)
}

function checkForMode() {
    for (const button of radioButtons) {
        if (button.checked) return button.value
    }
}

function openSettings(params) {
 
}