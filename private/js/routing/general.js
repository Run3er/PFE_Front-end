
angular.module("ProjMngmnt")
    .config(function (CommonConstants, $stateProvider) {

        $stateProvider
            .state("general", {
                url: "/general",
                templateUrl: CommonConstants.PARTIALS_DIR + "/nav-sidebar-header.html",
                controller: function ($state) {
                    // Default redirection to base path
                    if ($state.href($state.current.name, $state.params) === $state.current.url) {
                        $state.go(".default", null, {location: "replace"});
                    }
                },
                onEnter: function (Sidebar, Header) {
                    Sidebar.setContent({ type: "general", urlPrefix: "general" });
                    Header.setContent({ updateTimeDisplayed: false, entries: []} );
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
            });
    });