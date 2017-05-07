angular.module("ProjMngmnt")
    .config(function (CommonConstants, $stateProvider) {
        // Global project levels parent state
        var PROJECT_LEVELS_STATE_STRING = "projectLevels";

        // Project level controllers-resolve targeted
        var projectLevelPageSpecifics = {};

        $stateProvider
            .state(PROJECT_LEVELS_STATE_STRING, {
                controller: function (Header, $state) {
                    // Initialize global project levels state
                    projectLevelPageSpecifics.urlPrefix =  "";
                    Header.getEntries().push({ title: "Portefeuille", url: $state.href("general.portfolio", null, {absolute: true}) });
                },
                // Template going to instantiate first nested child-controller (thus only triggered by a nested state)
                templateUrl: CommonConstants.PARTIALS_DIR + "/nav-sidebar-header.html"
            });

        // Common project level states, parametrized, config
        function getProjectLevelStatesConfig(projectLevelSingleName) {

            return {
                getProjectLevelConfig: function(projectLevelStateName) {
                    return {
                        url: "/" + projectLevelSingleName + "s/:" + projectLevelSingleName + "Id",
                        controller: function (Sidebar, Header, DB, $state, $stateParams) {
                            // Set global URL
                            var stateResolvedUrl = $state.href($state.current.name, $stateParams);
                            console.log(stateResolvedUrl)
                            var urlParts = stateResolvedUrl.slice(1).split("/");
                            // Remove default redirection appended
                            if (urlParts[urlParts.length - 1] === "dashboard") {
                                urlParts.pop();
                            }
                            projectLevelPageSpecifics.urlPrefix = urlParts.join("/");

                            console.log(projectLevelPageSpecifics.urlPrefix)

                            // Sidebar
                            Sidebar.setContent({ type: projectLevelSingleName, urlPrefix: projectLevelPageSpecifics.urlPrefix });

                            // Header: Get project name by projectId, from DB
                            DB.getSingleResrcByUri(projectLevelPageSpecifics.urlPrefix)
                                .then(function (projectLevelEntry) {
                                    Header.getEntries().push({
                                        title: projectLevelEntry.name,
                                        url: projectLevelPageSpecifics.urlPrefix
                                    });
                                });

                            // Default redirection to base path
                            console.log($state.current.name)
                            // Note: $state.current; returns child state (if detected through url), instead of this hereby state
                            if ($state.current.name === projectLevelStateName) {
                                $state.go(".default", null, { location: "replace" });
                            }
                            console.log("------" + projectLevelStateName)
                        },
                        onExit: function(Header, Sidebar/*, resolveField*/){
                            Header.getEntries().pop();
                            console.log(Header.getEntries())
                            var urlParts = projectLevelPageSpecifics.urlPrefix.split("/");
                            urlParts.pop().pop();
                            projectLevelPageSpecifics.urlPrefix = urlParts.join("/");
                        },
                        templateUrl: CommonConstants.PARTIALS_DIR + "/nested-abstract.html"
                    };
                },
                defaultConfig: {
                    url: "/",
                    controller: function ($state) {
                        // Default redirection to designated entry (instead of blank)
                        $state.go("^.dashboard", null, {location: "replace"});
                    }
                },
                getDashboardConfig: function () {
                    return {
                        url: "/dashboard",
                        controller: "DashboardCtrl",
                        templateUrl: CommonConstants.PARTIALS_DIR + "/dashboard.html",
                        resolve: {
                            projectLevelSpecifics: function () {
                                projectLevelPageSpecifics.type = projectLevelSingleName;
                                // Just undefine, complete deletion not needed
                                projectLevelPageSpecifics.menuUrl = void(0);
                                // projectLevelPageSpecifics.urlPrefix; set in parent state

                                return projectLevelPageSpecifics;
                            }
                        }
                    };
                },
                getEntryConfig: function (stateSingleName) {
                    return {
                        url: "/" + stateSingleName + "s",
                        controller: "EntriesCtrl",
                        templateUrl: CommonConstants.PARTIALS_DIR + "/entries.html",
                        resolve: {
                            //	This does not work (but fails silently):
                            //     // entrySpecifics: function () {
                            //     // 	return entriesMap[i].resolveFn();
                            //     // }
                            // .. cannot apparently use outer scope variables inside
                            //	following's alternative inline function declaration.
                            // But this does (function declared outside):
                            //     // entrySpecifics: entriesMap["actions"].resolveFn
                            entrySpecifics: function () {
                                projectLevelPageSpecifics.type = stateSingleName;
                                projectLevelPageSpecifics.menuUrl = stateSingleName + "s";
                                // projectLevelPageSpecifics.urlPrefix; set in parent state

                                return projectLevelPageSpecifics;
                            }
                        }
                    };
                },
                planningConfig: {
                    url: "/planning",
                    template: "<p>Planning</p>",
                    controller: function (Sidebar) {
                        Sidebar.setActiveMenuUrlBySuffix("planning");
                    }
                }
            };
        }

        // Project level similar routing
        var projectLevelStateName = PROJECT_LEVELS_STATE_STRING;
        for (var i = 0; i < CommonConstants.PROJECT_LEVELS.length; i++) {
            generateProjectLevelState(projectLevelStateName, CommonConstants.PROJECT_LEVELS[i]);
            projectLevelStateName += "." + CommonConstants.PROJECT_LEVELS[i];
        }
        generateProjectLevelState(PROJECT_LEVELS_STATE_STRING + "." + CommonConstants.PROJECT_STRING, CommonConstants.CONSTRUCTION_SITE_STRING);

        function generateProjectLevelState(projectLevelParentStateName, projectLevelSingleName) {
            var statesConfig = getProjectLevelStatesConfig(projectLevelSingleName);
            var stateName = (projectLevelParentStateName ? projectLevelParentStateName + "." : "") + projectLevelSingleName;

            $stateProvider
                .state(stateName, statesConfig.getProjectLevelConfig(stateName))
                .state(stateName + ".default", statesConfig.defaultConfig)
                .state(stateName + ".dashboard", statesConfig.getDashboardConfig())
                .state(stateName + ".planning", statesConfig.planningConfig);

            for (var j = 0; j < CommonConstants.PROJECT_LEVEL_ARTIFACTS.length; j++) {
                $stateProvider.state(stateName + "." + CommonConstants.PROJECT_LEVEL_ARTIFACTS[j] + "s",
                    statesConfig.getEntryConfig(CommonConstants.PROJECT_LEVEL_ARTIFACTS[j]));
            }

            if (projectLevelSingleName === CommonConstants.PROJECT_STRING) {
                $stateProvider.state(stateName + "." + CommonConstants.SUB_PROJECT_STRING + "s",
                    statesConfig.getEntryConfig(CommonConstants.SUB_PROJECT_STRING));
            }
            if (projectLevelSingleName === CommonConstants.PROJECT_STRING
                || projectLevelSingleName === CommonConstants.SUB_PROJECT_STRING) {
                $stateProvider.state(stateName + "." + CommonConstants.CONSTRUCTION_SITE_STRING + "s",
                    statesConfig.getEntryConfig(CommonConstants.CONSTRUCTION_SITE_STRING));
            }
        }
    });