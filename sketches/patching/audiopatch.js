let patch = {
    oscillator: new Tone.Oscillator(440, "sawtooth").start(),
    gain: new Tone.Gain(0),
    filter: new Tone.Filter(200, "lowpass"),
    delay: new Tone.FeedbackDelay(0.5),
    output: new Tone.Gain(0)
}



let connections = [['oscillator', 'gain'], ['gain', 'filter'], ['filter', 'delay'], ['delay', 'output']];

connections.forEach(function (connection) {
    if(connection[1] == 'output') {
        patch[connection[0]].toDestination();
        
    } else {
        patch[connection[0]].connect(patch[connection[1]]);    
    }
    
})

const svg = d3.select("svg");

svg.selectAll("rect")
    .data(Object.keys(patch))
    .enter()
    .append("rect")
    .attr("y", function(d, i) { return i * 100 + 10; })
    .attr("x", 10)
    .attr("width", 80)
    .attr("height", 80)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("class", function(d, i) { return Object.keys(patch)[i]; })
    .on("click", function(d, i) { 
        if (Object.keys(patch)[i] == 'oscillator') {
            patch[Object.keys(patch)[i]].start();
        }
    })    
    
svg.selectAll("text")
    .data(Object.keys(patch))
    .enter()
    .append("text")
    .attr("y", function(d, i) { return i * 100 + 60; })
    .attr("x", 50)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .text(function(d, i) { return Object.keys(patch)[i]; })
    
svg.selectAll("line")
    .data(connections)
    .enter()
    .append("line")
    .attr("x1", function(d, i) { return parseInt(svg.selectAll("rect").filter("." + d[0]).attr("x")) + 40; })
    .attr("y1", function(d, i) { return parseInt(svg.selectAll("rect").filter("." + d[0]).attr("y")) + 80; })
    .attr("x2", function(d, i) { return parseInt(svg.selectAll("rect").filter("." + d[1]).attr("x")) + 40; })
    .attr("y2", function(d, i) { return parseInt(svg.selectAll("rect").filter("." + d[1]).attr("y")); })
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("marker-end", "url(#arrowhead)");
    
const drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
    
svg.selectAll("rect").call(drag);

function dragstarted(d) {
    d3.select(this).raise().classed("active", true);
}

function dragged(d) {
    console.log(d3.event.x, d3.event.y)
    d3.select(this).attr("x", d3.event.x - 40).attr("y", d3.event.y - 40);
    svg.selectAll("line").filter(function(e, i) { return e[0] == d; })
        .attr("x1", d3.event.x).attr("y1", d3.event.y);
    svg.selectAll("line").filter(function(e, i) { return e[1] == d; })
        .attr("x2", d3.event.x).attr("y2", d3.event.y);
    svg.selectAll("text").filter(function(e, i) { return e == d; })
        .attr("x", d3.event.x + 40).attr("y", d3.event.y + 40);
}

function dragended(d) {
    d3.select(this).classed("active", false);
}

