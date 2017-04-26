
angular.module('ProjMngmnt')
	.service('Sidebar', function () {

		this.contents = {
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
                },
                {
                    "url": "./sub-projects",
                    "iconClass": "fa fa-sitemap",
                    "title": "Sous-projets",
                    "entries": [
                        {
                            "url": "./sub-projects/1",
                            "title": "Service 5G - Ooredoo"
                        },
                        {
                            "url": "./sub-projects/2",
                            "title": "SMS Sender - TT"
                        },
                        {
                            "url": "./sub-projects/3",
                            "title": "Application de gestion de projets en mode SaaS"
                        },
                        {
                            "url": "./sub-projects/4",
                            "title": "Rénovation Infrastructure"
                        }
                    ]
                }
			]
		};
	});