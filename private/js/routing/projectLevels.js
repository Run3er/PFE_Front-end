angular.module("ProjMngmnt")
    .config(function (CommonConstants, $stateProvider) {

        // Common project level states, parametrized, config
        function getProjectLevelStatesConfig(projectLevelSingleName) {
            var urlParts = [""];
            if (projectLevelSingleName === CommonConstants.PROJECT_STRING
                    || projectLevelSingleName === CommonConstants.SUB_PROJECT_STRING) {
                urlParts.push(CommonConstants.PROJECT_STRING + "s/:" + CommonConstants.PROJECT_STRING + "Id");
            }
            if (projectLevelSingleName === CommonConstants.SUB_PROJECT_STRING) {
                urlParts.push(CommonConstants.SUB_PROJECT_STRING + "s/:" + CommonConstants.SUB_PROJECT_STRING + "Id");
            }

            // Project level controllers-resolve targeted
            var projectLevelPageSpecifics = {};

            var projectLevelRouting = {
                projectLevelPageSpecifics: projectLevelPageSpecifics,
                projectLevelConfig: {
                    url: urlParts.join("/"),
                    templateUrl: CommonConstants.PARTIALS_DIR + "/nav-sidebar-header.html",
                    controller: function (Sidebar, Header, API, $state, $stateParams) {
                        // Sidebar setup
                        var urlPrefixParts = [];
                        // Header setup
                        var entries = [];
                        entries.push({ title: "Portefeuille", url: $state.href("general.projects", null, {absolute: true}) });

                        // Common conditions
                        if (projectLevelSingleName === CommonConstants.PROJECT_STRING
                            || projectLevelSingleName === CommonConstants.SUB_PROJECT_STRING) {
                            urlPrefixParts.push(CommonConstants.PROJECT_STRING + "s/" + $stateParams[CommonConstants.PROJECT_STRING + "Id"]);

                            var projectEntry = { url: urlPrefixParts.join("/") + "/"  };
                            API.getSingleResrcByUri(urlPrefixParts[0])
                                .then(function (projectLevelEntry) {
                                    projectEntry.title = projectLevelEntry.name;
                                });
                            // Get project name by projectId, from API
                            entries.push(projectEntry);
                        }
                        if (projectLevelSingleName === CommonConstants.SUB_PROJECT_STRING) {
                            urlPrefixParts.push(CommonConstants.SUB_PROJECT_STRING + "s/" + $stateParams[CommonConstants.SUB_PROJECT_STRING + "Id"]);

                            var subProjectEntry = { url: urlPrefixParts.join("/") + "/"  };
                            API.getSingleResrcByUri(urlPrefixParts[1])
                                .then(function (projectLevelEntry) {
                                    subProjectEntry.title = projectLevelEntry.name;
                                });
                            // Get project name by projectId, from API
                            entries.push(subProjectEntry);
                        }
                        projectLevelPageSpecifics.urlPrefix = urlPrefixParts.join("/");


                        // Post-setup

                        Sidebar.setContent({ type: projectLevelSingleName, urlPrefix: projectLevelPageSpecifics.urlPrefix });
                        // On direct access, corresponding child state menu entry
                        if ($state.current.name !== projectLevelSingleName) {
                            // Get suffix by removing leading slash
                            Sidebar.setActiveMenuUrlBySuffix($state.current.url.slice(1));
                        }

                        Header.setContent({ updateTimeDisplayed:true, entries: entries });


                        // Default redirection to base path
                        // $state.current; returns child state (if detected through url), instead of this hereby state
                        if ($state.current.name === projectLevelSingleName) {
                            $state.go(".default", null, {location: "replace"});
                        }
                    }
                },
                defaultConfig: {
                    url: "/",
                    controller: function ($state, Sidebar) {
                        Sidebar.setActiveMenuUrlBySuffix("dashboard");

                        // Default redirection to designated entry (instead of blank)
                        $state.go("^.dashboard", null, {location: "replace"});
                    }
                },
                getDashboardConfig: function () {
                    return {
                        url: "/dashboard",
                        templateUrl: CommonConstants.PARTIALS_DIR + "/dashboard.html",
                        controller: "DashboardCtrl",
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
                        templateUrl: CommonConstants.PARTIALS_DIR + "/entries.html",
                        controller: "EntriesCtrl",
                        resolve: {
                            //	This does not work (but fails silently):
                            //     // entrySpecifics: function () {
                            //     // 	return entriesMap[i].resolveFn();
                            //     // }
                            // .. cannot apparently use outer scope variables inside
                            //	following's alternative inline function declaration.
                            // But this does (function declared outside):
                            //     // entrySpecifics: entriesMap["actions"].resolveFn
                            // TODO: find out why...
                            entrySpecifics: function () {
                                projectLevelPageSpecifics.type = stateSingleName;
                                projectLevelPageSpecifics.menuUrl = stateSingleName + "s";
                                // projectLevelPageSpecifics.urlPrefix; set in parent state

                                return projectLevelPageSpecifics;
                            }
                        }
                    };
                },
                getEntriesWithIndicatorsConfig: function (entryType) {
                    // Global view
                    var views = {
                        "": {
                            templateUrl: CommonConstants.PARTIALS_DIR + "/" + entryType + "s.html"
                        }
                    };
                    // Indicators view
                    var controllerPrefix = entryType.slice(0, 1).toUpperCase() + entryType.slice(1) + "s";
                    views["indicators@" + projectLevelSingleName + "." + entryType + "s"] = {
                        templateUrl: CommonConstants.PARTIALS_DIR + "/" + entryType + "s-indicators.html",
                        controller: controllerPrefix + "IndicatorsCtrl",
                        resolve: {
                            entrySpecifics: function () {
                                projectLevelPageSpecifics.type = entryType;
                                // Just undefine, complete deletion not needed
                                projectLevelPageSpecifics.menuUrl = void(0);
                                // projectLevelPageSpecifics.urlPrefix; set in parent state

                                return projectLevelPageSpecifics;
                            }
                        }
                    };
                    // Entries table-form view
                    var entriesConfig = projectLevelRouting.getEntryConfig(entryType);
                    entriesConfig.url = void(0);
                    views["entries@" + projectLevelSingleName + "." + entryType + "s"] = entriesConfig;

                    return {
                        url: "/" + entryType + "s",
                        views: views
                    }
                },
                getDetailsConfig: function(entryType) {
                    return {
                        url: "/" + entryType,
                        templateUrl: CommonConstants.PARTIALS_DIR + "/details.html",
                        controller: "DetailsCtrl",
                        resolve: {
                            entrySpecifics: function () {
                                projectLevelPageSpecifics.type = entryType;
                                projectLevelPageSpecifics.menuUrl = entryType;
                                // projectLevelPageSpecifics.urlPrefix; set in parent state

                                return projectLevelPageSpecifics;
                            }
                        }
                    }
                }
            };

            return projectLevelRouting;
        }

        // Project level similar routing
        for (var i = 0; i < CommonConstants.PROJECT_LEVELS.length; i++) {
            var projectLevelStatesConfig = getProjectLevelStatesConfig(CommonConstants.PROJECT_LEVELS[i]);

            $stateProvider
                .state(CommonConstants.PROJECT_LEVELS[i], projectLevelStatesConfig.projectLevelConfig)
                .state(CommonConstants.PROJECT_LEVELS[i] + ".dashboard", projectLevelStatesConfig.getDashboardConfig())
                .state(CommonConstants.PROJECT_LEVELS[i] + ".charter", projectLevelStatesConfig.getDetailsConfig("charter"))
                .state(CommonConstants.PROJECT_LEVELS[i] + ".advancementState", projectLevelStatesConfig.getDetailsConfig("advancementState"))
                .state(CommonConstants.PROJECT_LEVELS[i] + ".budget", projectLevelStatesConfig.getDetailsConfig("budget"))

                .state(CommonConstants.PROJECT_LEVELS[i] + ".actions", projectLevelStatesConfig.getEntriesWithIndicatorsConfig("action"))
                // .state(CommonConstants.PROJECT_LEVELS[i] + ".risks", projectLevelStatesConfig.getEntriesWithIndicatorsConfig("risk"))

                .state(CommonConstants.PROJECT_LEVELS[i] + ".default", projectLevelStatesConfig.defaultConfig);

            var projectLevelArtifacts = CommonConstants.PROJECT_LEVEL_ARTIFACTS;
            projectLevelArtifacts[CommonConstants.PROJECT_LEVELS[i]].splice(projectLevelArtifacts[CommonConstants.PROJECT_LEVELS[i]].indexOf("action"), 1);
            // projectLevelArtifacts[CommonConstants.PROJECT_LEVELS[i]].splice(projectLevelArtifacts[CommonConstants.PROJECT_LEVELS[i]].indexOf("risk"), 1);
            for (var j = 0; j < projectLevelArtifacts[CommonConstants.PROJECT_LEVELS[i]].length; j++) {
                $stateProvider.state(CommonConstants.PROJECT_LEVELS[i] + "." + projectLevelArtifacts[CommonConstants.PROJECT_LEVELS[i]][j] + "s",
                    projectLevelStatesConfig.getEntryConfig(projectLevelArtifacts[CommonConstants.PROJECT_LEVELS[i]][j]));
            }

            if (CommonConstants.PROJECT_LEVELS[i] === CommonConstants.PROJECT_STRING) {
                $stateProvider.state(CommonConstants.PROJECT_LEVELS[i] + "." + CommonConstants.SUB_PROJECT_STRING + "s",
                    projectLevelStatesConfig.getEntryConfig(CommonConstants.SUB_PROJECT_STRING));
            }
        }
    });