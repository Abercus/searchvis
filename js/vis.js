var renderRectangle = function (x1, y1, x2, y2, color) {
    // Swap around coords if needed.
    if (x1 > x2) {
        [x1, x2] = [x2, x1];
    }
    if (y1 > y2) {
        [y1, y2] = [y2, y1];
    }

    svg.append("rect")
        .attr("x", x1).attr("y", y1)
        .attr("width", x2 - x1).attr("height", y2 - y1)
        .attr("fill", color)
        .attr("stroke", color);

}

var clearSvg = function () {
    svg.selectAll("*").remove();
}

var clearCanvas = function () {
    // Fixed values, we use 600 by 600 window...
    context.clearRect(0, 0, 1000, 1000);
}

var renderCircle = function (x, y, radius, color) {
    svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', radius)
        .attr('stroke', color)
        .attr('fill', color);

}

var renderText = function (text, x, y, font_size, color) {
    svg.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("font-family", "sans-serif")
        .attr("font-size", font_size)
        .attr("fill", color)
        .text(text);


}

var renderPolygon = function (coords, color) {
    console.log(coords);
    console.log(color);

    let polyPoints = "";

    coords.forEach((pair, index) => {
        polyPoints += pair[0] + "," + pair[1] + " ";
    })


    svg.append("polygon").attr("points", polyPoints)
        .style("fill", color)
        .style("stroke", color);

}

var renderShapes = function (data) {
    var lines = data.split(/\r?\n/);

    lines.forEach((line, index) => {
        if (line) {
            let line_new = line.replace(/\s+/g, ' ').trim();

            console.log(line);
            let split = line_new.split(" ");
            let shape = split[0];
            if (shape === "rectangle") {
                console.log("It's a rectangle");
                let x1_coord = parseInt(split[1]);
                let y1_coord = parseInt(split[2]);
                let x2_coord = parseInt(split[3]);
                let y2_coord = parseInt(split[4]);
                let color = split[5];

                renderRectangle(x1_coord, y1_coord, x2_coord, y2_coord, color);
            } else if (shape === "circle") {
                console.log("It's a circle");
                let x_coord = parseInt(split[1]);
                let y_coord = parseInt(split[2]);
                let radius = parseInt(split[3]);
                let color = split[4];
                renderCircle(x_coord, y_coord, radius, color);
            } else if (shape === "line") {
                console.log("It's a line");
                let x1_coord = parseInt(split[1]);
                let y1_coord = parseInt(split[2]);
                let x2_coord = parseInt(split[3]);
                let y2_coord = parseInt(split[4]);
                let width = parseInt(split[5]);
                let color = split[6];
                renderLine(x1_coord, y1_coord, x2_coord, y2_coord, width, color);
            } else if (shape === "polygon") {
                let coords = new Array();
                let coord_count = split.length / 2 - 1
                for (i = 0; i < coord_count; i++) {
                    coords.push([parseInt(split[i * 2 + 1]), parseInt(split[i * 2 + 2])]);
                }

                let color = split[split.length - 1]

                renderPolygon(coords, color);
            } else if (shape === "text") {
                // Find text by ", split the remaining.
                text_start = line.indexOf('"');
                text_end = line.indexOf('"', text_start + 1);
                let text = line.slice(text_start + 1, text_end);
                remaining = line.slice(text_end + 2);
                remaining = remaining.replace(/\s+/g, ' ').trim();

                splits = remaining.split(" ");
                let x1_coord = parseInt(splits[0]);
                let y1_coord = parseInt(splits[1]);
                let font_size = parseInt(splits[2]);
                let color = splits[3];

                renderText(text, x1_coord, y1_coord, font_size, color);

            }


        }
    })
}


var renderLine = function (x1, y1, x2, y2, width, color) {
    svg.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2)
        .attr("stroke-width", width).attr("stroke", color);

}

var renderCoverage = function (data, fieldWidth, fieldHeight) {
    // Draw all points in file

    context.clearRect(0, 0, canvas.width, canvas.height);

    var lines = data.split(/\r?\n/);

    var line_coords = new Array();

    lines.forEach((line, index) => {
        if (line) {
            let coords = line.split(" ").map(Number);
            line_coords.push(coords);
        }
    })


    let multConstX = Math.min(1, 600.0 / fieldWidth);
    let multConstY = Math.min(1, 600.0 / fieldHeight);

    for (i = 0; i < line_coords.length; i++) {

        context.fillStyle = 'rgba(0, 0, 0, 0.1)';
        context.beginPath();
        const x = line_coords[i][0] * multConstX; //* canvas.width;
        const y = line_coords[i][1] * multConstY; //* canvas.height;
        context.arc(x, y, 1, 0, 2 * Math.PI);

        // fill the point
        context.fill();


    }
}

