/*
*  Angular actions page script
*
*/


angular.module('ProjMngmnt', ['ngRoute'])
	.config([
		'$routeProvider', 
		'$locationProvider', 
		function($routeProvider, $locationProvider) {
			// var resolveProjects = {
			// 	projects: function (Projects) {
			// 		return Projects.fetch();
			// 	}
			// };
		 
			$routeProvider
				.when('/', {
					templateUrl:'void.html'
				})
				.when('/dashboard', {
					templateUrl:'dashboard.html', 
					controller: 'DashboardCtrl'
				})
				.when('/actions', {
					templateUrl:'actions.html'
				})
				// .when('/', {
				//   controller:'ProjectListController as projectList',
				//   templateUrl:'list.html',
				//   resolve: resolveProjects
				// })
				// .when('/edit/:projectId', {
				//   controller:'EditProjectController as editProject',
				//   templateUrl:'detail.html',
				//   resolve: resolveProjects
				// })
				.otherwise({
					redirectTo:'/'
				});
				
			// use the HTML5 History API
			$locationProvider.html5Mode(true);
		}
	])

	.service('Dashboard', function () {
		// Globals
		var chartHolders = [];
		var greenHue = '#64CF6F';
		var redHue = '#FE5B54';
		var yellowHue = '#FEBD55';



		/* Risks & Actions Charts */

		// Risks & Actions Labels
		var riskLabels_AscendingGravity = ["Maîtrisé","Moyen", "Élevé"];
		var actionLabels_AscendingGravity = ["À temps", "En retard"];
		// Risks & Actions Values
		var riskValues_AscendingGravity = [5, 2, 4];
		var actionValues_AscendingGravity = [9, 14];
		// Risks & Actions Data
		var risksData = [
			{ 
				"label": riskLabels_AscendingGravity[0],
				"value" : riskValues_AscendingGravity[0]
			} , 
			{ 
				"label": riskLabels_AscendingGravity[1],
				"value" : riskValues_AscendingGravity[1]
			} , 
			{ 
				"label": riskLabels_AscendingGravity[2],
				"value" : riskValues_AscendingGravity[2]
			}
		];
		var actionsData = [
			{ 
				"label": actionLabels_AscendingGravity[0],
				"value" : actionValues_AscendingGravity[0]
			}, 
			{ 
				"label": actionLabels_AscendingGravity[1],
				"value" : actionValues_AscendingGravity[1]
			} 
		];

		// Risks & Actions chart creation function
		function addSimplePieChart(selector, data, colorsArrayAscendingGravity) {
		    var chartHolder = {};

			nv.addGraph(function() {
				chartHolder.chart = nv.models.pieChart()
		            .x(function(d) { return d.label })
		            .y(function(d) { return d.value })
		            .color(colorsArrayAscendingGravity)
		            .labelType('value')
		            .legendPosition('bottom')
		            .valueFormat(d3.format('.0'))
		            .growOnHover(false)
		            .showLabels(true);
		        
		        chartHolder.chart.tooltip.enabled(false);

		        d3.select(selector)
		            .datum(data)
		            .transition().duration(1200)
		            .call(chartHolder.chart);

		        return chartHolder.chart;
		    });
		    return chartHolder;
		}



		/* AdvancementRatio & SubProjects Charts */

		// AdvancementRatio Value
		var advancementRatioValue = 0.36;
		// AdvancementRatio Data
		var advancementRatioData = [
		    {
		        "value": advancementRatioValue
		    },
		    {
		        "value": 1 - advancementRatioValue
		    }
		];
		// AdvancementRatio chart variables
		var advancementRatioChartHolder = {};
		chartHolders.push(advancementRatioChartHolder);
		var advancementRatio_color = yellowHue; /*"#7FC"*/
		var advancementRatio_bgColor = "#F2F2F2";


		// SubProjects Labels
		var SubProjectsLabelsOrdered = ["SousProjY", "SousProjZ", "Grands Travaux", "Plein De Tâches", "Phase de finalisation"];
		// SubProjects Values
		var SubProjectsValuesOrdered = [1, 0.64, 0.16, 0.28, 0.4];
		// SubProjects Data
		var SubProjectsData = [
		    {
		        key: 'SubProjectsSeries',
		        values: [
		            {
		                "label" : SubProjectsLabelsOrdered[0],
		                "value" : SubProjectsValuesOrdered[0]
		            } ,
		            {
		                "label" : SubProjectsLabelsOrdered[1],
		                "value" : SubProjectsValuesOrdered[1]
		            } ,
		            {
		                "label" : SubProjectsLabelsOrdered[2],
		                "value" : SubProjectsValuesOrdered[2]
		            } ,
		            {
		                "label" : SubProjectsLabelsOrdered[3],
		                "value" : SubProjectsValuesOrdered[3]
		            } ,
		            {
		                "label" : SubProjectsLabelsOrdered[4],
		                "value" : SubProjectsValuesOrdered[4]
		            }
		        ]
		    }
		];
		// SubProjects chart variables
		var SubProjectsChartHolder = {};
		chartHolders.push(SubProjectsChartHolder);


		// Dashboard charts init function
		this.initCharts = function (controllerScope) {		
			// Create Risks & Actions charts & feed them data
			var risksChartHolder = addSimplePieChart("#risksChart svg", risksData, [greenHue, yellowHue, redHue]);
			chartHolders.push(risksChartHolder);
			var actionsChartHolder = addSimplePieChart("#actionsChart svg", actionsData, [greenHue, redHue]);
			chartHolders.push(actionsChartHolder);

			// Update Risks & Actions charts on container (svg) resize (ie. on media query change)
			var mq = window.matchMedia("(min-width: 1605px)");
			if (matchMedia) {
				mq.addListener(Width2xlg);
			}
			// media query change
			function Width2xlg(mq) {
			    // for (var i = 0; i < chartHolders.length; i++) {
			    //     chartHolders[i].chart.update();
			    // }
			    risksChartHolder.chart.update();
			    actionsChartHolder.chart.update();
			}

			// remove media query on charts unload (controller/view unload)
			controllerScope.$on('destroy', function () {
				mq.removeListener(Width2xlg);
			})


			// Create AdvancementRatio chart & Feed it data
			nv.addGraph(function() {
			    advancementRatioChartHolder.chart = nv.models.pieChart()
			        .y(function(d) { return d.value })
			        .donut(true)
			        .donutRatio(0.75)
			        .showLabels(false)
			        .showLegend(false)
			        .growOnHover(false)
			        .color([advancementRatio_color, advancementRatio_bgColor]);

			    advancementRatioChartHolder.chart.title(advancementRatioValue * 100+"%")
			        .tooltip.enabled(false);

			    d3.select("#advancement-measure svg")
			        .datum(advancementRatioData)
			        .transition().duration(1200)
			        .call(advancementRatioChartHolder.chart);

			    // LISTEN TO WINDOW RESIZE
			    // nv.utils.windowResize(advancementRatioChartHolder.chart.update);
			    // LISTEN TO CLICK EVENTS ON SLICES OF THE PIE/DONUT
			    // advancementRatioChartHolder.chart.pie.dispatch.on('elementClick', function() {
			    //     code...
			    // });
			    // advancementRatioChartHolder.chart.pie.dispatch.on('chartClick', function() {
			    //     code...
			    // });
			    // LISTEN TO DOUBLECLICK EVENTS ON SLICES OF THE PIE/DONUT
			    // advancementRatioChartHolder.chart.pie.dispatch.on('elementDblClick', function() {
			    //     code...
			    // });
			    // LISTEN TO THE renderEnd EVENT OF THE PIE/DONUT
			    // advancementRatioChartHolder.chart.pie.dispatch.on('renderEnd', function() {
			    //     code...
			    // });
			    // OTHER EVENTS DISPATCHED BY THE PIE INCLUDE: elementMouseover, elementMouseout, elementMousemove
			    // @see nv.models.pie
			    return advancementRatioChartHolder.chart;
			});


			// Create SubProjects chart & Feed it data
			nv.addGraph(function() {
			    SubProjectsChartHolder.chart = nv.models.multiBarHorizontalChart()
			        .x(function(d) { return d.label })
			        .y(function(d) { return d.value })
			  	    .barColor([greenHue, greenHue, redHue, redHue, yellowHue])
			        .showYAxis(false)
			        .duration(250)
			        .margin({left: 130})
			        .yDomain([0, 1])
			        .showValues(true)
					.valueFormat(d3.format('.0%'))
			        .showLegend(false)
			        .showControls(false);
				    
				SubProjectsChartHolder.chart.tooltip.enabled(false);

			    d3.select('#advancement-chart svg')
			        .datum(SubProjectsData)
			        .call(SubProjectsChartHolder.chart);

			    nv.utils.windowResize(SubProjectsChartHolder.chart.update);

			    // chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
			    // chart.state.dispatch.on('change', function(state){
			    //     nv.log('state', JSON.stringify(state));
			    // });
			    return SubProjectsChartHolder.chart;
			});
		}
	})

	.controller('DashboardCtrl', [
		'Dashboard', 
		'$scope', 
		function (Dashboard, $scope) {
			Dashboard.initCharts($scope);
		}
	])

	.service('Sidebar', function () {
		this.initClickListeners = function () {
			// In/Out-dent sidebar
			document.getElementById('outdent-icon').onclick = function () {
			    var body = document.body;
			    // TODO: polyfill for classList (from MDN?)
			    if (body.classList.contains('mini-sidebar')) {
			        body.classList.remove('mini-sidebar');
			    }
			    else {
			        body.className += " mini-sidebar";
			    }
			}

			// On sidebar expandable menu click
			var li_expandables = document.getElementsByClassName('collapsible-menu');
			for (var i = 0; i < li_expandables.length; i++) {
			    li_expandables[i].children[0].onclick = function () {
			        // TODO: polyfill for children[] property (IE8-)
			        var ul = this.parentElement.children[1];
			        var isExpanded = ul.clientHeight;

			        // TODO: replace with specific (.expanded?) class query
			        //  & replace li_expandables with css selector on all needed ul
			        for (var j = 0; j < li_expandables.length; j++) {
			            // select ul element
			            var ul_j = li_expandables[j].children[1];
			            if (ul_j.clientHeight) {
			                ul_j.style.height = 0;
			            }
			        }

			        if (!isExpanded) {
			            ul.style.height = ul.scrollHeight + "px";
			        }
			    }
			}

			// On sidebar submenu click
			var subLinks = document.querySelectorAll('#sidebar .tab-content .tab-pane > ul > li > ul > li > a');
			for (var i = 0; i < subLinks.length; i++) {
			    subLinks[i].onclick = function () {
			        // only one element should match, even across tabs
			        var li_active = document.querySelector('#sidebar .tab-content .tab-pane > ul > li.active');
			        if (li_active) {
			            li_active.classList.remove('active');
			        }
			        // only one element should match, even across tabs
			        var a_active = document.querySelector('#sidebar .tab-content .tab-pane > ul > li > ul > li > a.active');
			        if (a_active) {
			            a_active.classList.remove('active');
			        }
			        // activate clicked on a_link & parent menu entry
			        this.className += " active";
			        var menuEntry = this.parentElement.parentElement.parentElement;
			        menuEntry.className += " active";
			    }
			}

			// On sidebar simple menu click
			var li_simples = document.getElementsByClassName('simple-menu');
			for (var i = 0; i < li_simples.length; i++) {
			    li_simples[i].onclick = function () {
			        // TODO: replace with specific (.expanded?) class query
			        //  & replace li_expandables with css selector on all needed ul
			        for (var j = 0; j < li_expandables.length; j++) {
			            // select ul element
			            var ul_j = li_expandables[j].children[1];
			            if (ul_j.clientHeight) {
			                ul_j.style.height = 0;
			            }
			        }

			        // only one element should match, even across tabs
			        var li_active = document.querySelector('#sidebar .tab-content .tab-pane > ul > li.active');
			        if (li_active) {
			            li_active.classList.remove('active');
			        }
			        // only one element should match, even across tabs
			        var a_active = document.querySelector('#sidebar .tab-content .tab-pane > ul > li > ul > li > a.active');
			        if (a_active) {
			            a_active.classList.remove('active');
			        }

			        // activate clicked on a_link's parent menu entry
			        this.className += " active";
			    }
			}

		}
	})

	.controller('SidebarCtrl', [
		'Sidebar', 
		'$scope', 
		function (Sidebar, $scope) {
			Sidebar.initClickListeners();
		}
	])