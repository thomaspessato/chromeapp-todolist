chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    frame: "none",
       id: "todoID",
       innerBounds: {
         width: 390,
         height: 500,
         left: 600,
         minWidth: 220,
         minHeight: 220
      }
  });
});