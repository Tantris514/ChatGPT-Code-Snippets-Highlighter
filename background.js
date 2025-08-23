// Set default theme to dark on installation using local storage
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({'selectedTheme': 'dark'}, function() {
      console.log('Default theme set on installation.');
    });
  });
  