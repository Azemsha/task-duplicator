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

    function copyUrl(){
        var input = document.getElementById('input-link');
        input.select();
        document.execCommand('copy');
        DOM_COMPONENTS.showMessage('Copied!', 2000);
    }

    return this;
}

const DOM_COMPONENTS = comp();