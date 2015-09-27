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
  $scope.minDate = new Date(2014, 9, 1);
  $scope.maxDate = new Date(2015, 10, 10);

  $scope.colors = [
    "skyblue",
    "limegreen",
    "hotpink",
    "purple",
    "orange",
    "darkblue"
  ]

  var xScale, yScale, padding, width, height;
  var svg = setUpGraph();

  //this is done just once
  $scope.allEmails = allEmails.map((email) => {
    email.timestamp = new Date(email.timestamp);
    email.date = new Date(email.timestamp.getFullYear(), email.timestamp.getMonth(), email.timestamp.getDate());
    return email;
  })

  $scope.lineArray = []; //an array of objects {tags:_, dataset: _}

  $scope.addSearch = (str) => {
    console.log("adding search");
    var tagsArray = strToArray(str);
    console.log("tagsArray", tagsArray);
    var filteredEmails = getFilteredEmails(tagsArray);
    var dataset = getDataSet(filteredEmails);
    $scope.lineArray.push({
      tags: tagsArray,
      dataset: dataset
    });
    drawLines();
  }
  //this is done for every search
  function strToArray(str){
    return str.split(" ");
  }

  function drawOneLine(dataset, color){
    console.log("drawing line for dataset", dataset);
    // draw line graph

    var line = d3.svg.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.freq))
        .interpolate('linear');

    svg.append("svg:path")
      .attr("d", line(dataset))
      .attr("stroke", color);

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
  }

  function drawLines(){

    d3.selectAll("path.line").remove();

    xScale = d3.time.scale()
        .domain([$scope.minDate, $scope.maxDate])
        .range([padding, width - padding]);

    var maxY = _.max($scope.lineArray, line => {
      return line.freq;
    });

    yScale = d3.scale.linear()
        .domain([0, maxY])
        .range([height - padding, padding]);

    $scope.lineArray.forEach((line, index)=> {
      drawOneLine(line.dataset, $scope.colors[index]);
    });
  }

  function getFilteredEmails(searchTagsArr){
    return $scope.allEmails.filter((email) => {
      var include = true;
      searchTagsArr.forEach((tag) => {
        if(email.tags.indexOf(tag)<0) {
          include = false;
        }
      });
      return include;
    });
  }

  function getDataSet(filteredEmails){

    var datasetObj = {};

    filteredEmails.forEach((email) => {
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

    for(var date = $scope.minDate; date<$scope.maxDate; date = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1))
    {
      if(_.findIndex(dataset, (datapoint) => {
        return datapoint.date===date;
      })<0) {
        dataset.push({
          date: date,
          freq: 0
        })
      }
    }

    dataset.sort((a,b) => {
      if(a.date<b.date){
        return -1;
      }
      if(a.date>b.date){
        return 1;
      }
      return 0;
    });

    return dataset;
    //console.log("my dataset", dataset);
  }

  function setUpGraph() {

    width = 500;
    height = 250;

    // Create the SVG 'canvas'
    var svg = d3.select("body")
        .append("svg")
        .attr("viewBox", "0 0 " + width + " " + height)

    // Define the padding around the graph
    padding = 50;

    // Set the scales
    //var minDate = d3.min(dataset, function(d) { return d.date; });
    //minDate.setDate(minDate.getDate());

    //var maxDate = d3.max(dataset, function(d) { return d.date; });

    xScale = d3.time.scale()
        .domain([$scope.minDate, $scope.maxDate])
        .range([padding, width - padding]);

    yScale = d3.scale.linear()
        .domain([0, 10])
        .range([height - padding, padding]);

    // x-axis
    var format = d3.time.format("%d %b");

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickFormat(format)
        .ticks(d3.time.weeks,5);

    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

    // y-axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(d => d)
        .tickSize(5, 5, 0)
        .ticks(5); // set rough # of ticks

    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    return svg;
  }

});
