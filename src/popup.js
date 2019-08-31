var contentPort = null;
var taskNumber = '';
var summary = null;
var description = null;
var settings = null;

chrome.runtime.onConnect.addListener(function(portFrom) {
  if(portFrom.name === 'TaskExporter') {
    portFrom.onMessage.addListener(function(form) {
      if (form) {
        taskNumber = form.taskNumber;
        summary = form.summary;
        document.getElementById('task-number').textContent = form.taskNumber;
        document.getElementById('summary').textContent = form.summary;
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
    DOM_COMPONENTS.createUrlInput(result.sections[0].issues[0].key);
    DOM_COMPONENTS.createOpenLink(result.sections[0].issues[0].key);
    DOM_COMPONENTS.createCopyLink();
  } else {
    DOM_COMPONENTS.createAssigneeSelect([settings.login].concat(settings.assignee.split('\n')));
    DOM_COMPONENTS.createFormButton(create);
  }
}

function check(appSettings) {
  settings = appSettings;
  SERVER.checkIssue(settings, CONSTANT.SEARCH_ISSUE_URL + taskNumber, isIssueCreated);
}

function create() {
  var body = TASK_UTILS.getBody(taskNumber, summary, description, document.getElementById('select-assignee').value);
  SERVER.createIssue(settings, CONSTANT.CREATE_ISSUE_URL, body, checkResultOfCreation)
}

function checkResultOfCreation(result) {
  document.getElementById('actions').innerHTML = '';
  DOM_COMPONENTS.createUrlInput(result.key);
  DOM_COMPONENTS.createOpenLink(result.key);
  DOM_COMPONENTS.createCopyLink();
  DOM_COMPONENTS.showMessage('Issue created!', 2000) ;
}