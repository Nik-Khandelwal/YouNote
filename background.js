var note_id;
var yt_id;
var prev_subs;
var title;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log(request)
    if( request.message === "response_subs" )
    {
      
      // console.log(request.curr_subs);

      if(!prev_subs)
      {
          chrome.storage.sync.set({'note': "#"+title+"$\n\n"+request.curr_subs.replace(/("\r\n|\n|\r)/gm, " ")}, function() {
                console.log(request.curr_subs);
          });
      }
      else if(request.curr_subs != prev_subs)
      {
          chrome.storage.sync.set({'note': " "+request.curr_subs.replace(/("\r\n|\n|\r)/gm, " ")}, function() {
                console.log(request.curr_subs);
          });  
      }

      prev_subs = request.curr_subs;
    
    }
    // else if(request.message === "capture" )
    // {
    //   console.log("capture");
    //   chrome.tabs.captureVisibleTab(yt_id, {format: "jpeg"}, function(dataUrl) 
    //         {
    //             console.log(dataUrl);
    //         });
    // }
    else if(request.message === "toggle_auto" ){
      console.log("toggle_auto")
      chrome.tabs.sendMessage(yt_id, {"message": "request_subs"});
    }
    else if(request.message === "response_title" ){
        title = request.yt_title;
    }
}
);


chrome.browserAction.onClicked.addListener(function(tab) {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      console.log(activeTab);
      chrome.tabs.sendMessage(activeTab.id, {"message": "request_title"});
      yt_id = activeTab.id;
    });


    var maxWidth = window.screen.availWidth;
    var maxHeight = window.screen.availHeight;

    chrome.windows.getCurrent(function(wind) {
    console.log(wind.id)
    var updateInfo = {
        left: 0,
        top: 0,
        width: parseInt(maxWidth*3/4),
        height: maxHeight,
        drawAttention:true,
        state:"normal"
    };

    chrome.windows.update(wind.id, updateInfo);});

    

    var value = " Initializing... ";
    chrome.storage.sync.set({'note': value}, function() {
          console.log('Value is set to ' + value);
    });

    

    chrome.windows.create({"url": chrome.extension.getURL('notes.html'),
                  "type":"popup",
                  "left":parseInt(maxWidth*10/12),
                  "width":parseInt(maxWidth*1/4),
                  "height":parseInt(maxHeight)
    });

    chrome.windows.getLastFocused({"windowTypes":['popup']},function(wind) {
    note_id = wind.id;
  });
    

});

chrome.commands.onCommand.addListener(function(command) {

    console.log("Cmd pressed");
    chrome.tabs.sendMessage(yt_id, {"message": "request_subs"});
    
});
