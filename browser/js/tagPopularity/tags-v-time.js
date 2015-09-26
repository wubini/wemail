app.config(function ($stateProvider) {
    $stateProvider
    .state('tags', {
        url: '/tags',
        templateUrl: 'js/tagPopularity/tags-v-time.html',
        resolve: {
          allEmails: function(EmailFactory){
            return EmailFactory.getAll();
          }
        },
        controller: 'TagGraphCtrl'
    });
});

app.controller("TagGraphCtrl", function($scope, allEmails){
  console.log("in tag graph ctrl")
  $scope.allEmails = allEmails.map((email) => {
    email.date = new Date(email.timestamp);
    return email;
  })

  var datasetObj = {};

  $scope.allEmails.forEach((email) => {
    if(datasetObj[email.date]){
      datasetObj[email.date].freq ++;
    }
    else {
      datasetObj[email.date] = {
        date: email.date,
        freq: 1
      }
    }
  });

  var dataset = _.values(datasetObj);

  var width = 500;
  var height = 250;

  // Create the SVG 'canvas'
  var svg = d3.select("body")
      .append("svg")
      .attr("viewBox", "0 0 " + width + " " + height)

  // get the data
  // var dataset = [
  //     { date: new Date(2013, 10, 1), freq: 1 },
  //     { date: new Date(2013, 10, 2), freq: 2 },
  //     { date: new Date(2013, 10, 3), freq: 3 },
  //     { date: new Date(2013, 10, 4), freq: 0 },
  //     { date: new Date(2013, 10, 5), freq: 5 },
  //     { date: new Date(2013, 10, 6), freq: 6 },
  //     { date: new Date(2013, 10, 7), freq: 7 }
  // ];

  // Define the padding around the graph
  var padding = 50;

  // Set the scales
  var minDate = d3.min(dataset, function(d) { return d.date; });
  minDate.setDate(minDate.getDate());

  var maxDate = d3.max(dataset, function(d) { return d.date; });

  var xScale = d3.time.scale()
      .domain([minDate, maxDate])
      .range([padding, width - padding]);

  var yScale = d3.scale.linear()
      .domain([0, d3.max(dataset, function(d) { return d.freq; })])
      .range([height - padding, padding]);

  // x-axis
  var format = d3.time.format("%d %b");
  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .tickFormat(format)
      .ticks(d3.time.days, 1);

  svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);

  // y-axis
  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .tickFormat(function (d) { return d; })
      .tickSize(5, 5, 0)
      .ticks(5); // set rough # of ticks

  svg.append("g")
      .attr("class", "axis y-axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

  // draw line graph
  var line = d3.svg.line()
      .x(function(d) {
          return xScale(d.date);
      })
      .y(function(d) {
          return yScale(d.freq);
      });

  svg.append("svg:path").attr("d", line(dataset));

  // plot circles
  svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .attr("cx", function(d) {
          return xScale(d.date);
      })
      .attr("cy", function(d) {
          return yScale(d.freq);
      })
      .attr("r", 5);

});
