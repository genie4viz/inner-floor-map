// create an SVG
var maxZoom, minZoom;
var svg;
w = 2293;
h = 2139;

var block_names = ["right_pier", "center_hall", "front_pier", "left_pier", "main_hall"];

// Create function to apply zoom to countriesGroup
function zoomed() {
  t = d3.event.transform;

  width = $("#map-holder").width();
  height = $("#map-holder").height();

  tx = Math.min(0, Math.max(t.x, w - w * t.k));
  ty = Math.min(0, Math.max(t.y, h - h * t.k));

  d3.zoomIdentity.translate([tx, ty]);
  levelGroup
    .transition().duration(300)
    .attr("transform", "translate(" + [tx, ty] + ")scale(" + t.k + ")");

}

// Define map zoom behaviour
var zoom = d3
  .zoom()
  .scaleExtent([1, 4])
  .on("zoom", zoomed);

// on window resize
$(window).resize(function () {
  // Resize SVG
  svg
    .attr("width", $("#map-holder").width())
    .attr("height", $("#map-holder").height());
  zoom.scaleTo(svg.transition(), 1);
});

var tool_tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(d => d);

d3.xml("mapinfo/level0.svg").mimeType("image/svg+xml").get(function (error, xml) {
  if (error) throw error;

  var importedNode = document.importNode(xml.documentElement, true);

  d3
    .select("#map-holder")
    .each(function () {
      this.appendChild(importedNode);
    });

  svg = d3.select("svg")
    .attr("width", $("#map-holder").width())
    .attr("height", $("#map-holder").height())
    .call(zoom);

  levelGroup = d3.select("g#level0");

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
        //boxZoom(svg.select("g#" + b_name).node().getBBox(), getBoundingBoxCenter(svg.select("g#" + b_name)), 100);
      });

  });
  //initiateZoom();
});
// zoom to show a bounding box, with optional additional padding as percentage of box size
function boxZoom(box, centroid, paddingPerc) {

  // find size of block area defined
  zoomWidth = Math.abs(w - box.width);//Math.abs(minXY[0] - maxXY[0]);
  zoomHeight = Math.abs(h - box.height);//Math.abs(minXY[1] - maxXY[1]);

  // find midpoint of block area defined
  zoomMidX = centroid[0];
  zoomMidY = centroid[1];
  console.log(zoomMidX + ":" + zoomMidY)
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
      d3.zoomIdentity.translate(zoomMidX, zoomMidY).scale(1.5)
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



//handler for zoom home/in/out
$('#zoom-home').on('click', function () {
  zoom.scaleTo(svg.transition(), 1);
});
$('#zoom-in').on('click', function () {
  zoom.scaleBy(svg.transition(), 1.2);
});
$('#zoom-out').on('click', function () {
  zoom.scaleBy(svg.transition(), 0.8);
});