const pianoKeys = document.querySelectorAll(".piano-keys .key"),
  volumeSlider = document.querySelector(".volume-slider input"),
  keysCheckbox = document.querySelector(".keys-checkbox input");

const noteFreqs = {
    1:262.5,   //  s     c
    2:269.8,   
    3:277.6,   //  r1    c#
    4:285.8,   
    5:294.4,   //  r2    d   g1                
    6:303,
    7:312.2,   // r3    d#  g2
    8:320.36,
    9:329.86,  //        e   g3
    10:340,
    11:349.8,  //  m1    f   
    12:360.6,
    13:370.9,  //  m2    f#  
    14:382.2, 
    15:392.9,  //        g   p
    16:402.4,
    17:416.04, //  d1    g#
    18:429.2,
    19:440.9,  //  d2    a   n1
    20:454,
    21:466.16, // d3    a#  n2
    22:482,
    23:493.88, //        b   n3
    24:509.9,
    25:524.9
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
let volume = 0.5;
let oscillator = null;
gainNode.connect(audioContext.destination);
// Function to handle key press and play sound
function handleKeyPress(key) {
  const note = key.getAttribute("data-note");
  const freq = noteFreqs[note];
  key.classList.add("active");
  playSound(freq, volume);
}

// Function to handle key release and stop sound
function handleKeyRelease(key) {
  key.classList.remove("active");
  stopSound();
}


pianoKeys.forEach((key) => {
  key.addEventListener("mousedown", () => {
    handleKeyPress(key);
  });
  key.addEventListener("mouseup", () => {
    handleKeyRelease(key);
  });
  
  key.addEventListener("mouseleave", () => {
    handleKeyRelease(key);
  });

  key.addEventListener("touchstart", () => {
    handleKeyPress(key);
  });
  key.addEventListener("touchend", () => {
    handleKeyRelease(key);
  });
  
});

const keyState = {}; // Object to track key states

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase(); // Convert key to lowercase
  const note = keyToNoteMap[key];
  if (!keyState[key]) { // Check if the key is not already pressed
    keyState[key] = true; // Mark the key as pressed
    if (note) {
      const freq = noteFreqs[note];
      playSound(freq, volume);
    }
  }
  // key.classList.add("active");
});

document.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase(); // Convert key to lowercase
  keyState[key] = false; // Mark the key as released
  console.log("keyup event");
  // key.classList.remove("active");
  stopSound();
});



function playSound(freq, volume) {
  oscillator = audioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime); // first arg is volume , second is time // 0.5 is default 0 to 1

  oscillator.connect(gainNode);
  oscillator.start();
}
function stopSound() {
  if (oscillator) {
    oscillator.stop();
    oscillator = null;
  }
}
const handleVolume = (e) => {
  volume = e.target.value;
};

const showHideKeys = () => {
  // toggling hide class from each key on the checkbox click
  pianoKeys.forEach((key) => key.classList.toggle("hide"));
};

keysCheckbox.addEventListener("click", showHideKeys);
volumeSlider.addEventListener("input", handleVolume);
