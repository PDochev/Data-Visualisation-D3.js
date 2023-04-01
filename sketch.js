let glacerTable;
let month = [];
let sel;
let glacer = ["Air Temp", "Humidity", "Wind Speed"];
let sortedData;
let sortedDataHum;
let sortedDataWind;
let button;
let buttonHum;
let buttonWind;

function preload() {
  glacerTable = loadTable("glacer_data.tsv", "tsv", "header");
}

function setup() {
  month = glacerTable.getColumn("Date");

  let numRows = glacerTable.getRowCount();
  sel = createSelect();
  sel.position(650, 10);
  sel.option(glacer[0]);
  sel.option(glacer[1]);
  sel.option(glacer[2]);
  button = createButton("Sort Temp");
  buttonHum = createButton("Sort Humidity");
  buttonWind = createButton("Sort WindSpd");
  buttonHum.position(400, 10);
  buttonWind.position(520, 10);

  button.position(300, 10);
  button.mousePressed(sortData);
  buttonHum.mousePressed(sortDataHum);
  buttonWind.mousePressed(sortDataWind);

  var resetButton = createButton("Reset Data");
  resetButton.position(192, 10);
  resetButton.mousePressed(resetData);

  buttonHum.id("hum");
  button.id("temp");
  buttonWind.id("wind");
}

function draw() {
  switch (sel.value()) {
    case "Air Temp":
      AirTemp();
      document.getElementById("hum").disabled = true;
      document.getElementById("wind").disabled = true;
      document.getElementById("temp").disabled = false;
      break;
    case "Humidity":
      Humidity();
      document.getElementById("hum").disabled = false;
      document.getElementById("wind").disabled = true;
      document.getElementById("temp").disabled = true;
      break;
    case "Wind Speed":
      WindSpeed();
      document.getElementById("hum").disabled = true;
      document.getElementById("wind").disabled = false;
      document.getElementById("temp").disabled = true;
      break;
  }
}
function resetData() {
  sortedData = glacerTable.getColumn("AirTemp");
  sortedDataHum = glacerTable.getColumn("Humidity");
  sortedDataWind = glacerTable.getColumn("WindSpd");
  month = glacerTable.getColumn("Date");

  redraw(); // Redraw the graph with original data
}

function sortData() {
  let data = glacerTable.getArray().map((row) => ({
    month: row[0],
    value: Number(row[1]),
  }));
  data.sort((a, b) => a.value - b.value);
  sortedData = data.map((row) => row.value);
  month = data.map((row) => row.month);
}

function sortDataHum() {
  let data = glacerTable.getArray().map((row) => ({
    month: row[0],
    humidity: Number(row[2]),
  }));
  data.sort((a, b) => a.humidity - b.humidity);
  sortedDataHum = data.map((row) => row.humidity);
  month = data.map((row) => row.month);
}

function sortDataWind() {
  let data = glacerTable.getArray().map((row) => ({
    month: row[0],
    wind: Number(row[3]),
  }));
  data.sort((a, b) => a.wind - b.wind);
  sortedDataWind = data.map((row) => row.wind);
  month = data.map((row) => row.month);
}

