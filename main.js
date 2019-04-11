window.onload = start;

function start() {

    var graph = document.getElementById('graph');
    var graph2 = document.getElementById('graph2');
    var storyText = document.getElementById('storyText');
    var nextButton = document.getElementById('nextButton');
    var prevButton = document.getElementById('prevButton');

    var width = 800;
    var height = 500;
    var graphNum = 0;

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

        CreateGraph1()
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
                } else if (graphNum == 2) {
                    resetDots();
                    transitionIncrease();
                    graphNum = 1;
                } else if (graphNum == 3) {
                    resetSVG();
                    CreateGraph1();
                    transitionDecrease();
                    graphNum = 2;
                } else if (graphNum == 4) {
                    resetSVG();
                    CreateGraph2();
                    CreateGraph3();
                    graphNum = 3;
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
                } else if (graphNum == 1) {
                    resetDots();
                    transitionDecrease();
                    graphNum = 2;
                } else if (graphNum == 2) {
                    resetSVG();
                    CreateGraph2();
                    CreateGraph3();
                    graphNum = 3;
                } else if (graphNum == 3) {
                    d3.select(nextButton).style("visibility", "hidden");
                    resetSVG();
                    CreateGraph4();
                    graphNum = 4;
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
                            var moveX = d.x - 200;
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
                        tooltip.html("Year: " + d.data.Event_Date + "<br/>Total Uninjured: " + d.data.count 
                            + "<br/> Total Fatalities:" + NumFatalitiesCount[d.data.Event_Date])
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
                        tooltip.html("Year: " + d.data.Event_Date + "<br/>Total Uninjured: " + d.data.count 
                            + "<br/> Total Fatalities:" + NumFatalitiesCount[d.data.Event_Date]);
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
                        .sum(function(d) { return NumUninjuredCount[d.Event_Date]; });

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
                            var moveX = d.x - 200;
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
                        tooltip.html("Year: " + d.data.Event_Date + "<br/>Total Fatalities: " + d.data.count 
                            + "<br/> Total Uninjured :" + NumUninjuredCount[d.data.Event_Date]);
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
                        tooltip.html("Year: " + d.data.Event_Date + "<br/>Total Fatalities: " + d.data.count 
                            + "<br/> Total Uninjured :" + NumUninjuredCount[d.data.Event_Date]);
                            return tooltip.style("visibility", "visible").attr("data-html", "true");})
                        .on("mousemove", function(){return tooltip.style("top", (event.pageY - 30)+"px").style("left",(event.pageX + 20)+"px");})
                        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
                        

                d3.select(self.frameElement)
                        .style("height", width + "px");
                    
                
                    }

            function CreateGraph4() {
                //d3.selectAll(graph).selectAll("*").remove();
                xScale.domain([1995, 2016]); // scaled by year
                //yScale.domain([0, d3.max(data, function(d) { return NumDamageMinorCount[d.Event_Date]; })]); // scaled by date

                yScale.domain([0, d3.max(data, function(d) { return NumDamageMinorCount[d.Event_Date]; })]);
                
                var datasetMinor = d3.range(22).map(function(d, i) { return {"y": NumDamageMinorCountArray[i].count, "Event_Date": 
                    + NumDamageMinorCountArray[i].Event_Date } })

                var datasetDestroyed = d3.range(22).map(function(d, i) { return {"y": NumDamageDestroyedCountArray[i].count, "Event_Date": 
                    + NumDamageDestroyedCountArray[i].Event_Date } })

                // line showing amount of crashes per year
                var valueline = d3.line()
                    .x(function(d) { return xScale(d.Event_Date); })
                    .y(function(d) { return yScale(d.y); })
                    .curve(d3.curveMonotoneX);

                var valueline2 = d3.line()
                    .x(function(d) { return xScale(d.Event_Date); })
                    .y(function(d) { return yScale(d.y); })
                    .curve(d3.curveMonotoneX);


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
                    .attr("cy", function(d) { return yScale(NumDamageDestroyedCount[d.Event_Date]) })
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
                    .attr("cy", function(d) { return yScale(NumDamageMinorCount[d.Event_Date]) })
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
