
angular.module('ProjMngmnt')
	.service('Header', function () {
	    this.content = {
	        "updateTimeDisplayed": false
        };

        this.displayUpdateTime = function () {
            this.content.updateTimeDisplayed = true;
        };

        this.removeUpdateTime = function () {
            this.content.updateTimeDisplayed = false;
        };
	});