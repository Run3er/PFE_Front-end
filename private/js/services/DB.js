
angular.module('ProjMngmnt')
	// Database layer mockup
	.service('DB', function ($q) {
		// View Data
		var viewsData = {
			action: {
                table: {
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values
                        {
                            key: "description",
                            name: "Description"
                        },
                        {
                            key: "status",
                            name: "Statut"
                        },
                        {
                            key: "supervisor",
                            name: "Responsable"
                        },
                        {
                            key: "priority",
                            name: "Priorité"
                        },
                        {
                            key: "creationDate",
                            name: "Création"
                        },
                        {
                            key: "closingPlannedDate",
                            name: "Clôture Planifiée"
                        },
                        {
                            key: "delay",
                            name: "Retard"
                        },
                        {
                            key: "closingDate",
                            name: "Clôture Effective"
                        },
                        {
                            key: "comment",
                            name: "Commentaire"
                        }
                    ]
                },
                form: {
                    title: {
                        add: "Ajouter une action",
                        edit: "Modifier une action"
                    },
                    defaultSortingField: "creationDate",
                    fields: [
                        // labels are taken from DB_getAll().keys
                        {
                            identifier: "description",
                            label: "Description",
                            placeholder: "Saisir une description",
                            type: 'input'
                        },
                        {
                            identifier: "status",
                            label: "Statut",
                            placeholder: "Sélectionner le statut",
                            choices: [
                                { identifier: "ONGOING", value: "En cours"},
                                { identifier: "STANDBY", value: "En standby"},
                                { identifier: "CANCELLED", value: "Annulée"},
                                { identifier: "CLOSED", value: "Clôturée"}
                            ]
                        },
                        {
                            identifier: "supervisor",
                            label: "Responsable",
                            placeholder: "Sélectionner le responsable",
                            choices: [
                                { identifier: "1", value: "Mohamed"},
                                { identifier: "2", value: "Fatma"},
                                { identifier: "3", value: "Ali"},
                                { identifier: "4", value: "Salma"}
                            ]
                        },
                        {
                            identifier: "priority",
                            label: "Priorité",
                            placeholder: "Sélectionner la priorité",
                            choices: [
                                { identifier: "1", value: "Faible"},
                                { identifier: "2", value: "Moyenne"},
                                { identifier: "3", value: "Élevée"}
                            ]
                        },
                        {
                            identifier: "creationDate",
                            label: "Date de création",
                            placeholder: "Spécifier la date de création",
                            type: 'input'
                        },
                        {
                            identifier: "closingPlannedDate",
                            label: "Date de clôture planifiée",
                            placeholder: "Spécifier la date de clôture planifiée",
                            type: 'input'
                        },
                        {
                            identifier: "delay",
                            label: "Retard",
                            //default: 0,
                            placeholder: "Saisir le retard",
                            type: 'input'
                        },
                        {
                            identifier: "closingDate",
                            label: "Date de clôture",
                            placeholder: "Spécifier la date de clôture réelle",
                            type: 'input'
                        },
                        {
                            identifier: "comment",
                            label: "Commentaire",
                            placeholder: "Saisir un commentaire",
                            type: 'textarea'
                        }
                    ]
                }
            },
			risk: {
                table: {
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values
                        {
                            key: "description",
                            name: "Description"
                        },
                        {
                            key: "probability",
                            name: "Probabilité"
                        },
                        {
                            key: "impact",
                            name: "Impact"
                        },
                        {
                            key: "actionPlan",
                            name: "Plan d'action"
                        },
                        {
                            key: "status",
                            name: "Statut"
                        },
                        {
                            key: "decision",
                            name: "Décision"
                        },
                        {
                            key: "detectionDate",
                            name: "Date détection"
                        },
                        {
                            key: "qualificationDate",
                            name: "Date qualification"
                        },
                        {
                            key: "closingDate",
                            name: "Date de clôture"
                        },
                        {
                            key: "comment",
                            name: "Commentaire"
                        }
                    ],
                    generatedFields: [
                        // Must be ordered by ascending position
                        {
                            position: 3,
                            key: "kri",
                            columnName: "KRI",
                            // extract values from current entry
                            formula: function (entry) {
                                // return probability * impact
                                return entry["probability"] * entry["impact"];
                            }
                        },
                        {
                            position: 4,
                            key: "disposition",
                            columnName: "Disposition à prendre",
                            formula: function (entry) {
                                var probability = entry["probability"];
                                var impact = entry["impact"];

                                var plan = [
                                    "Monitoring",
                                    "Plan B",
                                    "Plan d'urgence"
                                ];

                                switch (impact) {
                                    case "1":
                                        return plan[0];
                                    case "2":
                                        if (probability < "3")
                                            return plan[0];
                                        return plan[1];
                                    case "3":
                                        if (probability < "2")
                                            return plan[0];
                                        return plan[1];
                                    case "4":
                                        if (probability < "3")
                                            return plan[1];
                                        return plan[2];
                                    case "5":
                                        if (probability < "2")
                                            return plan[1];
                                        return plan[2];
                                }
                            }
                        }
                    ]
                },
                form: {
                    title: {
                        add: "Ajouter un risque",
                        edit: "Modifier un risque"
                    },
                    defaultSortingField: "detectionDate",
                    fields: [
                        {
                            identifier: "description",
                            label: "Description",
                            placeholder: "Saisir une description",
                            type: 'input'
                        },
                        {
                            identifier: "probability",
                            label: "Probabilité",
                            placeholder: "Sélectionner la probabilité",
                            choices: [
                                { identifier: "1", value: "Faible"},
                                { identifier: "2", value: "Moyenne"},
                                { identifier: "3", value: "Élevée"}
                            ]
                        },
                        {
                            identifier: "impact",
                            label: "Impact",
                            placeholder: "Sélectionner l'impact",
                            choices: [
                                { identifier: "1", value: "Moindre"},
                                { identifier: "2", value: "Faible"},
                                { identifier: "3", value: "Moyen"},
                                { identifier: "4", value: "Élevé"},
                                { identifier: "5", value: "Extrême"}
                            ]
                        },
                        {
                            identifier: "actionPlan",
                            label: "Plan d'action",
                            placeholder: "Saisir le plan d'action",
                            type: 'textarea'
                        },
                        {
                            identifier: "status",
                            label: "Statut",
                            placeholder: "Sélectionner le statut",
                            choices: [
                                { identifier: "DETECTED", value: "Détecté"},
                                { identifier: "TO_STUDY", value: "À étudier"},
                                { identifier: "QUALIFIED", value: "qualifié"},
                                { identifier: "DECIDED_UPON", value: "Décision prise"},
                                { identifier: "ACTION_PLAN_ONGOING", value: "Plan d'action ongoing"},
                                { identifier: "MASTERED", value: "Maîtrisé"},
                                { identifier: "CLOSED", value: "Clôturé"}
                            ]
                        },
                        {
                            identifier: "decision",
                            label: "Décision",
                            placeholder: "Saisir la décision",
                            type: 'input'
                        },
                        {
                            identifier: "detectionDate",
                            label: "Date de détection",
                            placeholder: "Spécifier la date de détection",
                            type: 'input'
                        },
                        {
                            identifier: "qualificationDate",
                            label: "Date de qualification",
                            placeholder: "Spécifier la date de qualification",
                            type: 'input'
                        },
                        {
                            identifier: "closingDate",
                            label: "Date de clôture",
                            placeholder: "Spécifier la date de clôture",
                            type: 'input'
                        },
                        {
                            identifier: "comment",
                            label: "Commentaire",
                            placeholder: "Saisir un commentaire",
                            type: 'textarea'
                        }
                    ]
                }
            },
			project: {
                table: {
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values
                        {
                            key: "name",
                            name: "Nom"
                        },
                        {
                            key: "advancement",
                            name: "Avancement"
                        },
                        {
                            key: "status",
                            name: "Statut"
                        },
                        {
                            key: "chargeConsumed",
                            name: "Charge Consommée"
                        },
                        {
                            key: "budgetConsumed",
                            name: "Budget Consommé"
                        },
                        {
                            key: "budgetTotal",
                            name: "Budget Total"
                        },
                        {
                            key: "budgetPlanned",
                            name: "Budget Planifié"
                        }
                    ]
                },
                form: {
                    title: {
                        add: "Ajouter un projet",
                        edit: "Modifier un projet"
                    },
                    defaultSortingField: "name",
                    fields: [
                        {
                            identifier: "name",
                            label: "Nom",
                            placeholder: "Saisir un nom",
                            type: 'input'
                        },
                        {
                            identifier: "advancement",
                            label: "Avancement",
                            placeholder: "Saisir l'avancement",
                            type: 'input'
                        },
                        {
                            identifier: "status",
                            label: "Statut",
                            placeholder: "Sélectionner le statut",
                            choices: [
                                { identifier: "BAD", value: "Mauvais"},
                                { identifier: "UNCERTAIN", value: "Incertain"},
                                { identifier: "GOOD", value: "Bon"}
                            ]
                        },
                        {
                            identifier: "chargeConsumed",
                            label: "Charge consommée",
                            placeholder: "Saisir la charge consommée",
                            type: 'input'
                        },
                        {
                            identifier: "budgetConsumed",
                            label: "Budget consommé",
                            placeholder: "Saisir le budget consommé",
                            type: 'input'
                        },
                        {
                            identifier: "budgetPlanned",
                            label: "Budget planifié",
                            placeholder: "Saisir le budget planifié",
                            type: 'input'
                        },
                        {
                            identifier: "budgetTotal",
                            label: "Budget total",
                            placeholder: "Saisir le budget total",
                            type: 'input'
                        }
                    ]
                }
            }
		};

		// Mock data
		var actionsTenantData = [
			{
				"id": 1,
				"description": "Faire Action I",
				"status": "ONGOING",
				"supervisor": "1",
				"priority": "2",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "29/03/2017",
				"delay": "20 j",
				"closingDate": "",
				"comment": "Consulter Foulen pour les guides."
			},
			{
				"id": 2,
				"description": "Compléter Action II",
				"status": "STANDBY",
				"supervisor": "2",
				"priority": "1",
				"creationDate": "02/02/2017",
				"closingPlannedDate": "17/02/2017",
				"delay": "3 j",
				"closingDate": "",
				"comment": ""
			},
			{
				"id": 3,
				"description": "S'occuper de Action III",
				"status": "ONGOING",
				"supervisor": "3",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "",
				"comment": "Maîtriser le process avant d'entreprendre l'action."
			},
			{
				"id": 4,
				"description": "S'occuper de Action IV",
				"status": "CLOSED",
				"supervisor": "1",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "20/03/2017",
				"comment": "Une partie du travail a déja été faite par Ammar."
			},
			{
				"id": 5,
				"description": "Faire Action I",
				"status": "ONGOING",
				"supervisor": "1",
				"priority": "2",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "29/03/2017",
				"delay": "20 j",
				"closingDate": "",
				"comment": "Consulter Foulen pour les guides."
			},
			{
				"id": 6,
				"description": "Compléter Action II",
				"status": "STANDBY",
				"supervisor": "2",
				"priority": "1",
				"creationDate": "02/02/2017",
				"closingPlannedDate": "17/02/2017",
				"delay": "3 j",
				"closingDate": "",
				"comment": ""
			},
			{
				"id": 7,
				"description": "S'occuper de Action III",
				"status": "ONGOING",
				"supervisor": "3",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "",
				"comment": "Maîtriser le process avant d'entreprendre l'action."
			},
			{
				"id": 8,
				"description": "S'occuper de Action IV",
				"status": "CLOSED",
				"supervisor": "1",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "20/03/2017",
				"comment": "Une partie du travail a déja été faite par Ammar."
			},
			{
				"id": 9,
				"description": "Faire Action I",
				"status": "ONGOING",
				"supervisor": "1",
				"priority": "2",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "29/03/2017",
				"delay": "20 j",
				"closingDate": "",
				"comment": "Consulter Foulen pour les guides."
			},
			{
				"id": 10,
				"description": "Compléter Action II",
				"status": "STANDBY",
				"supervisor": "2",
				"priority": "1",
				"creationDate": "02/02/2017",
				"closingPlannedDate": "17/02/2017",
				"delay": "3 j",
				"closingDate": "",
				"comment": ""
			},
			{
				"id": 11,
				"description": "S'occuper de Action III",
				"status": "ONGOING",
				"supervisor": "3",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "",
				"comment": "Maîtriser le process avant d'entreprendre l'action."
			},
			{
				"id": 12,
				"description": "S'occuper de Action IV",
				"status": "CLOSED",
				"supervisor": "1",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "20/03/2017",
				"comment": "Une partie du travail a déja été faite par Ammar."
			},
			{
				"id": 13,
				"description": "Faire Action I",
				"status": "ONGOING",
				"supervisor": "1",
				"priority": "2",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "29/03/2017",
				"delay": "20 j",
				"closingDate": "",
				"comment": "Consulter Foulen pour les guides."
			},
			{
				"id": 14,
				"description": "Compléter Action II",
				"status": "STANDBY",
				"supervisor": "2",
				"priority": "1",
				"creationDate": "02/02/2017",
				"closingPlannedDate": "17/02/2017",
				"delay": "3 j",
				"closingDate": "",
				"comment": ""
			},
			{
				"id": 15,
				"description": "S'occuper de Action III",
				"status": "ONGOING",
				"supervisor": "3",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "",
				"comment": "Maîtriser le process avant d'entreprendre l'action."
			},
			{
				"id": 16,
				"description": "S'occuper de Action IV",
				"status": "CLOSED",
				"supervisor": "1",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "20/03/2017",
				"comment": "Une partie du travail a déja été faite par Ammar."
			}
		];

        var risksTenantData = [
            {
                "id": 1,
                "description": "Panne de X",
                "probability": "2",
                "impact": "4",
                "actionPlan": "Mettre en place X",
                "status": "DECIDED_UPON",
                "decision": "Go",
                "detectionDate": "02/02/2017",
                "qualificationDate": "05/02/2017",
                "closingDate": "",
                "comment": "Consulter FoulenX pour avant la mise en place"
            },
            {
                "id": 2,
                "description": "Panne de Y",
                "probability": "2",
                "impact": "4",
                "actionPlan": "Imposer Y",
                "status": "DECIDED_UPON",
                "decision": "Go",
                "detectionDate": "03/02/2017",
                "qualificationDate": "05/02/2017",
                "closingDate": "",
                "comment": "Consulter FoulenY pour avant la mise en place"
            },
            {
                "id": 3,
                "description": "Z absent",
                "probability": "3",
                "impact": "5",
                "actionPlan": "Prendre mesure Z",
                "status": "DETECTED",
                "decision": "Go",
                "detectionDate": "01/03/2017",
                "qualificationDate": "",
                "closingDate": "05/02/2017",
                "comment": "Consulter FoulenZ pour avant la mise en place"
            },
            {
                "id": 4,
                "description": "Panne de W",
                "probability": "3",
                "impact": "1",
                "actionPlan": "Imposer W",
                "status": "DECIDED_UPON",
                "decision": "Go",
                "detectionDate": "01/02/2017",
                "qualificationDate": "05/02/2017",
                "closingDate": "",
                "comment": "Consulter FoulenW pour avant la mise en place"
            }
        ];


        // Mock API Response
        var projectsRawData = {
            "_embedded": {
                "projects": [
                    {
                        "budgetTotal": null,
                        "budgetPlanned": null,
                        "budgetConsumed": null,
                        "chargeConsumed": 0,
                        "advancement": 0.9,
                        "status": "BAD",
                        "name": "Project-X",
                        "_links": {
                            "self": {
                                "href": "http://localhost:9000/projects/ed17d92c-19a8-4591-8f6b-16923e550de1"
                            },
                            "project": {
                                "href": "http://localhost:9000/projects/ed17d92c-19a8-4591-8f6b-16923e550de1{?projection}",
                                "templated": true
                            },
                            "archivedUpdates": {
                                "href": "http://localhost:9000/projects/ed17d92c-19a8-4591-8f6b-16923e550de1/archivedUpdates"
                            },
                            "milestones": {
                                "href": "http://localhost:9000/projects/ed17d92c-19a8-4591-8f6b-16923e550de1/milestones"
                            },
                            "entity": {
                                "href": "http://localhost:9000/projects/ed17d92c-19a8-4591-8f6b-16923e550de1/entity"
                            },
                            "pendingIssues": {
                                "href": "http://localhost:9000/projects/ed17d92c-19a8-4591-8f6b-16923e550de1/pendingIssues"
                            },
                            "actions": {
                                "href": "http://localhost:9000/projects/ed17d92c-19a8-4591-8f6b-16923e550de1/actions"
                            },
                            "changeRequests": {
                                "href": "http://localhost:9000/projects/ed17d92c-19a8-4591-8f6b-16923e550de1/changeRequests"
                            },
                            "subProjects": {
                                "href": "http://localhost:9000/projects/ed17d92c-19a8-4591-8f6b-16923e550de1/subProjects"
                            },
                            "risks": {
                                "href": "http://localhost:9000/projects/ed17d92c-19a8-4591-8f6b-16923e550de1/risks"
                            },
                            "resources": {
                                "href": "http://localhost:9000/projects/ed17d92c-19a8-4591-8f6b-16923e550de1/resources"
                            },
                            "documents": {
                                "href": "http://localhost:9000/projects/ed17d92c-19a8-4591-8f6b-16923e550de1/documents"
                            }
                        }
                    },
                    {
                        "budgetTotal": null,
                        "budgetPlanned": null,
                        "budgetConsumed": null,
                        "chargeConsumed": 0,
                        "advancement": 0,
                        "status": "BAD",
                        "name": "wtvr",
                        "_links": {
                            "self": {
                                "href": "http://localhost:9000/projects/d440938a-04d9-4615-8303-abe4d124ab9c"
                            },
                            "project": {
                                "href": "http://localhost:9000/projects/d440938a-04d9-4615-8303-abe4d124ab9c{?projection}",
                                "templated": true
                            },
                            "archivedUpdates": {
                                "href": "http://localhost:9000/projects/d440938a-04d9-4615-8303-abe4d124ab9c/archivedUpdates"
                            },
                            "milestones": {
                                "href": "http://localhost:9000/projects/d440938a-04d9-4615-8303-abe4d124ab9c/milestones"
                            },
                            "entity": {
                                "href": "http://localhost:9000/projects/d440938a-04d9-4615-8303-abe4d124ab9c/entity"
                            },
                            "pendingIssues": {
                                "href": "http://localhost:9000/projects/d440938a-04d9-4615-8303-abe4d124ab9c/pendingIssues"
                            },
                            "actions": {
                                "href": "http://localhost:9000/projects/d440938a-04d9-4615-8303-abe4d124ab9c/actions"
                            },
                            "changeRequests": {
                                "href": "http://localhost:9000/projects/d440938a-04d9-4615-8303-abe4d124ab9c/changeRequests"
                            },
                            "subProjects": {
                                "href": "http://localhost:9000/projects/d440938a-04d9-4615-8303-abe4d124ab9c/subProjects"
                            },
                            "risks": {
                                "href": "http://localhost:9000/projects/d440938a-04d9-4615-8303-abe4d124ab9c/risks"
                            },
                            "resources": {
                                "href": "http://localhost:9000/projects/d440938a-04d9-4615-8303-abe4d124ab9c/resources"
                            },
                            "documents": {
                                "href": "http://localhost:9000/projects/d440938a-04d9-4615-8303-abe4d124ab9c/documents"
                            }
                        }
                    }
                ]
            },
            "_links": {
                "self": {
                    "href": "http://localhost:9000/projects"
                },
                "profile": {
                    "href": "http://localhost:9000/profile/projects"
                }
            },
            "page": {
                "size": 20,
                "totalElements": 2,
                "totalPages": 1,
                "number": 0
            }
        };


