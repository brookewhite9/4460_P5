window.onload = start;

function start() {

    var graph = document.getElementById('graph');
    var graph2 = document.getElementById('graph2');
    var nextButton = document.getElementById('nextButton');
    var prevButton = document.getElementById('prevButton');

    var width = 700;
    var height = 500;
    var graphNum = 0;

    var textStuff = ["Ever since the Wright brothers decided to take the world into the skies in the early 1900s, aviation has been a major industry for transportation and entertainment alike." 
                        + " On any given day around eight million people fly on an airplane and each year companies work to develop new components designed to improve the experience of flying." 
                        + " Unfortunately, as with every advancement of technology, the miraculous benefits of such creation are sprinkled with instances of devastating failure." 
                        + " To help better understand the distribution of airplane related accidents over the years, below is a graph of reported incidents that occured from 1995 through 2016." 
                        + " This line graph aids showing changes in the data over time. As you can see, there are many peaks and valleys in the number of reported incidents over the years." 
                        + " Click “Next” to explore this data more.",
                    "First, let’s look at the intervals where the number of reported airplane related incidents increases from the past year." 
                        + " On the graph, data points that increase from the previous year are highlighted." 
                        + " There are many spikes in the data with most being gradual increases, however 2004-2005 and 2009-2010 stand out in particular as they feature the most drastic inclines over a year." 
                        + " The largest increase in data occurs from 2009 to 2010 with a difference of 34 reported incidents and the year with the most amount of accidents overall is 2011." 
                        + " One would think that the number of accidents should be a steady decline throughout the years as technology improves, but the data shows much fluctuation." 
                        + " This could be because modern communication and record-keeping is far superior to that in the past which enables more records to be kept for even the least significant incident." 
                        + " In the past, they may have focused documenting critical accidents that resulted in high fatalities." 
                        + " We will examine this more later. Another possible explanation is the public’s comfort with flying now and our need for transportation." 
                        + " The increased need for commercial airlines flying both passengers and goods across the country could result in more accidents.",
                    "In this graph the declines in reports from year to year are highlighted." 
                        + " Unlike the increases in reports that typically appeared in over the span of a year and then began to decline again, the decreases over the years appear to cluster into steady declines over multiple years."
                        + " The most drastic decrease is obviously from 2015 to 2016 with a difference of 56 incidents and, although it features a much smaller difference, there is a sharp decline from 2012 to 2013 also." 
                        + " The year 2016 has the fewest reports out of all the data. As this year was the last point following a downward trend starting in 2011, the small amount of reported accidents could be caused by an initiative to prevent crashes, more thorough safety requirements, or new technology.",
                    "In order to better visualize the differences in total fatalities versus total uninjured per year, these bubble clusters display each attribute in an easily comparable way." 
                        + " To the left, you can see the number of fatalities each year which is shown by the size of the bubble. The years in large bubbles had the most fatalities while those in the smaller ones had few." 
                        + " The right visual operates in a similar way, however, it depicts total uninjured per year. You can click on the colorful part of each bubble to highlight that year’s data in both visualizations so the reported fatalities versus uninjured for that year can be compared." 
                        + " Recall that 2011 has the most reports of incidents over all the years. If you select the associated bubble, you can see that there were substantially fewer fatailites than uninjured." 
                        + " This implies that although there were more accidents that year, most were minor and resulted in a relatively safe return to ground." 
                        + " It can also be observed from these visualizations that 2016 had the least amount of uninjured of all the years, however this could be attributed to it having the fewest accident reports which we learned from the previous graph.",
                    "This final graph provides a way to compare the number of accidents that resulted in a destroyed aircraft versus the number that only took minor damage over the years." 
                        + " The top blue line represents the number of incidents with minor damage while the lower red line shows the number of accidents that led to the complete destruction of the plane." 
                        + " According to this visualization, 2010 has the most minor damage reports while 1999 has the most incidents that resulted in a destroyed aircraft." 
                        + " It comes as no surprise that the year 2016 has the least amount of reports of both minor and destroyed accidents. It is interesting, however, that the lines follow a similar pattern if you compare the blue line on this graph to that of the first graph shown." 
                        + " This relationship could be attributed to the fact that most reports that make up the data are minor damage. The main structure of the first visualization showing overall reports could be primarily showing the instances of minor damage as they would have the most influence with their large number of occurrences."]

    var svg = d3.select(graph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var svg2 = d3.select(graph2)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr("class", "bubble");

    var xScale = d3.scaleLinear().range([0, width - 50]);
    var yScale = d3.scaleLinear().range([height, 50]);
    var yScale2 = d3.scaleLinear().range([height, 50]);

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

        // array for number of fatalities per year
        var NumFatalitiesCountArray = [];
        Object.keys(NumFatalitiesCount).forEach(function(key) {
             NumFatalitiesCountArray.push({
                Event_Date: key,
                count: NumFatalitiesCount[key]
            });
        });

        // dictonary for number of uninjured per year
        var NumUninjuredCount = {};
        data.forEach(function(r) {
            if (! NumUninjuredCount[r.Event_Date]) {
                 NumUninjuredCount[r.Event_Date] = 0;
            }
             NumUninjuredCount[r.Event_Date] += r.Total_Uninjured;
        });

         // array for number of uninjured people per year
        var NumUninjuredCountArray = [];
        Object.keys(NumUninjuredCount).forEach(function(key) {
             NumUninjuredCountArray.push({
                Event_Date: key,
                count: NumUninjuredCount[key]
            });
        });


        // dictonary for number of crashes per destroyed type
        var NumDamageDestroyedCount = {};
        data.forEach(function(r) {
            if (! NumDamageDestroyedCount[r.Event_Date]) {
                 NumDamageDestroyedCount[r.Event_Date] = 0;
            }
            if (r.Aircraft_Damage == "Destroyed") {
                NumDamageDestroyedCount[r.Event_Date]++;
            }
        });

         // array for number of crashes per destroyed type
        var NumDamageDestroyedCountArray = [];
        Object.keys(NumDamageDestroyedCount).forEach(function(key) {
           NumDamageDestroyedCountArray.push({
                Event_Date: key,
                count: NumDamageDestroyedCount[key]
            });
           
        });

        console.log(NumDamageDestroyedCountArray);

        // dictonary for number of crashes per minor type
        var NumDamageMinorCount = {};
        data.forEach(function(r) {
            if (! NumDamageMinorCount[r.Event_Date]) {
                 NumDamageMinorCount[r.Event_Date] = 0;
            }
            if (r.Aircraft_Damage == "Minor") {
               NumDamageMinorCount[r.Event_Date]++;
            }
        });

         // array for number of crashes per destroyed type
        var NumDamageMinorCountArray = [];
        Object.keys(NumDamageMinorCount).forEach(function(key) {
           NumDamageMinorCountArray.push({
                Event_Date: key,
                count: NumDamageMinorCount[key]
            });
           
        });

        console.log(NumDamageMinorCountArray);

        CreateGraph1();
        d3.select('#storyText')
          .text(textStuff[0]);
        //CreateGraph2();
        //CreateGraph3();

        d3.select(prevButton)
            .append('button')
            .style("border", "1px solid black")
            .text('Previous')
            .on('click', function() {
                d3.select(nextButton).style("visibility", "visible");
                if (graphNum == 1) {
                    d3.select(prevButton).style("visibility", "hidden");
                    resetDots();
                    graphNum = 0;
                    d3.select('#storyText')
                      .text(textStuff[0]);
                } else if (graphNum == 2) {
                    resetDots();
                    transitionIncrease();
                    graphNum = 1;
                    d3.select('#storyText')
                      .text(textStuff[1]);
                } else if (graphNum == 3) {
                    resetSVG();
                    CreateGraph1();
                    transitionDecrease();
                    graphNum = 2;
                    d3.select('#storyText')
                      .text(textStuff[2]);
                } else if (graphNum == 4) {
                    resetSVG();
                    CreateGraph2();
                    CreateGraph3();
                    graphNum = 3;
                    d3.select('#storyText')
                      .text(textStuff[3]);
                }               
            });

        d3.select(prevButton).style("visibility", "hidden");

        d3.select(nextButton)
            .append('button')
            .style("border", "1px solid black")
            .text('Next')
            .on('click', function() {
                d3.select(prevButton).style("visibility", "visible");
                if (graphNum == 0) {  
                    transitionIncrease();
                    graphNum = 1;
                    d3.select('#storyText')
                      .text(textStuff[1]);
                } else if (graphNum == 1) {
                    resetDots();
                    transitionDecrease();
                    graphNum = 2;
                    d3.select('#storyText')
                      .text(textStuff[2]);
                } else if (graphNum == 2) {
                    resetSVG();
                    CreateGraph2();
                    CreateGraph3();
                    graphNum = 3;
                    d3.select('#storyText')
                      .text(textStuff[3]);
                } else if (graphNum == 3) {
                    d3.select(nextButton).style("visibility", "hidden");
                    resetSVG();
                    CreateGraph4();
                    graphNum = 4;
                    d3.select('#storyText')
                      .text(textStuff[4]);
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

            function resetSVG() {
                svg.selectAll("*").remove();
                svg2.selectAll("*").remove();   
            }


            function CreateGraph1() {
                //d3.selectAll(graph).selectAll("*").remove();
                xScale.domain([1995, 2016]); // scaled by year
                yScale.domain([0, d3.max(data, function(d) { return NumYearCount[d.Event_Date]; })]); // scaled by date
                
                var dataset = d3.range(22).map(function(d, i) { return {"y": NumYearCountArray[i].count, "Event_Date": +NumYearCountArray[i].Event_Date } })

                // line showing amount of crashes per year
                var valueline = d3.line()
                    .x(function(d) { return xScale(d.Event_Date); })
                    .y(function(d) { return yScale(d.y) - 20; })
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
                    .attr("cy", function(d) { return yScale(NumYearCount[d.Event_Date]) - 20 })
                    .attr("r", 5)
                    .attr('transform', 'translate(30,0)')
                    .on("mouseover", function(d){
                        tooltip.html("Year: " + d.Event_Date + "<br/>Number of Crashes: " + NumYearCount[d.Event_Date] 
                            + "<br/>Number of Fatalities: " + NumFatalitiesCount[d.Event_Date]
                            + "<br/>Total Uninjured: " + NumUninjuredCount[d.Event_Date]);
                        return tooltip.style("visibility", "visible").attr("data-html", "true");})
                    .on("mousemove", function(){return tooltip.style("top", (event.pageY - 30)+"px").style("left",(event.pageX)+"px");})
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

            function CreateGraph2() {
                d3.selectAll(graph).selectAll("*").remove();
                //console.log(NumUninjuredCount);
                var rolledData = d3.nest()
                    .key(function(d) { return d.Event_Date})
                    .rollup(function(d){
                        return d3.sum(d, function(d) { return NumUninjuredCount[d.Event_Date];});
                    }).entries(data);
                
                var newData = {"name": "root", "children": {}}
                NumUninjuredCountArray.forEach(function (d) {
                    if (typeof newData.children[d.Event_Date] !== 'undefined') {
                        newData.children[d.Event_Date].children.push(d)
                    } else {
                        newData.children[d.Event_Date] = {"name": d.Event_Date, "children": [d]}
                    }
                })
                newData.children = Object.keys(newData.children).map(function (key) {
                    return newData.children[key];
                });
                //console.log(newData);
                var color = d3.scaleOrdinal(d3.schemeCategory20);

                var bubble = d3.pack(newData)
                        .size([width, height])
                        .padding(0);

                svg = d3.select("svg")
                        .attr("width", width)
                        .attr("height", width)
                        .attr("class", "bubble");


                var nodes = d3.hierarchy(newData)
                        .sum(function(d) { return NumUninjuredCount[d.Event_Date]; });

                //console.log(nodes);

                var node = svg.selectAll(".node")
                        .data(bubble(nodes).descendants())
                        .enter()
                        .filter(function(d){
                            return  !d.children
                        })
                        .append("g")
                        .attr("class", "node")
                        .attr("transform", function(d) {
                            var moveX = d.x - 150;
                            return "translate(" + moveX + "," + d.y + ")";
                        });
                

                node.append("title")
                        .text(function(d) {
                            return d.data.Event_Date + ": " + d.data.count;
                        });

                var tooltip = d3.select("#graph")
                    .append("div")
                    .attr("class", "tooltip2")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden");

                node.append("circle")
                        .attr("r", function(d) {
                            return d.r;
                        })
                        .style("fill", function(d,i) {
                            return color(i);
                        })
                        .on("mouseover", function(d){
                        tooltip.html("Year: " + d.data.Event_Date + "<br/>Total Uninjured: " + d.data.count)
                            return tooltip.style("visibility", "visible").attr("data-html", "true");})
                        .on("mousemove", function(){return tooltip.style("top", (event.pageY - 30)+"px").style("left",(event.pageX)+"px");})
                        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
                        .on("click", function(d,i){ 
                            d3.select(graph).selectAll('circle')
                                .classed('selected', function(m) {
                                    return (false);
                                })
                                .classed('selected2', function(m) {
                                    return (false);
                                })
                            d3.select(graph2).selectAll('circle')
                                .classed('selected', function(m) {
                                    return (false);
                                })
                                .classed('selected2', function(m) {
                                    return (false);
                                })
                            d3.select(this)
                                .classed('selected', true); 
                            d3.select(graph2).selectAll('circle')
                                .classed('selected', function(m) {
                                  return (d.data.Event_Date == m.data.Event_Date);
                        });
                    });

                

                node.append("text")
                        .attr("dy", ".3em")
                        .style("text-anchor", "middle")
                        .html(function(d) {
                            return d.data.Event_Date.substring(0, d.r / 3);
                        })
                        .on("mouseover", function(d){
                        tooltip.html("Year: " + d.data.Event_Date + "<br/>Total Uninjured: " + d.data.count);
                            return tooltip.style("visibility", "visible").attr("data-html", "true");})
                        .on("mousemove", function(){return tooltip.style("top", (event.pageY - 30)+"px").style("left",(event.pageX)+"px");})
                        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});                        

                d3.select(self.frameElement)
                        .style("height", width + "px");
                    
                
            }

            function CreateGraph3() {
                //d3.selectAll(graph).selectAll("*").remove();
                //console.log(NumUninjuredCount);
                var rolledData = d3.nest()
                    .key(function(d) { return d.Event_Date})
                    .rollup(function(d){
                        return d3.sum(d, function(d) { return NumFatalitiesCount[d.Event_Date];});
                    }).entries(data);
                
                var newData = {"name": "root", "children": {}}
                NumFatalitiesCountArray.forEach(function (d) {
                    if (typeof newData.children[d.Event_Date] !== 'undefined') {
                        newData.children[d.Event_Date].children.push(d)
                    } else {
                        newData.children[d.Event_Date] = {"name": d.Event_Date, "children": [d]}
                    }
                })
                newData.children = Object.keys(newData.children).map(function (key) {
                    return newData.children[key];
                });
                //console.log(newData);
                var color = d3.scaleOrdinal(d3.schemeCategory20);

                var bubble = d3.pack(newData)
                        .size([width, height])
                        .padding(0);

                // svg2 = d3.select(graph2)
                //         .append("svg")
                //         .attr("width", width)
                //         .attr("height", height)
                //         .attr("class", "bubble");


                var nodes = d3.hierarchy(newData)
                        .sum(function(d) { return NumFatalitiesCount[d.Event_Date]; });

                //console.log(nodes);

                var node = svg2.selectAll(".node")
                        .data(bubble(nodes).descendants())
                        .enter()
                        .filter(function(d){
                            return  !d.children
                        })
                        .append("g")
                        .attr("class", "node")
                        .attr("transform", function(d) {
                            var moveX = d.x - 100;
                            return "translate(" + moveX + "," + d.y + ")";
                        });
                

                node.append("title")
                        .text(function(d) {
                            return d.data.Event_Date + ": " + d.data.count;
                        });

                var tooltip = d3.select("#graph")
                    .append("div")
                    .attr("class", "tooltip2")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden");

                node.append("circle")
                        .attr("r", function(d) {
                            return d.r;
                        })
                        .style("fill", function(d,i) {
                            return color(i);
                        })
                        .on("mouseover", function(d){
                        tooltip.html("Year: " + d.data.Event_Date + "<br/>Total Fatalities: " + d.data.count);
                            return tooltip.style("visibility", "visible").attr("data-html", "true");})
                        .on("mousemove", function(){return tooltip.style("top", (event.pageY - 30)+"px").style("left",(event.pageX)+"px");})
                        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
                        .on("click", function(d,i){ 
                            d3.select(graph2).selectAll('circle')
                                .classed('selected2', function(m) {
                                    return (false);
                                })
                                .classed('selected', function(m) {
                                    return (false);
                                })
                            d3.select(graph).selectAll('circle')
                                .classed('selected', function(m) {
                                    return (false);
                                })
                                .classed('selected2', function(m) {
                                    return (false);
                                })
                            d3.select(this)
                                .classed('selected2', true); 
                            d3.select(graph).selectAll('circle')
                                .classed('selected2', function(m) {
                                  return (d.data.Event_Date == m.data.Event_Date);
                        });
                    });

                

                node.append("text")
                        .attr("dy", ".3em")
                        .style("text-anchor", "middle")
                        .html(function(d) {
                            return d.data.Event_Date.substring(0, d.r / 3);
                        })
                        .on("mouseover", function(d){
                        tooltip.html("Year: " + d.data.Event_Date + "<br/>Total Fatalities: " + d.data.count);
                            return tooltip.style("visibility", "visible").attr("data-html", "true");})
                        .on("mousemove", function(){return tooltip.style("top", (event.pageY - 30)+"px").style("left",(event.pageX + 20)+"px");})
                        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
                        

                d3.select(self.frameElement)
                        .style("height", width + "px");
                    
                
                    }

            function CreateGraph4() {
                d3.select('#storyText')
                  .text(textStuff[4]);
                //d3.selectAll(graph).selectAll("*").remove();
                xScale.domain([1995, 2016]); // scaled by year
                //yScale.domain([0, d3.max(data, function(d) { return NumDamageMinorCount[d.Event_Date]; })]); // scaled by date

                yScale.domain([0, d3.max(data, function(d) { return NumDamageMinorCount[d.Event_Date]; })]);
                
                var datasetMinor = d3.range(22).map(function(d, i) { return {"y": NumDamageMinorCountArray[i].count, "Event_Date": 
                    + NumDamageMinorCountArray[i].Event_Date } })

                var datasetDestroyed = d3.range(22).map(function(d, i) { return {"y": NumDamageDestroyedCountArray[i].count, "Event_Date": 
                    + NumDamageDestroyedCountArray[i].Event_Date } })

                var area = d3.area()
                    .x(function(d) { return xScale(d.Event_Date); })
                    .y0(height - 20)
                    .y1(function(d) { return yScale(d.y) - 20; });

                // line showing amount of crashes per year
                var valueline = d3.line()
                    .x(function(d) { return xScale(d.Event_Date); })
                    .y(function(d) { return yScale(d.y) - 20; })
                    .curve(d3.curveMonotoneX);

                var valueline2 = d3.line()
                    .x(function(d) { return xScale(d.Event_Date); })
                    .y(function(d) { return yScale(d.y) - 20; })
                    .curve(d3.curveMonotoneX);

                svg.append("path")
                   .datum(datasetMinor)
                   .attr("class", "area")
                   .attr("d", area)
                   .attr('transform', 'translate(30,0)')
                   .style("fill", "lightsteelblue");    

                svg.append("path")
                  .datum(datasetMinor)
                  .attr("class", "line")
                  .style("fill", "none")
                  .attr("stroke", "steelblue")
                  .attr("stroke-width", 5)
                  .attr('transform', 'translate(30,0)')
                  .attr("d", valueline);

                svg.append("path")
                   .datum(datasetDestroyed)
                   .attr("class", "area")
                   .attr('transform', 'translate(30,0)')
                   .style("fill", "coral")
                   .attr("d", area);    

                svg.append("path")
                  .datum(datasetDestroyed)
                  .attr("class", "line")
                  .style("fill", "none")
                  .attr("stroke", "red")
                  .attr("stroke-width", 5)
                  .attr('transform', 'translate(30,0)')
                  .attr("d", valueline2);

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
                    .attr("cy", function(d) { return yScale(NumDamageDestroyedCount[d.Event_Date]) - 20 })
                    .attr("r", 5)
                    .attr('transform', 'translate(30,0)')
                    .on("mouseover", function(d){
                        tooltip.html("Year: " + d.Event_Date + "<br/>Number of Crashes: " + NumYearCount[d.Event_Date] 
                            + "<br/>Destroyed Total: " + NumDamageDestroyedCount[d.Event_Date]
                            + "<br/>Minor Damage Total: " + NumDamageMinorCount[d.Event_Date]);
                        return tooltip.style("visibility", "visible").attr("data-html", "true");})
                    .on("mousemove", function(){return tooltip.style("top", (event.pageY - 30)+"px").style("left",(event.pageX)+"px");})
                    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});


                svg.selectAll(".dot2")
                    .data(data)
                        .enter().append("circle") // Uses the enter().append() method
                    .attr("class", "dot2") // Assign a class for styl ing
                    .attr("cx", function(d) { return xScale(d.Event_Date) })
                    .attr("cy", function(d) { return yScale(NumDamageMinorCount[d.Event_Date]) - 20 })
                    .attr("r", 5)
                    .attr('transform', 'translate(30,0)')
                    .on("mouseover", function(d){
                        tooltip.html("Year: " + d.Event_Date + "<br/>Number of Crashes: " + NumYearCount[d.Event_Date] 
                            + "<br/>Destroyed Total: " + NumDamageDestroyedCount[d.Event_Date]
                            + "<br/>Minor Damage Total: " + NumDamageMinorCount[d.Event_Date]);
                        return tooltip.style("visibility", "visible").attr("data-html", "true");})
                    .on("mousemove", function(){return tooltip.style("top", (event.pageY - 70)+"px").style("left",(event.pageX)+"px");})
                    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

                
            }

        })
}
