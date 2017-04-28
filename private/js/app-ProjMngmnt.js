
angular.module("ProjMngmnt", ["ui.router"])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider) {
        // Project levels string
        var projectString = "project";
        var subProjectString = "subProject";
        var constructionSiteString = "constructionSite";
        var projectLevelArtifacts = [ "action", "risk", "pendingIssue", "changeRequest", "resource", "document" ];

        var partialsDir = "partials";


        // Common project level states, parametrized, config
        function getProjectLevelStatesConfig(projectLevelSingleName) {
            var url = "";
            if (projectLevelSingleName === projectString) {
                url += "/" + projectString + "s/:" + projectString + "Id";
            }
            if (projectLevelSingleName === subProjectString) {
                url += "/" + projectString + "s/:" + projectString + "Id";
                url += "/" + subProjectString + "s/:" + subProjectString + "Id";
            }
            if (projectLevelSingleName === constructionSiteString) {
                url += "/" + projectString + "s/:" + projectString + "Id";
                url += "/" + subProjectString + "s/:" + subProjectString + "Id";
                url += "/" + constructionSiteString + "s/:" + constructionSiteString + "Id";
            }

            return {
                projectLevelConfig: {
                    url: url,
                    templateUrl: partialsDir + "/nested-abstract.html",
                    controller: function ($state) {
                        // Default redirection to base path
                        // $state.current; returns child state (if detected through url), instead of this hereby state
                        if ($state.current.name === projectLevelSingleName){
                            $state.go(".default", null, { location: "replace" });
                        }
                    },
                    onEnter: function (Sidebar, Header, $stateParams) {
                        var urlPrefix = "";
                        if (projectLevelSingleName === projectString) {
                            urlPrefix += projectString + "s/" + $stateParams[projectString + "Id"];
                        }
                        if (projectLevelSingleName === subProjectString) {
                            urlPrefix += projectString + "s/" + $stateParams[projectString + "Id"] + "/";
                            urlPrefix += subProjectString + "s/" + $stateParams[subProjectString + "Id"];
                        }
                        if (projectLevelSingleName === constructionSiteString) {
                            urlPrefix += projectString + "s/" + $stateParams[projectString + "Id"] + "/";
                            urlPrefix += subProjectString + "s/" + $stateParams[subProjectString + "Id"] + "/";
                            urlPrefix += constructionSiteString + "s/" + $stateParams[constructionSiteString + "Id"];
                        }

                        Sidebar.setContent({ type: projectLevelSingleName, urlPrefix: urlPrefix });
                        Header.displayUpdateTime();
                    }
                },
                defaultConfig: {
                    url: "/",
                    controller: function ($state) {
                        // Default redirection to designated entry (instead of blank)
                        $state.go("^.dashboard", null, { location: "replace" });
                    }
                },
                dashboardConfig: {
                    url: "/dashboard",
                    templateUrl: partialsDir + "/dashboard.html",
                    controller: "DashboardCtrl",
                    onEnter: function (Sidebar) {
                        Sidebar.setMenuActive("dashboard");
                    }
                },
                getEntryConfig: function (stateSingleName) {
                    return {
                        url: "/" + stateSingleName + "s",
                        templateUrl: partialsDir + "/entries.html",
                        controller: "EntriesCtrl",
                        onEnter: function (Sidebar) {
                            Sidebar.setMenuActive(stateSingleName + "s");
                        },
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
                                return {type: stateSingleName};
                            }
                        }
                    };
                },
                planningConfig: {
                    url: "/planning",
                    template: "<p>Planning</p>",
                    controller: function (Sidebar) {
                        Sidebar.setMenuActive("planning");
                    }
                }
            };
        }


        // Routing config
        $stateProvider
            .state("general", {
                url: "/general",
                templateUrl: partialsDir + "/nested-abstract.html",
                controller: function ($state) {
                    // Default redirection to base path
                    if ($state.href($state.current.name, $state.params) === $state.current.url){
                        $state.go(".default", null, { location: "replace" });
                    }
                },
                onEnter: function (Sidebar, Header) {
                    Sidebar.setContent({type: "general", urlPrefix: "general"});
                    Header.removeUpdateTime();
                }
            })
            .state("general.default", {
                url: "/",
                controller: function ($state) {
                    // Default redirection to designated entry (instead of blank)
                    $state.go("^.dashboard", null, { location: "replace" });
                }
            })
            .state("general.dashboard", {
                url: "/dashboard",
                template: "<p>Tableau de bord.</p>",
                onEnter: function (Sidebar) {
                    Sidebar.setMenuActive("dashboard");
                }
            })
            .state("general.portfolio", {
                url: "/portfolio",
                template: "<p>Portefeuille.</p>",
                onEnter: function (Sidebar) {
                    Sidebar.setMenuActive("portfolio");
                }
            })
            .state("general.resources", {
                url: "/resources",
                template: "<p>Ressources.</p>",
                onEnter: function (Sidebar) {
                Sidebar.setMenuActive("resources");
            }
            })
            .state("general.internal", {
                url: "/internal",
                template: "<p>Interne.</p>",
                onEnter: function (Sidebar) {
                    Sidebar.setMenuActive("internal");
                }
            })
            .state("general.external", {
                url: "/external",
                template: "<p>Externe.</p>",
                onEnter: function (Sidebar) {
                    Sidebar.setMenuActive("external");
                }
            })

            .state("404", {
                // no url defined
                template: "<p>404 Not Found.</p>"
            });

        // Project level similar routing
        var projectLevels = [ projectString, subProjectString, constructionSiteString ];
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

        $urlRouterProvider
            .when("/", "/general")
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