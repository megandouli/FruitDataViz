var dict = {
    apple: "#dd0a35",
    banana: "#fff591",
    blueberry: "#3e64ff",
    cherry: "#c02739",
    grape: "#9656a1",
    orange: "#ff9234",
    peach: "#ffa372",
    pear: "#ecde6d",
    pineapple: "#e3b04b",
    pomegranate: "#db3056",
    raspberry: "#ca2374",
    strawberry: "#ed4255",
    watermelon: "#fe583f"
};

var data = [
    {
        name: "apple", water: 86.2, protein: 0.6,
        fat: 0.5, sugars: 11.6, fiber: 2.5
    },
    {
        name: "banana", water: 75.0, protein: 1.2,
        fat: 0.1, sugars: 18.1, fiber: 2.6
    },
    {
        name: "blueberry", water: 85.7, protein: 0.9,
        fat: 0.2, sugars: 9.1, fiber: 3.0
    },
    {
        name: "cherry", water: 82.25, protein: 1.06,
        fat: 0.2, sugars: 12.82, fiber: 2.1
    },
    {
        name: "grape", water: 81.1, protein: 0.6,
        fat: 0.1, sugars: 17.0, fiber: 1.9
    },
    {
        name: "orange", water: 87.0, protein: 0.8,
        fat: 0.2, sugars: 8.2, fiber: 2.9
    },
    {
        name: "peach", water: 88.3, protein: 0.91,
        fat: 0.27, sugars: 8.39, fiber: 1.5
    },
    {
        name: "pear", water: 85.2, protein: 0.3,
        fat: 0.1, sugars: 10.9, fiber: 4.3
    },
    {
        name: "pineapple", water: 86.0, protein: 0.54,
        fat: 0.12, sugars: 9.85, fiber: 1.4
    },
    {
        name: "pomegranate", water: 77.93, protein: 1.67,
        fat: 1.17, sugars: 13.67, fiber: 4
    },
    {
        name: "raspberry", water: 85.75, protein: 1.2,
        fat: 0.65, sugars: 4.42, fiber: 6.5
    },
    {
        name: "strawberry", water: 91.6, protein: 0.6,
        fat: 0.5, sugars: 6.1, fiber: 4.8
    },
    {
        name: "watermelon", water: 91.45, protein: 0.61,
        fat: 0.15, sugars: 6.2, fiber: 0.4
    }
];

// setting up a div which will be our tooltip
var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#DDDDDD")
    .style("padding", "10px")
    .text("");


var allFruits = d3.selectAll('.fruit-img-container')
    .on("click", function () {
        // on click, turn all the fruits to half opacity and
        // remove the "selected" class
        d3.selectAll('.fruit-img-container')
            .style("opacity", 0.5)
            .classed("selected", false);

        // the fruit that was clicked on gets an opacity of 1
        // and gets the "selected" class name
        d3.select(this)
            .style("opacity", 1.0)
            .classed("selected", true);
        // display the name of the selected fruit
        fillText();
        // create a donut chart
        makeDonut();
        scrollToChart();

    }).on("mouseover", function () {
        // the fruit we're mousing over gets opacity of 1
        d3.select(this)
            .style("opacity", 1.0);
        // change the fruit name displayed to be the one the
        // mouse is hovering ove
        d3.select("#selected-fruit-name")
            .text(this.id)
            .style("color", dict[this.id])
    }).on("mouseout", function () {
        // as long as we're not mousing out of the currently selected
        // fruit, we'll change its opacity back to 0.5
        if (!d3.select(this).classed("selected")) {
            d3.select(this)
            .style("opacity", 0.5);
        }
        fillText();
    });

var selectedFruits = document.getElementsByClassName('selected');

// a function that grabs the id of the currently selected fruit
// and puts its name in an h2 placeholder
function fillText() {
    // recalculate selectedFruits since it would've changed if
    // a fruit was clicked
    selectedFruits = document.getElementsByClassName('selected');
    // if there are no selected fruits or if all the fruits are selected,
    // we don't have a single name to show so we have ""
    if (selectedFruits.length != 1) {
        d3.select("#selected-fruit-name")
            .text("");
    } else {
        var selected = selectedFruits[0];
        d3.select(selected)
            .style("opacity", 1.0);
        d3.select("#selected-fruit-name")
            .text(selected.id)
            .style("color", dict[selected.id]);
    }
}

var width = window.innerWidth * 0.75;
var height = window.innerHeight * 0.75;
var margin = 100;

// a method that returns the fruit object with name equal
// to the given name
function findObject(nameToFind) {
    var objToFind;
    // look through the data array to find the matching object
    data.forEach(function (obj) {
        if (obj.name === nameToFind) {
            objToFind = obj;
        }
    });
    return objToFind;
}

