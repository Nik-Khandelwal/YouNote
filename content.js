var quill;

chrome.storage.onChanged.addListener(function(changes, namespace) {
        var note = changes['note'].newValue;
        // document.getElementById("add-notes-area").value += storageChange.newValue;
        // document.getElementsByClassName("ql-editor")[0].innerHTML += storageChange.newValue;

        if(note[0]=='#')
        {
            quill.insertText(0, note.split("$")[0].substr(1),{'italic': true });

            note = note.split("$")[1];
        }

        var len = quill.getLength();
        quill.insertText(len-1, note);
        console.log(document.getElementById("export_text"));
        

});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "request_subs" ) {
      
      var curr_subs = document.getElementsByClassName("captions-text")[0].innerText
      console.log(curr_subs);

      chrome.runtime.sendMessage({"message": "response_subs", "curr_subs": curr_subs});
    }
    else if( request.message === "request_title")
    {
        var yt_title = document.getElementsByClassName("title style-scope ytd-video-primary-info-renderer")[0].innerText;
        console.log(yt_title)
        chrome.runtime.sendMessage({"message": "response_title", "yt_title": yt_title});
    }
  }
);

function Export2Doc() {

    var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
       var footer = "</body></html>";

       var sourceHTML = header+document.getElementById("editor").innerHTML+footer;
       
       var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
       var fileDownload = document.createElement("a");
       document.body.appendChild(fileDownload);
       fileDownload.href = source;
       fileDownload.download = 'notes.doc';
       fileDownload.click();
       document.body.removeChild(fileDownload);
}


document.addEventListener('DOMContentLoaded', function() {
  
  quill = new Quill('#editor', {
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block']
    ]
  },
  theme: 'snow'  // or 'bubble'
});

    var btn = document.getElementById("take_ss");
    btn.addEventListener("click", function() {
      chrome.runtime.sendMessage({msg: "capture"});
      console.log("capture");
  }, false);
  var button = document.getElementById("export_text");
    button.addEventListener("click", function() {
    Export2Doc();
    }, false);
  });