function AirTemp() {
  var width = 700,
    height = 300,
    margin = 30;

  createCanvas(width + margin * 2, 600);

  push();
  translate(margin, margin);

  //y axis
  var D3yscale = d3.scale.linear().domain([0, 13]).range([height, 10]);

  var D3yaxis = d3.svg.axis().scale(D3yscale).orient("left");

  var p5yaxis = D3p5axis(D3yaxis);

  p5yaxis.drawTicks(function (txt) {
    stroke("#ddd");
    line(0, 0, width, 0);
    noStroke();
    fill("black");
    textAlign(RIGHT);
    text(txt, -5, 5);
  });

  p5yaxis.drawConnectingLine(function (startX, endX) {
    //no line connecting
  });

  //x axis
  var D3xscale = d3.scale
    .ordinal()
    .domain(month)
    .rangeRoundBands([0, width], 0.1);

  var D3xaxis = d3.svg.axis().scale(D3xscale);

  var p5axis = D3p5axis(D3xaxis, 0, height);

  p5axis.drawTicks(function (txt) {
    fill("black");
    noStroke();
    textAlign(CENTER);
    text(txt, 0, 23);
    stroke("black");
    line(0, 3, 0, 10);
  });

  let data = sortedData || glacerTable.getColumn("AirTemp");



   // data.sort((a, b) => a - b )

  for (var i = 0; i < data.length; i++) {
    fill("#a8dadc");

    var xOffset = D3xscale.range()[i];
    var barWidth = D3xscale.rangeBand();
    var barHeight = D3yscale(data[i]);
    var maxHeight = D3yscale(0);
    
    push();
    translate(xOffset, 0);
    rect(0, barHeight, barWidth, maxHeight - barHeight);

    pop();
  }

  pop();

  //Add a title
  fill("#000");
  noStroke();
  textSize(13);
  text("Air Temperature °C", 30, 20);
  text("September 2013", 325, 380);
}

//Function for converting D3 axis to p5 drawing methods
p5.prototype.D3p5axis = function (d3Axis, x, y) {
  x = x || 0;
  y = y || 0;
  var D3scaleObj = d3Axis.scale();
  var customDOMaxis = d3
    .select("body")
    .append("custom")
    .style("display", "none")
    .call(d3Axis);
  var ticks = customDOMaxis.selectAll("g");

  var returnFunction = function () {};

  returnFunction.drawTicks = function (drawFunction) {
    push();
    translate(x, y);
    ticks.each(function () {
      var translateObj = d3.transform(d3.select(this).attr("transform"));
      var translateX = translateObj.translate[0];
      var translateY = translateObj.translate[1];
      push();
      translate(translateX, translateY);
      var txt = d3.select(this).select("text").text();
      drawFunction(txt);
      pop();
    });
    pop();
  };

  returnFunction.drawConnectingLine = function (drawFunction) {
    push();
    translate(x, y);
    drawFunction(D3scaleObj.range()[0], D3scaleObj.range()[1]);

    pop();
  };

  return returnFunction;
};

function Humidity() {
  var width = 700,
    height = 300,
    margin = 30;

  createCanvas(width + margin * 2, 600);

  push();
  translate(margin, margin);

  //y axis
  var D3yscale = d3.scale.linear().domain([0, 100]).range([height, 10]);

  var D3yaxis = d3.svg.axis().scale(D3yscale).orient("left");

  var p5yaxis = D3p5axis(D3yaxis);

  p5yaxis.drawTicks(function (txt) {
    stroke("#ddd");
    line(0, 0, width, 0);
    noStroke();
    fill("black");
    textAlign(RIGHT);
    text(txt, -5, 5);
  });

  p5yaxis.drawConnectingLine(function (startX, endX) {
    //no line connecting
  });

  //x axis
  var D3xscale = d3.scale
    .ordinal()
    .domain(month)
    .rangeRoundBands([0, width], 0.1);

  var D3xaxis = d3.svg.axis().scale(D3xscale);

  var p5axis = D3p5axis(D3xaxis, 0, height);

  p5axis.drawTicks(function (txt) {
    fill("black");
    noStroke();
    textAlign(CENTER);
    text(txt, 0, 23);
    stroke("black");
    line(0, 3, 0, 10);
  });


  let data = sortedDataHum || glacerTable.getColumn("Humidity");

  for (var i = 0; i < data.length; i++) {
    fill("#8ecae6");

    var xOffset = D3xscale.range()[i];
    var barWidth = D3xscale.rangeBand();
    var barHeight = D3yscale(data[i]);
    var maxHeight = D3yscale(0);

    push();
    translate(xOffset, 0);
    rect(0, barHeight, barWidth, maxHeight - barHeight);
    pop();
  }

  pop();

  //Add a title
  fill("#000");
  noStroke();
  textSize(13);
  text("Humidity - %", 30, 20);
  text("September 2013", 325, 380);
}

