
angular.module('ProjMngmnt')
    .service('UI', function (CommonConstants) {
        // Dashboard View Data
        var dashboardData = {
            riskStatusLabelMap: {
                DETECTED: "Détecté",
                TO_STUDY: "À l'étude",
                QUALIFIED: "Qualifié",
                DECIDED_UPON: "Décision prise",
                ACTION_PLAN_ONGOING: "Plan d'action en cours",
                MASTERED: "Maîtrisé",
                CLOSED: "Clôturé"
            },
            actionInTimeOrNotLabelMap: {
                "true" : "Dans les temps",
                "false" : "En retard"
            }
        };


        // Entries & Details View Data
        var viewsData = {
            // Entries View Data
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
                            key: "advancement",
                            name: "Avancement",
                            type: "percentage"
                        },
                        {
                            key: "supervisor",
                            initialValueKey: "supervisorName", 
                            name: "Responsable"
                        },
                        {
                            key: "priority",
                            name: "Priorité"
                        },
                        {
                            key: "creationDate",
                            type: "date",
                            name: "Création"
                        },
                        {
                            key: "closurePlannedDate",
                            type: "date",
                            name: "Clôture Planifiée"
                        },
                        {
                            key: "closureDate",
                            type: "date",
                            name: "Clôture Effective"
                        },
                        {
                            key: "comment",
                            name: "Commentaire",
                            type: "textarea"
                        }
                    ],
                    generatedFields: [
                        // Must be ordered by ascending position
                        {
                            position: 6,
                            key: "delay",
                            type: "days",
                            columnName: "Retard",
                            // extract values from current entry
                            formula: function (entry) {
                                // closurePlannedDate - today's date
                                var difference = new Date().getTime() - entry["closurePlannedDate"];
                                return difference < 0 ? void(0) : Math.floor(difference / 1000 / (3600 * 24));
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
                    defaultSortingField: "creationDate",
                    fields: [
                        // labels are taken from API_getAll().keys
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
                            identifier: "advancement",
                            label: "Avancement",
                            placeholder: "Entrer l'avancement",
                            type: 'percentage'
                        },
                        {
                            identifier: "supervisor",
                            label: "Responsable",
                            placeholder: "Sélectionner le responsable",
                            asyncChoices: {
                                entriesName: "humanResource",
                                attachedFieldName: "name"
                                // ,filterBy: {
                                //     type: "HUMAN"
                                // }
                            }
                        },
                        {
                            identifier: "priority",
                            label: "Priorité",
                            placeholder: "Sélectionner la priorité",
                            choices: [
                                { identifier: 1, value: "Faible"},
                                { identifier: 2, value: "Moyenne"},
                                { identifier: 3, value: "Élevée"}
                            ]
                        },
                        {
                            identifier: "creationDate",
                            label: "Date de création",
                            placeholder: "Spécifier la date de création",
                            type: 'date'
                        },
                        {
                            identifier: "closurePlannedDate",
                            label: "Date de clôture planifiée",
                            placeholder: "Spécifier la date de clôture planifiée",
                            type: 'date'
                        },
                        {
                            identifier: "closureDate",
                            label: "Date de clôture",
                            placeholder: "Spécifier la date de clôture réelle",
                            type: 'date'
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
                            type: "nbWithLiteral",
                            name: "Probabilité"
                        },
                        {
                            key: "impact",
                            type: "nbWithLiteral",
                            name: "Impact"
                        },
                        {
                            key: "cause",
                            name: "Cause",
                            type: "textarea"
                        },
                        {
                            key: "actionPlan",
                            name: "Plan d'action",
                            type: "textarea"
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
                            type: "date",
                            name: "Date détection"
                        },
                        {
                            key: "qualificationDate",
                            type: "date",
                            name: "Date qualification"
                        },
                        {
                            key: "closureDate",
                            type: "date",
                            name: "Date de clôture"
                        },
                        {
                            key: "category",
                            name: "Catégorie"
                        },
                        {
                            key: "comment",
                            name: "Commentaire",
                            type: "textarea"
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
                    defaultSortingField: "detectionDate",
                    fields: [
                        {
                            identifier: "description",
                            label: "Description",
                            placeholder: "Saisir une description",
                            type: 'input'
                        },
                        {
                            identifier: "cause",
                            label: "Cause",
                            placeholder: "Saisir la cause",
                            type: 'textarea'
                        },
                        {
                            identifier: "probability",
                            label: "Probabilité",
                            placeholder: "Sélectionner la probabilité",
                            choices: [
                                { identifier: 1, value: "1 - Faible"},
                                { identifier: 2, value: "2 - Moyenne"},
                                { identifier: 3, value: "3 - Élevée"}
                            ]
                        },
                        {
                            identifier: "impact",
                            label: "Impact",
                            placeholder: "Sélectionner l'impact",
                            choices: [
                                { identifier: 1, value: "1 - Moindre"},
                                { identifier: 2, value: "2 - Faible"},
                                { identifier: 3, value: "3 - Moyen"},
                                { identifier: 4, value: "4 - Élevé"},
                                { identifier: 5, value: "5 - Extrême"}
                            ]
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
                                { identifier: "ACTION_PLAN_ONGOING", value: "Plan d'action en cours"},
                                { identifier: "MASTERED", value: "Maîtrisé"},
                                { identifier: "CLOSED", value: "Clôturé"}
                            ]
                        },
                        {
                            identifier: "category",
                            label: "Catégorie",
                            placeholder: "Sélectionner la catégorie",
                            choices: [
                                { identifier: "STRATEGIC", value: "Stratégique"},
                                { identifier: "ECONOMIC", value: "Éonomique"},
                                { identifier: "TECHNICAL", value: "Technique"},
                                { identifier: "HUMAN", value: "Humain"},
                                { identifier: "LEGAL", value: "Réglementaire"},
                                { identifier: "ORGANIZATIONAL", value: "Organisationnel"}
                            ]
                        },
                        {
                            identifier: "actionPlan",
                            label: "Plan d'action",
                            placeholder: "Saisir le plan d'action",
                            type: 'textarea'
                        },
                        {
                            identifier: "detectionDate",
                            label: "Date de détection",
                            placeholder: "Spécifier la date de détection",
                            type: 'date'
                        },
                        {
                            identifier: "qualificationDate",
                            label: "Date de qualification",
                            placeholder: "Spécifier la date de qualification",
                            type: 'date'
                        },
                        {
                            identifier: "closureDate",
                            label: "Date de clôture",
                            placeholder: "Spécifier la date de clôture",
                            type: 'date'
                        },
                        {
                            identifier: "decision",
                            label: "Décision",
                            placeholder: "Saisir la décision",
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
            resource: {
                table: {
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values
                        {
                            key: "name",
                            name: "Nom"
                        },
                        {
                            key: "type",
                            name: "Type"
                        }
                    ]
                },
                form: {
                    defaultSortingField: "type",
                    fields: [
                        {
                            identifier: "name",
                            label: "Nom",
                            placeholder: "Saisir un nom",
                            type: 'input'
                        },
                        {
                            identifier: "type",
                            label: "Type",
                            placeholder: "Sélectionner le type",
                            choices: [
                                { identifier: "HUMAN", value: "Humaine"},
                                { identifier: "HARDWARE", value: "Matérielle"},
                                { identifier: "SOFTWARE", value: "Logicielle"}
                            ]
                        }
                    ]
                }
            },
            document: {
                table: {
                    columnKeyLinkable: "name",
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values
                        {
                            key: "name",
                            name: "Nom"
                        }
                    ]
                },
                form: {
                    defaultSortingField: "name",
                    fields: [
                        {
                            identifier: "name",
                            label: "Nom",
                            placeholder: "Saisir un nom",
                            type: 'input'
                        },
                        {
                            identifier: "file",
                            label: "Fichier",
                            placeholder: "Choisir le fichier",
                            type: "file"
                        }
                    ]
                }
            },
            pendingIssue: {
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
                            key: "priority",
                            name: "Priorité"
                        },
                        {
                            key: "supervisor",
                            initialValueKey: "supervisorName",
                            name: "Responsable"
                        },
                        {
                            key: "creationDate",
                            type: "date",
                            name: "Création"
                        },
                        {
                            key: "resolutionPlannedDate",
                            type: "date",
                            name: "Résolution Planifiée"
                        },
                        {
                            key: "resolutionDate",
                            type: "date",
                            name: "Résolution Effective"
                        },
                        {
                            key: "impacts",
                            name: "Impacts"
                        },
                        {
                            key: "decisions",
                            name: "Décisions",
                            type: "textarea"
                        }
                    ]
                },
                form: {
                    defaultSortingField: "creationDate",
                    fields: [
                        // labels are taken from API_getAll().keys
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
                                { identifier: "OPEN", value: "Ouvert"},
                                { identifier: "AFFECTED", value: "Affecté"},
                                { identifier: "DEFERRED", value: "Différé"},
                                { identifier: "CLOSED", value: "Clôturée"}
                            ]
                        },
                        {
                            identifier: "supervisor",
                            label: "Responsable",
                            placeholder: "Sélectionner le responsable",
                            asyncChoices: {
                                entriesName: "humanResource",
                                attachedFieldName: "name"
                                // ,filterBy: {
                                //     type: "HUMAN"
                                // }
                            }
                        },
                        {
                            identifier: "priority",
                            label: "Priorité",
                            placeholder: "Sélectionner la priorité",
                            choices: [
                                { identifier: 1, value: "Faible"},
                                { identifier: 2, value: "Moyenne"},
                                { identifier: 3, value: "Haute"},
                                { identifier: 4, value: "Critique"}
                            ]
                        },
                        {
                            identifier: "creationDate",
                            label: "Date de création",
                            placeholder: "Spécifier la date de création",
                            type: 'date'
                        },
                        {
                            identifier: "resolutionPlannedDate",
                            label: "Date de résolution planifiée",
                            placeholder: "Spécifier la date de clôture planifiée",
                            type: 'date'
                        },
                        {
                            identifier: "resolutionDate",
                            label: "Date de clôture",
                            placeholder: "Spécifier la date de résolution réelle",
                            type: 'date'
                        },
                        {
                            identifier: "impacts",
                            label: "Impacts",
                            placeholder: "Saisir les impacts",
                            type: 'input'
                        },
                        {
                            identifier: "decisions",
                            label: "Décisions",
                            placeholder: "Saisir les décisions",
                            type: 'textarea'
                        }
                    ]
                }
            },
            changeRequest: {
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
                            key: "requester",
                            name: "Demandeur"
                        },
                        {
                            key: "priority",
                            name: "Priorité"
                        },
                        {
                            key: "requestDate",
                            type: "date",
                            name: "Soumission"
                        },
                        {
                            key: "decisionPlannedDate",
                            type: "date",
                            name: "Décision Planifiée"
                        },
                        {
                            key: "decisionDate",
                            type: "date",
                            name: "Décision Effective"
                        },
                        {
                            key: "impacts",
                            name: "Impacts"
                        }
                    ]
                },
                form: {
                    defaultSortingField: "requestDate",
                    fields: [
                        // labels are taken from API_getAll().keys
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
                                {identifier: "STUDYING", value: "À l'étude"},
                                {identifier: "ONGOING", value: "En cours"},
                                {identifier: "ACCEPTED", value: "Acceptée"},
                                {identifier: "REFUSED", value: "Refusée"},
                                {identifier: "ABANDONED", value: "Abandonnée"},
                                {identifier: "REPLACED", value: "Remplacée"}
                            ]
                        },
                        {
                            identifier: "requester",
                            label: "Demandeur",
                            placeholder: "Spécifier le demandeur",
                            type: 'input'
                        },
                        {
                            identifier: "priority",
                            label: "Priorité",
                            placeholder: "Sélectionner la priorité",
                            choices: [
                                { identifier: 1, value: "Faible"},
                                { identifier: 2, value: "Moyenne"},
                                { identifier: 3, value: "Élevée"}
                            ]
                        },
                        {
                            identifier: "requestDate",
                            label: "Date de création",
                            placeholder: "Spécifier la date de demande",
                            type: 'date'
                        },
                        {
                            identifier: "decisionPlannedDate",
                            label: "Date de clôture planifiée",
                            placeholder: "Spécifier la date de prise de décision planifiée",
                            type: 'date'
                        },
                        {
                            identifier: "decisionDate",
                            label: "Date de prise de décision",
                            placeholder: "Spécifier la date de prise de décision réelle",
                            type: 'date'
                        },
                        {
                            identifier: "impacts",
                            label: "Impacts",
                            placeholder: "Saisir les impacts",
                            type: 'input'
                        }
                    ]
                }
            },
            milestone: {
                table: {
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values,
                        {
                            key: "name",
                            name: "Nom"
                        },
                        {
                            key: "dueDate",
                            type: "date",
                            name: "Date d'échéance prévue"
                        },
                        {
                            key: "description",
                            name: "Description"
                        }
                    ]
                },
                form: {
                    defaultSortingField: "dueDate",
                    fields: [
                        // labels are taken from API_getAll().keys
                        {
                            identifier: "name",
                            label: "Nom",
                            placeholder: "Saisir le nom",
                            type: 'input'
                        },
                        {
                            identifier: "dueDate",
                            label: "Date d'échéance prévue",
                            placeholder: "Saisir la date d'échéance prévue",
                            type: 'date'
                        },
                        {
                            identifier: "description",
                            label: "Description",
                            placeholder: "Saisir une description",
                            type: 'input'
                        }
                    ]
                }
            },
            todo: {
                table: {
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values
                        {
                            key: "description",
                            name: "Description"
                        },
                        {
                            key: "charge",
                            name: "Charge (H/J)"
                        },
                        {
                            key: "estimationDate",
                            name: "Date d'estimation",
                            type: "date"
                        }
                    ]
                },
                form: {
                    defaultSortingField: "charge",
                    fields: [
                        {
                            identifier: "description",
                            label: "Description",
                            placeholder: "Saisir une description",
                            type: 'input'
                        },
                        {
                            identifier: "charge",
                            label: "Charge",
                            placeholder: "Saisir la charge",
                            type: 'charge'
                        },
                        {
                            identifier: "estimationDate",
                            label: "Date d'estimation",
                            placeholder: "Saisir la date d'estimation",
                            type: 'date'
                        }
                    ]
                }
            },
            humanResource: {
                table: {
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values
                        {
                            key: "name",
                            name: "Nom"
                        }
                    ]
                },
                form: {
                    defaultSortingField: "name",
                    fields: [
                        {
                            identifier: "name",
                            label: "Nom",
                            placeholder: "Saisir un nom",
                            type: 'input'
                        }
                    ]
                }
            },
            communicationPlan: {
                table: {
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values
                        {
                            key: "description",
                            name: "Description"
                        },
                        {
                            key: "supervisor",
                            name: "Responsable"
                        }
                    ]
                },
                form: {
                    defaultSortingField: "supervisor",
                    fields: [
                        {
                            identifier: "description",
                            label: "Description",
                            placeholder: "Saisir une description",
                            type: 'input'
                        },
                        {
                            identifier: "supervisor",
                            label: "Responsable",
                            placeholder: "Sélectionner le responsable",
                            asyncChoices: {
                                entriesName: "humanResource",
                                attachedFieldName: "name"
                                // ,filterBy: {
                                //     type: "HUMAN"
                                // }
                            }
                        }
                    ]
                }
            },
            writeup: {
                table: {
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values
                        {
                            key: "nom",
                            name: "Nom"
                        },
                        {
                            key: "description",
                            name: "Description"
                        }
                    ]
                },
                form: {
                    defaultSortingField: "charge",
                    fields: [
                        {
                            identifier: "nom",
                            label: "Nom",
                            placeholder: "Saisir le nom",
                            type: 'input'
                        },
                        {
                            identifier: "description",
                            label: "Description",
                            placeholder: "Saisir une description",
                            type: 'input'
                        }
                    ]
                }
            },
            reunionPlanning: {
                table: {
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values,
                        {
                            key: "name",
                            name: "Nom"
                        },
                        {
                            key: "date",
                            type: "date",
                            name: "Date"
                        },
                        {
                            key: "location",
                            name: "Lieu"
                        },
                        {
                            key: "status",
                            name: "Statut"
                        }
                    ]
                },
                form: {
                    defaultSortingField: "date",
                    fields: [
                        // labels are taken from API_getAll().keys
                        {
                            identifier: "name",
                            label: "Nom",
                            placeholder: "Saisir le nom",
                            type: 'input'
                        },
                        {
                            identifier: "date",
                            label: "Date",
                            placeholder: "Saisir la date",
                            type: 'date'
                        },
                        {
                            identifier: "location",
                            label: "Lieu",
                            placeholder: "Saisir le lieu",
                            type: 'input'
                        },
                        {
                            identifier: "status",
                            label: "Statut",
                            placeholder: "Saisir un statut",
                            choices: [
                                { identifier: "PLANNED", value: "Plannifiée"},
                                { identifier: "CANCELLED", value: "Annulée"},
                                { identifier: "CLOSED", value: "Clôturée"}
                            ]
                        }
                    ]
                }
            },
            user: {
                table: {
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values
                        {
                            key: "firstName",
                            name: "Prénom"
                        },
                        {
                            key: "lastName",
                            name: "Nom"
                        },
                        {
                            key: "login",
                            name: "Login"
                        }
                    ]
                },
                form: {
                    defaultSortingField: "firstName",
                    fields: [
                        {
                            identifier: "firstName",
                            label: "Prénom",
                            placeholder: "Saisir le prénom",
                            type: 'input'
                        },
                        {
                            identifier: "lastName",
                            label: "Nom",
                            placeholder: "Saisir le nom",
                            type: 'input'
                        },
                        {
                            identifier: "login",
                            label: "Login",
                            placeholder: "Saisir le login",
                            type: 'input'
                        },
                        {
                            identifier: "password",
                            label: "Mot de passe",
                            placeholder: "Saisir le mot de passe",
                            type: 'input'
                        }
                    ]
                }
            },


            // Details View Data
            budget: {
                table: {
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values
                        {
                            key: "budgetInitial",
                            name: "Budget initial",
                            type: "currency"
                        },
                        {
                            key: "budgetConsumed",
                            name: "Budget consommé",
                            type: "currency"
                        },
                        {
                            key: "budgetToConsume",
                            name: "Estimation du budget qui reste à consommer",
                            type: "currency"
                        }
                    ],
                    generatedFields: [
                        // Must be ordered by ascending position
                        {
                            position: 3,
                            key: "budgetTotalPrevision",
                            columnName: "Budget total prévisionnel",
                            type: "currency",
                            // extract values from current entry
                            formula: function (entry) {
                                // return budgetConsumed and budgetToConsume sum
                                var budgetTotalPrevision = parseInt(entry["budgetConsumed"]) + parseInt(entry["budgetToConsume"]);

                                return budgetTotalPrevision ? budgetTotalPrevision : 0;
                            }
                        }
                    ]
                },
                form: {
                    fields: [
                        {
                            identifier: "budgetInitial",
                            label: "Budget initial",
                            placeholder: "Entrer le montant du budget initial",
                            type: "currency"
                        },
                        {
                            identifier: "budgetConsumed",
                            label: "Budget consommé",
                            placeholder: "Entrer le montant du budget consommé",
                            type: "currency"
                        },
                        {
                            identifier: "budgetToConsume",
                            label: "Estimation du budget qui reste à consommer",
                            placeholder: "Entrer le montant du budget qui reste à consommer",
                            type: "currency"
                        }
                    ]
                }
            },
            advancementState: {
                table: {
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values
                        {
                            key: "status",
                            name: "Statut",
                            type: "coloredDot"
                        },
                        {
                            key: "advancement",
                            name: "Avancement",
                            type: "percentage"
                        },
                        {
                            key: "chargeConsumed",
                            name: "Charge consommé",
                            type: "charge"
                        }
                    ]
                },
                form: {
                    fields: [
                        {
                            identifier: "status",
                            label: "Statut",
                            placeholder: "Sélectionner le statut",
                            type: "coloredDot",
                            choices: [
                                { identifier: "GREEN", value: "GREEN"},
                                { identifier: "ORANGE", value: "ORANGE"},
                                { identifier: "RED", value: "RED"}
                            ]
                        },
                        {
                            identifier: "advancement",
                            label: "Avancement",
                            placeholder: "Entrer l'avancement",
                            type: "percentage"
                        },
                        {
                            identifier: "chargeConsumed",
                            label: "Charge consommée",
                            placeholder: "Entrer la charge prévisionnelle",
                            type: "charge"
                        }
                    ]
                }
            },
            charter: {
                table: {
                    // tenantDataKey_columnName mapping
                    columnMaps: [
                        // Ordered key-values
                        {
                            key: "name",
                            name: "Nom"
                        },
                        {
                            key: "mainContact",
                            name: "Contact principal"
                        },
                        {
                            key: "sponsors",
                            name: "Sponsors",
                            type: "textarea"
                        },
                        {
                            key: "finalClient",
                            name: "Client final"
                        },
                        {
                            key: "goal",
                            name: "Objectif du projet"
                        },
                        {
                            key: "budgetInitial",
                            name: "Budget initial",
                            type: "currency"
                        },
                        {
                            key: "chargePrevision",
                            name: "Charge prévisionnelle",
                            type: "charge"
                        },
                        {
                            key: "startDate",
                            name: "Date début",
                            type: "date"
                        },
                        {
                            key: "endDate",
                            name: "Date fin",
                            type: "date"
                        },
                        {
                            key: "hypotheses_constraints",
                            name: "Hypothèses & Contraintes",
                            type: "textarea"
                        },
                        {
                            key: "history_decisions",
                            name: "Historique & Décisions",
                            type: "textarea"
                        },
                        {
                            key: "comment",
                            name: "Commentaire",
                            type: "textarea"
                        }
                    ]
                },
                form: {
                    fields: [
                        {
                            identifier: "name",
                            label: "Nom",
                            placeholder: "Sasir le nom",
                            type: "input"
                        },
                        {
                            identifier: "mainContact",
                            label: "Contact principal",
                            placeholder: "Sasir le nom du contact principal",
                            type: "input"
                        },
                        {
                            identifier: "sponsors",
                            label: "Sponsors",
                            placeholder: "Sasir un sponsor par ligne",
                            type: "textarea"
                        },
                        {
                            identifier: "finalClient",
                            label: "Client final",
                            placeholder: "Sasir le nom du client final",
                            type: "input"
                        },
                        {
                            identifier: "goal",
                            label: "Objectif du projet",
                            placeholder: "Sasir l'objectif du projet",
                            type: "input"
                        },
                        {
                            identifier: "budgetInitial",
                            label: "Budget initial",
                            placeholder: "Entrer le budget initial",
                            type: "currency"
                        },
                        {
                            identifier: "chargePrevision",
                            label: "Charge prévisionnelle",
                            placeholder: "Entrer la charge prévisionnelle",
                            type: "charge"
                        },
                        {
                            identifier: "startDate",
                            label: "Date début",
                            placeholder: "Choisir la date de début",
                            type: "date"
                        },
                        {
                            identifier: "endDate",
                            label: "Date fin",
                            placeholder: "Choisir la date de fin",
                            type: "date"
                        },
                        {
                            identifier: "hypotheses_constraints",
                            label: "Hypothèses & Contraintes",
                            placeholder: "Sasir les hypothèses et les contraintes",
                            type: "textarea"
                        },
                        {
                            identifier: "history_decisions",
                            label: "Historique & Décisions",
                            placeholder: "Sasir l'historique et les décisions",
                            type: "textarea"
                        },
                        {
                            identifier: "comment",
                            label: "Commentaire",
                            placeholder: "Sasir un commentaire",
                            type: "textarea"
                        },
                        {
                            identifier: "files",
                            label: "Documents en pièce jointe",
                            placeholder: "Attacher des fichiers en pièces jointes",
                            type: "input"
                        }
                    ]
                }
            }
        };

        var projectLevelCommonViewData = {
            table: {
                // tenantDataKey_columnName mapping
                columnMaps: [
                    // Ordered key-values
                    {
                        key: "name",
                        name: "Nom"
                    },
                    {
                        key: "mainContact",
                        name: "Contact principal"
                    },
                    {
                        key: "sponsors",
                        name: "Sponsors",
                        type: "textarea"
                    },
                    {
                        key: "finalClient",
                        name: "Client final"
                    },
                    {
                        key: "goal",
                        name: "Objectif du projet"
                    },
                    {
                        key: "budgetInitial",
                        name: "Budget initial (TND)"
                    },
                    {
                        key: "chargePrevision",
                        name: "Charge prévisionnelle (H/J)"
                    },
                    {
                        key: "startDate",
                        name: "Date début",
                        type: "date"
                    },
                    {
                        key: "endDate",
                        name: "Date fin",
                        type: "date"
                    },
                    {
                        key: "hypotheses_constraints",
                        name: "Hypothèses & Contraintes",
                        type: "textarea"
                    },
                    {
                        key: "history_decisions",
                        name: "Historique & Décisions",
                        type: "textarea"
                    },
                    {
                        key: "comment",
                        name: "Commentaire",
                        type: "textarea"
                    }
                ]
            },
            form: {
                defaultSortingField: "name",
                fields: [{
                    identifier: "name",
                    label: "Nom",
                    placeholder: "Sasir le nom",
                    type: "input"
                },
                    {
                        identifier: "mainContact",
                        label: "Contact principal",
                        placeholder: "Sasir le nom du contact principal",
                        type: "input"
                    },
                    {
                        identifier: "sponsors",
                        label: "Sponsors",
                        placeholder: "Sasir un sponsor par ligne",
                        type: "textarea"
                    },
                    {
                        identifier: "finalClient",
                        label: "Client final",
                        placeholder: "Sasir le nom du client final",
                        type: "input"
                    },
                    {
                        identifier: "goal",
                        label: "Objectif du projet",
                        placeholder: "Sasir l'objectif du projet",
                        type: "input"
                    },
                    {
                        identifier: "budgetInitial",
                        label: "Budget initial",
                        placeholder: "Entrer le budget initial",
                        type: "currency"
                    },
                    {
                        identifier: "chargePrevision",
                        label: "Charge prévisionnelle",
                        placeholder: "Entrer la charge prévisionnelle",
                        type: "charge"
                    },
                    {
                        identifier: "startDate",
                        label: "Date début",
                        placeholder: "Choisir la date de début",
                        type: "date"
                    },
                    {
                        identifier: "endDate",
                        label: "Date fin",
                        placeholder: "Choisir la date de fin",
                        type: "date"
                    },
                    {
                        identifier: "hypotheses_constraints",
                        label: "Hypothèses & Contraintes",
                        placeholder: "Sasir les hypothèses et les contraintes",
                        type: "textarea"
                    },
                    {
                        identifier: "history_decisions",
                        label: "Historique & Décisions",
                        placeholder: "Sasir l'historique et les décisions",
                        type: "textarea"
                    },
                    {
                        identifier: "comment",
                        label: "Commentaire",
                        placeholder: "Sasir un commentaire",
                        type: "textarea"
                    },
                    {
                        identifier: "files",
                        label: "Documents en pièce jointe",
                        placeholder: "Attacher des fichiers en pièces jointes",
                        type: "input"
                    }
                ]
            }
        };

        viewsData[CommonConstants.PROJECT_STRING] = angular.copy(projectLevelCommonViewData);
        viewsData[CommonConstants.PROJECT_STRING].table.columnKeyLinkable = "name";

        viewsData[CommonConstants.SUB_PROJECT_STRING] = angular.copy(projectLevelCommonViewData);
        viewsData[CommonConstants.SUB_PROJECT_STRING].table.columnKeyLinkable = "name";

        viewsData[CommonConstants.CONSTRUCTION_SITE_STRING] = angular.copy(projectLevelCommonViewData);



        // Sidebar View Data

        var projectsSidebarContent  = {
            title: "Général",
            entries: [
                {
                    url: "projects",
                    iconClass: "fa fa-th",
                    title: "Portefeuille"
                },
                {
                    url: CommonConstants.EMPTY_HREF_URL,
                    iconClass: "fa fa-tasks",
                    title: "Administration",
                    entries: [
                        {
                            url: "." + CommonConstants.GENERAL_BASE_URL + "/resources",
                            title: "Ressources"
                        },
                        {
                            url: "." + CommonConstants.GENERAL_BASE_URL + "/users",
                            title: "Gestion de comptes"
                        }
                    ]
                }
            ]
        };

        this.getProjectLevelSidebarContent = function (projectLevelProperties) {
            var entries = [
                {
                    url: "charter",
                    iconClass: "fa fa-thumb-tack",
                    title: "Charte"
                },
                {
                    url: "javascript:void(0)",
                    iconClass: "fa fa-eye",
                    title: "État des lieux",
                    entries: [
                        {
                            url: "./" + projectLevelProperties.urlPrefix + "/dashboard",
                            title: "Tableau de bord"
                        },
                        {
                            url: "./" + projectLevelProperties.urlPrefix + "/advancementState",
                            title: "État d'avancement"
                        },
                        {
                            url: "./" + projectLevelProperties.urlPrefix + "/actions",
                            title: "Plan d'action"
                        },
                        {
                            url: "./" + projectLevelProperties.urlPrefix + "/todos",
                            title: "Reste à faire"
                        }
                    ]
                },
                {
                    url: "milestones",
                    iconClass: "fa fa-calendar-times-o",
                    title: "Principaux jalons"
                },
                {
                    url: "javascript:void(0)",
                    iconClass: "fa fa-sticky-note",
                    title: "Gestion du scope",
                    entries: [
                        {
                            url: "./" + projectLevelProperties.urlPrefix + "/documents",
                            title: "Documentations"
                        },
                        {
                            url: "./" + projectLevelProperties.urlPrefix + "/pendingIssues",
                            title: "Points en suspens"
                        },
                        {
                            url: "./" + projectLevelProperties.urlPrefix + "/changeRequests",
                            title: "Demandes de changement"
                        }
                    ]
                }
            ];

            if (projectLevelProperties.type === CommonConstants.PROJECT_STRING) {
                entries.push({
                    url: "javascript:void(0)",
                    iconClass: "fa fa-sitemap",
                    title: "Gestion d'intégration",
                    entries: [
                        {
                            url: "./" + projectLevelProperties.urlPrefix + "/subProjects",
                            title: "Sous-projets"
                        },
                        {
                            url: "./" + projectLevelProperties.urlPrefix + "/constructionSites",
                            title: "Chantiers"
                        }
                    ]
                });
            }
            else if (projectLevelProperties.type === CommonConstants.SUB_PROJECT_STRING) {
                entries.push({
                    url: "constructionSites",
                    iconClass: "fa fa-sitemap",
                    title: "Chantiers"
                });
            }

            entries = entries.concat([
                {
                    url: "javascript:void(0)",
                    iconClass: "fa fa-user-times",
                    title: "Gestion des ressources",
                    entries: [
                        {
                            url: "./" + projectLevelProperties.urlPrefix + "/humanResources",
                            title: "Ressources humaines"
                        },
                        {
                            url: "./" + projectLevelProperties.urlPrefix + "/resources",
                            title: "Autres ressources"
                        }
                    ]
                },
                {
                    url: "budget",
                    iconClass: "fa fa-eur",
                    title: "Gestion des coûts"
                },
                {
                    url: "risks",
                    iconClass: "fa fa-exclamation-circle",
                    title: "Gestion des risques"
                }
            ]);
            
            if (projectLevelProperties.type === CommonConstants.PROJECT_STRING) {
                entries.push({
                        url: "javascript:void(0)",
                        iconClass: "fa fa-comments",
                        title: "Gestion de la communication",
                        entries: [
                            {
                                url: "./" + projectLevelProperties.urlPrefix + "/communicationPlans",
                                title: "Plan de communication"
                            },
                            {
                                url: "./" + projectLevelProperties.urlPrefix + "/writeups",
                                title: "Comptes rendus de réunions"
                            },
                            {
                                url: "./" + projectLevelProperties.urlPrefix + "/reunionPlannings",
                                title: "Planning des réunions"
                            }
                        ]
                    });
            }

            return {
                entries: entries
            };
        };

        this.getProjectsSidebarContent = function () {
            return projectsSidebarContent;
        };

        this.getEntryViewData = function (viewType) {
            return viewsData[viewType];
        };

        this.getDashboardViewData = function () {
            return dashboardData;
        };
    });