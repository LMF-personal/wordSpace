var measureNum=0;
var measure_layerGroup=[];
var marker_zindex=2000;

var moveIcon=L.marker([0, 0],{
	zIndexOffset:marker_zindex
});

var clickFunction;
var dblclickFunction;
var moveFunction;


/*************************添加测量控件开关**********************************************************/
L.Control.Measure = L.Control.extend({
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
		lengthImg.src = "images/measure.png";
		this._lengthImg = lengthImg;
		this._container.appendChild(this._lengthImg);
		L.DomEvent.addListener(this._container, 'click', createMeasure);
		return this._container;
	}
});
		
L.control.Measure = function (options) {
    return new L.Control.Measure();
};

var measureControl;

function createMeasure(e){
	if(measureControl){
		map.removeControl(measureControl);
		measureControl=undefined;
	}else{
		measureControl=new L.Control.ShowMeasure().addTo(map);
	}
	e.stopPropagation();
}



/*************************添加测量控件**********************************************************/
L.Control.ShowMeasure = L.Control.extend({
	options: {
		position: 'topright' //初始位置

	},
	initialize: function (options) {
		L.Util.extend(this.options, options);

	},
	onAdd: function (map) {
	   //创建一个class为leaflet-control-clegend的div
		this._container = L.DomUtil.create('div', 'leaflet-control-measure');
		//L.DomUtil.addClass(this._container,'leaflet-control-measureTras');
		
		var lengthContainer=document.createElement('div');
		this._lengthContainer=lengthContainer;
		//创建一个图片要素
		var lengthImg = document.createElement('img');
		//legendimg.className = 'leaflet-control-formatLengthImg';
		lengthImg.type = 'img';
		lengthImg.src = "images/length_blue.png";
		this._lengthImg = lengthImg;
		this._lengthContainer.appendChild(this._lengthImg);
		this._container.appendChild(this._lengthContainer);
		L.DomEvent.addListener(this._lengthContainer, 'click', formatLength);
		
		var areaContainer=document.createElement('div');
		this._areaContainer=areaContainer;
		//创建一个图片要素
		var areaImg = document.createElement('img');
		//legendimg.className = 'leaflet-control-formatLengthImg';
		areaImg.type = 'img';
		areaImg.src = "images/area_blue.png";
		this._areaImg = areaImg;
		this._areaContainer.appendChild(this._areaImg);
		this._container.appendChild(this._areaContainer);
		L.DomEvent.addListener(this._areaContainer, 'click', formatArea);
		
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
		L.DomEvent.addListener(this._clearContainer, 'click', clearMeasure);
		
		return this._container;
	},
//			onRemove: function (map) 
//				L.DomUtil.addClass(this._container,'leaflet-control-measureTras');
//			}
});
		


