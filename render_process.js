'use strict';
const electron = require('electron');
const { ipcRenderer } = electron;


let startButton = document.getElementById('start_button');
let pauseButton = document.getElementById('pause_button');
let resetButton = document.getElementById('reset_button');
let countdownMinutes = document.getElementById('countdown_minutes');
let countdownSeconds = document.getElementById('countdown_seconds');
let isPaused = false;
let defaultDuration = 1500;
let currentCountdown = 0;


updateCountdownHTML(toMinutesAndSeconds(defaultDuration));

startButton.addEventListener('click', countdownRoutine);

pauseButton.addEventListener('click', pauseCountdown);

resetButton.addEventListener('click', resetCountdown);

function countdownRoutine() {
    // remove pause 
    isPaused = false

    currentCountdown = currentCountdown || defaultDuration

    let timeout_for_countdown = setInterval(function () {

        if (currentCountdown > 0 && !isPaused) {
            currentCountdown -= 1;
            updateCountdownHTML(toMinutesAndSeconds(currentCountdown));
        } else {
            clearInterval(timeout_for_countdown)
        }
    }, 1000);
}

function pauseCountdown() {
    isPaused = true
}

function resetCountdown() {
    pauseCountdown();
    currentCountdown = defaultDuration;
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
    countdownMinutes.innerHTML = countdown.minutes;
    countdownSeconds.innerHTML = countdown.seconds;
}