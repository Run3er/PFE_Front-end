
angular.module('ProjMngmnt')
    .constant('CommonConstants', {
        PROJECT_STRING: "project",
        SUB_PROJECT_STRING: "subProject",
        CONSTRUCTION_SITE_STRING: "constructionSite",
        PROJECT_LEVELS: [ "project", "subProject" ],
        PROJECT_LEVEL_ARTIFACTS: {
            "project": [ "constructionSite", "action", "risk", "pendingIssue", "changeRequest", "resource", "document", "milestone", "todo", "humanResource", "communicationPlan", "writeup", "reunionPlanning" ],
            "subProject": [ "constructionSite", "action", "risk", "pendingIssue", "changeRequest", "resource", "document", "milestone", "todo", "humanResource" ]
        } ,
        PARTIALS_DIR: "partials",
        GENERAL_BASE_URL: "/general",
        EMPTY_HREF_URL: "javascript:void(0)"
    });