window.onload = start;

function start() {

    var graph = document.getElementById('graph');
    var storyText = document.getElementById('storyText');
    var nextButton = document.getElementById('nextButton');
    var prevButton = document.getElementById('prevButton');

    var width = 800;
    var height = 600;
    var graphNum = 0;

    var svg = d3.select(graph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var xScale = d3.scaleLinear().range([0, width - 50]);
    var yScale = d3.scaleLinear().range([height, 50]);

    d3.csv('aircraft_incidents.csv', function(d) {
        var date = new Date(d.Event_Date);
        date = date.getFullYear();
        d.Event_Date = date;
        d.Total_Uninjured = +d.Total_Uninjured;
        d.Total_Fatal_Injuries = +d.Total_Fatal_Injuries;
        d.Aircraft_Damage = d.Aircraft_Damage;
        return d;
    }, function(error, data) {

        // dictonary for number of crashes per year
        var NumYearCount = {};
        data.forEach(function(r) {
            if (!NumYearCount[r.Event_Date]) {
                NumYearCount[r.Event_Date] = 0;
            }
            NumYearCount[r.Event_Date]++;
        });

        // array for number of crashes per year
        var NumYearCountArray = [];
        Object.keys(NumYearCount).forEach(function(key) {
             NumYearCountArray.push({
                Event_Date: key,
                count: NumYearCount[key]
            });
        });
        
         // dictonary for number of fatalities per year
        var NumFatalitiesCount = {};
        data.forEach(function(r) {
            if (! NumFatalitiesCount[r.Event_Date]) {
                 NumFatalitiesCount[r.Event_Date] = 0;
            }
             NumFatalitiesCount[r.Event_Date] += r.Total_Fatal_Injuries;
        });

        // dictonary for number of uninjured per year
        var NumUninjuredCount = {};
        data.forEach(function(r) {
            if (! NumUninjuredCount[r.Event_Date]) {
                 NumUninjuredCount[r.Event_Date] = 0;
            }
             NumUninjuredCount[r.Event_Date] += r.Total_Uninjured;
        });


        // dictonary for number of crashes per damage type
        var NumDamageCount = {};
        data.forEach(function(r) {
            if (! NumDamageCount[r.Aircraft_Damage]) {
                 NumDamageCount[r.Aircraft_Damage] = 0;
            }
             NumDamageCount[r.Aircraft_Damage]++;
        });

         // array for number of crashes per damage type
        var NumDamageCountArray = [];
        Object.keys(NumDamageCount).forEach(function(key) {
           NumDamageCountArray.push({
                Aircraft_Damage: key,
                count: NumDamageCount[key]
            });
           
        });

        createGraph1();

        d3.select(nextButton)
            .append('button')
            .style("border", "1px solid black")
            .text('Next')
            .on('click', function() {
                if (graphNum == 0) {
                    transitionIncrease();
                    graphNum = 1;
                } else if (graphNum == 1) {
                    resetDots();
                    transitionDecrease();
                    graphNum = 2;
                }      
            });

         d3.select(prevButton)
            .append('button')
            .style("border", "1px solid black")
            .text('Previous')
            .on('click', function() {
                if (graphNum == 1) {
                    resetDots();
                    graphNum = 0;
                } else if (graphNum == 2) {
                    resetDots();
                    transitionIncrease();
                    graphNum = 1;
                }               
            });

            function resetDots() {
                svg.selectAll('.dot')
                    .filter(function(d,i) {
                        return true;
                    })
                    .transition()
                    .duration(function(d) {
                        return d.Event_Date / 2;
                    })
                    .attr('r', 5)
                    .attr("fill", "black")
                    .style("stroke", "black")
                    .style("stroke-width", "1px")
            }


            function createGraph1() {
                xScale.domain([1995, 2016]); // scaled by year
                yScale.domain([0, d3.max(data, function(d) { return NumYearCount[d.Event_Date]; })]); // scaled by date
                
                var dataset = d3.range(22).map(function(d, i) { return {"y": NumYearCountArray[i].count, "Event_Date": +NumYearCountArray[i].Event_Date } })

                // line showing amount of crashes per year
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
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden");
                   

                svg.selectAll(".dot")
                    .data(data)
                        .enter().append("circle") // Uses the enter().append() method
                    .attr("class", "dot") // Assign a class for styl ing
                    .attr("cx", function(d) { return xScale(d.Event_Date) })
                    .attr("cy", function(d) { return yScale(NumYearCount[d.Event_Date]) })
                    .attr("r", 5)
                    .attr('transform', 'translate(30,0)')
                    .on("mouseover", function(d){
                        tooltip.html("Year: " + d.Event_Date + "<br/>Number of Crashes: " + NumYearCount[d.Event_Date] 
                            + "<br/>Number of Fatalities: " + NumFatalitiesCount[d.Event_Date]
                            + "<br/>Total Uninjured: " + NumUninjuredCount[d.Event_Date]);
                        return tooltip.style("visibility", "visible").attr("data-html", "true");})
                    .on("mousemove", function(){return tooltip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");})
                    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
            }

            function transitionIncrease() {
                svg.selectAll('.dot')
                    .filter(function(d,i) {
                        return NumYearCount[d.Event_Date] > NumYearCount[d.Event_Date - 1];
                    })
                    .transition()
                    .duration(function(d) {
                        return d.Event_Date / 2;
                    })
                    .attr('r', function(d) {
                        return 15;
                    })
                    .attr("fill", "#FF9F80")
                    .style("stroke", "black")
                    .style("stroke-width", "1px")
            }

             function transitionDecrease() {
                svg.selectAll('.dot')
                    .filter(function(d,i) {
                        return NumYearCount[d.Event_Date] < NumYearCount[d.Event_Date - 1];
                    })
                    .transition()
                    .duration(function(d) {
                        return d.Event_Date / 2;
                    })
                    .attr('r', function(d) {
                        return 15;
                    })
                    .attr("fill", "#FF9F80")
                    .style("stroke", "black")
                    .style("stroke-width", "1px")
            }
        })
}
