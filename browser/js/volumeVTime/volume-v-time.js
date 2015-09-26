app.config(function ($stateProvider) {
    $stateProvider
    .state('volume', {
        url: '/volume',
        templateUrl: 'js/volumeVTime/volume-v-time.html',
        resolve: {
          allEmails: function(EmailFactory){
            return EmailFactory.getAll();
          }
        },
        controller: 'VolumeCtrl'
    });
});

app.controller("VolumeCtrl", function($scope, allEmails){
  console.log("in volume ctrl")
  $scope.allEmails = allEmails;

  var margin = {top: 10, right: 30, bottom: 30, left: 30},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var svg = d3.select("ui-view").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // var svg = d3.select('ui-view').append('svg')
  //   .attr('width', window.innerWidth)
  //   .attr('height', window.innerHeight);


  var values = $scope.allEmails.map(function(email){
    return (new Date(email.timestamp)).getHours();
  })

  // A formatter for counts.
  var formatCount = d3.format(",.0f");


  var x = d3.scale.linear()
      .domain([0, 24])
      .range([0, width]);

  // Generate a histogram, 24 bins
  var data = d3.layout.histogram()
      .bins(x.ticks(24))
      (values);

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.y; })])
      .range([height-50, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var bar = svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  bar.append("rect")
      .attr("x", 1)
      .attr("width", x(data[0].dx) - 1)
      .attr("height", function(d) { return height - y(d.y); });

  //text on each bar
  bar.append("text")
      .attr("dy", ".75em")
      .attr("y", 6)
      .attr("x", x(data[0].dx) / 2)
      .attr("text-anchor", "middle")
      .text(function(d) { return formatCount(d.y); });

  //y-axis title
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Emails Sent");

  //x-axis title
  svg.append("text")
      .attr("y", 0 + height)
      .attr("x",0 + width/2)
      .attr("dy", "3em")
      .style("text-anchor", "middle")
      .text("Hour of Day");

  //graph title
  svg.append("text")
      .attr("y", 0)
      .attr("x",0 - margin.left + width/2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Emails Sent vs Hour of Day");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,"+height/10+")")
      .call(yAxis);

});
