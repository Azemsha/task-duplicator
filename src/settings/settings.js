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
    if (settings.projectKey === '') {
        wrongFields.push('Project Key');
    }
    if (settings.jiraUrl === '') {
        wrongFields.push('Jira URL');
    }

    if (wrongFields.length > 0) {
        showNotification('Please check ' + wrongFields.join(', ') + ' and try again');
        return false;
    } else {
        return true;
    }
}

function processSettings() {
    let url = document.getElementById('jiraUrl').value;
    if (url.charAt(url.length - 1) === '/') {
        url = url.slice(0, -1);
    }

    let devIssueNumber = document.getElementById('development').value;
    let meetingIssueNumber = document.getElementById('meeting').value;
    let projectKey = document.getElementById('projectKey').value;
    if (devIssueNumber && !devIssueNumber.includes(projectKey)) {
        devIssueNumber = projectKey + '-' + devIssueNumber;
    }
    if (meetingIssueNumber && !meetingIssueNumber.includes(projectKey)) {
        meetingIssueNumber = projectKey + '-' + meetingIssueNumber;
    }

    let settings = {
        login: document.getElementById('login').value,
        password: document.getElementById('password').value,
        projectKey: projectKey,
        jiraUrl: url,
        assignee: document.getElementById('assignee').value,
        devIssue: devIssueNumber,
        meetingIssue: meetingIssueNumber,
        defaultMode: document.querySelector('input[name="defaultMode"]:checked').value
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
    document.getElementById('projectKey').value = settings.projectKey || '';
    document.getElementById('jiraUrl').value = settings.jiraUrl || '';
    document.getElementById('development').value = settings.devIssue || '';
    document.getElementById('meeting').value = settings.meetingIssue || '';
    if (settings.defaultMode === 'dev') {
        document.getElementById('devDefault').checked = true;
    } else {
        document.getElementById('tasksDefault').checked = true;
    }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', processSettings);
