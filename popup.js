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

    // Only send the message to a tab if it's an HTTP/HTTPS page
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].id && (tabs[0].url.startsWith("http://") || tabs[0].url.startsWith("https://"))) {
            chrome.tabs.sendMessage(tabs[0].id, {type: "CHANGE_THEME", theme: selectedTheme}, function(response) {
                if (chrome.runtime.lastError) {
                    // Handle the error gracefully
                    console.error("Error sending message: ", chrome.runtime.lastError.message);
                } else {
                    // Message was sent successfully, handle the response if needed
                    console.log('Theme change message sent', response);
                }
            });
        } else {
            console.log("Content script not available on this tab.");
        }
    });
});