function formatLength(e){
		cancleAllListener();
		var lengthGroup=L.layerGroup([]).addTo(map);
		measure_layerGroup.push(lengthGroup);
		var layerThisNum=measureNum++;
		var poly_points = [];//区域
		var poly_line=new L.Polyline([],{
			color:'red',
			opacity:0.6,
			weight:2
		});//折线
		var dashLine=new L.Polyline([],{
			color:'red',
			opacity:0.6,
			dashArray: [10, 10],
			weight:2
		});

		
		var distance=0;
		var clickMarker;
		var divIcon;
		var clickLocation;
		
		
		//画矩形
		clickFunction=function addClickLatlng(e){
			marker_zindex+=10;
			//当前点
			clickLocation=[e.latlng.lat,e.latlng.lng];
			poly_points.push(clickLocation);
				
	
			//显示折线
			poly_line.addLatLng(e.latlng);
			lengthGroup.addLayer(poly_line);
			clickMarker = L.circleMarker(clickLocation,{
		    	radius: 3,
		    	color: 'red',
		    	opacity:0.6,
		    	weight:2,
		    	fillColor: '#FFFFFF',
				fillOpacity:1
		    }).addTo(lengthGroup);
			if(poly_points.length-1>0){
				var lastLocation=poly_points[poly_points.length-2];
				distance=Number(distance)+Number(e.latlng.distanceTo(new L.LatLng(lastLocation[0],lastLocation[1])) / 1000);
				if(e.latlng.lat!=lastLocation[0]&&e.latlng.lng!=lastLocation[1]){
					divIcon=L.marker(clickLocation,{
						zIndexOffset:marker_zindex,
						icon:L.divIcon({html:"<div class='myTooltip'>"+Number(distance).toFixed(2)+"km</div>",className:"noDefault"}),
						riseOnHover:true
					});
					divIcon.setZIndexOffset(marker_zindex);
					divIcon.addTo(lengthGroup);
				}
			}else{
				divIcon=L.marker(clickLocation,{
					zIndexOffset:marker_zindex,
					icon:L.divIcon({html:"<div class='myTooltip'>起点</div>",className:"noDefault"}),
					riseOnHover:true
				})
				divIcon.setZIndexOffset(marker_zindex);
				divIcon.addTo(lengthGroup);
			}
			
		}
		map.on('click', clickFunction);
		
		moveFunction=function addDashLine(evt){
			lengthGroup.addLayer(dashLine);
			moveIcon.addTo(lengthGroup);
			if(poly_points.length>0){
				var lastLocation=[poly_points[poly_points.length-1][0],poly_points[poly_points.length-1][1]];
				var dash_points = [
				    lastLocation,
				    [evt.latlng.lat,evt.latlng.lng]
				];
				var nowDistance=Number(distance)+Number((evt.latlng.distanceTo(new L.LatLng(lastLocation[0],lastLocation[1]))) / 1000);
				dashLine.setLatLngs(dash_points);
				moveIcon.setIcon(L.divIcon({html:"<div class='myTooltip'>当前"+Number(nowDistance).toFixed(2)+"km</div>",className:"noDefault"}));
				moveIcon.setLatLng(evt.latlng);
				moveIcon.setZIndexOffset(marker_zindex+20);
				//dashLine.bindTooltip('当前'+Number(nowDistance).toFixed(2)+'km').openTooltip(evt.latlng);
			}else{
				//dashLine.bindTooltip('点击开始测量距离，双击结束').openTooltip(evt.latlng);
				moveIcon.setIcon(L.divIcon({html:"<div class='myTooltip'>点击开始测量距离，双击结束</div>",className:"noDefault"}));
				moveIcon.setLatLng(evt.latlng);
				moveIcon.setZIndexOffset(marker_zindex+20);
			}
		};
		map.on("mousemove",moveFunction);
		
		dblclickFunction=function removeFormat(){
			cancleAllListener();
			lengthGroup.removeLayer(dashLine)
			lengthGroup.removeLayer(divIcon);
			//divIcon.removeFrom(lengthGroup);
			if(distance.toFixed(2)==0){
				lengthGroup.clearLayers();
			}else{
				var lastIcon=L.marker(clickLocation,{
					zIndexOffset:marker_zindex,
					riseOnHover:true,
					icon:L.divIcon({html:"<div class='myTooltip'>"+Number(distance).toFixed(2)+"km　"+"<img src='images/clearGray.png' width='12px' height='12px' class='deleteBtn' onclick='deleteMeasureLayer("+layerThisNum+")' /></div>",className: "deleteBtn"})
				});
				lastIcon.setZIndexOffset(marker_zindex);
				lastIcon.addTo(lengthGroup);
			}
		}
		map.once('dblclick', dblclickFunction);
		
		e.stopPropagation();
}

function deleteMeasureLayer(layerGroupId){
	measure_layerGroup[layerGroupId].clearLayers();
}