var renderPath = function (data) {
    // Draw all points in file
    var lines = data.split(/\r?\n/);

    var line_coords = new Array();

    lines.forEach((line, index) => {
        if (line) {
            let coords = line.split(" ").map(Number);
            line_coords.push(coords);
        }
    })

    for (i = 0; i < line_coords.length - 1; i++) {
        svg.append("line").attr("x1", line_coords[i][0])
            .attr("y1", line_coords[i][1])
            .attr("x2", line_coords[i + 1][0])
            .attr("y2", line_coords[i + 1][1])
            .attr("stroke-width", 2).attr("stroke", "red");
    }


}

var fieldWidth = d3.select("#width-input").node().value;

var fieldHeight = d3.select("#height-input").node().value;


var viewBoxHeight = fieldHeight / 0.6; // 0.6 == 600 / 1000
var viewBoxWidth = fieldWidth / 0.6;


// create svg element:
var svg = d3.select("#svg")
    .append("svg")
    .attr("viewBox", "0 0 " + String(Math.ceil(viewBoxWidth)) + " " + String(Math.ceil(viewBoxHeight)))
    .attr("width", fieldWidth)
    .attr("height", fieldHeight)
    .attr("preserveAspectRatio", "none");

var canv = d3.select("#canvas")
    .append("canvas")
    .attr("width", 600)
    .attr("height", 600);

var context = canv.node().getContext('2d');


var updateVariables = function () {
    fieldWidth = d3.select("#width-input").node().value;
    fieldHeight = d3.select("#height-input").node().value;


    if (fieldWidth > 600) {
        viewBoxHeight = Math.ceil(fieldHeight / (600.0 / fieldHeight));
        viewBoxWidth = Math.ceil(fieldWidth / (600.0 / fieldWidth));
        svg.style("border", "none");
        d3.selectAll(".viscontainer").style("border", "solid");
    } else {
        viewBoxHeight = fieldWidth;
        viewBoxWidth = fieldHeight;
        console.log(d3.selectAll("viscontainer"));
        svg.style("border", "solid");
        d3.selectAll(".viscontainer").style("border", "none");


    }

    console.log(viewBoxHeight, viewBoxWidth, fieldHeight, fieldWidth);

    // modify svg element
    svg
        .attr("viewBox", "0 0 " + String(viewBoxWidth) + " " + String(viewBoxHeight))
        .attr("width", fieldWidth)
        .attr("height", fieldHeight);
}




d3.select("#download")
    .on('click', function () {
        // Get the d3js SVG element and save using saveSvgAsPng.js
        

        saveSvgAsPng(document.getElementsByTagName("svg")[0], "plot.png", {
            scale: 1,
            backgroundColor: "#FFFFFF", width: fieldWidth, height: fieldHeight,
            encoderOptions: 1
        });
    })

d3.select("#updatefield")
    .on('click', function () {
        console.log("Updating field..");
        clearSvg();
        clearCanvas();
        updateVariables();
    })

d3.select("#addshapes")
    .on('click', function () {
        // Get all shapes described in the textarea and add them to the image
        var shapesInput = d3.select("#shapesarea").node().value;
        clearSvg();
        renderShapes(shapesInput);


    })

d3.select("#clearsvg")
    .on('click', function () {
        // Get all shapes described in the textarea and add them to the image
        clearSvg();
        clearCanvas();

    })

d3.select("#file-input").attr("accept", "text/plain").on("change", function () {
    var file = d3.event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onloadend = function (event1) {
            console.log(event1);
            var data = event1.target.result;
            renderPath(data);
        };
        reader.readAsText(file);
    }
})


d3.select("#coverage-input").attr("accept", "text/plain").on("change", function () {
    var file = d3.event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onloadend = function (event1) {
            console.log(event1);
            var data = event1.target.result;
            renderCoverage(data, fieldWidth, fieldHeight);
        };
        reader.readAsText(file);
    }
})

