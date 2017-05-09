
angular.module('ProjMngmnt')
    .service('UI', function (CommonConstants) {
        // Dashboard Data
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
            actionStatusLabelMap: {
                ONGOING : "En cours",
                STANDBY : "En standby",
                CANCELLED : "Annulée",
                CLOSED : "Clôturée"
            }
        };


        // Views Data
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
                            initialValueKey: "supervisorName", 
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
                            key: "closurePlannedDate",
                            name: "Clôture Planifiée"
                        },
                        {
                            key: "delay",
                            name: "Retard"
                        },
                        {
                            key: "closureDate",
                            name: "Clôture Effective"
                        },
                        {
                            key: "comment",
                            name: "Commentaire"
                        }
                    ]
                },
                form: {
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
                            asyncChoices: {
                                entriesName: "resource",
                                attachedFieldName: "name",
                                filterBy: {
                                    type: "HUMAN"
                                }
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
                            identifier: "delay",
                            label: "Retard",
                            //default: 0,
                            placeholder: "Saisir le retard",
                            type: 'input'
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
                            key: "closureDate",
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
                                { identifier: 1, value: "Faible"},
                                { identifier: 2, value: "Moyenne"},
                                { identifier: 3, value: "Élevée"}
                            ]
                        },
                        {
                            identifier: "impact",
                            label: "Impact",
                            placeholder: "Sélectionner l'impact",
                            choices: [
                                { identifier: 1, value: "Moindre"},
                                { identifier: 2, value: "Faible"},
                                { identifier: 3, value: "Moyen"},
                                { identifier: 4, value: "Élevé"},
                                { identifier: 5, value: "Extrême"}
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
                                { identifier: "ACTION_PLAN_ONGOING", value: "Plan d'action en cours"},
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
                            name: "Création"
                        },
                        {
                            key: "resolutionPlannedDate",
                            name: "Résolution Planifiée"
                        },
                        {
                            key: "resolutionDate",
                            name: "Résolution Effective"
                        },
                        {
                            key: "impacts",
                            name: "Impacts"
                        },
                        {
                            key: "decisions",
                            name: "Décisions"
                        }
                    ]
                },
                form: {
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
                                entriesName: "resource",
                                attachedFieldName: "name",
                                filterBy: {
                                    type: "HUMAN"
                                }
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
                            name: "Soumission"
                        },
                        {
                            key: "decisionPlannedDate",
                            name: "Décision Planifiée"
                        },
                        {
                            key: "decisionDate",
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
                            key: "Date prévue",
                            name: "dueDate"
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
                        // labels are taken from DB_getAll().keys
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
            }
        };

        var projectLevelCommonViewData = {
            table: {
                // tenantDataKey_columnName mapping
                columnKeyLinkable: "name",
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
        };

        viewsData[CommonConstants.PROJECT_STRING] = angular.copy(projectLevelCommonViewData);

        viewsData[CommonConstants.SUB_PROJECT_STRING] = angular.copy(projectLevelCommonViewData);

        viewsData[CommonConstants.CONSTRUCTION_SITE_STRING] = angular.copy(projectLevelCommonViewData);


        // Sidebar Data

        var projectLevelBaseContent = {
            entries: [
                {
                    url: "dashboard",
                    iconClass: "fa fa-dashboard",
                    title: "Tableau de bord"
                },
                {
                    url: "milestones",
                    iconClass: "fa fa-calendar-plus-o",
                    title: "Jalons"
                },
                {
                    url: "planning",
                    iconClass: "fa fa-calendar",
                    title: "Planning"
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
                    url: "projects",
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



        this.getProjectLevelBaseContent = function () {
            return projectLevelBaseContent;
        };

        this.getPortfolioContent = function () {
            return portfolioContent;
        };

        this.getEntryViewData = function (viewType) {
            return viewsData[viewType];
        };

        this.getDashboardViewData = function () {
            return dashboardData;
        };
    });