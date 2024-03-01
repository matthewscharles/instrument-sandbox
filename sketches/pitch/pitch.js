// adapted from https://ianjohnson.dev/pitchy/playground.html

import { PitchDetector } from "https://esm.sh/pitchy@4";
import { drawGraph } from "./drawGraph.js";
import * as CM from "https://cdn.jsdelivr.net/npm/@matthewscharles/cm-toolbox@1.2.1/dist/cm-toolbox.es.js";

const history = [];
let historyLength = 100;

let minVolumeDecibels = -10;
let minClarityPercent = 95;
let [minPitch, maxPitch] = [60, 10000];

let [overrideSampleRate, desiredSampleRate, sampleRate] = [false, 44100, null];

let inputBufferSize = 2048;

let canvas;
let micStream, analyserNode, detector, inputBuffer;

let intervalHandle;

window.pitchBuffer = "";



function updatePitch() {
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
    drawGraph(canvas, history, historyLength, minPitch, maxPitch, minClarityPercent);
  }, interval);
}

function resetAudioContext() {
  sampleRate = analyserNode = inputBuffer = null;
  const actualSampleRate = document.getElementById("actual-sample-rate");
  const actualInputBufferSize = document.getElementById(
    "actual-input-buffer-size"
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

document.getElementById("reset-audio-context").addEventListener("click", () => {
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

const overrideSampleRateInput = document.getElementById("override-sample-rate");
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

const minVolumeDecibelsInput = document.getElementById("min-volume-decibels");
minVolumeDecibelsInput.addEventListener("change", () => {
  minVolumeDecibels = Number.parseFloat(minVolumeDecibelsInput.value);
  if (detector) detector.minVolumeDecibels = minVolumeDecibels;
});

const minClarityPercentInput = document.getElementById("min-clarity-percent");
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
