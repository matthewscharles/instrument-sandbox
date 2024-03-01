// adapted from https://ianjohnson.dev/pitchy/playground.html

import { PitchDetector } from "https://esm.sh/pitchy@4";
import * as CM from "https://cdn.jsdelivr.net/npm/@matthewscharles/cm-toolbox@1.2.1/dist/cm-toolbox.es.js";

const history = [];
let historyLength = 100;

let minVolumeDecibels = -10;
let minClarityPercent = 95;
let [minPitch, maxPitch] = [60, 10000];

let [overrideSampleRate, desiredSampleRate, sampleRate] = [
false,
44100,
null,
];

let inputBufferSize = 2048;

let canvas;
let micStream, analyserNode, detector, inputBuffer;

let intervalHandle;

let pitchBuffer = '';

function drawGraph() {
    if (!canvas) return;

    const [w, h] = [canvas.width, canvas.height];
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);

    const matchesConditions = ([pitch, clarity]) =>
        pitch >= minPitch &&
        pitch <= maxPitch &&
        100 * clarity >= minClarityPercent;
    const filteredHistory = history.filter(matchesConditions);
    if (filteredHistory.length == 0) {
        canvas.innerText = "No pitches recorded";
        return;
    }

    const headingHeight = 100;
    const labelWidth = 100;
    const yPadding = 20;

    let [lastPitch, lastClarityPercent] =
        filteredHistory[filteredHistory.length - 1];
    lastPitch = Math.round(lastPitch * 10) / 10;
    lastClarityPercent = Math.round(lastClarityPercent * 1000) / 10;

    canvas.innerText = `Last pitch: ${lastPitch.toFixed(1,)} Hz at ${lastClarityPercent.toFixed(1)}% clarity`;

    const filteredPitches = filteredHistory.map(([pitch]) => pitch);
    const logMin = Math.log2(Math.min(...filteredPitches));
    const logMax = Math.log2(Math.max(...filteredPitches));
    const xOffset =
        ((w - labelWidth) * (historyLength - history.length)) / historyLength;
    const x = (i) => xOffset + ((w - labelWidth) * i) / (historyLength - 1);
    const y = (v) =>
        headingHeight +
        yPadding +
        (h - headingHeight - 2 * yPadding) *
        (1 - (Math.log2(v) - logMin) / (logMax - logMin));

    ctx.font = "16px system-ui, -apple-system";
    ctx.fillStyle = "#111111";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
        `${Tone.Frequency(lastPitch.toFixed(1)).toNote()}: ${lastPitch.toFixed(1)} Hz (${lastClarityPercent.toFixed(1)}%)`,
        w / 2,
        headingHeight / 2,
        w,
    );

    // let newPitch = Tone.Frequency(lastPitch.toFixed(1)).toNote();
    // if(pitchBuffer != newPitch){
    //     pitchBuffer = newPitch;
    //     console.log(pitchBuffer);
    // }
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#1e9be9";
    ctx.beginPath();

    for (let i = 0; i < history.length; i++) {
        if (
        i > 0 &&
        matchesConditions(history[i - 1]) &&
        matchesConditions(history[i])
        ) {
        ctx.lineTo(x(i), y(history[i][0]));
        } else {
        ctx.moveTo(x(i), y(history[i][0]));
        }
    }
    ctx.stroke();

    ctx.font = "16px system-ui, -apple-system";
    ctx.fillStyle = "#111111";
    ctx.strokeStyle = "#aaaaaa";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.beginPath();
    ctx.moveTo(0, y(lastPitch));
    ctx.lineTo(w - labelWidth, y(lastPitch));
    ctx.stroke();
    ctx.fillText(
        `${lastPitch.toFixed(1)} Hz`,
        w - labelWidth,
        y(lastPitch),
        labelWidth,
    );
}

