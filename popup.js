function buildCSS(colors) {
    return `\n.p-4 { background-color: ${colors.background} !important; }\n` +
           `.hljs-string { color: ${colors.string} !important; }\n` +
           `.hljs-comment { color: ${colors.comment} !important; }\n` +
           `.hljs-keyword { color: ${colors.keyword} !important; }\n` +
           `.hljs-title, .class_ { color: ${colors.title} !important; }\n` +
           `.hljs-title, .function_ { color: ${colors.function} !important; }\n` +
           `.hljs-type { color: ${colors.type} !important; }\n` +
           `.hljs-variable { color: ${colors.variable} !important; }\n` +
           `.hljs-number { color: ${colors.number} !important; }\n` +
           `.hljs-literal { color: ${colors.literal} !important; }\n` +
           `.hljs-attr { color: ${colors.attr} !important; }\n` +
           `.hljs-punctuation { color: ${colors.punctuation} !important; }\n` +
           `.hljs-tag { color: ${colors.tag} !important; }\n` +
           `.hljs-meta { color: ${colors.meta} !important; }\n` +
           `.hljs-selector-class { color: ${colors.selector} !important; }\n` +
           `.hljs-built_in { color: ${colors.builtIn} !important; }`;
}

function loadThemes() {
    chrome.storage.sync.get(['selectedTheme', 'customThemes'], function(data) {
        const themeSelector = document.getElementById('themeSelector');
        const builtIn = ['default', 'dark', 'light', 'github', 'monkai', 'dracula'];

        // Remove existing custom options
        Array.from(themeSelector.options).forEach(opt => {
            if (!builtIn.includes(opt.value)) {
                themeSelector.removeChild(opt);
            }
        });

        const customThemes = data.customThemes || {};
        Object.keys(customThemes).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name + ' (Custom)';
            themeSelector.appendChild(option);
        });

        let current = data.selectedTheme || 'default';
        const exists = Array.from(themeSelector.options).some(opt => opt.value === current);
        if (!exists) {
            current = 'default';
            chrome.storage.sync.set({selectedTheme: current});
        }
        themeSelector.value = current;

        renderCustomThemeList(customThemes);
    });
}

function renderCustomThemeList(customThemes) {
    const list = document.getElementById('customThemeList');
    list.innerHTML = '';
    Object.keys(customThemes).forEach(name => {
        const item = document.createElement('div');
        item.className = 'custom-theme-item';
        const span = document.createElement('span');
        span.textContent = name;
        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.addEventListener('click', function() {
            delete customThemes[name];
            chrome.storage.sync.set({customThemes: customThemes}, loadThemes);
        });
        item.appendChild(span);
        item.appendChild(del);
        list.appendChild(item);
    });
}

document.getElementById('createCustomButton').addEventListener('click', function() {
    const section = document.getElementById('customThemeSection');
    const isHidden = window.getComputedStyle(section).display === 'none';
    section.style.display = isHidden ? 'block' : 'none';
});

document.getElementById('saveCustomTheme').addEventListener('click', function() {
    const name = document.getElementById('customThemeName').value.trim();
    if (!name) return;
    const colors = {
        background: document.getElementById('color-background').value,
        string: document.getElementById('color-string').value,
        comment: document.getElementById('color-comment').value,
        keyword: document.getElementById('color-keyword').value,
        title: document.getElementById('color-title').value,
        function: document.getElementById('color-function').value,
        type: document.getElementById('color-type').value,
        variable: document.getElementById('color-variable').value,
        number: document.getElementById('color-number').value,
        literal: document.getElementById('color-literal').value,
        attr: document.getElementById('color-attr').value,
        punctuation: document.getElementById('color-punctuation').value,
        tag: document.getElementById('color-tag').value,
        meta: document.getElementById('color-meta').value,
        selector: document.getElementById('color-selector').value,
        builtIn: document.getElementById('color-built-in').value,
    };
    const css = buildCSS(colors);
    chrome.storage.sync.get(['customThemes'], function(data) {
        const customThemes = data.customThemes || {};
        customThemes[name] = css;
        chrome.storage.sync.set({customThemes: customThemes}, function() {
            document.getElementById('customThemeName').value = '';
            document.getElementById('customThemeSection').style.display = 'none';
            loadThemes();
        });
    });
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

// Initialize
loadThemes();