//Function for converting D3 axis to p5 drawing methods
p5.prototype.D3p5axis = function (d3Axis, x, y) {
  x = x || 0;
  y = y || 0;
  var D3scaleObj = d3Axis.scale();
  var customDOMaxis = d3
    .select("body")
    .append("custom")
    .style("display", "none")
    .call(d3Axis);
  var ticks = customDOMaxis.selectAll("g");

  var returnFunction = function () {};

  returnFunction.drawTicks = function (drawFunction) {
    push();
    translate(x, y);
    ticks.each(function () {
      var translateObj = d3.transform(d3.select(this).attr("transform"));
      var translateX = translateObj.translate[0];
      var translateY = translateObj.translate[1];
      push();
      translate(translateX, translateY);
      var txt = d3.select(this).select("text").text();
      drawFunction(txt);
      pop();
    });
    pop();
  };

  returnFunction.drawConnectingLine = function (drawFunction) {
    push();
    translate(x, y);
    drawFunction(D3scaleObj.range()[0], D3scaleObj.range()[1]);
    pop();
  };

  return returnFunction;
};

function WindSpeed() {
  var width = 700,
    height = 300,
    margin = 30;

  createCanvas(width + margin * 2, 600);

  push();
  translate(margin, margin);

  //y axis
  var D3yscale = d3.scale.linear().domain([0, 9]).range([height, 10]);

  var D3yaxis = d3.svg.axis().scale(D3yscale).orient("left");

  var p5yaxis = D3p5axis(D3yaxis);

  p5yaxis.drawTicks(function (txt) {
    stroke("#ddd");
    line(0, 0, width, 0);
    noStroke();
    fill("black");
    textAlign(RIGHT);
    text(txt, -5, 5);
  });

  p5yaxis.drawConnectingLine(function (startX, endX) {
    //no line connecting
  });

  //x axis
  var D3xscale = d3.scale
    .ordinal()
    .domain(month)
    .rangeRoundBands([0, width], 0.1);

  var D3xaxis = d3.svg.axis().scale(D3xscale);

  var p5axis = D3p5axis(D3xaxis, 0, height);

  p5axis.drawTicks(function (txt) {
    fill("black");
    noStroke();
    textAlign(CENTER);
    text(txt, 0, 23);
    stroke("black");
    line(0, 3, 0, 10);
  });


  let data = sortedDataWind || glacerTable.getColumn("WindSpd");

  for (var i = 0; i < data.length; i++) {
    fill("#a2d2ff");
    var xOffset = D3xscale.range()[i];
    var barWidth = D3xscale.rangeBand();
    var barHeight = D3yscale(data[i]);
    var maxHeight = D3yscale(0);
    push();
    translate(xOffset, 0);
    rect(0, barHeight, barWidth, maxHeight - barHeight);
    pop();
  }

  pop();

  //Add a title
  fill("#000");
  noStroke();
  textSize(13);
  text("Wind Speed - mph", 30, 20);
  text("September 2013", 325, 380);
}

//Function for converting D3 axis to p5 drawing methods
p5.prototype.D3p5axis = function (d3Axis, x, y) {
  x = x || 0;
  y = y || 0;
  var D3scaleObj = d3Axis.scale();
  var customDOMaxis = d3
    .select("body")
    .append("custom")
    .style("display", "none")
    .call(d3Axis);
  var ticks = customDOMaxis.selectAll("g");

  var returnFunction = function () {};

  returnFunction.drawTicks = function (drawFunction) {
    push();
    translate(x, y);
    ticks.each(function () {
      var translateObj = d3.transform(d3.select(this).attr("transform"));
      var translateX = translateObj.translate[0];
      var translateY = translateObj.translate[1];
      push();
      translate(translateX, translateY);
      var txt = d3.select(this).select("text").text();
      drawFunction(txt);
      pop();
    });
    pop();
  };

  returnFunction.drawConnectingLine = function (drawFunction) {
    push();
    translate(x, y);
    drawFunction(D3scaleObj.range()[0], D3scaleObj.range()[1]);
    pop();
  };

  return returnFunction;
};
