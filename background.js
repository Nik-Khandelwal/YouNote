var note_id;
var yt_id;
var prev_subs = undefined;
var title = undefined;
var url;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if( request.message === "response_subs" )
  {
    if(prev_subs == undefined && title != undefined)
    {
      chrome.storage.sync.set({'note': "#"+title+"$\n\n"+request.curr_subs.replace(/("\r\n|\n|\r)/gm, " ")}, function() {});
    }
    else if(request.curr_subs != prev_subs)
    {
      chrome.storage.sync.set({'note': " "+request.curr_subs.replace(/("\r\n|\n|\r)/gm, " ")}, function() {});  
    }
    prev_subs = request.curr_subs;
  }
  else if(request.message === "download" )
  {
    chrome.tabs.create({"url": 'http://younote.pythonanywhere.com/'});
  }
  else if(request.message === "toggle_auto" )
  {
    chrome.tabs.sendMessage(yt_id, {"message": "request_subs"});
  }
  else if(request.message === "response_title" )
  {
    title = request.yt_title;
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  var new_url = changeInfo.url
  if(new_url != undefined && new_url != url)
  {
    setTimeout(function()
    { 
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "request_title"});
      });
      url = new_url;
      prev_subs = undefined;
    }, 5000);
  }
});



chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "request_title"});
    yt_id = activeTab.id;
  });
  var maxWidth = window.screen.availWidth;
  var maxHeight = window.screen.availHeight;
  chrome.windows.getCurrent(function(wind) {
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
  chrome.storage.sync.set({'note': value}, function() {});
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
  chrome.tabs.sendMessage(yt_id, {"message": "request_subs"});
});