function makeDonut() {
    d3.selectAll("svg").remove();

    var svg = d3.select("#chart")
    .style("width", "fit-content")
    .style("margin", "auto")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 3 + ")");

    var selected = selectedFruits[0];
    var selectedName = selected.id;

    var fruitObj = findObject(selectedName);

    // for creating a color scale
    var fruitObjKeys = Object.keys(fruitObj);
    // remove the first object which is the name of the fruit
    // that way we're left with just the numeric data
    fruitObjKeys.shift();

    var fruitObjEntries = d3.entries(fruitObj);
    // similarly, remove the first item so we don't
    // have the name of the fruit in the donut chart
    fruitObjEntries.shift();

    var radius = Math.min(width, height * 0.7) / 2 - margin;
    var colorScale = d3.scaleOrdinal()
        .domain(fruitObjKeys)
        .range(["#8ed6ff", "#c6cfff", "#ffd868", "#ffffff", "#a7e9af"]);

    var pie = d3.pie()
        .value(function (d) { return d.value; })
        .sort(null)
        .padAngle(0.01);
    var pie_data = pie(fruitObjEntries);

    svg.selectAll('path')
        .data(pie_data)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(radius * 0.5)
            .outerRadius(radius)
        )
        .attr('fill', function (d) { return (colorScale(d.data.key)); })
        .attr("stroke", "white")
        .attr("stroke-width", "1px")
        .on("mouseover", function (d) {
            tooltip.text(d.value + "%")
                .style("background-color", colorScale(d.data.key))
                .style("visibility", "visible");
        })
        .on("mousemove", function () {
            tooltip.style("top", (d3.event.pageY - 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
        });

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(0, ${radius + 50})`);

    var squareSize = 25;

    legend.selectAll("rect")
        .data(fruitObjKeys)
        .enter()
        .append("rect")
        .attr("x", function (d, i) { return (i - 2) * radius * 0.75 - squareSize / 2; })
        .attr("y", 0)
        .attr("width", squareSize)
        .attr("height", squareSize)
        .attr("fill", function (d) { return colorScale(d); });

    legend.selectAll("text")
        .data(fruitObjEntries)
        .enter()
        .append("text")
        .attr("x", function (d, i) { return (i - 2) * radius * 0.75 + squareSize / 2 + 10; })
        .attr("y", squareSize * 0.75)
        .text(d => d.key)
        .style("font-size", "14px");

}

var selectedCategory; 

// select all the buttons used to create a bar chart
var buttons = d3.selectAll(".round-button")
    .on("click", function () {
        allFruits.style("opacity", 1.0)
        .classed("selected", true);
        fillText();

        selectedCategory = this.innerHTML;
        makeBarGraph();
        scrollToChart();
    });

function makeBarGraph() {

    d3.selectAll("svg").remove();

    var svg = d3.select("#chart")
    .style("width", "fit-content")
    .style("margin", "auto")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

    var fruits = data.map(function(d) { return d.name; });

    // grab just the values that correspond with the button clicked
    var valuesOfInterest =
    data.map(function(d) {
        var desiredKey = selectedCategory.toLowerCase();
        return d[desiredKey];
    });

    var dataCombined = [];
    for (var i = 0; i < fruits.length; i++ ) {
        var obj = {name: fruits[i], value: valuesOfInterest[i]};
        dataCombined.push(obj);
    }

    dataCombined.sort(function(a, b) { return b.value - a.value; });

    var xScale = d3.scaleBand()
    .domain(dataCombined.map(function(d) { return d.name; }))
    .rangeRound([margin, width - margin])
    .padding(0.2);

    var minVal = Math.min(... valuesOfInterest);
    var maxVal = Math.max(... valuesOfInterest);

    var yScale = d3.scaleLinear()
    .domain([Math.max(0, minVal - 5), maxVal * 1.1 ])
    .range([height * 0.75 - margin, margin]);

    var yScaleAxis = d3.scaleLinear()
    .domain([Math.max(0, minVal - 5), maxVal * 1.1 ])
    .range([height - margin, margin]);

    
   var xAxis = svg.append("g")
       .attr("class","axis")
       .attr("transform",`translate(0, ${height-margin})`)
       .call(d3.axisBottom().scale(xScale));

   var yAxis = svg.append("g")
       .attr("class","axis")
       .attr("transform",`translate(${margin}, ${0})`)
       .call(d3.axisLeft().scale(yScaleAxis));

       xAxis.selectAll("text")
       .attr("transform","rotate(45)")
       .attr("text-anchor","start");

     var xAxisLabel = svg.append("text")
         .attr("class","axisLabel")
         .attr("x", width/2)
         .attr("y", height - margin/4)
         .attr("text-anchor","middle")
         .text("Fruit");
 
     var yAxisLabel = svg.append("text")
         .attr("class","axisLabel")
         .attr("transform","rotate(-90)")
         .attr("x",-height/2)
         .attr("y",margin/2)
         .attr("text-anchor","middle")
         .text("Grams Per 100 Grams of Fruit");

    var chartTitle = svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin)
    .style("font-size", "30px")
    .text(selectedCategory);

    var bar = svg.selectAll("rect")
    .data(dataCombined)
    .enter()
    .append("rect")
    .attr("x", function(d) { return xScale(d.name); })
    .attr("y", function(d) { return yScale(d.value); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - margin - yScale(d.value); })
    .attr("fill", function(d) { return dict[d.name]; })
    .on("mouseover", function (d) {
        tooltip.text(d.value + "g/100g")
            .style("background-color", "white")
            .style("border", "none")
            .style("visibility", "visible");
    })
    .on("mousemove", function () {
        tooltip.style("top", (d3.event.pageY - 10) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
    })
    .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
    });

}

function scrollToChart() {
    document.querySelector('#chart').scrollIntoView({ 
        behavior: 'smooth' 
      });
}

