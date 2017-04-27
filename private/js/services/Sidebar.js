
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

		var entitiesContent  = {
            "title": "Portefeuille",
            "entries": [
                {
                    "url": "./portfolio/details",
                    "iconClass": "fa fa-dashboard",
                    "title": "Détails"
                },
                {
                    "url": "javascript:void(0)",
                    "iconClass": "fa fa-sitemap",
                    "title": "Entité-A",
                    "entries": [
                        {
                            "url": "./projects/1",
                            "title": "Service 5G - Ooredoo"
                        },
                        {
                            "url": "./projects/2",
                            "title": "SMS Sender - TT"
                        },
                        {
                            "url": "./projects/3",
                            "title": "Application de gestion de projets en mode SaaS"
                        },
                        {
                            "url": "./projects/4",
                            "title": "Rénovation Infrastructure"
                        }
                    ]
                },
                {
                    "url": "javascript:void(0)",
                    "iconClass": "fa fa-sitemap",
                    "title": "Entité-A",
                    "entries": [
                        {
                            "url": "./projects/1",
                            "title": "Service 5G - Ooredoo"
                        },
                        {
                            "url": "./projects/2",
                            "title": "SMS Sender - TT"
                        },
                        {
                            "url": "./projects/3",
                            "title": "Application de gestion de projets en mode SaaS"
                        },
                        {
                            "url": "./projects/4",
                            "title": "Rénovation Infrastructure"
                        }
                    ]
                },{
                    "url": "javascript:void(0)",
                    "iconClass": "fa fa-sitemap",
                    "title": "Entité-C",
                    "entries": [
                        {
                            "url": "./projects/1",
                            "title": "Service 5G - Ooredoo"
                        },
                        {
                            "url": "./projects/2",
                            "title": "SMS Sender - TT"
                        },
                        {
                            "url": "./projects/3",
                            "title": "Application de gestion de projets en mode SaaS"
                        },
                        {
                            "url": "./projects/4",
                            "title": "Rénovation Infrastructure"
                        }
                    ]
                }
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


        this.getContent = function () {
            return sidebarContent;
        };

        this.setContent = function (pageContentType) {
            var cloneContent;

            if (pageContentType === "portfolio") {
                cloneContent = angular.copy(entitiesContent);
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