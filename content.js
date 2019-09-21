var quill;
var toggle_auto;
var title;

chrome.storage.onChanged.addListener(function(changes, namespace) {

  var note = changes['note'].newValue;
  var len;
  try{
      if(note[0]=='#')
      {
        len = quill.getLength();
        title = note.split("$")[0].substr(1);
        if(len==1)
        {
            quill.insertText(len-1, title,{'italic': true ,'underline':true});
        }
        else
        {
            quill.insertText(len-1, "\n\n"+title,{'italic': true ,'underline':true});
        }
        note = note.split("$")[1];
      }

      len = quill.getLength();
      quill.insertText(len-1, note);  
  }
  catch(err){console.log("yep")};
});



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "request_subs" ) {
      try
      {
      var curr_subs = document.getElementsByClassName("captions-text")[0].innerText
      chrome.runtime.sendMessage({"message": "response_subs", "curr_subs": curr_subs});
      }
      catch(err){console.log("yep")};
    }
    else if( request.message === "request_title")
    {
      try{
        var yt_title = document.getElementsByClassName("title style-scope ytd-video-primary-info-renderer")[0].innerText;
        chrome.runtime.sendMessage({"message": "response_title", "yt_title": yt_title});
        }
      catch(err){console.log("yep")};
    }
  }
);


function Export2Doc(note) {
    try
    {
      var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
       var footer = "</body></html>";

       var sourceHTML = header+note+footer;
       
       var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
       var fileDownload = document.createElement("a");
       document.body.appendChild(fileDownload);
       fileDownload.href = source;
       fileDownload.download = title+'.doc';
       fileDownload.click();
       document.body.removeChild(fileDownload);
       document.location.reload(true)
        }
      catch(err){console.log("yep")};
}



document.addEventListener('DOMContentLoaded', function() {
  
  setTimeout( function(){
    document.getElementById("screen1").style.display="none";
  },2000);

  if(document.getElementById("editor"))
  {
    quill = new Quill('#editor', {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['image', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] }, { 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
        ]
      },
      placeholder: '\n\n\n          1. Switch ON captions.\n\n\n          2. Press / Hold  Ctrl+Y \n\n                         OR \n\n          Switch ON Auto typing\n\n\n\n\n\n\n\nFree Version only supports video with subtitles',
      theme: 'snow'  // or 'bubble'
    });
  }

  var modeStatus = false;
  var autoStatus = true;

  var button = document.getElementById("export_text");
  chrome.runtime.sendMessage({message: "toggle_auto"})
  button.addEventListener("click", function() {
    var note = document.getElementById("editor").innerHTML
    chrome.runtime.sendMessage({message: "download",download:note})
    Export2Doc(note);
  }, false);

  var mode = document.getElementById("mode");
  mode.addEventListener("click", function() {
    if(document.getElementById("modeStat").checked != modeStatus){
      modeStatus = document.getElementById("modeStat").checked;
      if(modeStatus==true){
        document.getElementById("body").style.background = 'black';
        document.getElementsByClassName("switchColor")[0].style.color = "white";
        document.getElementsByClassName("switchColor")[1].style.color = "white";

        var btn = document.getElementById("export_text");
        btn.classList.toggle("day");
        btn.classList.toggle("night");
      }
      else if(modeStatus==false){
        document.getElementById("body").style.background = 'white';
        document.getElementsByClassName("switchColor")[0].style.color = "black";
        document.getElementsByClassName("switchColor")[1].style.color = "black";

        var btn = document.getElementById("export_text");
        btn.classList.toggle("day");
        btn.classList.toggle("night");
      }
    }
  })

  var auto = document.getElementById("auto");
  auto.addEventListener("click", function() {
  if(document.getElementById("autoStat").checked != autoStatus){
      autoStatus = document.getElementById("autoStat").checked;
      if(autoStatus==true){
          toggle_auto = setInterval(function(){ 
          chrome.runtime.sendMessage({message: "toggle_auto"}) }, 1000);
      }
      else if(autoStatus==false){

            clearInterval(toggle_auto);
      }
    }
  })  
});

