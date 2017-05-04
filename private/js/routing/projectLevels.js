angular.module("ProjMngmnt")
    .config(function (CommonConstants, $stateProvider) {

        // Common project level states, parametrized, config
        function getProjectLevelStatesConfig(projectLevelSingleName) {
            var urlParts = [""];
            if (projectLevelSingleName === CommonConstants.PROJECT_STRING
                    || projectLevelSingleName === CommonConstants.SUB_PROJECT_STRING
                    || projectLevelSingleName === CommonConstants.CONSTRUCTION_SITE_STRING) {
                urlParts.push(CommonConstants.PROJECT_STRING + "s/:" + CommonConstants.PROJECT_STRING + "Id");
            }
            if (projectLevelSingleName === CommonConstants.SUB_PROJECT_STRING
                    || projectLevelSingleName === CommonConstants.CONSTRUCTION_SITE_STRING) {
                urlParts.push(CommonConstants.SUB_PROJECT_STRING + "s/:" + CommonConstants.SUB_PROJECT_STRING + "Id");
            }
            if (projectLevelSingleName === CommonConstants.CONSTRUCTION_SITE_STRING) {
                urlParts.push(CommonConstants.CONSTRUCTION_SITE_STRING + "s/:" + CommonConstants.CONSTRUCTION_SITE_STRING + "Id");
            }

            // Project level API URI prefix
            var entrySpecifics = {};

            return {
                projectLevelConfig: {
                    url: urlParts.join("/"),
                    templateUrl: CommonConstants.PARTIALS_DIR + "/nav-sidebar-header.html",
                    controller: function (Sidebar, Header, DB, $state, $stateParams) {
                        // Sidebar setup
                        var urlPrefixParts = [];
                        // Header setup
                        var entries = [];
                        entries.push({ title: "Portefeuille", url: $state.href("general.portfolio", null, {absolute: true}) });

                        // Common conditions
                        if (projectLevelSingleName === CommonConstants.PROJECT_STRING
                            || projectLevelSingleName === CommonConstants.SUB_PROJECT_STRING
                            || projectLevelSingleName === CommonConstants.CONSTRUCTION_SITE_STRING) {
                            urlPrefixParts.push(CommonConstants.PROJECT_STRING + "s/" + $stateParams[CommonConstants.PROJECT_STRING + "Id"]);

                            var projectEntry = { url: urlPrefixParts.join("/") };
                            DB.getSingleResrcByUri(urlPrefixParts[0])
                                .then(function (projectLevelEntry) {
                                    projectEntry.title = projectLevelEntry.name;
                                });
                            // Get project name by projectId, from DB
                            entries.push(projectEntry);
                        }
                        if (projectLevelSingleName === CommonConstants.SUB_PROJECT_STRING
                            || projectLevelSingleName === CommonConstants.CONSTRUCTION_SITE_STRING) {
                            urlPrefixParts.push(CommonConstants.SUB_PROJECT_STRING + "s/" + $stateParams[CommonConstants.SUB_PROJECT_STRING + "Id"]);

                            var subProjectEntry = { url: urlPrefixParts.join("/") };
                            DB.getSingleResrcByUri(urlPrefixParts[1])
                                .then(function (projectLevelEntry) {
                                    subProjectEntry.title = projectLevelEntry.name;
                                });
                            // Get project name by projectId, from DB
                            entries.push(subProjectEntry);
                        }
                        if (projectLevelSingleName === CommonConstants.CONSTRUCTION_SITE_STRING) {
                            urlPrefixParts.push(CommonConstants.CONSTRUCTION_SITE_STRING + "s/" + $stateParams[CommonConstants.CONSTRUCTION_SITE_STRING + "Id"]);

                            var constructionSiteEntry = { url: urlPrefixParts.join("/") };
                            DB.getSingleResrcByUri(urlPrefixParts[2])
                                .then(function (projectLevelEntry) {
                                    constructionSiteEntry.title = projectLevelEntry.name;
                                });
                            // Get project name by projectId, from DB
                            entries.push(constructionSiteEntry);
                        }
                        entrySpecifics.urlPrefix = urlPrefixParts.join("/");

                        // Post-setup
                        Sidebar.setContent({ type: projectLevelSingleName, urlPrefix: entrySpecifics.urlPrefix });
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
                    controller: function ($state) {
                        // Default redirection to designated entry (instead of blank)
                        $state.go("^.dashboard", null, {location: "replace"});
                    }
                },
                dashboardConfig: {
                    url: "/dashboard",
                    templateUrl: CommonConstants.PARTIALS_DIR + "/dashboard.html",
                    controller: "DashboardCtrl"
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
                            entrySpecifics: function () {
                                entrySpecifics.type = stateSingleName;
                                entrySpecifics.menuUrl = stateSingleName + "s";
                                // entrySpecifics.urlPrefix; set in parent state

                                return entrySpecifics;
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
        var projectLevels = [CommonConstants.PROJECT_STRING, CommonConstants.SUB_PROJECT_STRING, CommonConstants.CONSTRUCTION_SITE_STRING];
        for (var i = 0; i < projectLevels.length; i++) {
            var projectLevelStatesConfig = getProjectLevelStatesConfig(projectLevels[i]);

            $stateProvider
                .state(projectLevels[i], projectLevelStatesConfig.projectLevelConfig)
                .state(projectLevels[i] + ".default", projectLevelStatesConfig.defaultConfig)
                .state(projectLevels[i] + ".dashboard", projectLevelStatesConfig.dashboardConfig)
                .state(projectLevels[i] + ".planning", projectLevelStatesConfig.planningConfig);

            for (var j = 0; j < CommonConstants.PROJECT_LEVEL_ARTIFACTS.length; j++) {
                $stateProvider.state(projectLevels[i] + "." + CommonConstants.PROJECT_LEVEL_ARTIFACTS[j] + "s",
                    projectLevelStatesConfig.getEntryConfig(CommonConstants.PROJECT_LEVEL_ARTIFACTS[j]));
            }

            if (projectLevels[i] === CommonConstants.PROJECT_STRING) {
                $stateProvider.state(CommonConstants.PROJECT_STRING + "." + CommonConstants.SUB_PROJECT_STRING + "s",
                    projectLevelStatesConfig.getEntryConfig(CommonConstants.SUB_PROJECT_STRING));
                $stateProvider.state(CommonConstants.PROJECT_STRING + "." + CommonConstants.CONSTRUCTION_SITE_STRING + "s",
                    projectLevelStatesConfig.getEntryConfig(CommonConstants.CONSTRUCTION_SITE_STRING));
            }
            else if (projectLevels[i] === CommonConstants.SUB_PROJECT_STRING) {
                $stateProvider.state(CommonConstants.SUB_PROJECT_STRING + "." + CommonConstants.CONSTRUCTION_SITE_STRING + "s",
                    projectLevelStatesConfig.getEntryConfig(CommonConstants.CONSTRUCTION_SITE_STRING));
            }
        }
    });