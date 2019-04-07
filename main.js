window.onload = start;

// This is where all of our javascript code resides. This method
// is called by "window" when the document (everything you see on
// the screen) has finished loading.
function start() {
    // Select the graph from the HTML page and save
    // a reference to it for later.
    var graph = document.getElementById('graph');

    // Specify the width and height of our graph
    // as variables so we can use them later.
    // Remember, hardcoding sucks! :)
    var width = 800;
    var height = 600;

    // Here we tell D3 to select the graph that we defined above.
    // Then, we add an <svg></svg> tag inside the graph.
    // On the <svg> element, we set the width and height.
    // Then, we save the reference to this element in the "svg" variable,
    // so we can use it later.
    // 
    // So our code now looks like this in the browser:
    // <svg width="700" height="600">
    // </svg>
    var svg = d3.select(graph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);



    // Remember, "svg" now references to <svg width="700" height="600"></svg>
    // So now we append a group <g></g> tag to our svg element, and return a
    // reference to that and save it in the "bars" variable.
    // 
    // Now bars looks like this:
    // <g></g>
    // 
    // And the svg element in our browser looks like this:
    // <svg width="700" height="600">
    //  <g></g>
    // </svg>
    var bars = svg.append('g');


    var xScale = d3.scaleLinear().range([0, width - 50]);
    var yScale = d3.scaleLinear().range([height, 50]);

    // Tell D3 to create a y-axis scale for us, and orient it to the left.
    // That means the labels are on the left, and tick marks on the right.
    // var yAxis = d3.axisLeft(yScale);

    // Add a button below the graph. Clicking on this button will
    // run a filter on the data and use an animation in the process.
    // 
    // Our HTML will now look like this:
    // <div id="graph">
    //  <svg width="700" height="600">...</svg>
    //  <p>
    //    <button>Filter Data</button>
    //  </p>
    // </div>
 //    var color = 'red';
 //    function colorchange() {
 //    	console.log("Color Change");
	// 	selectValue = d3.select('select').property('value');
	// 	color = selectValue;
	// };
 //    var cutoff = 0.05;
 //    function cutoffchange() {
 //    	console.log("Cutoff Change");
	// 	selectValue = d3.select('input').property('value');
	// 	console.log(selectValue);
	// 	cutoff = selectValue;
	// };
 //    d3.select(graph)
 //        .append('p')
 //        .append('button')
 //            .style("border", "1px solid black")
 //        .text('Filter Data')
 //        .on('click', function() {
 //            bars.selectAll('.bar')
 //                .filter(function(d) {
 //                    return d.frequency > cutoff;
 //                })
 //                .transition()
 //                .duration(function(d) {
 //                    return Math.random() * 1000;
 //                })
 //                .delay(function(d) {
 //                    return d.frequency * 8000
 //                })
 //                .style('fill', color)
 //                .attr('width', function(d) {
 //                    return xScale(d.frequency);
 //                })
 //            bars.selectAll('.bar')
 //                .filter(function(d) {
 //                    return d.frequency < cutoff;
 //                })
 //                .transition()
 //                .duration(function(d) {
 //                    return Math.random() * 1000;
 //                })
 //                .delay(function(d) {
 //                    return d.frequency * 8000
 //                })
 //                .attr('width', function(d) {
 //                    return xScale(0);
 //                })
 //        });

 //    // Add a button to clear the filtered data
 //    d3.select(graph)
 //        .append('p')
 //        .append('button')
 //            .style("border", "1px solid black")
 //        .text('Clear Filter')
 //        .on('click', function(d) {
 //            bars.selectAll('.bar')
 //                .filter(function(d) {
 //                    return d.frequency;
 //                }).transition()
 //                .duration(function(d) {
 //                    return Math.random() * 1000;
 //                })
 //                .delay(function(d) {
 //                    return d.frequency * 8000
 //                })
 //                .style('fill', 'steelblue')
 //                .attr('width', function(d) {
 //                    return xScale(d.frequency);
 //                });
 //        });
 //    // add a list to change the color of the filtered bars

 //    var myData = ["Red", "Yellow", "Green"];
 //    d3.select(graph)
 //        .append('select')
 //            .style("border", "1px solid black")
 //        .on("change", colorchange)
 //        .selectAll("option")
 //        .data(myData)
 //        .enter()
	// 	.append("option")
	// 	.text(function(d) { return d; });
        
	

 //    // add a text box to put the cut off value in
 //    d3.select(graph)
 //     	.append('p')
 //       	.append('lable')
 //       	.text('Cutoff: ')
 //        .append('input')
	//         .style("border", "1px solid black")
	// 	    .attr('type','number')
	// 	    .attr('name','textInput')
	// 	    .attr('value', 0.05)
	// 	    .on("change", cutoffchange)




    // D3 will grab all the data from "data.csv" and make it available
    // to us in a callback function. It follows the form:
    // 
    // d3.csv('file_name.csv', accumulator, callback)
    // 
    // Where 'file_name.csv' - the name of the file to read
    // accumulator - a method with parameter d that lets you pre-process
    //               each row in the CSV. This affects the array of
    //               rows in the function named 'callback'
    //
    // callback - a method with parameters error, data. Error contains
    //            an error message if the data could not be found, or
    //            was malformed. The 'data' parameter is an array of
    //            rows returned after being processed by the accumulator.
    d3.csv('aircraft_incidents.csv', function(d) {
        var date = new Date(d.Event_Date);
        date = date.getFullYear();
        d.Event_Date = date;
        d.Total_Uninjured = +d.Total_Uninjured;
        d.Total_Fatal_Injuries = +d.Total_Fatal_Injuries;
        d.Aircraft_Damage = d.Aircraft_Damage;
        return d;
    }, function(error, data) {
        // We now have the "massaged" CSV data in the 'data' variable.
        
        // We set the domain of the xScale. The domain includes 0 up to
        // the maximum frequency in the dataset. This is because 

        var NumYearCount = {};
        data.forEach(function(r) {
            if (!NumYearCount[r.Event_Date]) {
                NumYearCount[r.Event_Date] = 0;
            }
            NumYearCount[r.Event_Date]++;
        });

        var NumYearCountArray = [];
        Object.keys(NumYearCount).forEach(function(key) {
             NumYearCountArray.push({
                Event_Date: key,
                count: NumYearCount[key]
            });
        });
        
        var NumDamageCount = {};
        data.forEach(function(r) {
            if (! NumDamageCount[r.Aircraft_Damage]) {
                 NumDamageCount[r.Aircraft_Damage] = 0;
            }
             NumDamageCount[r.Aircraft_Damage]++;
        });
        var NumDamageCountArray = [];
        Object.keys(NumDamageCount).forEach(function(key) {
           NumDamageCountArray.push({
                Aircraft_Damage: key,
                count: NumDamageCount[key]
            });
           
        });

        xScale.domain([1995, 2016]);
        yScale.domain([0, d3.max(data, function(d) { return NumYearCount[d.Event_Date]; })]);
        
        var dataset = d3.range(22).map(function(d, i) { return {"y": NumYearCountArray[i].count, "Event_Date": +NumYearCountArray[i].Event_Date } })

        var valueline = d3.line()
            .x(function(d) { return xScale(d.Event_Date); })
            .y(function(d) { return yScale(d.y); })
            .curve(d3.curveMonotoneX);


        svg.append("path")
          .datum(dataset)
          .attr("class", "line")
          .style("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 5)
          .attr('transform', 'translate(30,0)')
          .attr("d", valueline);

        // Add the X Axis
        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(30," + (height - 20) + ")")
           .call(d3.axisBottom(xScale)
                    .ticks(22)
                    .tickFormat(d3.format("d")));
           

        // Add the Y Axis
        svg.append("g")
           .style("fill", "black")
           .attr("class", "y axis")
           .attr('transform', 'translate(30,-20)')
           .call(d3.axisLeft(yScale)
                    .ticks(15));

        var tooltip = d3.select("#graph")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden");
            //.text(function(d) { return NumYearCount[d.Event_Date] });
        
        svg.selectAll(".dot")
            .data(data)
                .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styl ing
            .attr("cx", function(d) { return xScale(d.Event_Date) })
            .attr("cy", function(d) { return yScale(NumYearCount[d.Event_Date]) })
            .attr("r", 5)
            .attr('transform', 'translate(30,0)')
            .on("mouseover", function(d){
                tooltip.text("Number of Crashes: " + NumYearCount[d.Event_Date])
                return tooltip.style("visibility", "visible");})
            .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
            })
}
