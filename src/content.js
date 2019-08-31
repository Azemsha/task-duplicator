
contentPort = chrome.runtime.connect({
  name: 'TaskExporter'
});

contentPort.onDisconnect.addListener(function(){
  contentPort = null;
});

var message;
if (document.getElementById('key-val')) {
  // old version
  message = {
    taskNumber: document.getElementById('key-val').getAttribute('data-issue-key'),
    summary: document.getElementById('summary-val').textContent,
    description: document.getElementById('description-val').textContent,
  }
} else if (new URL(document.URL).searchParams.get("selectedIssue")) {
  // popup
  var popupHtml = document.getElementById('jira-issue-header').parentElement.parentElement;
  message = {
    taskNumber: new URL(document.URL).searchParams.get("selectedIssue"),
    summary: popupHtml.getElementsByTagName('h1')[0].textContent,
    description: popupHtml.getElementsByClassName('ak-renderer-document')[0].innerHTML,
  }
} else {
  // new version
  message = {
    taskNumber: document.URL.substring(document.URL.lastIndexOf("/") + 1),
    summary: document.getElementsByTagName('h1')[0].textContent,
    description: document.getElementsByClassName('ak-renderer-document')[0].innerHTML,
  }
}
contentPort.postMessage(message);

