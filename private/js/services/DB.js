
angular.module('ProjMngmnt')
	// Database layer mockup
	.service('DB', function ($q) {
		// Mock data
		var actionsTenantData = [
			{
				"description": "Faire Action I",
				"status": "En cours",
				"supervisor": "Mohamed",
				"priority": "2",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "29/03/2017",
				"delay": "20 j",
				"closingDate": "",
				"comment": "Consulter Foulen pour les guides."
			},
			{
				"description": "Compléter Action II",
				"status": "En standby",
				"supervisor": "Fatma",
				"priority": "1",
				"creationDate": "02/02/2017",
				"closingPlannedDate": "17/02/2017",
				"delay": "3 j",
				"closingDate": "",
				"comment": ""
			},
			{
				"description": "S'occuper de Action III",
				"status": "En cours",
				"supervisor": "Ali",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "",
				"comment": "Maîtriser le process avant d'entreprendre l'action."
			},
			{
				"description": "S'occuper de Action IV",
				"status": "Clôturée",
				"supervisor": "Mohamed",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "20/03/2017",
				"comment": "Une partie du travail a déja été faite par Ammar."
			},
			{
				"description": "Faire Action I",
				"status": "En cours",
				"supervisor": "Mohamed",
				"priority": "2",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "29/03/2017",
				"delay": "20 j",
				"closingDate": "",
				"comment": "Consulter Foulen pour les guides."
			},
			{
				"description": "Compléter Action II",
				"status": "En standby",
				"supervisor": "Fatma",
				"priority": "1",
				"creationDate": "02/02/2017",
				"closingPlannedDate": "17/02/2017",
				"delay": "3 j",
				"closingDate": "",
				"comment": ""
			},
			{
				"description": "S'occuper de Action III",
				"status": "En cours",
				"supervisor": "Ali",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "",
				"comment": "Maîtriser le process avant d'entreprendre l'action."
			},
			{
				"description": "S'occuper de Action IV",
				"status": "Clôturée",
				"supervisor": "Mohamed",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "20/03/2017",
				"comment": "Une partie du travail a déja été faite par Ammar."
			},
			{
				"description": "Faire Action I",
				"status": "En cours",
				"supervisor": "Mohamed",
				"priority": "2",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "29/03/2017",
				"delay": "20 j",
				"closingDate": "",
				"comment": "Consulter Foulen pour les guides."
			},
			{
				"description": "Compléter Action II",
				"status": "En standby",
				"supervisor": "Fatma",
				"priority": "1",
				"creationDate": "02/02/2017",
				"closingPlannedDate": "17/02/2017",
				"delay": "3 j",
				"closingDate": "",
				"comment": ""
			},
			{
				"description": "S'occuper de Action III",
				"status": "En cours",
				"supervisor": "Ali",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "",
				"comment": "Maîtriser le process avant d'entreprendre l'action."
			},
			{
				"description": "S'occuper de Action IV",
				"status": "Clôturée",
				"supervisor": "Mohamed",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "20/03/2017",
				"comment": "Une partie du travail a déja été faite par Ammar."
			},
			{
				"description": "Faire Action I",
				"status": "En cours",
				"supervisor": "Mohamed",
				"priority": "2",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "29/03/2017",
				"delay": "20 j",
				"closingDate": "",
				"comment": "Consulter Foulen pour les guides."
			},
			{
				"description": "Compléter Action II",
				"status": "En standby",
				"supervisor": "Fatma",
				"priority": "1",
				"creationDate": "02/02/2017",
				"closingPlannedDate": "17/02/2017",
				"delay": "3 j",
				"closingDate": "",
				"comment": ""
			},
			{
				"description": "S'occuper de Action III",
				"status": "En cours",
				"supervisor": "Ali",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "",
				"comment": "Maîtriser le process avant d'entreprendre l'action."
			},
			{
				"description": "S'occuper de Action IV",
				"status": "Clôturée",
				"supervisor": "Mohamed",
				"priority": "3",
				"creationDate": "01/02/2017",
				"closingPlannedDate": "31/03/2017",
				"delay": "",
				"closingDate": "20/03/2017",
				"comment": "Une partie du travail a déja été faite par Ammar."
			}
		];

		var actionsViewData = {	
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
			form_table_Mapping: {
				// tenantDataKey_formField_mapping
				"description" : "description",
				"status" : "status", 
				"supervisor" : "supervisor", 
				"priority" : "priority", 
				"creationDate" : "creation-date", 
				"closingPlannedDate" : "closing-planned-date", 
				"delay" : "delay", 
				"closingDate" : "closing-date", 
				"comment" : "comment"
			}, 
			form: {
				title: "Ajouter une action", 
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
							{ identifier: "ongoing", value: "En cours"}, 
							{ identifier: "standby", value: "En standby"}, 
							{ identifier: "cancelled", value: "Annulée"}, 
							{ identifier: "closed", value: "Clôturée"}
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
						identifier: "creation-date", 
						label: "Date de création", 
						placeholder: "Spécifier la date de création", 
						type: 'input'
					}, 
					{
						identifier: "closing-planned-date", 
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
						identifier: "closing-date", 
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
		};

		var risksTenantData = [
			{
				"description": "Panne de Y",
				"probability": "2",
				"impact": "4",
				"actionPlan": "Mettre en place X",
				"status": "Décision prise",
				"decision": "Go",
				"detectionDate": "01/02/2017",
				"qualificationDate": "05/02/2017",
				"closingDate": "",
				"comment": "Consulter Foulen pour avant la mise en place"
			}, 
			{
				"description": "Panne de Y",
				"probability": "2",
				"impact": "4",
				"actionPlan": "Mettre en place X",
				"status": "Décision prise",
				"decision": "Go",
				"detectionDate": "01/02/2017",
				"qualificationDate": "05/02/2017",
				"closingDate": "",
				"comment": "Consulter Foulen pour avant la mise en place"
			}
		];

		var risksViewData = {
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
			form_table_Mapping: {
				// tenantDataKey_formField_mapping
				"description" : "description",
				"probability" : "probability", 
				"impact" : "impact", 
				"actionPlan" : "action-plan", 
				"status" : "status", 
				"decision" : "decision", 
				"detectionDate" : "creation-date", 
				"qualificationDate" : "qualification-date", 
				"closingDate" : "closing-date", 
				"comment" : "comment"
			}, 
			form: {
				title: "Ajouter un risque", 
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
						identifier: "action-plan", 
						label: "Plan d'action", 
						placeholder: "Saisir le plan d'action", 
						type: 'textarea'
					}, 
					{
						identifier: "status", 
						label: "Statut", 
						placeholder: "Sélectionner le statut",
						choices: [
							{ identifier: "detected", value: "Détecté"}, 
							{ identifier: "toStudy", value: "À étudier"}, 
							{ identifier: "qualified", value: "Qualifié"}, 
							{ identifier: "decidedUpon", value: "Décision prise"}, 
							{ identifier: "actionPlanOngoing", value: "Plan d'action en cours"}, 
							{ identifier: "mastered", value: "Maîtrisé"}, 
							{ identifier: "closed", value: "Clôturé"}
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
		};


		// Object entriesProps supposed property
		var entryType;

		// DB entries interface object
		var entriesProps = {
			// Tenant specific data
			getAll: function () {
				var tenantData;

				switch (entryType) {
					case "action":
						tenantData = actionsTenantData;
						break;
					case "risk":
						tenantData = risksTenantData;
						break;
				}

				return tenantData;
			}, 
			add: function (entry) {
				// Entry addition logic
				console.log("FAKE_SERVER--adding: " + JSON.stringify(entry));
				
				// Return promise
				return $q(function (resolve, reject) {
					// Simulate request timelaps
					setTimeout(function () {
						// Simulate addtion operation result
						var didSucceed = Math.random() > 0.5;

						if (didSucceed) {
							resolve('FAKE_SERVER--Success.');
							console.log('FAKE_SERVER--Success.');
						}
						else {
							reject('FAKE_SERVER--Failure.');
							console.log('FAKE_SERVER--Failure.');
						}
					}, 1500);
				});
			}, 
			update: function (entry) {
				// Entry updating logic
				console.log("FAKE_SERVER--updating: " + JSON.stringify(entry));
				
				// Return promise
				return $q(function (resolve, reject) {
					// Simulate request timelaps
					setTimeout(function () {
						// Simulate addtion operation result
						var didSucceed = Math.random() > 0.5;

						if (didSucceed) {
							resolve('FAKE_SERVER--Success.');
							console.log('FAKE_SERVER--Success.');
						}
						else {
							reject('FAKE_SERVER--Failure.');
							console.log('FAKE_SERVER--Failure.');
						}
					}, 1500);
				});
			}, 
			delete: function (entry) {
				// Entry deletion logic
				console.log("FAKE_SERVER--deleting: " + JSON.stringify(entry));
				
				// Return promise
				return $q(function (resolve, reject) {
					// Simulate request timelaps
					setTimeout(function () {
						// Simulate addtion operation result
						var didSucceed = Math.random() > 0.5;

						if (didSucceed) {
							resolve('FAKE_SERVER--Success.');
							console.log('FAKE_SERVER--Success.');
						}
						else {
							reject('FAKE_SERVER--Failure.');
							console.log('FAKE_SERVER--Failure.');
						}
					}, 1500);
				});
			}, 
			// View specific data
			viewData: {
				getAll: function () {
					var viewData;

					switch (entryType) {
						case "action":
							viewData = actionsViewData;
							break;
						case "risk":
							viewData = risksViewData;
							break;
					}

					return viewData;
				}
			}
		};


		// DB entries interface
		this.entries = function(_entryType) {
			// TODO: create props specific object for any entryType
			entryType = _entryType;

			return entriesProps;
		};
	});