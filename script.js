let shift = 1;
let type = "sine";
let initialized = false;

function connectAudioDestination(context) {

  initialized = context != null;

  $('.drum-pad').on('click', () => {
    let id = event.target.id;
    shift = idToShift(id);
    type = idToType(id);
    if (id) playPad(context, id);
  });

  $(document).keypress(e => {
    let key = e.which;
    console.log("press" + key);
    let id = keypressToId(key);
    type = idToType(id);
    if (id) playPad(context, id);
  });

  $(document).keydown(e => {
    let key = e.which;
    console.log("down" + key);
    let id = keydownToId(key);
    $('#' + id).addClass('active');
    shift = idToShift(id);
  });

  $(document).keyup(e => {
    let key = e.which;
    console.log("up" + key);
    let id = keydownToId(key);
    $('#' + id).removeClass('active');
    if (key == 186 || key == 222) shift = 1;
  });
}

async function getAudioContext() {
  try {
    return await new Promise((resolve, reject) => {
      resolve(
      new (
      window.AudioContext ||
      window.webkitAudioContext)());


    });
  } catch (e) {
    console.log(e.toString());
    window.alert("Your browser does not support Web Audio API, a required component");
  }
}

function captureMediaStream(stream) {

  let node = c.createMediaStreamSource(stream);
  node.connect(c.destination);
  let =
  new MediaRecorder(stream);
  let initial = 0;
  let chunks = [];
  let interval;

  $('#record-pad').on('click',
  () => {
    console.log('start');
    recorder.start();
    initial = Date.now();
    interval = setInterval(() => {
      let elapsed = Date.now() - initial;
      let timer = new
      Date(Math.floor(elapsed)).
      toISOString().slice(12, -5);
      $('#indicator').text(timer);
    }, 1000);
  });

  $('#stop-pad').on('click',
  () => {
    console.log('stop');
    recorder.stop();
    clearInterval(interval);
  });

  recorder.onstop = e => {
    console.log('onstop');
    let blob = new Blob(
    chunks,
    { type: 'audio/ogg; codecs: opus' });

    chunks = [];
    let url = window.URL.createObjectURL(blob);
    $('#recorder').attr('src', url);
  };

  recorder.ondataavailable = e => {
    console.log('ondataavailable');
    chunks.push(e.data);
  };
}


async function getUserMedia() {
  try {
    return await navigator.mediaDevices.getUserMedia(
    { audio: true });
  } catch (e) {
    console.log(e.toString());
    // window.alert("Your browser does not support Media Streams API, a required component");
  }
}

function idToShift(id) {
  switch (id) {
    case "raise-pad":return 2;
    case "lower-pad":return 0.5;
    default:return shift;}

}

function idToType(id) {
  switch (id) {
    case "sine-pad":return "sine";
    case "square-pad":return "square";
    case "triangle-pad":return "triangle";
    case "sawtooth-pad":return "sawtooth";
    default:return type;}

}

function keydownToId(key) {
  switch (key) {
    case 65:return "cl-pad";
    case 87:return "cs-pad";
    case 83:return "d-pad";
    case 69:return "ef-pad";
    case 68:return "e-pad";
    case 70:return "f-pad";
    case 71:return "fs-pad";
    case 74:return "g-pad";
    case 85:return "gs-pad";
    case 75:return "a-pad";
    case 73:return "bf-pad";
    case 76:return "b-pad";
    case 79:return "ch-pad";
    case 222:return "raise-pad";
    case 186:return "lower-pad";
    case 90:return "sine-pad";
    case 88:return "square-pad";
    case 188:return "triangle-pad";
    case 190:return "sawtooth-pad";
    case 32:return "refresh-pad";
    default:return false;}

}

function keypressToId(key) {
  switch (key) {
    case 97:return "cl-pad";
    case 119:return "cs-pad";
    case 115:return "d-pad";
    case 101:return "ef-pad";
    case 100:return "e-pad";
    case 102:return "f-pad";
    case 103:return "fs-pad";
    case 106:return "g-pad";
    case 117:return "gs-pad";
    case 107:return "a-pad";
    case 105:return "bf-pad";
    case 108:return "b-pad";
    case 111:return "ch-pad";
    case 39:return "raise-pad";
    case 59:return "lower-pad";
    case 122:return "sine-pad";
    case 120:return "square-pad";
    case 44:return "triangle-pad";
    case 46:return "sawtooth-pad";
    case 32:return "refresh-pad";
    default:return false;}

}

function idToFrequency(id) {
  switch (id) {
    case "cl-pad":return 1047;
    case "cs-pad":return 1109;
    case "d-pad":return 1175;
    case "ef-pad":return 1245;
    case "e-pad":return 1319;
    case "f-pad":return 1397;
    case "fs-pad":return 1480;
    case "g-pad":return 1568;
    case "gs-pad":return 1661;
    case "a-pad":return 1760;
    case "bf-pad":return 1865;
    case "b-pad":return 1976;
    case "ch-pad":return 2093;
    default:return 0;}

}

function frequencyToSound(context, frequency) {

  let osc = context.createOscillator();
  let gain = context.createGain();
  osc.connect(gain);
  gain.connect(context.destination);
  gain.gain.exponentialRampToValueAtTime(
  0.00001, context.currentTime + 3.5);

  osc.frequency.value = frequency;
  osc.type = type;
  return osc;
}

function idToNote(frequency) {
  switch (frequency) {
    case "c-pad":return 'C';
    case "cs-pad":return 'C#';
    case "d-pad":return 'D';
    case "ef-pad":return 'Eb';
    case "e-pad":return 'E';
    case "f-pad":return 'F';
    case "fs-pad":return 'F#';
    case "g-pad":return 'G';
    case "gs-pad":return 'G#';
    case "a-pad":return 'A';
    case "bf-pad":return 'Bb';
    case "b-pad":return 'B';
    default:return '';}

}

function playPad(context, id) {
  if (id == 'refresh-pad') {
    shift = 1;
    $('#display').text('\xA0');
    return;
  }
  let frequency = Math.floor(idToFrequency(id) * shift);
  let sound = frequencyToSound(context, frequency);
  let note = idToNote(id);
  sound.start(0);
  if (frequency != 0) $('#display').text(note + " " + frequency + "Hz" + " " + type);
}

function initializeAudioContext() {
  getAudioContext().then(ctx => {
    connectAudioDestination(ctx);
  });
}

$(document).ready(function () {

  $('#record-pad').on('click', () => {
    if (initialized) {
      console.log(c);
      getUserMedia().then(strm => {
        captureMediaStream(strm);
      });
    }
  });

  if (!initialized) {
    $('#drum-machine').
    on('click', initializeAudioContext());
    $('#drum-machine').
    off('click', initializeAudioContext());
    $(document).
    on('keypress', initializeAudioContext());
    $(document).
    off('keypress', initializeAudioContext());
  }
});