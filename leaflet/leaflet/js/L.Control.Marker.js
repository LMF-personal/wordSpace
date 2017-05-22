/*************************添加标绘控件开关**********************************************************/
		L.Control.Marker = L.Control.extend({
			options: {
				position: 'topright' //初始位置
		
			},
			initialize: function (options) {
				L.Util.extend(this.options, options);
		
			},
			onAdd: function (map) {
			   //创建一个class为leaflet-control-clegend的div
				this._container = L.DomUtil.create('div', 'leaflet-control-showMeasure');
				//创建一个图片要素
				var lengthImg = document.createElement('img');
				//legendimg.className = 'leaflet-control-formatLengthImg';
				lengthImg.type = 'img';
				lengthImg.src = "images/marker.png";
				this._lengthImg = lengthImg;
				this._container.appendChild(this._lengthImg);
				L.DomEvent.addListener(this._container, 'click', createMarker);
				return this._container;
			}
		});
		
	L.control.Marker = function (options) {
	    return new L.Control.Marker();
	};

		
var markerControl;
function createMarker(e){
	//$("<div class='leaflet-control-toggle'><div id='#'></div></div>");
	if(markerControl){
		map.removeControl(markerControl);
		markerControl=undefined;
	}else{
		markerControl=new L.Control.ShowMarker().addTo(map);
	}
	e.stopPropagation();
}



/*************************添加标绘控件**********************************************************/
		L.Control.ShowMarker = L.Control.extend({
			options: {
				position: 'topright' //初始位置
		
			},
			initialize: function (options) {
				L.Util.extend(this.options, options);
		
			},
			onAdd: function (map) {
			   //创建一个class为leaflet-control-clegend的div
				this._container = L.DomUtil.create('div', 'leaflet-control-measure');
				L.DomUtil.addClass(this._container,'leaflet-control-marker');
				
				var pointContainer=document.createElement('div');
				this._pointContainer=pointContainer;
				//创建一个图片要素
				var pointImg = document.createElement('img');
				//legendimg.className = 'leaflet-control-formatLengthImg';
				pointImg.type = 'img';
				pointImg.src = "images/point_blue.png";
				this._pointImg = pointImg;
				this._pointContainer.appendChild(this._pointImg);
				this._container.appendChild(this._pointContainer);
				L.DomEvent.addListener(this._pointContainer, 'click', pointMarker);
				
				var lineContainer=document.createElement('div');
				this._lineContainer=lineContainer;
				//创建一个图片要素
				var lineImg = document.createElement('img');
				//legendimg.className = 'leaflet-control-formatLengthImg';
				lineImg.type = 'img';
				lineImg.src = "images/line_blue.png";
				this._lineImg = lineImg;
				this._lineContainer.appendChild(this._lineImg);
				this._container.appendChild(this._lineContainer);
				L.DomEvent.addListener(this._lineContainer, 'click', lineMarker);
				
				var polygonContainer=document.createElement('div');
				this._polygonContainer=polygonContainer;
				//创建一个图片要素
				var polygonImg = document.createElement('img');
				//legendimg.className = 'leaflet-control-formatLengthImg';
				polygonImg.type = 'img';
				polygonImg.src = "images/polygon_blue.png";
				this._polygonImg = polygonImg;
				this._polygonContainer.appendChild(this._polygonImg);
				this._container.appendChild(this._polygonContainer);
				L.DomEvent.addListener(this._polygonContainer, 'click', polygonMarker);
				
				var clearContainer=document.createElement('div');
				this._clearContainer=clearContainer;
				//创建一个图片要素
				var clearImg = document.createElement('img');
				//legendimg.className = 'leaflet-control-formatLengthImg';
				clearImg.type = 'img';
				clearImg.src = "images/clear_blue.png";
				this._clearImg = clearImg;
				this._clearContainer.appendChild(this._clearImg);
				this._container.appendChild(this._clearContainer);
				L.DomEvent.addListener(this._clearContainer, 'click', clearMarker);
				
				return this._container;
			},
//			onRemove: function (map) 
//				L.DomUtil.addClass(this._container,'leaflet-control-measureTras');
//			}
		});
	
var markerGroup=L.layerGroup([]);

var moveMarker=L.marker([0, 0],{
	zIndexOffset:marker_zindex
});

var clickFunction;
var dblclickFunction;
var moveFunction;

function pointMarker(e){
	cancleAllListener();
	markerGroup.addTo(map);
	var clickLocation;
	
	clickFunction=function addClickMarker(e){  
		$("#map").css("cursor","default");
		clickLocation=[e.latlng.lat,e.latlng.lng];
//		console.log(clickLocation);
		cancleAllListener();
		var pointMarker=L.marker(clickLocation).addTo(markerGroup);
		$(".coverAll").css("display","block");
		
		$("#confrimBtn").one("click", function(){
			var tips="暂无备注";
			if($("#markerTip").val()!=null&&$("#markerTip").val().length!=0){
				tips=$("#markerTip").val();
			}
			pointMarker.bindPopup(tips,{
				autoClose:false
			}).openPopup();
			$(".coverAll").css("display","none");
			$("#markerTip").val("");
			$("#confrimBtn").unbind();
			$("#cancleBtn").unbind();
		});
		$("#cancleBtn").one("click", function(){
			pointMarker.removeFrom(markerGroup);
			$(".coverAll").css("display","none");
			$("#markerTip").val("");
			$("#confrimBtn").unbind();
			$("#cancleBtn").unbind();
		});
	}
	map.once("click",clickFunction);
	
	moveFunction=function addMoveMarker(e){
		$("#map").css("cursor","pointer");
		moveMarker.addTo(markerGroup);
		moveMarker.setLatLng(e.latlng);
	}
	map.on("mousemove",moveFunction);
	
	e.stopPropagation();
}


