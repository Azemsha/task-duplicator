function comp() {
    function getList(elements) {
        let div = document.createElement('div');
        let label = document.createElement('label');
        label.innerText = 'Assignee: ';
        let list = document.createElement('select');
        list.id = 'select-assignee';
        for (var i = 0; i < elements.length; i++) {
            let option = document.createElement('option');
            option.innerText = elements[i];
            option.value = elements[i];
            list.appendChild(option);
        }
        div.appendChild(label);
        div.appendChild(list);
        return div;
    }

    this.createUrlInput = function (jiraUrl, issueKey) {
        let input = document.createElement('input');
        input.id = 'input-link';
        input.readOnly = 'readonly';
        input.value = jiraUrl + CONSTANT.ISSUE_URL + issueKey;
        document.getElementById('actions').appendChild(input);
    };

    this.createOpenLink = function (jiraUrl, issueKey) {
        let link = document.createElement('a');
        link.id = 'open-link';
        link.href = jiraUrl + CONSTANT.ISSUE_URL + issueKey;
        link.innerText = 'Open issue';
        link.target = '_blank';
        document.getElementById('actions').appendChild(link);
    };

    this.createCopyLink = function () {
        let copyLink = document.createElement('a');
        copyLink.href = 'javascript:void(0)';
        copyLink.innerText = 'Copy link';
        copyLink.addEventListener('click', copyUrl);
        document.getElementById('actions').appendChild(copyLink);
    };

    this.createAssigneeSelect = function(assignees) {
        document.getElementById('actions').appendChild(getList(assignees));
    };

    this.createFormButton = function(clickHandler) {
        let button = document.createElement('button');
        button.innerText = 'Create issue';
        button.addEventListener('click', clickHandler);
        document.getElementById('actions').appendChild(button);
    };

    this.showMessage = function(message, timeout) {
        var status = document.getElementById('message');
        status.textContent = message;
        if (timeout > 0) {
            setTimeout(function () {
                status.textContent = '';
            }, timeout);
        }
    };

    function copyUrl() {
        var input = document.getElementById('input-link');
        input.select();
        document.execCommand('copy');
        DOM_COMPONENTS.showMessage('Copied!', 2000);
    }

    this.showModeSelect = function(mode) {
        document.getElementById('modeSelect').hidden = false;
        if (mode === 'dev') {
            document.getElementById('devMode').checked = true;
        } else {
            document.getElementById('tasksMode').checked = true;
        }
        selectMode();
    }

    function selectMode() {
        const selectedModeElement = document.querySelector('input[name="mode"]:checked');
        const selectedMode = selectedModeElement.value
        if (selectedMode === 'dev') {
            document.getElementById('devModeActions').hidden = false;
            document.getElementById('actions').hidden = true;
        } else {
            document.getElementById('devModeActions').hidden = true;
            document.getElementById('actions').hidden = false;
        }
        document.getElementById('tasksMode').addEventListener('click', selectMode);
        document.getElementById('devMode').addEventListener('click', selectMode);

        const activeTab = document.getElementsByClassName('mode-active');
        if (activeTab.length > 0) {
            activeTab.item(0).classList.remove('mode-active');
        }
        selectedModeElement.parentElement.classList.add('mode-active');

        //set date
        document.getElementById('logDate').valueAsDate = new Date();
        document.getElementById('yesterdayButton').addEventListener('click', setYesterdayDate);
        document.getElementById('devHours').value = '7h';
        document.getElementById('meetingHours').value = '1h';
    }

    function setYesterdayDate() {
        document.getElementById('logDate').valueAsDate = new Date(new Date().setDate(new Date().getDate()-1));
    }

    this.addEventsForLogButtons = function(devButtonClickHandler, meetingButtonClickHandler) {
        document.getElementById('devLogButton').addEventListener('click', devButtonClickHandler);
        document.getElementById('meetingLogButton').addEventListener('click', meetingButtonClickHandler);
    };

    this.hideEmptyControls = function(devIssueNumber, meetingIssueNumber) {
        if (!devIssueNumber) {
            document.getElementById('devControl').hidden = true;
        }
        if (!meetingIssueNumber) {
            document.getElementById('meetingControl').hidden = true;
        }
    }

    return this;
}

const DOM_COMPONENTS = comp();
