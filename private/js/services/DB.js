
angular.module('ProjMngmnt')
	// Database layer mockup
	.service('DB', function () {
		// Tenant specific data
		function DB_getAll(entryType) {
			var jsonDBResult;

			switch (entryType) {
				case "action":
					jsonDBResult = {
						keys: [
							"Description", 
							"Statut", 
							"Responsable", 
							"Priorité", 
							"Création", 
							"Clôture Planifiée", 
							"Retard", 
							"Clôture Effective", 
							"Commentaire"
						],
						values: [
							[
								"Faire Action I",
								"En cours",
								"Mohamed",
								"2",
								"01/02/2017",
								"29/03/2017",
								"20 j",
								"",
								"Consulter Foulen pour les guides."
							],
							[
								"Compléter Action II",
								"En standby",
								"Fatma",
								"1",
								"02/02/2017",
								"17/02/2017",
								"3 j",
								"",
								""
							],
							[
								"S'occuper de Action III",
								"En cours",
								"Ali",
								"3",
								"01/02/2017",
								"31/03/2017",
								"",
								"",
								"Maîtriser le process avant d'entreprendre l'action."
							],
							[
								"S'occuper de Action IV",
								"Clôturée",
								"Mohamed",
								"3",
								"01/02/2017",
								"31/03/2017",
								"",
								"20/03/2017",
								"Une partie du travail a déja été faite par Ammar."
							],
							[
								"Faire Action I",
								"En cours",
								"Mohamed",
								"2",
								"01/02/2017",
								"29/03/2017",
								"20 j",
								"",
								"Consulter Foulen pour les guides."
							],
							[
								"Compléter Action II",
								"En standby",
								"Fatma",
								"1",
								"02/02/2017",
								"17/02/2017",
								"3 j",
								"",
								""
							],
							[
								"S'occuper de Action III",
								"En cours",
								"Ali",
								"3",
								"01/02/2017",
								"31/03/2017",
								"",
								"",
								"Maîtriser le process avant d'entreprendre l'action."
							],
							[
								"S'occuper de Action IV",
								"Clôturée",
								"Mohamed",
								"3",
								"01/02/2017",
								"31/03/2017",
								"",
								"20/03/2017",
								"Une partie du travail a déja été faite par Ammar."
							],
							[
								"Faire Action I",
								"En cours",
								"Mohamed",
								"2",
								"01/02/2017",
								"29/03/2017",
								"20 j",
								"",
								"Consulter Foulen pour les guides."
							],
							[
								"Compléter Action II",
								"En standby",
								"Fatma",
								"1",
								"02/02/2017",
								"17/02/2017",
								"3 j",
								"",
								""
							],
							[
								"S'occuper de Action III",
								"En cours",
								"Ali",
								"3",
								"01/02/2017",
								"31/03/2017",
								"",
								"",
								"Maîtriser le process avant d'entreprendre l'action."
							],
							[
								"S'occuper de Action IV",
								"Clôturée",
								"Mohamed",
								"3",
								"01/02/2017",
								"31/03/2017",
								"",
								"20/03/2017",
								"Une partie du travail a déja été faite par Ammar."
							],
							[
								"Faire Action I",
								"En cours",
								"Mohamed",
								"2",
								"01/02/2017",
								"29/03/2017",
								"20 j",
								"",
								"Consulter Foulen pour les guides."
							],
							[
								"Compléter Action II",
								"En standby",
								"Fatma",
								"1",
								"02/02/2017",
								"17/02/2017",
								"3 j",
								"",
								""
							],
							[
								"S'occuper de Action III",
								"En cours",
								"Ali",
								"3",
								"01/02/2017",
								"31/03/2017",
								"",
								"",
								"Maîtriser le process avant d'entreprendre l'action."
							],
							[
								"S'occuper de Action IV",
								"Clôturée",
								"Mohamed",
								"3",
								"01/02/2017",
								"31/03/2017",
								"",
								"20/03/2017",
								"Une partie du travail a déja été faite par Ammar."
							]
						]
					};
					break;
				case "risk":
					jsonDBResult = {
						keys: [
							"Description", 
							"Probabilité", 
							"Impact", 
							"KRI", 
							"Disposition à prendre", 
							"Plan d'action", 
							"Statut", 
							"Décision", 
							"Date détection", 
							"Date qualification", 
							"Date clôture", 
							"Commentaire"
						],
						values: [
							[
								"Panne de Y",
								"2",
								"4", 
								"Mettre en place X",
								"Décision prise",
								"Go",
								"01/02/2017",
								"05/02/2017",
								"",
								"Consulter Foulen pour avant la mise en place."
							], 
							[
								"Panne de Y",
								"2",
								"4", 
								"Mettre en place X",
								"Décision prise",
								"Go",
								"01/02/2017",
								"05/02/2017",
								"",
								"Consulter Foulen pour avant la mise en place."
							]
						]
					};
					break;
			}

			return jsonDBResult;
		}

		// Application general data
		function DB_getEntriesViewData(entryType) {
			var viewData;

			switch (entryType) {
				case "action":
					viewData = {	
						formFields: [
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
								], 
								subForm: {
									id: "supervisor-sub-form", 
									fields: [
										{
								identifier: "supervisor-last-name", 
											label: "Nom", 
											placeholder: "Saisir le nom"
										}, 
										{
								identifier: "supervisor-first-name", 
											label: "Prénom", 
											placeholder: "Saisir le prénom"
										}
									]
								}
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
					break;
				case "risk":
					viewData = {
						generatedValues: [
						// Must be ordered by ascending position
							{
								position: 3, 
								// extract values from current entry
								formula: function (entry) {
									// return probability * impact
									return entry[1] * entry[2];
								}
							}, 
							{
								position: 4, 
								formula: function (entry) {
									var probability = entry[1];
									var impact = entry[2];

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
						], 
						formFields: [
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
					break;
			}

			return viewData;
		}


		/**
		 *	return entries 
				entries = {
				 	keys: values array ordered keys,
				 	values: entryType values array, where each value is 
				 	 an array of corresponding keys fields;
				};
		 */
		this.getAll = function (entryType) {
			var entries = DB_getAll(entryType);

			return entries;
		}

		this.getEntriesViewData = function (entryType) {
			var viewData = DB_getEntriesViewData(entryType);

			return viewData;
		}
	});