function updatePitch() {
    const matchesConditions = ([pitch, clarity]) =>
    pitch >= minPitch &&
    pitch <= maxPitch &&
    100 * clarity >= minClarityPercent;

const filteredHistory = history.filter(matchesConditions);
if (filteredHistory.length == 0) {
    canvas.innerText = "No pitches recorded";
    return;
}

const headingHeight = 100;
const labelWidth = 100;
const yPadding = 20;

let [lastPitch, lastClarityPercent] =
    filteredHistory[filteredHistory.length - 1];
lastPitch = Math.round(lastPitch * 10) / 10;
lastClarityPercent = Math.round(lastClarityPercent * 1000) / 10;

let newPitch = Tone.Frequency(lastPitch.toFixed(1)).toNote();
if(pitchBuffer != newPitch){
    pitchBuffer = newPitch;
    console.log(pitchBuffer);
}
    if (!analyserNode || !detector || !sampleRate || !inputBuffer) return;

    analyserNode.getFloatTimeDomainData(inputBuffer);
    history.push(detector.findPitch(inputBuffer, sampleRate));
    if (history.length > historyLength) {
        history.shift();
    }
    }

    function setUpdatePitchInterval(interval) {
    if (intervalHandle !== undefined) {
        clearInterval(intervalHandle);
    }
   
    
    
    intervalHandle = setInterval(() => {
        updatePitch();
        // drawGraph();
    }, interval);
}

function resetAudioContext() {
sampleRate = analyserNode = inputBuffer = null;
const actualSampleRate = document.getElementById("actual-sample-rate");
const actualInputBufferSize = document.getElementById(
    "actual-input-buffer-size",
);
actualSampleRate.innerText = actualInputBufferSize.innerText = "Unset";

const audioContextOptions = {};
if (overrideSampleRate) {
    audioContextOptions.sampleRate = desiredSampleRate;
}
const audioContext = new AudioContext(audioContextOptions);
sampleRate = audioContext.sampleRate;
actualSampleRate.innerText = sampleRate.toFixed();

analyserNode = new AnalyserNode(audioContext, {
    fftSize: inputBufferSize,
});
audioContext.createMediaStreamSource(micStream).connect(analyserNode);
detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
detector.minVolumeDecibels = minVolumeDecibels;
inputBuffer = new Float32Array(detector.inputLength);
actualInputBufferSize.innerText = inputBuffer.length.toFixed();
}

document
.getElementById("reset-audio-context")
.addEventListener("click", () => {
    resetAudioContext();
});

document.getElementById("clear-history").addEventListener("click", () => {
history.splice(0, history.length);
});

const refreshIntervalInput = document.getElementById("refresh-interval");
refreshIntervalInput.addEventListener("change", () => {
setUpdatePitchInterval(Number.parseFloat(refreshIntervalInput.value));
});

const historyLengthInput = document.getElementById("history-length");
historyLengthInput.addEventListener("change", () => {
historyLength = Number.parseFloat(historyLengthInput.value);
});

const desiredSampleRateInput = document.getElementById("sample-rate");
desiredSampleRateInput.addEventListener("change", () => {
sampleRate = Number.parseFloat(desiredSampleRateInput.value);
resetAudioContext();
});

const overrideSampleRateInput = document.getElementById(
"override-sample-rate",
);
overrideSampleRateInput.addEventListener("change", () => {
overrideSampleRate = overrideSampleRateInput.checked;
desiredSampleRateInput.disabled = !overrideSampleRate;
resetAudioContext();
});

const inputBufferSizeInput = document.getElementById("input-buffer-size");
inputBufferSizeInput.addEventListener("change", () => {
inputBufferSize = Number.parseFloat(inputBufferSizeInput.value);
resetAudioContext();
});

const minVolumeDecibelsInput = document.getElementById(
"min-volume-decibels",
);
minVolumeDecibelsInput.addEventListener("change", () => {
minVolumeDecibels = Number.parseFloat(minVolumeDecibelsInput.value);
if (detector) detector.minVolumeDecibels = minVolumeDecibels;
});

const minClarityPercentInput = document.getElementById(
"min-clarity-percent",
);
minClarityPercentInput.addEventListener("change", () => {
minClarityPercent = Number.parseFloat(minClarityPercentInput.value);
});

const minPitchInput = document.getElementById("min-pitch");
minPitchInput.addEventListener("change", () => {
minPitch = Number.parseFloat(minPitchInput.value);
});

const maxPitchInput = document.getElementById("max-pitch");
maxPitchInput.addEventListener("change", () => {
maxPitch = Number.parseFloat(maxPitchInput.value);
});

document.addEventListener("DOMContentLoaded", () => {
canvas = document.getElementById("pitch-graph");

setUpdatePitchInterval(50);

navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    micStream = stream;
    resetAudioContext();
});
});