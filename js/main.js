// variables for catching min and max zoom factors
var minZoom;
var maxZoom;
w = window.innerWidth;
h = window.innerHeight;

var block_names = ["right_wing0", "center_hall", "top_wing0", "left_wing0", "top_wing1", "left_wing1", "right_wing1", "right_rect0", "center_rect0", "right_rect1", "left_rect0", "center_ga", "left_rect1", "left_rect2", "right_rect2", "sign_e", "right_rect3", "left_rect3", "right_tri0", "right_rect4", "combine_left", "left_rect4"];

// Create function to apply zoom to countriesGroup
function zoomed() {
  t = d3
    .event
    .transform;

  svg
    .transition()
    .attr("transform", "translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
}
// Define map zoom behaviour
var zoom = d3
  .zoom()
  .on("zoom", zoomed);

// on window resize
$(window).resize(function () {
  // Resize SVG
  w = $("#map-holder").width();
  h = $("#map-holder").height();
  svg
    .attr("width", $("#map-holder").width())
    .attr("height", $("#map-holder").height());
  initiateZoom();
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
          .style('fill-opacity', 0.5);
        tool_tip.show(b_name);
      })
      .on('mouseout', function () {
        svg.select("g#" + b_name)
          .style('fill-opacity', 1);
        tool_tip.hide();
      })
      .on('click', function () {
        //console.log(svg.select("g#" + b_name).node().getBoundingClientRect());
        //console.log(getBoundingBoxCenter(svg.select("g#" + b_name)));
        boxZoom(svg.select("g#" + b_name).node().getBBox(), getBoundingBoxCenter(svg.select("g#" + b_name)), 100);
      });

  });
  initiateZoom();
});
// zoom to show a bounding box, with optional additional padding as percentage of box size
function boxZoom(box, centroid, paddingPerc) {

  console.log(box)
  console.log(centroid)
  // minXY = box.x;
  // maxXY = box[1];
  // find size of block area defined
  zoomWidth = box.width;//Math.abs(minXY[0] - maxXY[0]);
  zoomHeight = box.height;//Math.abs(minXY[1] - maxXY[1]);
  // find midpoint of block area defined
  zoomMidX = centroid[0];
  zoomMidY = centroid[1];
  // increase block area to include padding
  zoomWidth = zoomWidth * (1 + paddingPerc / 100);
  zoomHeight = zoomHeight * (1 + paddingPerc / 100);
  // find scale required for area to fill svg
  maxXscale = $("svg").width() / zoomWidth;
  maxYscale = $("svg").height() / zoomHeight;
  zoomScale = Math.min(maxXscale, maxYscale);
  // handle some edge cases
  // limit to max zoom (handles tiny countries)
  zoomScale = Math.min(zoomScale, maxZoom);
  // limit to min zoom (handles large countries and countries that span the date line)
  zoomScale = Math.max(zoomScale, minZoom);
  // Find screen pixel equivalent once scaled  
  offsetX = zoomScale * zoomMidX;
  offsetY = zoomScale * zoomMidY;
  // Find offset to centre, making sure no gap at left or top of holder
  dleft = Math.min(0, $("svg").width() / 2);
  dtop = Math.min(0, $("svg").height() / 2);
  // Make sure no gap at bottom or right of holder
  dleft = Math.max($("svg").width() - w * zoomScale, dleft);
  dtop = Math.max($("svg").height() - h * zoomScale, dtop);
  // set zoom
  svg
    .call(
      zoom.transform,
      d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
    );
}
//get selected block's centroid position
function getBoundingBoxCenter(selection) {
  // get the DOM element from a D3 selection
  // you could also use "this" inside .each()
  var element = selection.node();
  // use the native SVG interface to get the bounding box
  var bbox = element.getBBox();
  // return the center of the bounding box
  return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
}

// Function that calculates zoom/pan limits and sets zoom to default value 
function initiateZoom() {
  // Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides
  minZoom = Math.max($("#map-holder").width() / w, $("#map-holder").height() / h);
  // set max zoom to a suitable factor of this value
  maxZoom = 20 * minZoom;
  // set extent of zoom to chosen values
  // set translate extent so that panning can't cause map to move out of viewport
  zoom
    .scaleExtent([minZoom, maxZoom])
    .translateExtent([[0, 0], [w, h]]);
  // define X and Y offset for centre of map to be shown in centre of holder  
  midX = ($("#map-holder").width() - minZoom * w) / 2;
  midY = ($("#map-holder").height() - minZoom * h) / 2;
  // change zoom transform to min zoom and centre offsets
  svg.call(zoom.transform, d3.zoomIdentity.translate(midX, midY).scale((maxZoom - minZoom)));
}

//handler for zoom home/in/out
$('#zoom-home').on('click', function () {
  initiateZoom();
});
$('#zoom-in').on('click', function () {
  zoom.scaleBy(d3.select("svg"), 1.2);
});
$('#zoom-out').on('click', function () {
  zoom.scaleBy(d3.select("svg"), 0.8);
});