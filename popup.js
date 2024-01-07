document.getElementById('applyButton').addEventListener('click', function() {
    var selectedTheme = document.getElementById('themeSelector').value;

    // Save the selected theme using Chrome Storage API
    chrome.storage.sync.set({'selectedTheme': selectedTheme}, function() {
        console.log('Theme is set to ' + selectedTheme);
    });

    // Send the selected theme to the content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: "CHANGE_THEME", theme: selectedTheme});
    });
});
