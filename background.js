//Set default theme to dark on installation
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({'selectedTheme': 'dark'}, function() {
      console.log('Default theme set on installation.');
    });
  });
  