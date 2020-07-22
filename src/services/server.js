function server() {
    function buildAuthorizationBasic(login, password) {
        return window.btoa(login + ':' + password);
    }

    function httpGet(url, authorizationBasic, resultHandler) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Basic ' + authorizationBasic);
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    resultHandler(JSON.parse(xhr.response));
                } else {
                    let message = 'Unexpected Error!';
                    if (xhr.status === 404) {
                        message = 'SERVICE_UNAVAILABLE!';
                    } else if (xhr.status === 401) {
                        message = 'CREDENTIALS INVALID!';
                    }
                    DOM_COMPONENTS.showMessage(message, 3000);
                }
            }
        };
    }

    function httpPost(url, body, authorizationBasic, resultHandler) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Basic ' + authorizationBasic);
        xhr.send(JSON.stringify(body));

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200 || xhr.status === 201) {
                    resultHandler(JSON.parse(xhr.response));
                } else {
                    let message = 'Unexpected Error! Message: ' + xhr.response;
                    if (xhr.status === 404) {
                        message = 'SERVICE_UNAVAILABLE!';
                    } else if (xhr.status === 401) {
                        message = 'CREDENTIALS INVALID!';
                    }
                    DOM_COMPONENTS.showMessage(message, 3000);
                }
            }
        };
    }

    this.getQuery = function (settings, url, resultHandler) {
        const authorizationBasic = buildAuthorizationBasic(settings.login, settings.password);
        httpGet(url, authorizationBasic, resultHandler);
    };

    this.postQuery = function (settings, url, body, resultHandler) {
        const authorizationBasic = buildAuthorizationBasic(settings.login, settings.password);
        httpPost(url, body, authorizationBasic, resultHandler);
    };


    return this;
}

const SERVER = server();
