var level0 = [];

// on window resize
$(window).resize(function () {
  // Resize SVG
  svg
    .attr("width", $("#map-holder").width())
    .attr("height", $("#map-holder").height());
  //initiateZoom();
});

// create an SVG
var svg = d3
  .select("#map-holder")
  .append("svg")
  // set to the same size as the "map-holder" div
  .attr("width", $("#map-holder").width())
  .attr("height", $("#map-holder").height());

var tool_tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function (d) { console.log(d); return "Shape1"; });

// load the external svg from a file
jQuery.ajax({
  dataType: "json",
  url: "mapinfo/level0.json",
  async: false,
  success: function (data) { level0 = data; }
});

level0
  .forEach(function (item) {
    d3.xml("mapinfo/level0/" + item.id + ".svg").mimeType("image/svg+xml").get(function (error, xml) {
      if (error) throw error;

      var importedNode = document.importNode(xml.documentElement, true);
      importedNode.id = item.id;
      svg
        .each(function () {
          this.appendChild(importedNode);
        })

      svg.select('svg#' + importedNode.id)
        .attr("x", item.x)
        .attr("y", item.y)
        .attr("width", 100)
        .attr("height", 100)
        .on('mouseover', function () {          
          svg.select('svg#' + importedNode.id)
            .style('cursor', 'pointer')
            .style('fill-opacity', 0.3);
          // d3.selectAll('polygon')
          //   .style('cursor', 'pointer')
          //   .style('fill-opacity', 0.1);
          // tool_tip.show();
        })
        .on('mouseout', function () {          
          svg.select('svg#' + importedNode.id)
            .style('fill-opacity', 1);
        })

      //styleImportedSVG(importedNode.id);
    });
  })

function styleImportedSVG(c_id) {
  //console.log(svg.selectAll('svg'));
  // .filter(function(c_svg){ console.log(c_svg); return c_svg.id == c_id})
  // .attr("width", 50)
  // .attr("height", 50);
  // d3.selectAll('path').call(tool_tip);
  // d3.selectAll('path')
  //   .on('mouseover', function () {
  //     d3.selectAll('path')
  //       .style('cursor', 'pointer')
  //       .style('fill-opacity', 0.1);
  //     d3.selectAll('polygon')
  //       .style('cursor', 'pointer')
  //       .style('fill-opacity', 0.1);
  //     tool_tip.show();
  //   })
  //   .on('mouseout', function () {
  //     d3.selectAll('path')
  //       .style('fill-opacity', 1);
  //     d3.selectAll('polygon')
  //       .style('fill-opacity', 1);
  //     tool_tip.hide();
  //   })
}