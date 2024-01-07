// This function updates the select element to reflect the current theme
function setCurrentThemeSelection(currentTheme) {
    var themeSelector = document.getElementById('themeSelector');
    themeSelector.value = currentTheme;
}

// Get the currently selected theme from storage and update the select element
chrome.storage.sync.get('selectedTheme', function(data) {
    if (data.selectedTheme) {
        setCurrentThemeSelection(data.selectedTheme);
    } else {
        // If there's no theme saved, set it to the default value
        setCurrentThemeSelection('default');
    }
});

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
