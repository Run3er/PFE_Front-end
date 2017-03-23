/*
 *  Dashboard NVD3 charts implementation code
 *
 */


//Globals
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

// Create Risks & Actions chart & Feed it data
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
var risksChartHolder = addSimplePieChart("#risksChart svg", risksData, [greenHue, yellowHue, redHue]);
chartHolders.push(risksChartHolder);
var actionsChartHolder = addSimplePieChart("#actionsChart svg", actionsData, [greenHue, redHue]);
chartHolders.push(actionsChartHolder);


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

// Create AdvancementRatio chart & Feed it data
var advancementRatioChartHolder = {};
chartHolders.push(advancementRatioChartHolder);
var advancementRatio_color = yellowHue; /*"#7FC"*/
var advancementRatio_bgColor = "#F2F2F2";

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
var SubProjectsChartHolder = {};
chartHolders.push(SubProjectsChartHolder);

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




// May come in handy (customization code)
/* JavaScript Media Queries */
if (matchMedia) {
	var mq = window.matchMedia("(min-width: 1605px)");
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