function lineMarker(e){
	cancleAllListener();
	markerGroup.addTo(map);
	var clickLocation;
	var poly_line=new L.Polyline([],{
		color:'red',
		opacity:0.6,
		weight:3
	});//折线
	var dashLine=new L.Polyline([],{
		color:'red',
		opacity:0.6,
		dashArray: [10, 10],
		weight:3
	});
	
	
	clickFunction=function addClickLatlng(e){
		clickLocation=[e.latlng.lat,e.latlng.lng];
		poly_line.addLatLng(e.latlng);
		poly_line.addTo(markerGroup);
	};
	map.on('click',clickFunction);
	
	dblclickFunction=function addLineMarker(){
		cancleAllListener();
		map.removeLayer(dashLine);
		if(markerGroup.hasLayer(poly_line)&&poly_line.getLatLngs().length>2){
			$(".coverAll").css("display","block");
			$("#confrimBtn").one("click", function(){
				var tips="暂无备注";
				if($("#markerTip").val()!=null&&$("#markerTip").val().length!=0){
					tips=$("#markerTip").val();
				}
				poly_line.bindPopup(tips,{
					autoClose:false
				}).openPopup(L.latLng(clickLocation[0],clickLocation[1]));
				$(".coverAll").css("display","none");
				$("#markerTip").val("");
				$("#confrimBtn").unbind();
				$("#cancleBtn").unbind();
			});
			$("#cancleBtn").one("click", function(){
				poly_line.removeFrom(markerGroup);
				$(".coverAll").css("display","none");
				$("#markerTip").val("");
				$("#confrimBtn").unbind();
				$("#cancleBtn").unbind();
			});
		}else{
			map.removeLayer(poly_line);
		}
	}
	map.once('dblclick',dblclickFunction);
	
	moveFunction=function addDashLine(e){
		$("#map").css("cursor","pointer");
		if(clickLocation){
			dashLine.setLatLngs([clickLocation,[e.latlng.lat,e.latlng.lng]]);
			dashLine.addTo(markerGroup);
		}
	}
	map.on("mousemove",moveFunction);
	
	e.stopPropagation();
}

function polygonMarker(e){
	cancleAllListener();
	markerGroup.addTo(map);
	var poly_points = [];//区域点
	//console.log(ploy_points);
	var poly_area=new L.polygon([],{
		color:'red',
		opacity:0.6,
		weight:3,
		fillColor: 'red',
		fillOpacity:0.1
	});
	
	var poly_now=new L.polygon([],{
		color:'red',
		opacity:0.6,
		weight:3,
		dashArray: [10, 10],
		fillColor: 'red',
		fillOpacity:0.3
	});
	
	
	
	clickFunction=function addClickLatlng(e){
		//console.log(e.latlng);
		poly_points.push([e.latlng.lat,e.latlng.lng]);
	}
	map.on('click',clickFunction);
	
	dblclickFunction=function addPloygonMarker(){
		cancleAllListener();
		map.removeLayer(poly_now);		
		
		if(poly_points.length>2){
			poly_area.setLatLngs(poly_points).addTo(markerGroup);
			$(".coverAll").css("display","block");
		
			$("#confrimBtn").one("click", function(){
				var tips="暂无备注";
				if($("#markerTip").val()!=null&&$("#markerTip").val().length!=0){
					tips=$("#markerTip").val();
				}
				poly_area.bindPopup(tips,{
					autoClose:false
				}).openPopup(L.latLng(poly_points[poly_points.length-1][0],poly_points[poly_points.length-1][1]));
				$(".coverAll").css("display","none");
				$("#markerTip").val("");
				$("#confrimBtn").unbind();
				$("#cancleBtn").unbind();
			});
			$("#cancleBtn").one("click", function(){
				poly_area.removeFrom(markerGroup);
				$(".coverAll").css("display","none");
				$("#markerTip").val("");
				$("#confrimBtn").unbind();
				$("#cancleBtn").unbind();
			});
		}
		
	}
	map.once('dblclick',dblclickFunction);
	
	moveFunction=function addPolyNow(e){
		if(poly_points.length>0){
			poly_now.setLatLngs(poly_points);
			poly_now.addLatLng([e.latlng.lat,e.latlng.lng]).addTo(markerGroup);
		}
	}
	map.on("mousemove",moveFunction);
	e.stopPropagation();
}

function clearMarker(e){
	cancleAllListener();
	markerGroup.clearLayers();
	e.stopPropagation();
}

function cancleAllListener(){
	if(clickFunction){
		map.off('click',clickFunction);
	}
	if(dblclickFunction){
		map.off('dblclick',dblclickFunction);	
	}
	if(moveFunction){
		map.off('mousemove',moveFunction);
	}
	if(moveMarker){
		moveMarker.removeFrom(map);
	}
	if(moveIcon){
		moveIcon.removeFrom(map);
	}
}