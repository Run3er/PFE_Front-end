
angular.module("ProjMngmnt")
    .config(function (CommonConstants, $stateProvider) {

        $stateProvider
            .state("general", {
                url: CommonConstants.GENERAL_BASE_URL,
                templateUrl: CommonConstants.PARTIALS_DIR + "/nav-sidebar-header.html",
                controller: function ($state, Sidebar) {
                    // On direct access, corresponding child state menu entry
                    if ($state.current.name !== "general") {
                        // Get suffix by removing leading slash
                        Sidebar.setActiveMenuUrlBySuffix($state.current.url.slice(1));
                    }

                    // Default redirection to base path
                    if ($state.href($state.current.name, $state.params) === $state.current.url) {
                        $state.go(".default", null, {location: "replace"});
                    }
                },
                onEnter: function (Sidebar, Header) {
                    Sidebar.setContent({ type: "general", urlPrefix: "general" });
                    Header.setContent({ updateTimeDisplayed: false, entries: [] });
                }
            })
            .state("general.default", {
                url: "/",
                controller: function (Sidebar, $state) {
                    Sidebar.setActiveMenuUrlBySuffix("projects");

                    // Default redirection to designated entry (instead of blank)
                    $state.go("^.projects", null, {location: "replace"});
                }
            })
            .state("general.dashboard", {
                url: "/dashboard",
                template: "<p>Tableau de bord.</p>"
            })
            .state("general.projects", {
                url: "/projects",
                templateUrl: CommonConstants.PARTIALS_DIR + "/entries.html",
                controller: "EntriesCtrl",
                resolve: {
                    entrySpecifics: function () {
                        return { type: "project" };
                    }
                }
            })
            .state("general.resources", {
                url: "/resources",
                templateUrl: CommonConstants.PARTIALS_DIR + "/entries.html",
                controller: "EntriesCtrl",
                resolve: {
                    entrySpecifics: function () {
                        return { type: "resource" };
                    }
                }
            })
            .state("general.providers", {
                url: "/providers",
                template: "<p>Fournisseurs.</p>"
            })
            .state("general.partners", {
                url: "/partners",
                template: "<p>Partenaires.</p>"
            })
            .state("general.accounts", {
                url: "/accounts",
                template: "<p>Gestion de comptes.</p>"
            });
    });