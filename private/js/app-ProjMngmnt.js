angular.module("ProjMngmnt", ["ui.router"])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider) {
        // Project levels string
        var projectString = "project";
        var subProjectString = "subProject";
        var constructionSiteString = "constructionSite";
        var projectLevelArtifacts = ["action", "risk", "pendingIssue", "changeRequest", "resource", "document"];

        var partialsDir = "partials";


        // Common project level states, parametrized, config
        function getProjectLevelStatesConfig(projectLevelSingleName) {
            var urlParts = [""];
            if (projectLevelSingleName === projectString
                    || projectLevelSingleName === subProjectString
                    || projectLevelSingleName === constructionSiteString) {
                urlParts.push(projectString + "s/:" + projectString + "Id");
            }
            if (projectLevelSingleName === subProjectString
                    || projectLevelSingleName === constructionSiteString) {
                urlParts.push(subProjectString + "s/:" + subProjectString + "Id");
            }
            if (projectLevelSingleName === constructionSiteString) {
                urlParts.push(constructionSiteString + "s/:" + constructionSiteString + "Id");
            }

            return {
                projectLevelConfig: {
                    url: urlParts.join("/"),
                    templateUrl: partialsDir + "/nav-sidebar-header.html",
                    controller: function (Sidebar, Header, $state, $stateParams) {
                        // Sidebar setup
                        var urlPrefixParts = [];
                        // Header setup
                        var entries = [];
                        entries.push({ title: "Portefeuille", url: $state.href("general.portfolio", null, {absolute: true}) });

                        // Common conditions
                        if (projectLevelSingleName === projectString
                            || projectLevelSingleName === subProjectString
                            || projectLevelSingleName === constructionSiteString) {
                            urlPrefixParts.push(projectString + "s/" + $stateParams[projectString + "Id"]);
                            // Get project name by projectId, from DB
                            entries.push({ title: "Projet X", url: urlPrefixParts[0] + "/" });
                        }
                        if (projectLevelSingleName === subProjectString
                            || projectLevelSingleName === constructionSiteString) {
                            urlPrefixParts.push(subProjectString + "s/" + $stateParams[subProjectString + "Id"]);
                            // Get sub-project name by subProjectId, from DB
                            entries.push({ title: "Sous-projet Y", url: urlPrefixParts[0] + "/" + urlPrefixParts[1] + "/" });
                        }
                        if (projectLevelSingleName === constructionSiteString) {
                            urlPrefixParts.push(constructionSiteString + "s/" + $stateParams[constructionSiteString + "Id"]);
                            // Get sub-project name by constructionSiteId, from DB
                            entries.push({ title: "Chantier Z", url: urlPrefixParts[0] + "/" + urlPrefixParts[1] + "/" + urlPrefixParts[2] + "/" });
                        }

                        // Post-setup
                        Sidebar.setContent({ type: projectLevelSingleName, urlPrefix: urlPrefixParts.join("/") });
                        Header.setContent({ updateTimeDisplayed:true, entries: entries });


                        // TODO: Change sidebar title ...


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
                    templateUrl: partialsDir + "/dashboard.html",
                    controller: "DashboardCtrl"
                },
                getEntryConfig: function (stateSingleName) {
                    return {
                        url: "/" + stateSingleName + "s",
                        templateUrl: partialsDir + "/entries.html",
                        controller: "EntriesCtrl",
                        resolve: {
                            //	This does not work (but fails silently):
                            //     // entriesSpecifics: function () {
                            //     // 	return entriesMap[i].resolveFn();
                            //     // }
                            // .. cannot apparently use outer scope variables inside
                            //	following's alternative inline function declaration.
                            // But this does (function declared outside):
                            //     // entriesSpecifics: entriesMap["actions"].resolveFn
                            entriesSpecifics: function () {
                                return { type: stateSingleName, menuUrl: stateSingleName + "s" };
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


        // Routing config
        $stateProvider
            .state("general", {
                url: "/general",
                templateUrl: partialsDir + "/nav-sidebar-header.html",
                controller: function ($state) {
                    // Default redirection to base path
                    if ($state.href($state.current.name, $state.params) === $state.current.url) {
                        $state.go(".default", null, {location: "replace"});
                    }
                },
                onEnter: function (Sidebar, Header) {
                    Sidebar.setContent({type: "general", urlPrefix: "general"});
                    Header.setContent({updateTimeDisplayed: false, entries: []});
                }
            })
            .state("general.default", {
                url: "/",
                controller: function ($state) {
                    // Default redirection to designated entry (instead of blank)
                    $state.go("^.dashboard", null, {location: "replace"});
                }
            })
            .state("general.dashboard", {
                url: "/dashboard",
                template: "<p>Tableau de bord.</p>",
                onEnter: function (Sidebar) {
                    Sidebar.setActiveMenuUrlBySuffix("dashboard");
                }
            })
            .state("general.portfolio", {
                url: "/portfolio",
                templateUrl: partialsDir + "/entries.html",
                controller: "EntriesCtrl",
                resolve: {
                    entriesSpecifics: function () {
                        return { type: "project", menuUrl: "portfolio" };
                    }
                }
            })
            .state("general.resources", {
                url: "/resources",
                templateUrl: partialsDir + "/entries.html",
                controller: "EntriesCtrl",
                resolve: {
                    entriesSpecifics: function () {
                        return { type: "resource", menuUrl: "resources" };
                    }
                }
            })
            .state("general.internal", {
                url: "/internal",
                template: "<p>Interne.</p>",
                onEnter: function (Sidebar) {
                    Sidebar.setActiveMenuUrlBySuffix("internal");
                }
            })
            .state("general.external", {
                url: "/external",
                template: "<p>Externe.</p>",
                onEnter: function (Sidebar) {
                    Sidebar.setActiveMenuUrlBySuffix("external");
                }
            })

            .state("404", {
                // no url defined
                templateUrl: partialsDir + "/404-not-found.html"
            });

        // Project level similar routing
        var projectLevels = [projectString, subProjectString, constructionSiteString];
        for (var i = 0; i < projectLevels.length; i++) {
            $stateProvider
                .state(projectLevels[i], getProjectLevelStatesConfig(projectLevels[i]).projectLevelConfig)
                .state(projectLevels[i] + ".default", getProjectLevelStatesConfig(projectLevels[i]).defaultConfig)
                .state(projectLevels[i] + ".dashboard", getProjectLevelStatesConfig(projectLevels[i]).dashboardConfig)
                .state(projectLevels[i] + ".planning", getProjectLevelStatesConfig(projectLevels[i]).planningConfig);
            for (var j = 0; j < projectLevelArtifacts.length; j++) {
                $stateProvider.state(projectLevels[i] + "." + projectLevelArtifacts[j] + "s",
                    getProjectLevelStatesConfig(projectLevels[i]).getEntryConfig(projectLevelArtifacts[j]));
            }
        }

        $stateProvider
            .state(projectString + "." + subProjectString + "s",
                getProjectLevelStatesConfig(projectString).getEntryConfig(subProjectString))
            .state(subProjectString + "." + constructionSiteString + "s",
                getProjectLevelStatesConfig(subProjectString).getEntryConfig(constructionSiteString));

        // Default routing behavior
        $urlRouterProvider
            .when("/", "/general/")
            .otherwise(function ($injector) {
                var $state = $injector.get("$state");

                $state.go("404", null, {
                    location: false
                });
            });

        // Use the HTML5 History API for cleaner URLs
        // You have to specify the correct base in the html global
        //	template. exp: for an index page accessed through
        //	"localhost/ProjectX/", base is "/ProjectX/"
        $locationProvider.html5Mode(true);


        // Allow javascript:void(0) href
        var currentHrefSanitationRegex = $compileProvider.aHrefSanitizationWhitelist().toString().slice(1, -1);
        var newHrefSanitationRegex = "(" + currentHrefSanitationRegex + ")|(" + "^\\s*(javascript:void\\(0\\))" + ")";
        $compileProvider.aHrefSanitizationWhitelist(new RegExp(newHrefSanitationRegex));
    });