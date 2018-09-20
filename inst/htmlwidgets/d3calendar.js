HTMLWidgets.widget({

  name: 'd3calendar',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance
    var day = d3.time.format("%w"), // day of the week
        day_of_month = d3.time.format("%e"), // day of the month
        day_of_year = d3.time.format("%j"),
        week = d3.time.format("%U"), // week number of the year
        month = d3.time.format("%m"), // month number
        year = d3.time.format("%Y"),
        percent = d3.format(".1%"),
        format = d3.time.format("%Y-%m-%d");


    function dayTitle (t0) {
      return t0.toString().split(" ")[2];
    }
    function monthTitle (t0) {
      return t0.toLocaleString("en-us", { month: "long" });
    }
    function yearTitle (t0) {
      return t0.toString().split(" ")[3];
    }


    return {

      renderValue: function(x) {
        // console.log('data');
        // console.log(x.data);
        var data = x.data;

        var color = d3.scale.quantize()
                      .domain([x.settings.min_value, x.settings.max_value])
                      .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));
        var cellSize = Math.min(width / 32,
                                height / 28
                                );
        var no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50));
        var shift_up = cellSize * 3;

        d3.select(el).style('margin', '0 auto');
        var svg = d3.select(el).selectAll("svg")
          .data(d3.range(x.settings.min_year, x.settings.max_year))
          .enter().append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .attr("class", "RdYlGn")
                  .style("margin", "0, auto")
                  .append("g");

        var rect = svg.selectAll(".day")
            .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));})
            .enter().append("rect")
            .attr("class", "day")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", function(d) {
              var month_padding = 1.2 * cellSize*7 * ((month(d)-1) % (no_months_in_a_row));
                  return day(d) * cellSize + month_padding;
              })
            .attr("y", function(d) {
                  var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
                  var row_level = Math.ceil(month(d) / (no_months_in_a_row));
                  return (week_diff*cellSize) + row_level*cellSize*8 - cellSize/2 - shift_up;
                })
            .datum(format);

        var month_titles = svg.selectAll(".month-title")
              .data(function(d) {
                return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
              .enter().append("text")
              .text(monthTitle)
              .attr("x", function(d, i) {
                var month_padding = 1.2 * cellSize*7* ((month(d)-1) % (no_months_in_a_row));
                return month_padding;
              })
              .attr("y", function(d, i) {
                var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
                var row_level = Math.ceil(month(d) / (no_months_in_a_row));
                return (week_diff*cellSize) + row_level*cellSize*8 - cellSize - shift_up;
              })
              .attr("class", "month-title")
              .attr("d", monthTitle);

        var year_titles = svg.selectAll(".year-title")  // Jan, Feb, Mar and the
              .data(function(d) {
                return d3.time.years(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
              .enter().append("text")
              .text(yearTitle)
              .attr("x", function(d, i) { return width/2 - 100; })
              .attr("y", function(d, i) { return cellSize*5.5 - shift_up; })
              .attr("class", "year-title")
              .attr("d", yearTitle);

      //  Tooltip Object
      var tooltip = d3.select("body")
          .append("div").attr("id", "tooltip")
          .style("position", "absolute")
          .style("z-index", "10")
          .style("visibility", "hidden")
          .text("a simple tooltip");

      // set data
      rect.filter(function(d) { return d in data; })
          .attr("class", function(d) { return "day " + color(data[d].value); })
          .select("title")
          .text(function(d) { return data[d].label; });

      rect.on("mouseover", mouseover);
      rect.on("mouseout", mouseout);
      function mouseover(d) {
        tooltip.style("visibility", "visible");
        var purchase_text = data[d].label;

        //  Tooltip
        tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);

        tooltip.html(purchase_text)
                    .style("left", (d3.event.pageX)+30 + "px")
                    .style("top", (d3.event.pageY) + "px");
      }
      function mouseout (d) {
        tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        var elements = document.getElementsByClassName('tooltip');
        while(elements.length > 0){
          elements[0].parentNode.removeChild(elements[0]);
        }
      }

    },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
