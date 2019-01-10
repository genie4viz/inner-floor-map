// Extract the width and height that was computed by CSS.    

//Margin conventions
var margin = { top: 20, right: 60, bottom: 20, left: 20 };
var padding = { top: 60, right: 60, bottom: 60, left: 60 };
var width = 900 - margin.left - margin.right - padding.left - padding.right;
var height = 560 - margin.top - margin.bottom - padding.top - padding.right;

var tool_tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function (d) { console.log(d); return "Shape1"; });

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load the external svg from a file
d3.xml("floor0.svg").mimeType("image/svg+xml").get(function (error, xml) {
  if (error) throw error;

  var importedNode = document.importNode(xml.documentElement, true);
  console.log(xml.documentElement);
  console.log(xml.documentElement.getElementsByTagName("path"));
  svg
    .each(function () {
      this.appendChild(importedNode);
    })
  // inside of our d3.xml callback, call another function
  // that styles individual paths inside of our imported svg

  styleImportedSVG();
});


function styleImportedSVG() {
  svg.select('svg')
    .attr('x', 100)
    .attr('width', 300);

  d3.selectAll('path').call(tool_tip);
  d3.selectAll('path')
    .on('mouseover', function () {
      d3.selectAll('path')
        .style('cursor', 'pointer')
        .style('fill-opacity', 0.1);
      d3.selectAll('polygon')
        .style('cursor', 'pointer')
        .style('fill-opacity', 0.1);
      tool_tip.show();
    })
    .on('mouseout', function () {
      d3.selectAll('path')
        .style('fill-opacity', 1);
      d3.selectAll('polygon')
        .style('fill-opacity', 1);
      tool_tip.hide();
    })
}