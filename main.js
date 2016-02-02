readJson = function(text, callback)
{
  callback(text ? JSON.parse(text) : null);
}

var width = 800,
    height = 800,
    outerRadius = height / 2 - 10;
    innerRadius = 120,
    fontSize = 12;
    
function draw()
{
  d3.select("#chart").html("");
  drawStackedRadar(width, height, innerRadius, outerRadius, fontSize);
}

function drawStackedRadar(width, height, innerRadius, outerRadius, fontSize)
{
  //var formatDate = d3.time.format("%a"),
  //    formatDay = function(d) { return formatDate(new Date(2007, 0, d)); };

  var angle = d3.time.scale()
    .range([0, 2 * Math.PI]);

  var radius = d3.scale.linear()
    .range([innerRadius, outerRadius]);

  var z = d3.scale.category20();

  var stack = d3.layout.stack()
    .offset("zero")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.time; })
    .y(function(d) { return d.value; });

  var nest = d3.nest()
    .key(function(d) { return d.key; });

  var line = d3.svg.line.radial()
    .interpolate("cardinal-closed")
    .angle(function(d) { return angle(d.time); })
    .radius(function(d) { return radius(d.y0 + d.y); });

  var area = d3.svg.area.radial()
    .interpolate("cardinal-closed")
    .angle(function(d) { return angle(d.time); })
    .innerRadius(function(d) { return radius(d.y0); })
    .outerRadius(function(d) { return radius(d.y0 + d.y); });

  var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  readJson(JSON.stringify(jsonData), function(data) {
    data.forEach(function(d) {
      d.time = +d.time;
      d.value = +d.value;
  });

  var layers = stack(nest.entries(data));

  // Extend the domain slightly to match the range of [0, 2PI].
  angle.domain([0, d3.max(data, function(d) { return d.time + 1; })]);
  radius.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

  svg.selectAll(".layer")
      .data(layers)
    .enter().append("path")
      .attr("class", "layer")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d, i) { return z(i); });

  svg.selectAll(".axis")
      .data(d3.range(angle.domain()[1]))
    .enter().append("g")
      .attr("class", "axis")
      .attr("transform", function(d) { return "rotate(" + angle(d) * 180 / Math.PI + ")"; })
    .call(d3.svg.axis()
      .scale(radius.copy().range([-innerRadius, -outerRadius]))
      .orient("left"))
    .append("text")
      .attr("y", -innerRadius + 6)
      .attr("dy", ".71em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d; });
});
}

draw();


	$(function() {
		$( "#height-slider" ).slider(
		{
	      min: 100,
		  max: 2000,
		  value: height,
		  slide : function(event, ui)
		  {
		    height = ui.value;
		    draw();
	        $("#height").val($("#height-slider").slider("value"));
		  }
		});
		$("#height").val($("#height-slider").slider("value"));
	});


	$(function() {
		$( "#width-slider" ).slider(
		{
	      min: 100,
		  max: 2000,
		  value: width,
		  slide : function(event, ui)
		  {
		    width = ui.value;
		    draw();
	        $("#width").val($("#width-slider").slider("value"));
		  }
		});
		$("#width").val($("#width-slider").slider("value"));
	});


	$(function() {
		$( "#innerradius-slider" ).slider(
		{
	      min: 1,
		  max: 1000,
		  value: innerRadius,
		  slide : function(event, ui)
		  {
		    innerRadius = ui.value;
		    draw();
	        $("#innerradius").val($("#innerradius-slider").slider("value"));
		  }
		});
		$("#innerradius").val($("#innerradius-slider").slider("value"));
	});


	$(function() {
		$( "#outerradius-slider" ).slider(
		{
	      min: 1,
		  max: 1000,
		  value: outerRadius,
		  slide : function(event, ui)
		  {
		    outerRadius = ui.value;
		    draw();
	        $("#outerradius").val($("#outerradius-slider").slider("value"));
		  }
		});
		$("#outerradius").val($("#outerradius-slider").slider("value"));
	});


	$(function() {
		$( "#fontsize-slider" ).slider(
		{
	      min: 1,
		  max: 48,
		  value: fontSize,
		  slide : function(event, ui)
		  {
		    fontSize = ui.value;
		    draw();
	        $("#fontsize").val($("#fontsize-slider").slider("value"));
		  }
		});
		$("#fontsize").val($("#fontsize-slider").slider("value"));
	});


    $(function() {
    	$( "#draggable-title" ).draggable();
        $( "#config" ).draggable();
        $( "#chart" ).draggable();
    });
    
function titleChange(newTitle)
{
  d3.select("title").text(newTitle);
  d3.select("#titletext").text(newTitle);
}



