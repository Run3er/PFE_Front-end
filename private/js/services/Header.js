
angular.module('ProjMngmnt')
    .service('Header', function () {

        this.content = {
            updateTimeDisplayed: false,
            entries: []
        };

        this.setContent = function (content) {
            this.content.updateTimeDisplayed = content.updateTimeDisplayed;
            this.content.entries = content.entries;
        };

        this.getEntries = function () {
            if (this.content.entries === void(0)) {
                this.content.entries = [];
            }
            return this.content.entries;
        };

        // this.displayUpdateTime = function () {
        //     this.content.updateTimeDisplayed = true;
        // };
        //
        // this.removeUpdateTime = function () {
        //     this.content.updateTimeDisplayed = false;
        // };
    });