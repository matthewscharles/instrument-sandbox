export function drawGraph(canvas, history, historyLength, minPitch, maxPitch, minClarityPercent) {
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
  
    canvas.innerText = `Last pitch: ${lastPitch.toFixed(
      1
    )} Hz at ${lastClarityPercent.toFixed(1)}% clarity`;
  
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
      `${Tone.Frequency(lastPitch.toFixed(1)).toNote()}: ${lastPitch.toFixed(
        1
      )} Hz (${lastClarityPercent.toFixed(1)}%)`,
      w / 2,
      headingHeight / 2,
      w
    );
  
    let newPitch = Tone.Frequency(lastPitch.toFixed(1)).toNote();
    if (pitchBuffer != newPitch) {
      pitchBuffer = newPitch;
      console.log(pitchBuffer);
    }
  
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
      labelWidth
    );
  }