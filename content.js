// When the content script loads, check for a saved theme and apply it
chrome.storage.sync.get('selectedTheme', function(data) {
    if (data.selectedTheme) {
        switchTheme(data.selectedTheme);
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "CHANGE_THEME") {
      switchTheme(request.theme);
    }
});

  
  function switchTheme(themeName) {
    // Remove any existing theme
    var existingStyles = document.querySelectorAll('.custom-theme-style');
    existingStyles.forEach(function(style) {
      style.remove();
    });
  
    // Load the new theme
    var link = document.createElement('link');
    link.href = chrome.runtime.getURL('styles-' + themeName + '.css');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.classList.add('custom-theme-style');
    document.head.appendChild(link);
  }
  