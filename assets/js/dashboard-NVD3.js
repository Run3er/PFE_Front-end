/*
 *  Dashboard NVD3 charts implementation code
 *
 */


//Theme Colors Palette
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

// Create Risks & Actions chart & Feed it data
function addSimplePieChart(selector, data, colorsArrayAscendingGravity) {
	nv.addGraph(function() {
		var chart = nv.models.pieChart()
			.x(function(d) { return d.label })
			.y(function(d) { return d.value })
			.color(colorsArrayAscendingGravity)
			.labelType('value')
			.legendPosition('bottom')
			.valueFormat(d3.format('.0'))
			.growOnHover(false)
			.showLabels(true);
	    
		chart.tooltip.enabled(false);

	    d3.select(selector)
	        .datum(data)
	        .transition().duration(1200)
	        .call(chart);

		return chart;
	});
}
addSimplePieChart("#risksChart svg", risksData, [greenHue, yellowHue, redHue]);
addSimplePieChart("#actionsChart svg", actionsData, [greenHue, redHue]);


/* AdvancementRatio & SubProjects Charts */

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

// Create SubProjects chart & Feed it data
nv.addGraph(function() {
    var chart = nv.models.multiBarHorizontalChart()
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
	    
	chart.tooltip.enabled(false);

    d3.select('#advancement-chart svg')
        .datum(SubProjectsData)
        .call(chart);

    nv.utils.windowResize(chart.update);

    // chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
    // chart.state.dispatch.on('change', function(state){
    //     nv.log('state', JSON.stringify(state));
    // });
    return chart;
});


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

// Create AdvancementRatio chart & Feed it data
var advancementRatio_color = yellowHue; /*"#7FC"*/
var advancementRatio_bgColor = "#F2F2F2";
nv.addGraph(function() {
    var chart = nv.models.pieChart()
        .y(function(d) { return d.value })
        .donut(true)
        .donutRatio(0.75)
        .showLabels(false)
        .showLegend(false)
      	.growOnHover(false)
  	    .color([advancementRatio_color, advancementRatio_bgColor]);

    chart.title(advancementRatioValue * 100+"%")
		.tooltip.enabled(false);

    d3.select("#advancement-measure svg")
        .datum(advancementRatioData)
        .transition().duration(1200)
        .call(chart);

    // LISTEN TO WINDOW RESIZE
    // nv.utils.windowResize(chart.update);
    // LISTEN TO CLICK EVENTS ON SLICES OF THE PIE/DONUT
    // chart.pie.dispatch.on('elementClick', function() {
    //     code...
    // });
    // chart.pie.dispatch.on('chartClick', function() {
    //     code...
    // });
    // LISTEN TO DOUBLECLICK EVENTS ON SLICES OF THE PIE/DONUT
    // chart.pie.dispatch.on('elementDblClick', function() {
    //     code...
    // });
    // LISTEN TO THE renderEnd EVENT OF THE PIE/DONUT
    // chart.pie.dispatch.on('renderEnd', function() {
    //     code...
    // });
    // OTHER EVENTS DISPATCHED BY THE PIE INCLUDE: elementMouseover, elementMouseout, elementMousemove
    // @see nv.models.pie
    return chart;
});



// May come in handy (customization code)
		// /* JavaScript Media Queries */
		// if (matchMedia) {
		// 	var mq = window.matchMedia("(min-width: 1605px)");
		// 	mq.addListener(WidthChange);
		// 	WidthChange(mq);
		// }
		// // media query change
		// function WidthChange(mq) {
		// 	if (mq.matches) {
		// 	var main = document.getElementById('main');
		// 	main.className += ' largeWidthView';

		// 	// var leftColumn = document.getElementById('measure-chart-indicators-col');
		// 	// leftColumn.className += ' col-lg-9';

		// 	// var piesRow = document.getElementsByClassName('piesRow')[0];
		// 	// piesRow.className += ' col-lg-4';
		// 	// for(var ix = 0; ix < piesRow.children.length; ix++) {
		// 	// 	piesRow.children[ix].className += ' col-lg-12';
		// 	// }
		// 	} else {
		// 	var main = document.getElementById('main');
		// 	main.classList.remove('largeWidthView');

		// 	// var leftColumn = document.getElementById('measure-chart-indicators-col');
		// 	// leftColumn.classList.remove('col-lg-9');
			
		// 	// var piesRow = document.getElementsByClassName('piesRow')[0];
		// 	// piesRow.classList.remove('col-lg-4');
		// 	// for(var ix = 0; ix < piesRow.children.length; ix++) {
		// 	// 	piesRow.children[ix].classList.remove('col-lg-12');
		// 	// }
		// 	}
		// }