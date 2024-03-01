// starting from https://blosmusic.github.io/pitch-detection/

let onOffBtnTone = document.querySelector("#tone-io");
let freqDisplay = document.querySelector("#pitch");
let noteDisplay = document.querySelector("#note");
const fftBins = 2048;

document.querySelectorAll(".start").forEach(x=>{x.addEventListener("click", async () => {
  await Tone.start();
  console.log("audio is ready");
  if (x.innerText === "START") {
    readPitch();
  } else if (x.innerText === "STOP") {
    stopPitch();
  }
});
});

// get microphone input
const meter = new Tone.Meter(0.8);
const micFFT = new Tone.FFT(fftBins);
let inputLevelValueRead = null;
let inputIsBeingRead;
const mic = new Tone.UserMedia().chain(micFFT, meter);

function readPitch() {
    document.querySelectorAll(".start").forEach(x=>{x.innerText = "STOP";});
  console.log("readPitch called");
  mic.open().then(() => {
    console.log("mic open");
    // read input level
    inputIsBeingRead = setInterval(() => {
      //   readAudioInputLevel();
      frequencyOfInput();
    }, 50);
  });
}

function stopPitch() {
    document.querySelectorAll(".start").forEach(x=>{x.innerText = "STOP";});
//   console.log("stopPitch called");
  clearAudioInputLevel();
}

// read input level - check if mic is open
function readAudioInputLevel() {
//   console.log("processAudioInputLevel called");
  inputLevelValueRead = meter.getValue().toFixed(2);
  // print the incoming mic levels in decibels
  console.log("The Decibel level is:", inputLevelValueRead, "dB");
}

function clearAudioInputLevel() {
  mic.close();
  console.log("mic closed");
  clearInterval(inputIsBeingRead);
}

// read frequency of input
// function frequencyOfInput() {
//   let fftValues = micFFT.getValue();
//   console.log("The FFT values are:", fftValues);

//   let max = -Infinity;
//   let maxIndex = -1;
//   for (let i = 0; i < fftValues.length; i++) {
//     if (fftValues[i] > max) {
//       max = fftValues[i];
//       maxIndex = i;
//       // console.log("maxIndex is:", maxIndex);
//     }
//   }




//   let freq = ((maxIndex * (Tone.context.sampleRate / 2)) / fftBins).toFixed(3);
//   // let freq = ((maxIndex * (44100 / 2)) / fftBins).toFixed(3);
//   console.log("tone.js frequency is:", freq, "Hz");

//   freqDisplay.innerHTML = freq;
//   noteDisplay.innerText = Tone.Frequency(freq, "hz").toNote();
// }

// function frequencyOfInput() {
//     let fftValues = micFFT.getValue();
//     console.log("The FFT values are:", fftValues);
  
//     let max1 = -Infinity, max2 = -Infinity, max3 = -Infinity;
//     let maxIndex1 = -1, maxIndex2 = -1, maxIndex3 = -1;
//     for (let i = 0; i < fftValues.length; i++) {
//       if (fftValues[i] > max1) {
//         max3 = max2;
//         maxIndex3 = maxIndex2;
//         max2 = max1;
//         maxIndex2 = maxIndex1;
//         max1 = fftValues[i];
//         maxIndex1 = i;
//       } else if (fftValues[i] > max2) {
//         max3 = max2;
//         maxIndex3 = maxIndex2;
//         max2 = fftValues[i];
//         maxIndex2 = i;
//       } else if (fftValues[i] > max3) {
//         max3 = fftValues[i];
//         maxIndex3 = i;
//       }
//     }
  
//     let freq1 = ((maxIndex1 * (Tone.context.sampleRate / 2)) / fftBins).toFixed(3);
//     let freq2 = ((maxIndex2 * (Tone.context.sampleRate / 2)) / fftBins).toFixed(3);
//     let freq3 = ((maxIndex3 * (Tone.context.sampleRate / 2)) / fftBins).toFixed(3);
//     console.log("tone.js frequencies are:", freq1, freq2, freq3, "Hz");
  
//     freqDisplay.innerHTML = freq1 + ', ' + freq2 + ', ' + freq3;
//     noteDisplay.innerText = Tone.Frequency(freq1, "hz").toNote() + ', ' + 
//                             Tone.Frequency(freq2, "hz").toNote() + ', ' + 
//                             Tone.Frequency(freq3, "hz").toNote();
//   }

function frequencyOfInput(numVoices=4) {
    let fftValues = micFFT.getValue();
    console.log("The FFT values are:", fftValues);
  
    // Initialize the priority queue with dummy values
    let maxValues = Array(numVoices).fill(-Infinity);
    let maxIndices = Array(numVoices).fill(-1);
  
    for (let i = 0; i < fftValues.length; i++) {
      if (fftValues[i] > maxValues[0]) {
        // Replace the smallest value and its index
        maxValues[0] = fftValues[i];
        maxIndices[0] = i;
  
        // Re-sort the arrays to keep the smallest value at the front
        for (let j = 1; j < numVoices; j++) {
          if (maxValues[j] < maxValues[j - 1]) {
            [maxValues[j], maxValues[j - 1]] = [maxValues[j - 1], maxValues[j]];
            [maxIndices[j], maxIndices[j - 1]] = [maxIndices[j - 1], maxIndices[j]];
          } else {
            break;
          }
        }
      }
    }
  
    let freqs = maxIndices.map(index => ((index * (Tone.context.sampleRate / 2)) / fftBins).toFixed(3));
    console.log("tone.js frequencies are:", freqs, "Hz");
  
    freqDisplay.innerHTML = freqs.join(', ');
    noteDisplay.innerText = freqs.map(freq => Tone.Frequency(freq, "hz").toNote()).join(', ');
  }