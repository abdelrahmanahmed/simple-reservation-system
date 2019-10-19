var colour = ["", "#4372c2","#7d649d","#558000","#ffbf03", "#ed7d31","#008080", "#79b14e",  "#800000","#5d9bd6","#43C6DB","#C9BE62"];
function simGraphCall(){
	var graphAjaxURL = sessionStorage.gatewayurl+sessionStorage.simGraph;
			$.ajax({
	                method: "GET",
	                async: true,
					url: graphAjaxURL,
					headers: {
					  'Authorization': localStorage.jwtToken,
					},
	                jsonpCallback:'jsonCallback',
					crossDomain : true,
					dataType: "json"
			}).success(function(data) {	
					var availableCount=0;
					var blockCount=0;
					$('.statistic-date').html(' (as on '+(new Date()).format('dd/mm/yy')+')');
					if(data.length==0){
						$('#empty-sim').html('0 SIMs Available');
						$('#graph-slate').css('display','block');
						$('#empty-sim').css('display','block');
						$('#viewMore_graph').css('display','none');
						
					}else{
						var dataTestBar = [{ "type" : "date",
									"values" : [ "17/2/2016" ]
						}];
						var obj = {};
						$('#empty-sim').css('display','none');
						var temp = data.length;
						if(temp<10){
							temp=data.length;
						}else{
							temp =10;
						}
						for(i=0;i<temp;i++){
							var profileType = data[i].PROFILE_TYPE;
							var iccidCount = parseInt(data[i].SIM_COUNT);
							if(!(profileType === null)){
								obj = { 
									type: profileType,
									values: [iccidCount]
								};
								dataTestBar.push(obj);
							}
						}
						localStorage.sim_graph_data=JSON.stringify(dataTestBar); 
						Canvas($("#sim-graph"), false, dataTestBar,false,"bar");
						if(data.length < 11)
						{
							$("#viewMore_graph").hide();
						}
						else{
							$('#popup4').find('tbody').empty();
							$("#viewMore_graph").show();
							for(i=0; i< data.length;i++){
								var profileType = data[i].PROFILE_TYPE;
								var iccidCount = parseInt(data[i].SIM_COUNT);
								$('#popup4').find('tbody').append('<tr><td>'+profileType+'</td>'+'<td>'+iccidCount+'</td>'+'</tr>');
							}
						}
	            	}
				}).error(function(error){
					if(error.status === 0 && !localStorage.jwtToken) {
                      logoutClient();
                    }else {
					  var dataTestBar=[];
					  localStorage.sim_graph_data=JSON.stringify(dataTestBar);
					  Canvas($("#sim-graph"), false, dataTestBar,false,"bar");
					}
	            });
				errori18();
}

$('#viewMore_graph').click(function() {
	simGraphCall();
});

