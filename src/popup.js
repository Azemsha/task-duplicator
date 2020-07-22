var contentPort = null;
var taskNumber = '';
var summary = null;
var description = null;
var settings = null;

chrome.runtime.onConnect.addListener(function(portFrom) {
  if(portFrom.name === 'TaskExporter') {
    portFrom.onMessage.addListener(function(form) {
      if (form) {
        var turndownService = new TurndownService();
        taskNumber = form.taskNumber;
        summary = form.summary;
        description = turndownService.turndown(form.description);
        document.getElementById('task-number').textContent = taskNumber;
        document.getElementById('summary').textContent = summary;
        document.getElementById('message').textContent = '';
        getSettingsAndCheckIssue();
      }
    });
  }
});

chrome.tabs.query(
    { currentWindow: true, active: true },
    function (tabArray) {
      chrome.tabs.executeScript(tabArray[0].id, {file:'src/content.js'});
    }
);

function getSettingsAndCheckIssue() {
  chrome.extension.sendRequest({
    method: 'get-settings'
  }, check);
}

function isIssueCreated(result) {
  if (result.sections[0].issues && result.sections[0].issues.length) {
    DOM_COMPONENTS.createUrlInput(settings.jiraUrl, result.sections[0].issues[0].key);
    DOM_COMPONENTS.createOpenLink(settings.jiraUrl, result.sections[0].issues[0].key);
    DOM_COMPONENTS.createCopyLink();
  } else {
    const assignees = settings.assignee === '' ? [settings.login] : [settings.login].concat(settings.assignee.split('\n'));
    DOM_COMPONENTS.createAssigneeSelect(assignees);
    DOM_COMPONENTS.createFormButton(create);
  }
}

function check(appSettings) {
  settings = appSettings;
  if (settings.login === '' || settings.password === '') {
    DOM_COMPONENTS.showMessage('Login or Password is not provided!', 2000);
    return;
  } else {
    DOM_COMPONENTS.showModeSelect(settings.defaultMode);
    DOM_COMPONENTS.addEventsForLogButtons(devLog, meetingLog);
    DOM_COMPONENTS.hideEmptyControls(settings.devIssue, settings.meetingIssue);
  }
  SERVER.getQuery(settings, settings.jiraUrl + CONSTANT.SEARCH_ISSUE_URL + taskNumber, isIssueCreated);
}

function create() {
  const assignee = document.getElementById('select-assignee').value;
  const body = TASK_UTILS.getBody(taskNumber, summary, description, assignee, settings.projectKey,
      assignee === settings.login);
  SERVER.postQuery(settings, settings.jiraUrl + CONSTANT.ISSUE_BASE_URL, body, checkResultOfCreation)
}

function checkResultOfCreation(result) {
  document.getElementById('actions').innerHTML = '';
  DOM_COMPONENTS.createUrlInput(settings.jiraUrl, result.key);
  DOM_COMPONENTS.createOpenLink(settings.jiraUrl, result.key);
  DOM_COMPONENTS.createCopyLink();
  DOM_COMPONENTS.showMessage('Issue created!', 2000) ;
}

function devLog() {
  const date = new Date(document.getElementById('logDate').value);
  const timeSpent = document.getElementById('devHours').value;
  const comment = taskNumber + ': ' + summary + '.';

  const body = TASK_UTILS.getLogBody(covertDateToString(date), timeSpent, comment);
  const url = settings.jiraUrl + CONSTANT.ISSUE_BASE_URL + '/' + settings.devIssue + CONSTANT.LOG_PATH;

  SERVER.postQuery(settings, url, body, showLogMessage)
}

function meetingLog() {
  const date = new Date(document.getElementById('logDate').value);
  const timeSpent = document.getElementById('meetingHours').value;

  const body = TASK_UTILS.getLogBody(covertDateToString(date), timeSpent, '');
  const url = settings.jiraUrl + CONSTANT.ISSUE_BASE_URL + '/' + settings.meetingIssue + CONSTANT.LOG_PATH;

  SERVER.postQuery(settings, url, body, showLogMessage)
}

function showLogMessage(result) {
  DOM_COMPONENTS.showMessage('WorkLog Added!', 2000);
}

function covertDateToString(date) {
  return date.toISOString().substring(0, 10) + 'T00:00:01.000+0000';
}
