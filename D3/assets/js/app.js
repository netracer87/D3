// @TODO: YOUR CODE HERE!

// set up svg
var svgWidth = 550;
var svgHeight = 265;

var margin = {
    top: 25,
    right: 10,
    bottom: 40,
    left: 40
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create svg wrapper
var svg = d3.select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);
console.log(svgHeight);
console.log(height);
console.log(svgWidth);
console.log(width);

var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// import data
d3.csv('data.csv').then(function(data){
    console.log(data);
// parse Data
    data.forEach(function(d){
        d.poverty = +d.poverty;
        d.income = +d.income;
        d.obesity = +d.obesity;
        d.smokes = +d.smokes; 
        d.age = +d.age;
        
        d.healthcare = +d.healthcare
    });

    // create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty)-1, d3.max(data, d => d.poverty)+1])
        .range([1, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)+2])
        .range([height, 0])

    // create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes to chart
    chartGroup.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(bottomAxis);
    chartGroup.append('g')
        .call(leftAxis);

    // create circles
    var circlesGroup = chartGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xLinearScale(d.poverty))
            .attr('cy', d => yLinearScale(d.healthcare))
            .attr('r', 18)
            .attr('fill', 'purple')
            .attr('opacity', '.3');
    
     chartGroup.selectAll('.bubbletext')
        .data(data)
        .enter()
        .append('text').text(d => d.abbr)
        .attr('class','bubbletext')
            .attr('x', d => xLinearScale(d.poverty))
            .attr('y', d => yLinearScale(d.healthcare))
            .attr('fill', 'black');

    

    // initialize & call tooltip
    var toolTip = d3.tip()
        .attr('class', 'tooltip')
        .offset([2, -1])
        .html(function(d){
            return (`State: ${d.state}<br>Poverty Rates: ${d.poverty}<br>Healthcare Coverage: ${d.healthcare}`)
        })

    chartGroup.call(toolTip);

    // create event listeners
    circlesGroup.on('mouseover', toolTip.show);
    circlesGroup.on('mouseout', toolTip.hide);

    // create axis labels
    chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0-margin.left)
        .attr('x', 0-(height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Healthcare');
    
    chartGroup.append('text')
        .attr('transform', `translate(${width / 2}, ${height + margin.top + 10})`)
        .attr('class', 'axisText')
        .text('Poverty Rates')
});





