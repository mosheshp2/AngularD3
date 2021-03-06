'use strict';

/* Directives */
var d3Directives=angular.module('d3Directives', []);
d3Directives.directive('donutChart',['$http', function($http){
	return {
		link: function($scope,element){
			var data = $scope.data;
			var color= d3.scale.category10();

			var width = element.clientWidth || 300;
			var height = element.clientHeight || 300;
			var min= Math.min(height,width);
			var pie = d3.layout.pie().sort(null);
			var arc = d3.svg.arc()
				.outerRadius(min / 2 *0.9)
				.innerRadius(min / 2 *0.5);
			var svg = d3.select(element[0]).append('svg')
				.attr({width : width,height:height} )
				.append('g')
				.attr('transform', 'translate(' +width /2 + ',' +height / 2 + ')');
			svg.selectAll('path').data(pie(data))
				.enter().append('path')
				.style('stroke','white')
				.attr('d',arc)
				.attr('fill',function(d, i){ return color(i); });

		},
		restrict:'E',
		scope:{
			data: '=',
			height: '=',
			width: '='
		}

	};

}]);

var myDirective = d3Directives.directive('stackGraph',[function(){
	return {
		link:function($scope,$element){

			var KEY_COLUMN = 'Date';
			var margin = {top: 20, right: 20, bottom: 50, left: 40};
			var width = ($scope.width || 960) - margin.left - margin.right,
                height = ($scope.height || 540) - margin.top - margin.bottom;

            var x = d3.scale.ordinal()
                   .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
                   .rangeRound([height, 0]);

                    var color = d3.scale.ordinal()
                        .range(["#98abc5", "#8a89a6", "#7b6888" ,"#ff8c00", "#6b486b", "#a05d56", "#d0743c"]);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .tickFormat(d3.format(".2s"));

                    var svg = d3.select($element[0]).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");





					myDirective.clearHover = function(){
						if(myDirective.state)
								myDirective.state.style({
									'stroke':'',
									'strokeDasharray':''
								 });
						if(myDirective.text)
							myDirective.text.attr('fill','');

						if(myDirective.rects)
							myDirective.rects.style({
													'stroke':'',
													'strokeDasharray':''
												});

					};

					$scope.$parent.$watch($scope.data,function(newVal, oldVal){
						if(newVal == null || !angular.isArray(newVal)) return;
						var data = newVal;

                      	color.domain(d3.keys(data[0]).filter(function(key) { return key !== KEY_COLUMN && key.indexOf('$$')==-1; }));

                      	data.forEach(function(d) {
	                        var y0 = 0;
	                        d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: +d[name]}; });
	                        d.total = d3.max(d.ages).y1;
    	                  });


						  x.domain(data.map(function(d) { return d[KEY_COLUMN]; }));
						  y.domain([0, d3.max(data, function(d) { return d.total; })]);

						  svg.append("g")
							  .attr("class", "x axis")
							   .attr("transform", "translate(0," + height + ")")
							   .attr("y",height)
							  .call(xAxis)
						     .selectAll("text")
								   .style("text-anchor", "end")
								   .attr("dx", "-.8em")
								   .attr("dy", ".15em")
								   .attr("transform", function(d) {
									   return "rotate(-45)"
								   });

						  svg.append("g")
							  .attr("class", "y axis")
							  .call(yAxis)
							.append("text")
							  .attr("transform", "rotate(-90)")
							  .attr("y", 6)
							  .attr("dy", ".71em")
							  .style("text-anchor", "end")
							  .text("Count");

					       var state = svg.selectAll(".state")
							  .data(data)
							 .enter().append("g")
							  .attr("class", "g")
							  .attr("x",0)
							  .attr("y",0)
							  .attr("transform", function(d) { return "translate(0 ,0)"; })
							  .on('mouseover',function(e){
							  	  myDirective.clearHover();
							  	  myDirective.rects = d3.select(this)
							  	  			 .selectAll('rect')
											 .style({
												'stroke':'blue',
												'strokeDasharray':'5,5',
												'strokeWidth':3
											 });
								 var hoverData;
								 var dMonth = d3.select(this)
												.filter(function(d){
													hoverData = d;
													return true;
												});
								 if(hoverData){
									$scope.$parent.$apply(function(){
										$scope.$parent.$emit('hoverGraph',hoverData);
									});
									myDirective.text = svg.selectAll("g")
														  .filter(function(d){
															  return d != null && d == hoverData[KEY_COLUMN];
														  })
														  .attr('fill','blue');
								 }
							  });


						  var enters = state.selectAll("rect")
							  .data(function(d) { return d.ages; })
							.enter();

						  var rect = enters
							.append("rect")
							 .attr("width", x.rangeBand())
							  .attr("y", function(d) { return height; })
							  .attr("height", function(d) { return 0; })
							  .style("fill", function(d) { return color(d.name); })
							  .on('click',function(e){
									myDirective.openPopup(d3.select(this),e.name);
							  });
						var tinyTexts = enters.append("text")
								.attr("y",height)
								.text(function(d){
									return d.y1;//[d.name];
								});

 						 state.transition()
 						 	  .delay(function(d,i){ return i * 50; })
						  	  .attr("transform", function(d) { return "translate(" + x(d[KEY_COLUMN]) + ",0)"; })
						  	  //.attr("x",function(d){return x(d[KEY_COLUMN]);})
						  	  .each("end", function (e, i) {
						  	  	  d3.select(this)
						  	  	  	.selectAll('rect')
						  	  	  	.transition()
                                    .delay(function(d,i){ return i * 10; })
                                    .duration(1500)
                                    .ease('elastic')
						  	  	  	.attr("y", function(d) { return y(d.y1); })
									.attr("height", function(d) { return y(d.y0) - y(d.y1); });

								d3.select(this)
									.selectAll('text')
									.transition()
									.delay(function(d,i){ return i * 10; })
									.duration(1500)
									.ease('elastic')
									.attr("y", function(d) { return y(d.y1) +10; });
						  	  });

						  var legend = svg.selectAll(".legend")
							  .data(color.domain().slice().reverse())
							.enter().append("g")
							  .attr("class", "legend")
							  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

						  legend.append("rect")
							  .attr("x", width - 18)
							  .attr("width", 18)
							  .attr("height", 18)
							  .style("fill", color);

						  legend.append("text")
							  .attr("x", width - 24)
							  .attr("y", 9)
							  .attr("dy", ".35em")
							  .style("text-anchor", "end")
							  .text(function(d) { return d; });

							var popupPoint = [100,120];
							var popupSize = 120;
							var legHeight = 30;
							var polyXY=[
								{ x : popupPoint[0] - popupSize / 2, y : popupPoint[1] - popupSize - legHeight},
								{ x : popupPoint[0] + popupSize / 2, y : popupPoint[1] - popupSize - legHeight},
								{ x : popupPoint[0] + popupSize / 2, y : popupPoint[1] - legHeight},
								{ x : popupPoint[0] , y : popupPoint[1]},
								{ x : popupPoint[0] - popupSize / 2, y : popupPoint[1] - legHeight}
							];

							var textData = [0,20].map(function(d){
								return {
									x:  popupPoint[0] - popupSize / 2 + 10,
									y: popupPoint[1] - popupSize - legHeight + 20 + d,
									color: 'red',
									text: 'Popup'
								};
							});
							var gPopup = svg.append("g")
										 .attr("opacity","0");
							var popup =gPopup.selectAll("polygon")
										.data([polyXY]).enter()
										.append("polygon")
										 .attr("points",function(d) {
												return d.map(function(d) { return [d.x,d.y].join(","); }).join(" ");
										 })
										 //.attr("class","shadow")
										 .style({
													'strokeDasharray':'5,5',
													'stroke':'red',
													fill:'white'
												});
							var circle = gPopup.append("circle")
								.attr("cx",polyXY[0].x)
								.attr("cy",polyXY[0].y)
								.attr("r",10)
								.attr("fill","red")
								.on("click",function(e){
									myDirective.closePopup();
								});
							var line = gPopup.selectAll("line")
								.data([[-5,-5],[5,-5]]).enter()
								.append("line")
								.attr("x1",function(d){return polyXY[0].x+d[0];})
								.attr("y1",function(d){return polyXY[0].y+d[1];})
								.attr("x2",function(d){return polyXY[0].x-d[0];})
								.attr("y2",function(d){return polyXY[0].y-d[1];})
								.attr("width", '2')
								.style({
									'stroke':'black',
									'fill':'black',
									'strokeWidth':6
								});


							var popupText = gPopup.selectAll("text")
								.data(textData).enter()
								.append("text")
								.attr('x', function(d){return d.x;})
								.attr('y', function(d){return d.y;})
								.style('fill', function(d){return d.color;})
								.text(function(d){return d.text;});

							var sizePie = 100;
							var gPie = gPopup.append('g')
									.attr('transform', 'translate(' +(sizePie )+ ',' +(sizePie -40)+ ')');


							myDirective.openPopup = function(element,propName) {
								var eData = null;
								var eParent = element[0][0].parentNode;
								d3.select(eParent).filter(function(d){
									eData = d;
									return true;
								});
								var text = [eData[KEY_COLUMN],propName+ ' = '+ eData[propName]];
								var popupText = gPopup.selectAll("text").each(function(node,i,j){
									node.text = text[i];									
									d3.select(this).text(text[i]);

								});
								
								var Columns =  Object.getOwnPropertyNames(eData);
								var dataArray=[], dataKeyArray=[];
								for(var i in Columns){
									if(angular.isNumber(eData[Columns[i]] && Columns[i]!="total") ){
										dataArray.push(eData[Columns[i]]);
										dataKeyArray.push({
											key:Columns[i],
											d:eData[Columns[i]]
										});
									}	
								}
								dataArray=[eData.WsSearches,eData.TotalSearches,eData.IpSearches,eData.Books];

								var pie = d3.layout.pie();//.sort(null);
								var arc = d3.svg.arc()
									.outerRadius(sizePie / 2 *0.9)
									.innerRadius(sizePie / 2 *0.3);
								
								var pieData = pie(dataArray);
								gPie.selectAll("path").remove();
								gPie.selectAll('path').data(pieData)
									.enter().append('path')
									.style('stroke','white')
									.attr('d',function(d){
										 var myArc = arc(d);
										 return myArc;
									})
									.attr('fill',function(d, i){ return color(i); });


 								var x = d3.transform(d3.select(eParent).attr("transform")).translate[0];
								var y = +element.attr("y");
								var width = +element.attr("width");
								var pp= {x: x-20 - popupSize /2 - width /2, y: y - popupSize +20}
								pp.y = pp.y < -30 ? -30 : pp.y;

								gPopup.transition()
								 	.duration(500)
								 	.ease("elastic")
								 	.attr("transform","translate("+pp.x+","+pp.y+")")
								 	.attr("opacity","1");

							};
							myDirective.closePopup=function(){
								gPopup.transition().duration(300)
									.attr("opacity",0);
							};

					});
					$scope.$parent.$watch('lastClick',function(newVal,oldVal){
						if(newVal!=null &&newVal.key){ 
						myDirective.gridMarked = svg.selectAll("g")
							.filter(function(d){
								return d3.select(this).classed('g') && d != null && d[KEY_COLUMN] == newVal.key;
							}).selectAll("rect").filter(function(d){
								return d.name == newVal.col;
							});
						myDirective.openPopup(myDirective.gridMarked,newVal.col);
						}

					});
					$scope.$parent.$watch($scope.databold,function(newVal,oldVal){
						if(newVal == null) return;
                    	var month = newVal;

						myDirective.clearHover();

                     	myDirective.state = svg.selectAll("g")
                    		.filter(function(d){
                    				return d3.select(this).classed('g') && d != null && d[KEY_COLUMN] == newVal.key;
                    		})
                    		.style({
                    			'stroke':'red',
                    			'strokeDasharray':'5,5'
                    		});
                    	myDirective.text = svg.selectAll("g")
									  .filter(function(d){
									      return d != null && d == newVal.key;
									  })
									  .attr('fill','red');
					});
		},
		restrict:'E',
		scope:{
			data: '=',
			height: '=',
			width: '=',
			databold: '='
		}
	};
}]);
function endAll (transition, callback) {
    var n;

    if (transition.empty()) {
        callback();
    }
    else {
        n = transition.size();
        transition.each("end", function () {
            n--;
            if (n === 0) {
                callback();
            }
        });
    }
}