// create the canvas
//parameter list : 1-container id; 2-legend container id; 3-data to be plotted; 4- true/false; 5-histogram/line/bar ;
function Canvas(container,legend, data, grid, lines) {
	var parentWidth = container.width();
	var parentHeight = container.height();
	// create canvas and set its width and height
	var element = document.createElement("canvas");
	
	if (lines=="bar"){
		element.height=70;
		element.width = parentWidth-23;
		(container).empty();
	}
	else{
		element.className = "cls";
		element.width = parentWidth - 63;
		element.height = parentHeight - 160;

	}
	(container).append(element);
	var context = element.getContext("2d");
    
    if(data.length==0) {
			var errorText = "<div class='no_data_available' data-i18n=translation.no_data_available style='text-align: center;margin-top:-100px' ></div>";
		if(lines === 'bar') {
			$('#graph-slate').css('display','block');
			$('#viewMore_graph').css('display','none');
			errorText = "<div class='no_data_available' data-i18n=translation.no_sims_available style='text-align: center;margin-top:-35px;font-size: 28px;'></div>";
		}
		(container).append(errorText);
		translationi18();
	
	}else{
	// get the data and determine length and maxdata and write the scale
	var lengthOfData = data[0].values.length;
	var numberDataArray = [];
	for (j = 1; j < data.length; j++) {
		for (i = 0; i < lengthOfData; i++) {

			var y = parseFloat(data[j].values[i]);

			numberDataArray.push(y);
		}
	}
	var numberDataMax = Math.max.apply(Math, numberDataArray);

	//create a scale based on max data
	
	var noOfDigits=	Math.max(Math.floor((Math.log(Math.abs(numberDataMax)))/Math.LN10), 0) + 1;
	var scaleAll=Math.pow(10, (noOfDigits-1));
	
	// create a gray grid
	// grid width and height

	var noOfColumns = lengthOfData;
	var maxData = numberDataMax;
	var noOfRows = Math.floor(maxData / scaleAll) + 1;
	var canvasWidth = parentWidth - 63;
	var canvasHeight = parentHeight - 180;
	var cellWidth = canvasWidth / noOfColumns;
	var cellHeight = canvasHeight / noOfRows;
	var p = 10;

	if(grid){
	// draw vertical lines
	for (var x = 0; x <= canvasWidth; x += cellWidth) {
		context.moveTo(x, 0);
		context.lineTo(x, canvasHeight);
	}
	// draw horizontal lines
	for (var x = 0; x <= canvasHeight; x += cellHeight) {
		context.moveTo(0, x);
		context.lineTo(canvasWidth, x);
	}

	context.strokeStyle = "#d5d5d5";
	context.stroke();
	// end for grid
	
	// write legend
	var bufferLegend="";
	var leftScale="";
	
	var legendDataPoints = [];
	//Object.assign(legendDataPoints,data);
	legendDataPoints=JSON.parse(JSON.stringify(data));
	legendDataPoints.shift();
	legendDataPoints = sortByKey(legendDataPoints, "type");

	for (j = 0; j < legendDataPoints.length; j++) {
		leftScale=((j-1)*45)+ 45;
		var element_lgnd = document.createElement("canvas");
		element_lgnd.className = "cls-lgnd";
		element_lgnd.width = 30;
		element_lgnd.height = 30;
		legend.append(element_lgnd);
		var context_lgnd = element_lgnd.getContext("2d");
		context_lgnd.beginPath();
		context_lgnd.moveTo(2, 25);
		context_lgnd.lineWidth=8;
		context_lgnd.lineTo(25, 25);
		context_lgnd.strokeStyle = legendDataPoints[j].colour;
		context_lgnd.stroke();
		context_lgnd.closePath();
		bufferLegend = "<div class='legend' style='left:"+ leftScale+ "px'>"+legendDataPoints[j].type+"</div>";
		legend.append(bufferLegend);
	}
	
	// end legend

	// write the axes
	// write x-scale
	for (i = 0; i < lengthOfData; i++) {

		var text_width_x = cellWidth * i + 52;
		var text_height = parentHeight - 58 ;

		var scale_line_x = "<div style='top:" + text_height + "px;left:"
				+ text_width_x + "px;width:" + cellWidth
				+ "px'class='x-ax-scale-list'>" + data[0].values[i] + "</div>";
		(container).append(scale_line_x);
	}

	// write y-scale
	for (i = 0; i <= noOfRows; i++) {
		var text_width_y = cellHeight * (noOfRows - i) + 97;
		var scale_line_y = "<div style='top:" + text_width_y + "px;left:" + 9
				+ "px;width:" + cellWidth + "px'class='y-ax-scale-list'>" + scaleAll
				* i + "</div>";
		(container).append(scale_line_y);
	}

	// end write the axes
	}
	// line graph
	if(lines=="lines"){
	// plot the points
	for (i = 0; i < lengthOfData; i++) {
		var dataHeight = noOfRows * scaleAll;
		for (j = 1; j < data.length; j++) {
			var pointPos = (cellHeight / scaleAll) * data[j].values[i];
			context.moveTo(25 + i * cellWidth, canvasHeight - pointPos);
			context.beginPath();
			context.arc(25 + i * cellWidth, canvasHeight - pointPos, 2, 0, 2 * Math.PI);
			context.strokeStyle = "black";
			context.stroke();
		}
	}

	// plot the lines
	for (j = 1; j < data.length; j++) {	
			context.beginPath();
			
			context.moveTo(25 , canvasHeight - ((cellHeight / scaleAll) * data[j].values[0]));
			
			for (i = 0; i < lengthOfData; i++) {			
			var pointPos = (cellHeight / scaleAll) * data[j].values[i];			
			context.lineTo(25 + i * cellWidth, canvasHeight - pointPos);
			
		}
			context.lineWidth=2;
			context.strokeStyle = data[j].colour;
			context.stroke();
			context.closePath();
	}
}
	 else if (lines == "bar") {
  // plot bars
  // sim inv
  canvasWidth = parentWidth - 23;
  // calculate scale
  var sum = 0;
  var count = 0;
  for (j = 1; j < data.length; j++) {
    sum = sum + data[j].values[0];
    count = count + 1;
  }

  var leftScale;
  var scale = canvasWidth / sum;
  var bufferPT = 0;
  var minimal_sum = 0;
  var scale_deviation = 0;
  var minimal_value = [];
  for (j = 1; j < data.length; j++) {
    if (data[j].values[0] * scale < 50) {
      count = count - 1;
      minimal_sum = minimal_sum + (50 - data[j].values[0] * scale);
    } else {
      minimal_value.push(data[j].values[0]);
    }
  }
  var temp = minimal_sum;
  temp = minimal_sum / scale;
  scale_deviation = temp / count;
  for (j = 0; j < minimal_value.length; j++) {
    if ((minimal_value[j] - scale_deviation) * scale < 50) {
      count = count - 1;
    }
  }
  minimal_sum = minimal_sum / scale;
  scale_deviation = minimal_sum / count;
  for (j = 1; j < data.length; j++) {
    context.beginPath();
    var dataPt = data[j].values[0];
	var widh=0;
    context.fillStyle = colour[j];
    if ((data[j].values[0] - scale_deviation) * scale < 50) {
      context.fillRect(bufferPT + 10, 15, 50, 50);
	  widh=50;
    } else {
      context.fillRect(bufferPT + 10, 15, (dataPt - scale_deviation) * scale, 50);
	  widh=(dataPt-scale_deviation)*scale;

    }
    context.closePath();
    context.beginPath();
    context.fillStyle = "white";
    if ((data[j].values[0] - scale_deviation) * scale < 50) {
      context.fillText(data[j].values[0], bufferPT + 23, 45);
      leftScale = 15 + bufferPT;
    } else {
      context.fillText(data[j].values[0], (bufferPT + 10 + ((dataPt - scale_deviation) * scale / 2)), 45, dataPt * scale);
      leftScale = ((dataPt - scale_deviation) * scale / 2) + bufferPT;
    }
    context.closePath();
    // scale and values
    var SubType = data[j].type;
    var type = "<div style='width:" + widh + "px'class='hist-scale-list'>" + SubType + "</div>";
    $("#sim-graph").append(type);
    if ((data[j].values[0] - scale_deviation) * scale < 50) {
      bufferPT = bufferPT + 50;
    } else {
      bufferPT = bufferPT + (dataPt - scale_deviation) * scale;
    }
  }
  }
	else if (lines=="histogram"){
	// plot histogram
	for (j = 1; j < data.length; j++) {	
		context.beginPath();
		for (i = 0; i < lengthOfData; i++) {
			var pointPos = (cellHeight / scaleAll) * data[j].values[i];
			context.moveTo((j*i*cellWidth/3)+ i*cellWidth, 0);
			context.fillStyle = data[j].colour;
			context.fillRect(i*cellWidth+((j-1)*(cellWidth / 2))+12-((j-1)*10), canvasHeight - pointPos,
					cellWidth / 4, pointPos);
		}
	context.closePath();
	}
}
    }
	
}

