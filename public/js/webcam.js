// display video
let capture;
let blob;
chunks = [];
const recordButton = document.getElementById('record');
const submitButton = document.getElementById('submit');
const privacyButton = document.getElementById('privacy');
const vidParent = document.getElementById('video-placeholder');

// start webcam feed
function startCapture() {
  capture = createCapture(VIDEO, {
    video: true,
    audio: true,
  });
  // place and size the video
  capture.parent('#video-placeholder');
  capture.size(320, 240);
  capture.elt.volume = 0;
}

function setup() {
  noCanvas();
}

async function postToDatabase(blob) {
  let formdata = new FormData(); // create a from to of data to upload to the server
  formdata.append('videoBlob', blob, 'video' + new Date().getTime() + '.webm'); // append the sound blob and the name of the file. third argument will show up on the server as req.file.originalname
  var options = {
    method: 'POST',
    body: formdata, // with our form data packaged above
    headers: new Headers({
      'enctype': 'multipart/form-data' // the enctype is important to work with multer on the server
    })
  };
  const response = await fetch('/upload', options);
  console.log(response);
}

// record video
function record() {
  const elt = document.getElementById("recorded");
  if (elt) elt.remove();

  chunks.length = 0;
  let stream = capture.elt.srcObject;
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = e => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };

  recorder.onstop = exportVideo;

  recordButton.onclick = e => {
    recorder.stop();
    recordButton.textContent = 're-record';
    recordButton.onclick = record;
  };

  recorder.start();
  recordButton.textContent = 'stop';
}

// display video recording on webpage
function exportVideo(e) {
  blob = new Blob(chunks);
  // console.log(blob);
  let vid = document.createElement('video');
  vid.id = 'recorded';
  vid.controls = true;
  let videodata = URL.createObjectURL(blob);
  console.log(videodata);
  vid.src = videodata;
  document.getElementById("recording").appendChild(vid);
  vid.play();
}
recordButton.onclick = record;

submitButton.onclick = e => {
  console.log(blob);
  postToDatabase(blob);
  submitButton.textContent = 'submitted!';
};

privacyButton.onclick = e => {
  window.alert("By clicking “submit” you grant this website permission to display your video on this website.");
};

if (navigator.userAgent.match(/Mobile/)) {
  document.getElementById('switch-to-desktop').innerHTML = 'Please view this webpage on a desktop to experience all of its features. Thank you!';
  }