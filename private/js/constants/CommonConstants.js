
angular.module('ProjMngmnt')
    .constant('CommonConstants', {
        PROJECT_STRING: "project",
        SUB_PROJECT_STRING: "subProject",
        CONSTRUCTION_SITE_STRING: "constructionSite",
        PROJECT_LEVELS: [ "project", "subProject", "constructionSite" ],
        PROJECT_LEVEL_ARTIFACTS: ["action", "risk", "pendingIssue", "changeRequest", "resource", "document", "milestone"],
        PARTIALS_DIR: "partials",
        GENERAL_BASE_URL: "/general",
        EMPTY_HREF_URL: "javascript:void(0)"
    });