var serverOn;


		// DB entries interface object
		function getEntriesProps(entryType) {
			return {
                // Tenant specific data
                getAll: function () {
                    // Entries fetching logic
                    console.log("FAKE_SERVER--fetching... " + JSON.stringify(entryType));

                    // Return promise
                    return $q(function (resolve, reject) {
                        // Simulate request timelaps
                        setTimeout(function () {
                            // Simulate fetching operation result
                            serverOn = true;

                            // on resolve success
                            if (serverOn) {
                                // Request data from DB (promise)...
                                var tenantRawData = projectsRawData;

                                // Format data to desired simple array format
                                var entries = angular.copy(tenantRawData._embedded.projects);
                                // TODO: format others ...
                                if (entryType === "project") {
                                    for (var i = 0; i < entries.length; i++) {
                                        var urlParts = entries[i]._links.self.href.split("/");
                                        entries[i].id = urlParts[urlParts.length - 1];
                                        // Not needed for now...
                                        // delete entries[i]._links;
                                        // So set to undefined instead
                                        entries[i]._links = void(0);
                                    }
                                }
                                // TODO: get raw data to format it for ...
                                else {
                                    switch (entryType) {
                                        case "action":
                                            entries = actionsTenantData;
                                            break;
                                        case "risk":
                                            entries = risksTenantData;
                                            break;
                                    }
                                }

                                resolve(entries);
                                console.log('FAKE_SERVER--Success.');
                            }
                            else {
                                // Reject (DB failure implied)
                                reject();
                                console.log('FAKE_SERVER--Failure.');
                            }
                        }, 1500);
                    });

                },
                add: function (entry) {
                    // Entry addition logic
                    console.log("FAKE_SERVER--adding... " + JSON.stringify(entry));

                    // Return promise
                    return $q(function (resolve, reject) {
                        // Simulate request timelaps
                        setTimeout(function () {
                            // Simulate addition operation result
                            serverOn = true;

                            if (serverOn) {
                                // Get unique ID from DB ...
                                var id = new Date().getTime(); //[mockup]
                                resolve(id);
                                console.log('FAKE_SERVER--Success.');
                            }
                            else {
                                reject();
                                console.log('FAKE_SERVER--Failure.');
                            }
                        }, 1500);
                    });
                },
                update: function (entry) {
                    // Entry updating logic
                    console.log("FAKE_SERVER--updating... " + JSON.stringify(entry));

                    // Return promise
                    return $q(function (resolve, reject) {
                        // Simulate request timelaps
                        setTimeout(function () {
                            // Simulate addtion operation result
                            serverOn = true;

                            if (serverOn) {
                                resolve();
                                console.log('FAKE_SERVER--Success.');
                            }
                            else {
                                reject();
                                console.log('FAKE_SERVER--Failure.');
                            }
                        }, 1500);
                    });
                },
                delete: function (entry) {
                    // Entry deletion logic
                    console.log("FAKE_SERVER--deleting... " + JSON.stringify(entry));

                    // Return promise
                    return $q(function (resolve, reject) {
                        // Simulate request timelaps
                        setTimeout(function () {
                            // Simulate addtion operation result
                            serverOn = true;

                            if (serverOn) {
                                resolve();
                                console.log('FAKE_SERVER--Success.');
                            }
                            else {
                                reject();
                                console.log('FAKE_SERVER--Failure.');
                            }
                        }, 1500);
                    });
                },
                // View specific data
                viewData: {
                    getAll: function () {
                        return viewsData[entryType];
                    }
                }
            };
        }


		// DB entries interface
		this.getEntries = function(entryType) {

			// TODO: implement each of these ...
            switch (entryType) {
                case "resource":
                    entryType = "action";
                    break;
                case "changeRequest":
                    entryType = "action";
                    break;
                case "pendingIssue":
                    entryType = "action";
                    break;
                case "document":
                    entryType = "action";
                    break;
            }

			return getEntriesProps(entryType);
		};
	});