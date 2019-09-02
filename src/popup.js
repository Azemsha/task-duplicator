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
  }
  SERVER.checkIssue(settings, settings.jiraUrl + CONSTANT.SEARCH_ISSUE_URL + taskNumber, isIssueCreated);
}

function create() {
  var body = TASK_UTILS.getBody(taskNumber, summary, description, document.getElementById('select-assignee').value,
      settings.projectKey);
  SERVER.createIssue(settings, settings.jiraUrl + CONSTANT.CREATE_ISSUE_URL, body, checkResultOfCreation)
}

function checkResultOfCreation(result) {
  document.getElementById('actions').innerHTML = '';
  DOM_COMPONENTS.createUrlInput(settings.jiraUrl, result.key);
  DOM_COMPONENTS.createOpenLink(settings.jiraUrl, result.key);
  DOM_COMPONENTS.createCopyLink();
  DOM_COMPONENTS.showMessage('Issue created!', 2000) ;
}