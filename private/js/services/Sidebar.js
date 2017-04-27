
angular.module('ProjMngmnt')
	.service('Sidebar', function () {
	    var sidebarContent = {};

		var projectLevelBaseContent = {
			"title": "Application de gestion de projets en mode SaaS",
			"entries": [
                {
                	"url": "./dashboard",
                    "iconClass": "fa fa-dashboard",
                    "title": "Tableau de bord"
                },
                {
                    "url": "./actions",
                    "iconClass": "fa fa-tasks",
                    "title": "Actions"
                },
                {
                    "url": "./risks",
                    "iconClass": "fa fa-warning",
                    "title": "Risques"
                },
                {
                    "url": "./pending-issues",
                    "iconClass": "fa fa-pause-circle-o",
                    "title": "Points en suspens"
                },
                {
                    "url": "./change-requests",
                    "iconClass": "fa fa-exchange",
                    "title": "Demandes de changement",
					"notifsNb": 1
                },
                {
                    "url": "./resources",
                    "iconClass": "fa fa-user-times",
                    "title": "Ressources"
                },
                {
                    "url": "./documents",
                    "iconClass": "fa fa-file",
                    "title": "Documents",
					"notifsNb": 2
                },
                {
                    "url": "./planning",
                    "iconClass": "fa fa-calendar",
                    "title": "Planning"
                }
			]
		};

		var portfolioContent  = {
            "title": "Général",
            "entries": [
                {
                    "url": "./general/dashboard",
                    "iconClass": "fa fa-dashboard",
                    "title": "Dashboard"
                },{
                    "url": "./general/portfolio",
                    "iconClass": "fa fa-th",
                    "title": "Portefeuille"
                },{
                    "url": "./general/resources",
                    "iconClass": "fa fa-user-times",
                    "title": "Ressources"
                },{
                    "url": "./general/internal",
                    "iconClass": "fa fa-bullseye",
                    "title": "Interne"
                },{
                    "url": "./general/external",
                    "iconClass": "fa fa-external-link",
                    "title": "Externe"
                }
                // ,
                // {
                //     "url": "javascript:void(0)",
                //     "iconClass": "fa fa-sitemap",
                //     "title": "Entité-A",
                //     "entries": [
                //         {
                //             "url": "./projects/1",
                //             "title": "Service 5G - Ooredoo"
                //         },
                //         {
                //             "url": "./projects/2",
                //             "title": "SMS Sender - TT"
                //         },
                //         {
                //             "url": "./projects/3",
                //             "title": "Application de gestion de projets en mode SaaS"
                //         },
                //         {
                //             "url": "./projects/4",
                //             "title": "Rénovation Infrastructure"
                //         }
                //     ]
                // },
                // {
                //     "url": "javascript:void(0)",
                //     "iconClass": "fa fa-sitemap",
                //     "title": "Entité-A",
                //     "entries": [
                //         {
                //             "url": "./projects/1",
                //             "title": "Service 5G - Ooredoo"
                //         },
                //         {
                //             "url": "./projects/2",
                //             "title": "SMS Sender - TT"
                //         },
                //         {
                //             "url": "./projects/3",
                //             "title": "Application de gestion de projets en mode SaaS"
                //         },
                //         {
                //             "url": "./projects/4",
                //             "title": "Rénovation Infrastructure"
                //         }
                //     ]
                // },{
                //     "url": "javascript:void(0)",
                //     "iconClass": "fa fa-sitemap",
                //     "title": "Entité-C",
                //     "entries": [
                //         {
                //             "url": "./projects/1",
                //             "title": "Service 5G - Ooredoo"
                //         },
                //         {
                //             "url": "./projects/2",
                //             "title": "SMS Sender - TT"
                //         },
                //         {
                //             "url": "./projects/3",
                //             "title": "Application de gestion de projets en mode SaaS"
                //         },
                //         {
                //             "url": "./projects/4",
                //             "title": "Rénovation Infrastructure"
                //         }
                //     ]
                // }
            ]
        };

        function getSubHierarchyEntry(hierarchyHead) {
            var projectLevelSuffix;
            var projectLevelTitle;

            if (hierarchyHead === "entities") {
                projectLevelSuffix = "projects";
                projectLevelTitle = "Projets";
            }
            else if (hierarchyHead === "project") {
                projectLevelSuffix = "sub-projects";
                projectLevelTitle = "Sous-projets";                
            }
            else if (hierarchyHead === "sub-project") {
                projectLevelSuffix = "construction-sites";
                projectLevelTitle = "Chantiers";
            }
            else return void(0);

            return {
                "url": "javascript:void(0)",
                "iconClass": "fa fa-sitemap",
                "title": projectLevelTitle,
                "entries": [
                    {
                        "url": "./" + projectLevelSuffix + "/1",
                        "title": "Service 5G - Ooredoo"
                    },
                    {
                        "url": "./" + projectLevelSuffix + "/2",
                        "title": "SMS Sender - TT"
                    },
                    {
                        "url": "./" + projectLevelSuffix + "/3",
                        "title": "Application de gestion de projets en mode SaaS"
                    },
                    {
                        "url": "./" + projectLevelSuffix + "/4",
                        "title": "Rénovation Infrastructure"
                    }
                ]
            };
        }

        this.setMenuActive = function (entryUrl) {
            for (var i = 0; i < sidebarContent.entries; i++) {
                if (sidebarContent.entries[i].url === entryUrl) {

                }
            }
        };


        this.getContent = function () {
            return sidebarContent;
        };

        this.setContent = function (pageContentType) {
            var cloneContent;

            if (pageContentType === "general") {
                cloneContent = angular.copy(portfolioContent);
            }
            else if (pageContentType === "project" || pageContentType === "sub-project" || pageContentType === "construction-site") {
                cloneContent = angular.copy(projectLevelBaseContent);
                var entry = getSubHierarchyEntry(pageContentType);
                if (entry !== void(0)){
                    cloneContent.entries.push(entry);
                }
            }
            sidebarContent.title = cloneContent.title;
            sidebarContent.entries = cloneContent.entries;
            sidebarContent.menuActive = void(0);
            sidebarContent.menuExpanded = void(0);
            sidebarContent.subMenuActive = void(0);
        };
	});