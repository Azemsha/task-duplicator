function handleRequest(request, sender, responseHandler) {
        if ('get-settings' === request.method) {
            const settings = SETTINGS.getSettings();
            responseHandler(settings);
        }
}

chrome.extension.onRequest.addListener(handleRequest);
