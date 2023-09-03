const pianoKeys = document.querySelectorAll(".piano-keys .key"),
  volumeSlider = document.querySelector(".volume-slider input"),
  keysCheckbox = document.querySelector(".keys-checkbox input");

const noteFreqs = {
  1: 262.5, //  s     c
  2: 269.8,
  3: 277.6, //  r1    c#
  4: 285.8,
  5: 294.4, //  r2    d   g1
  6: 303,
  7: 312.2, // r3    d#  g2
  8: 320.36,
  9: 329.86, //        e   g3
  10: 340,
  11: 349.8, //  m1    f
  12: 360.6,
  13: 370.9, //  m2    f#
  14: 382.2,
  15: 392.9, //        g   p
  16: 402.4,
  17: 416.04, //  d1    g#
  18: 429.2,
  19: 440.9, //  d2    a   n1
  20: 454,
  21: 466.16, // d3    a#  n2
  22: 482,
  23: 493.88, //        b   n3
  24: 509.9,
  25: 524.9,
};

// key-to-note mappings here...
const keyToNoteMap = {
  a: 1,
  s: 2,
  d: 3,
  f: 4,
  g: 5,
  h: 6,
  j: 7,
  k: 8,
  l: 9,
  q: 10,
  w: 11,
  e: 12,
  r: 13,
  t: 14,
  y: 15,
  u: 16,
  i: 17,
  o: 18,
  p: 19,
  z: 20,
  x: 21,
  c: 22,
  v: 23,
  b: 24,
  n: 25,
};

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);

const activeKeys = {}; // Keep track of active keys
const keyState = {}; // Object to track key states

let volume = 0.5;
let oscillator = null;

// Function to handle key press and play sound
function handleKeyPress(key, note) {
  if (!activeKeys[note]) {
    const freq = noteFreqs[note];
    playSound(freq, volume, note);
  }
}
// Function to handle key release and stop sound
function handleKeyRelease(note) {
  stopSound(note);
}

function playSound(freq, volume, note) {
  const oscillator = audioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime); // Set the volume

  oscillator.connect(gainNode);
  oscillator.start();
  activeKeys[note] = oscillator;
}

function stopSound(note) {
  if (activeKeys[note]) {
    activeKeys[note].stop();
    activeKeys[note].disconnect();
    delete activeKeys[note];
  }
}

const handleVolume = (e) => {
  volume = e.target.value;
};

const showHideKeys = () => {
  // toggling hide class from each key on the checkbox click
  pianoKeys.forEach((key) => key.classList.toggle("hide"));
};

pianoKeys.forEach((key) => {
  key.addEventListener("mousedown", () => {
    const note = key.getAttribute("data-note");
    handleKeyPress(note, note);
  });
  key.addEventListener("mouseup", () => {
    const note = key.getAttribute("data-note");
    handleKeyRelease(note);
  });

  key.addEventListener("mouseleave", () => {
    const note = key.getAttribute("data-note");
    handleKeyRelease(note);
  });

  key.addEventListener("touchstart", (event) => {
    event.preventDefault(); // Prevent the default touch event
    const note = li.getAttribute("data-note");
    handleKeyPress(note, note);
  });
  key.addEventListener("touchend", () => {
    const note = li.getAttribute("data-note");
    handleKeyRelease(note);
  });
});

// Keyboard event listeners
document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase(); // Convert key to lowercase
  const note = keyToNoteMap[key];
  if (note) {
    event.preventDefault(); // Prevent the default action of the key press
    handleKeyPress(key, note);
  }
});

document.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase(); // Convert key to lowercase
  const note = keyToNoteMap[key];
  if (note) {
    handleKeyRelease(note);
  }
});

keysCheckbox.addEventListener("click", showHideKeys);
volumeSlider.addEventListener("input", handleVolume);
