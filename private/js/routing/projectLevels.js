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

            return {
                projectLevelPageSpecifics: projectLevelPageSpecifics,
                projectLevelConfig: {
                    url: urlParts.join("/"),
                    templateUrl: CommonConstants.PARTIALS_DIR + "/nav-sidebar-header.html",
                    controller: function (Sidebar, Header, DB, $state, $stateParams) {
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
                            DB.getSingleResrcByUri(urlPrefixParts[0])
                                .then(function (projectLevelEntry) {
                                    projectEntry.title = projectLevelEntry.name;
                                });
                            // Get project name by projectId, from DB
                            entries.push(projectEntry);
                        }
                        if (projectLevelSingleName === CommonConstants.SUB_PROJECT_STRING) {
                            urlPrefixParts.push(CommonConstants.SUB_PROJECT_STRING + "s/" + $stateParams[CommonConstants.SUB_PROJECT_STRING + "Id"]);

                            var subProjectEntry = { url: urlPrefixParts.join("/") + "/"  };
                            DB.getSingleResrcByUri(urlPrefixParts[1])
                                .then(function (projectLevelEntry) {
                                    subProjectEntry.title = projectLevelEntry.name;
                                });
                            // Get project name by projectId, from DB
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
                charterConfig: {
                    url: "/charter",
                    templateUrl: CommonConstants.PARTIALS_DIR + "/details.html",
                    controller: "DetailsCtrl",
                    resolve: {
                        entrySpecifics: function () {
                            projectLevelPageSpecifics.type = "charter";
                            projectLevelPageSpecifics.menuUrl = "charter";
                            // projectLevelPageSpecifics.urlPrefix; set in parent state

                            return projectLevelPageSpecifics;
                        }
                    }
                },
                planningConfig: {
                    url: "/planning",
                    template: "<p>Planning.</p>"
                },
                budgetConfig: {
                    url: "/budget",
                    template: "<p>Gestion du budget.</p>"
                }
            };
        }

        // Project level similar routing
        for (var i = 0; i < CommonConstants.PROJECT_LEVELS.length; i++) {
            var projectLevelStatesConfig = getProjectLevelStatesConfig(CommonConstants.PROJECT_LEVELS[i]);

            $stateProvider
                .state(CommonConstants.PROJECT_LEVELS[i], projectLevelStatesConfig.projectLevelConfig)
                .state(CommonConstants.PROJECT_LEVELS[i] + ".default", projectLevelStatesConfig.defaultConfig)
                .state(CommonConstants.PROJECT_LEVELS[i] + ".dashboard", projectLevelStatesConfig.getDashboardConfig())
                .state(CommonConstants.PROJECT_LEVELS[i] + ".charter", projectLevelStatesConfig.charterConfig)
                .state(CommonConstants.PROJECT_LEVELS[i] + ".planning", projectLevelStatesConfig.planningConfig)
                .state(CommonConstants.PROJECT_LEVELS[i] + ".budget", projectLevelStatesConfig.budgetConfig);

            for (var j = 0; j < CommonConstants.PROJECT_LEVEL_ARTIFACTS[CommonConstants.PROJECT_LEVELS[i]].length; j++) {
                $stateProvider.state(CommonConstants.PROJECT_LEVELS[i] + "." + CommonConstants.PROJECT_LEVEL_ARTIFACTS[CommonConstants.PROJECT_LEVELS[i]][j] + "s",
                    projectLevelStatesConfig.getEntryConfig(CommonConstants.PROJECT_LEVEL_ARTIFACTS[CommonConstants.PROJECT_LEVELS[i]][j]));
            }

            if (CommonConstants.PROJECT_LEVELS[i] === CommonConstants.PROJECT_STRING) {
                $stateProvider.state(CommonConstants.PROJECT_LEVELS[i] + "." + CommonConstants.SUB_PROJECT_STRING + "s",
                    projectLevelStatesConfig.getEntryConfig(CommonConstants.SUB_PROJECT_STRING));
            }
        }
    });