function BarGraph(container, data,lines) {
	var parentWidth = container.width();
	var parentHeight = container.height();
	// create canvas and set its width and height
	var element = document.createElement("canvas");
	element.className = "cls";
	element.width = parentWidth - 63;
	element.height = parentHeight - 100;
	(container).append(element);
	var context = element.getContext("2d");
	// get the data and determine length and maxdata and write the scale
	var lengthOfData = data[0].values.length;
}

//parameter list : 1-container id; 2-legend container id; 3-data to be plotted; 4- ; 5-histogram/line/bar ;
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

$(window).resize(function() {
	$('.no_data_available').remove();
	$('canvas').remove();
	$('.x-ax-scale-list').remove();
	$('.hist-scale-list').remove();
	$('.y-ax-scale-list').remove();
	$('.legend').remove();
	var pagename = window.location.pathname;
	var parts = pagename.split('/');
	if(parts[2] === 'Reporting.html') {
	Canvas($("#utilized_graph"),$("#util-legend"), JSON.parse(localStorage.utilized_graph_data),true,"lines");
	Canvas($("#available_graph"),$("#available-legend"),JSON.parse(localStorage.available_graph_data),true,"lines"); 
	Canvas($("#download_graph"),$("#download_profile-legend"),JSON.parse(localStorage.download_graph_data),true,"histogram");
	Canvas($("#ready_profile_graph"),$("#ready_profile-legend"),JSON.parse(localStorage.ready_profile_graph_data),true,"lines");
	} else {
	Canvas($("#sim-graph"), false, JSON.parse(localStorage.sim_graph_data),false,"bar");
	}
});
