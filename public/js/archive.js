// define variables
let videos = [];

// add videos from database
fetch('/list')
.then(response => response.json())
.then(json => {

  // create an array of videos based on the JSON data
  json.forEach(elt => {
    // aws
    videos.push(setUpVideo(`${elt.url}`));
    // file system
    // videos.push(setUpVideo(`upload/${elt.filename}`));
  });

  // iterate through videos to create grid
  for (let i = 0; i < videos.length; i += 1) {
    document.getElementById("videos-container").appendChild(videos[i]);
  }

});

function setUpVideo(inSrc) {
  var videlem = document.createElement("video");
  var sourceMP4 = document.createElement("source");
  sourceMP4.type = "video/mp4";
  sourceMP4.src = inSrc;
  videlem.appendChild(sourceMP4);
  videlem.autoplay = true;
  videlem.loop = true;
  videlem.muted = false;
  videlem.volume = 0.0; 
  videlem.setAttribute("class", "archive-video");
  // videlem.setAttribute("width", "320");
  // videlem.setAttribute("height", "240");
  videlem.setAttribute("controls", "controls");
  videlem.setAttribute("crossorigin", "anonymous"); 
  return videlem;
}