/*************************添加测面积控件**********************************************************/


	function formatArea(e){
		cancleAllListener();
		var areaGroup=L.layerGroup([]).addTo(map);
		measure_layerGroup.push(areaGroup);
		var layerThisNum=measureNum++;
		
		
		var poly_points = [];//区域点
		
		var ploy_area=new L.polygon([],{
			color:'red',
			opacity:0.6,
			weight:2,
			fillColor: 'red',
			fillOpacity:0.1
		});
		
		var ploy_now=new L.polygon([],{
			color:'red',
			opacity:0.6,
			weight:2,
			dashArray: [10, 10],
			fillColor: 'red',
			fillOpacity:0.3
		});
		

		var clickLocation;
		
		clickFunction=function addClickLatlng(e){
			
			//当前点
			clickLocation=[e.latlng.lat,e.latlng.lng];
			poly_points.push(clickLocation);
			var clickMarker = L.circleMarker(clickLocation,{
		    	radius: 3,
		    	color: 'red',
		    	opacity:0.6,
		    	weight:2,
		    	fillColor: '#FFFFFF',
				fillOpacity:1
		    }).addTo(areaGroup);
		}
		map.on('click', clickFunction);
		
		moveFunction=function addPolyNow(evt){
			areaGroup.addLayer(ploy_now);
			moveIcon.addTo(areaGroup);
			if(poly_points.length>0){
				ploy_now.setLatLngs(poly_points);
				ploy_now.addLatLng([evt.latlng.lat,evt.latlng.lng]);
				var nowArea=L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(ploy_now.getLatLngs()[0]),1);
				moveIcon.setIcon(L.divIcon({html:"<div class='myTooltip'>当前"+nowArea+"</div>",className:"noDefault"}));
				//ploy_now.bindTooltip('当前面积为'+'m<sup>2</sup>').openTooltip();
				moveIcon.setLatLng(ploy_now.getCenter());
			}else{
				moveIcon.setIcon(L.divIcon({html:"<div class='myTooltip'>点击开始测量面积，双击结束</div>",className:"noDefault"}));
				//ploy_now.bindTooltip('点击开始测量面积，双击结束').openTooltip();
				moveIcon.setLatLng(evt.latlng);
			}
			moveIcon.setZIndexOffset(marker_zindex+20);
		}
		map.on("mousemove",moveFunction);
		
		dblclickFunction=function showPoly(e){
			cancleAllListener();
			marker_zindex+=10;
			areaGroup.removeLayer(ploy_now);
			ploy_area.setLatLngs(poly_points);
			areaGroup.addLayer(ploy_area);
			for(i=0;i<poly_points.length;i++){
				var clickMarker = L.circleMarker(poly_points[i],{
			    	radius: 3,
			    	color: 'red',
			    	opacity:0.6,
			    	weight:2,
			    	fillColor: '#FFFFFF',
					fillOpacity:1
			    }).addTo(areaGroup);
			}
			var lastArea=L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(ploy_area.getLatLngs()[0]),1);
			if(lastArea=='0.00 m&sup2'){
				areaGroup.clearLayers();
				return;
			}
			var lastIcon=L.marker(ploy_area.getCenter(),{
				zIndexOffset:marker_zindex,
				riseOnHover:true,
				icon:L.divIcon({html:"<div class='myTooltip'>总计"+lastArea+"　"+"<img src='images/clearGray.png' width='12px' height='12px' class='deleteBtn' onclick='deleteMeasureLayer("+layerThisNum+")' /></div>",className: "deleteBtn"})
			});
			lastIcon.setZIndexOffset(marker_zindex);
			lastIcon.addTo(areaGroup);
			
		}
		map.once('dblclick', dblclickFunction);
		e.stopPropagation();
	}

/*************************添加清空测量记录控件**********************************************************/
	function clearMeasure(e){
		cancleAllListener();
		for(i=0;i<measure_layerGroup.length;i++){
			measure_layerGroup[i].clearLayers();
		}
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