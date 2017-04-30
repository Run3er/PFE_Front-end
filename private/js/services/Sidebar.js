
angular.module('ProjMngmnt')
    .service('Sidebar', function (DB) {
        var hrefVoid = "javascript:void(0)";

        // Project levels string
        var projectString = "project";
        var subProjectString = "subProject";
        var constructionSiteString = "constructionSite";
        var projectLevels = [ projectString, subProjectString, constructionSiteString ];

        var sidebarContent = {};

        var projectLevelBaseContent = {
            title: "Application de gestion de projets en mode SaaS",
            entries: [
                {
                    url: "dashboard",
                    iconClass: "fa fa-dashboard",
                    title: "Tableau de bord"
                },
                {
                    url: "actions",
                    iconClass: "fa fa-tasks",
                    title: "Actions"
                },
                {
                    url: "risks",
                    iconClass: "fa fa-warning",
                    title: "Risques"
                },
                {
                    url: "pendingIssues",
                    iconClass: "fa fa-pause-circle-o",
                    title: "Points en suspens"
                },
                {
                    url: "changeRequests",
                    iconClass: "fa fa-exchange",
                    title: "Demandes de changement",
                    notifsNb: 1
                },
                {
                    url: "resources",
                    iconClass: "fa fa-user-times",
                    title: "Ressources"
                },
                {
                    url: "documents",
                    iconClass: "fa fa-file",
                    title: "Documents",
                    notifsNb: 2
                },
                {
                    url: "planning",
                    iconClass: "fa fa-calendar",
                    title: "Planning"
                }
            ]
        };

        var portfolioContent  = {
            title: "Général",
            entries: [
                {
                    url: "dashboard",
                    iconClass: "fa fa-dashboard",
                    title: "Tableau de bord"
                },{
                    url: "portfolio",
                    iconClass: "fa fa-th",
                    title: "Portefeuille"
                },{
                    url: "resources",
                    iconClass: "fa fa-user-times",
                    title: "Ressources"
                },{
                    url: "internal",
                    iconClass: "fa fa-bullseye",
                    title: "Interne"
                },{
                    url: "external",
                    iconClass: "fa fa-external-link",
                    title: "Externe"
                }
            ]
        };

        // Get collapsible sub-hierarchy entry w/sub-links
        function getEntrySubs(parentEntryProps) {
            var subEntryType;
            var projectLevelTitle;

            if (parentEntryProps.type === projectString) {
                subEntryType = subProjectString;
                projectLevelTitle = "Sous-projets";
            }
            else if (parentEntryProps.type === subProjectString) {
                subEntryType = constructionSiteString;
                projectLevelTitle = "Chantiers";
            }
            else return void(0);

            return DB.getEntriesDAO(subEntryType).getAll()
                .then(function (entries) {
                    var subsUrlSuffix = subEntryType + "s";

                    var subEntries = [];
                    for (var i = 0; i < entries.length; i++) {
                        subEntries.push({
                            title: entries[i].name,
                            url: subsUrlSuffix + "/" + entries[i].id
                        });
                    }
                    for (var i = 0; i < subEntries.length; i++) {
                        subEntries[i].url = prependUrlPrefix(subEntries[i].url, parentEntryProps.urlPrefix);
                    }

                    return {
                        url: prependUrlPrefix(subsUrlSuffix, parentEntryProps.urlPrefix),
                        iconClass: "fa fa-sitemap",
                        title: projectLevelTitle,
                        entries: subEntries
                    };
                });
        }

        function prependUrlPrefix(urlSuffix, urlPrefix) {
            // Avoid prefixing for collapsible entry links [javascript:void(0)]
            if (urlSuffix === hrefVoid) {
                return urlSuffix;
            }
            return "./" + (urlPrefix ? urlPrefix + "/" : "") + urlSuffix;
        }



        this.getEntryByUrl = function (entryUrl) {
            var urlParts;
            var urlEnding;
            for (var i = 0; i < sidebarContent.entries.length; i++) {
                urlParts = sidebarContent.entries[i].url.split("/");
                urlEnding = urlParts[urlParts.length - 1];
                if (urlEnding === entryUrl) {
                    return sidebarContent.entries[i];
                }
            }
        };

        // Set active menu link corresponding to URL path
        this.setMenuActive = function (menuActiveUrl) {
            if (menuActiveUrl !== void(0)) {
                var urlParts;
                var urlEnding;
                for (var i = 0; i < sidebarContent.entries.length; i++) {
                    urlParts = sidebarContent.entries[i].url.split("/");
                    urlEnding = urlParts[urlParts.length - 1];
                    if (urlEnding === menuActiveUrl) {
                        // Since entries are identified & ordered by their ng-repeat $index, simply use i
                        sidebarContent.menuActive = i;
                        break;
                    }
                }
            }
        };

        this.getContent = function () {
            return sidebarContent;
        };

        this.setContent = function (pageProperties) {
            var cloneContent;

            // Set page [type] content
            if (pageProperties.type === "general") {
                cloneContent = angular.copy(portfolioContent);
            }
            else if (projectLevels.indexOf(pageProperties.type) !== -1) {
                cloneContent = angular.copy(projectLevelBaseContent);

                // Add subs if any
                var promise = getEntrySubs(pageProperties);
                if (promise !== void(0)) {
                    promise.then(function (subsEntry) {
                        if (subsEntry !== void(0)){
                            cloneContent.entries.push(subsEntry);
                        }
                    });
                }
            }
            for (var i = 0; i < cloneContent.entries.length; i++) {
                cloneContent.entries[i].url = prependUrlPrefix(cloneContent.entries[i].url, pageProperties.urlPrefix);
            }

            // Change global content
            sidebarContent.title = cloneContent.title;
            sidebarContent.entries = cloneContent.entries;
            sidebarContent.menuActive = void(0);
            sidebarContent.menuExpanded = void(0);
            sidebarContent.subMenuActive = void(0);
        };
    });