function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    console.log(sampleNames);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var chartsData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var chartsResultArray = chartsData.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var chartsResult = chartsResultArray[0];
    console.log(chartsData);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    
    var barChartData = {
      x: chartsResult.sample_values.sort((a,b) => b-a).slice(0,10).reverse(),
      y: chartsResult.otu_ids.map((otuID) => "otu " + otuID).slice(0,10),
      text: chartsResult.otu_labels,
      type: "bar",
      orientation: "h"
  };

    // 8. Create the trace for the bar chart. 
    var barData = [barChartData];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        xaxis: {title: "frequency"},
        yaxis: {title: "OTU_id"}
      };
     
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  
 

    // 1. Create the trace for the bubble chart.
    var bubbleChart = {
      x: chartsResult.otu_ids,
      y: chartsResult.sample_values,
      text: chartsResult.otu_labels,
      mode: "markers",
      marker: {
        color: chartsResult.otu_ids,
        size: chartsResult.sample_values,
        //opacity: [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]
        colorscale:  [
          ['0.0', 'rgb(165,0,38)'],
          ['0.1', 'rgb(215,48,39)'],
          ['0.2', 'rgb(244,109,67)'],
          ['0.3', 'rgb(253,174,97)'],
          ['0.4', 'rgb(254,224,144)'],
          ['0.5', 'rgb(224,243,248)'],
          ['0.6', 'rgb(171,217,233)'],
          ['0.7', 'rgb(116,173,209)'],
          ['0.8', 'rgb(69,117,180)'],
          ['1.0', 'rgb(49,54,149)']
        ]
      
      }
    };

    var bubbleData = [bubbleChart];
        
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU_ID"},
      //yaxis: {title: "Frequency"}
      };
  
    // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  

 // D2: 3. Use Plotly to plot the data with the layout.
    var frequency = data.metadata;
    var freqArray = frequency.filter(sampleObj => sampleObj.id ==sample);
    var freqResults = freqArray[0];
    //console.log(freqResults.wfreq);
    var wfreq = parseFloat(freqResults.wfreq);

  // 4. Create the trace for the gauge chart.
    var gaugeChart={domain: {x: [0, 10], y: [0, 10]},
    value:freqResults.wfreq,
    type: "indicator",
    mode: "gauge+number",
    title: {text: "Belly Button Washing Frequency: (Scrubs per week)", font: {size: 18}},
    gauge: {
        axis:  { 
          range: [0,10], 
          tickwidth: 1,
          tickcolor: "darkpurple" 
          },
        bar: {color: "black"},
        steps: [
          { range: [0, 2], color: "red"},
          { range: [2, 4], color: "orange"},
          { range: [4, 6], color: "yellow"},
          { range: [6, 8], color: "yellowgreen"},
          { range: [8, 10], color: "green"}
        ],
        threshhold: {
          value: wfreq,
          thickness: 0.70,
          line:{color: "red", width: 4 },          
          }          
        }
      };   
        
    var gaugeData = [gaugeChart];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, height: 500, margin: { t: 0, b: 0 }
     };
   
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
