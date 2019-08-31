function settings() {
    var localStorageItem = 'taskExporter';

    this.getSettings = function () {
        return JSON.parse(localStorage[localStorageItem] || '{}');
    };

    this.saveSettings = function (settings) {
        localStorage[localStorageItem] = JSON.stringify(settings);
    };

    return this;
}

var SETTINGS = settings();