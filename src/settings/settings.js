/**
 * Show text notification under save button
 *
 * @param message to show
 * @param timeout if need
 */
function showNotification(message, timeout) {
    var status = document.getElementById('status');
    status.textContent = message;
    if (timeout > 0) {
        setTimeout(function () {
            status.textContent = '';
        }, timeout);
    }
}

/**
 * Validate settings for empty and wrong urls
 *
 * @param settings to validate
 * @returns {boolean} true - settings is valid / false - settings is invalid
 */
function validateSettings(settings) {
    var wrongFields = [];

    if (settings.login === '') {
        wrongFields.push('Login');
    }
    if (settings.password === '') {
        wrongFields.push('Password');
    }

    if (wrongFields.length > 0) {
        showNotification('Please check ' + wrongFields.join(', ') + ' and try again');
        return false;
    } else {
        return true;
    }
}

function processSettings() {
    var settings = {
        login: document.getElementById('login').value,
        password: document.getElementById('password').value,
        assignee: document.getElementById('assignee').value
    };

    if (validateSettings(settings)) {
        SETTINGS.saveSettings(settings);
        showNotification('Settings saved', 1000);
    }
}

function restoreOptions() {
    var settings = SETTINGS.getSettings();

    document.getElementById('login').value = settings.login || '';
    document.getElementById('password').value = settings.password || '';
    document.getElementById('assignee').value = settings.assignee || '';
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', processSettings);