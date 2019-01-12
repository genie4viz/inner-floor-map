// create an SVG
var maxZoom, minZoom;
var svg;
w = 2293;
h = 2139;

var scale = 1.0;

var block_names = ["right_pier", "center_hall", "front_pier", "left_pier", "main_hall"];

// Create function to apply zoom to countriesGroup
function zoomed() {
  t = d3.event.transform;
  levelGroup
    .attr("transform", t);
}

// Define map zoom behaviour
var zoom = d3
  .zoom()
  .scaleExtent([1, 4])
  .translateExtent([[0, 0], [w, h]])
  .extent([[0, 0], [w, h]])
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

  bbox = levelGroup.node().getBBox();
  vx = bbox.x;		// container x co-ordinate
  vy = bbox.y;		// container y co-ordinate
  vw = bbox.width;	// container width
  vh = bbox.height;	// container height
  defaultView = "" + vx + " " + vy + " " + vw + " " + vh;

  svg
    .attr("viewBox", defaultView)
    .attr("preserveAspectRatio", "xMidYMid meet")

  block_names.forEach(b_name => {

    svg
      .select("g#" + b_name)
      .call(tool_tip)
      .on('mouseover', function () {
        d3.select(this)
          .style('cursor', 'pointer')
          .style('fill-opacity', 0.5);
        //tool_tip.show(b_name);
      })
      .on('mouseout', function () {
        d3.select(this)
          .style('fill-opacity', 1);
        //tool_tip.hide();
      })
      .on('click', function () {
        if (d3.event.defaultPrevented) {
          return; // panning, not clicking
        }
        node = d3.select(this);
        var transform = getTransform(node, 2);

        svg.transition().call(zoom.transform, d3.zoomIdentity.translate(transform.translate[0], transform.translate[1]).scale(transform.scale))
        scale = transform.scale;
      });

  });
});

function getTransform(node, xScale) {
  bbox = node.node().getBBox();
  var bx = bbox.x;
  var by = bbox.y;
  var bw = bbox.width;
  var bh = bbox.height;
  var tx = -bx * xScale + vx + vw / 2 - bw * xScale / 2;
  var ty = -by * xScale + vy + vh / 2 - bh * xScale / 2;
  return { translate: [tx, ty], scale: xScale }
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