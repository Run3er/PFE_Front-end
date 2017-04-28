
angular.module('ProjMngmnt')
	.service('Sidebar', function () {
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
        function getSubHierarchyEntry(hierarchyHead) {
            var projectLevelSuffix;
            var projectLevelTitle;

            if (hierarchyHead === "entities") {
                projectLevelSuffix = projectString + "s";
                projectLevelTitle = "Projets";
            }
            else if (hierarchyHead === projectString) {
                projectLevelSuffix = subProjectString + "s";
                projectLevelTitle = "Sous-projets";
            }
            else if (hierarchyHead === subProjectString) {
                projectLevelSuffix = constructionSiteString + "s";
                projectLevelTitle = "Chantiers";
            }
            else return void(0);

            return {
                url: "javascript:void(0)",
                iconClass: "fa fa-sitemap",
                title: projectLevelTitle,
                entries: [
                    {
                        url: projectLevelSuffix + "/1",
                        title: "Service 5G - Ooredoo"
                    },
                    {
                        url: projectLevelSuffix + "/2",
                        title: "SMS Sender - TT"
                    },
                    {
                        url: projectLevelSuffix + "/3",
                        title: "Application de gestion de projets en mode SaaS"
                    },
                    {
                        url: projectLevelSuffix + "/4",
                        title: "Rénovation Infrastructure"
                    }
                ]
            };
        }

        function prependUrlPrefix(entries, urlPrefix) {
            urlPrefix = "./" + (urlPrefix ? urlPrefix + "/" : "");
            for (var i = 0; i < entries.length; i++) {
                // Avoid prefixing for collapsible entry links [javascript:void(0)]
                if (entries[i].entries === void(0)) {
                    entries[i].url = urlPrefix + entries[i].url;
                }
                else {
                    // Prepend collapsible link sub-links
                    for (var j = 0; j < entries[i].entries.length; j++) {
                        if (entries[i].entries[j].entries === void(0)) {
                            entries[i].entries[j].url = urlPrefix + entries[i].entries[j].url;
                        }
                    }
                }
            }
        }


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

                var entry = getSubHierarchyEntry(pageProperties.type);
                if (entry !== void(0)){
                    cloneContent.entries.push(entry);
                }
            }
            prependUrlPrefix(cloneContent.entries, pageProperties.urlPrefix);

            // Change global content
            sidebarContent.title = cloneContent.title;
            sidebarContent.entries = cloneContent.entries;
            sidebarContent.menuActive = void(0);
            sidebarContent.menuExpanded = void(0);
            sidebarContent.subMenuActive = void(0);
        };
	});