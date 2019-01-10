var block_names = ["right_wing0", "center_hall", "top_wing0", "left_wing0", "top_wing1", "left_wing1", "right_wing1", "right_rect0", "center_rect0", "right_rect1", "left_rect0", "center_ga", "left_rect1", "left_rect2", "right_rect2", "sign_e", "right_rect3", "left_rect3", "right_tri0", "right_rect4", "combine_left", "left_rect4"];
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
  .html(function (d) { return d; });


d3.xml("mapinfo/level0.svg").mimeType("image/svg+xml").get(function (error, xml) {
  if (error) throw error;

  var importedNode = document.importNode(xml.documentElement, true);  
  svg
    .each(function () {
      this.appendChild(importedNode);
    });

  block_names.forEach(b_name => {
    svg
      .select("g#" + b_name)
      .call(tool_tip)
      .on('mouseover', function () {
        svg.select("g#" + b_name)
          .style('cursor', 'pointer')
          .style('fill-opacity', 0.3);
        tool_tip.show(b_name);
      })
      .on('mouseout', function () {
        svg.select("g#" + b_name)
          .style('fill-opacity', 1);
        tool_tip.hide();
      });

  });
});
