angular.module("ProjMngmnt")
    .config(function ($compileProvider) {

        // Allow javascript:void(0) href
        var currentHrefSanitationRegex = $compileProvider.aHrefSanitizationWhitelist().toString().slice(1, -1);
        var newHrefSanitationRegex = "(" + currentHrefSanitationRegex + ")|(" + "^\\s*(javascript:void\\(0\\))" + ")";
        $compileProvider.aHrefSanitizationWhitelist(new RegExp(newHrefSanitationRegex));
    });