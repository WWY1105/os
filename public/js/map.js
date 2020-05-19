/**
 * sharejoy osweb
 *
 * @copyright  Copyright (c) 2015 Typecho team (http://www.ishangbin.com)
 * @license    GNU General Public License 2.0
 * @version   0.0.5 by tinlee
 */
mapFn = function(a) { //    生成图片
	if (!view.latitude || !view.longitude) return;
	return "http://restapi.amap.com/v3/staticmap?zoom=14&size=200*180&markers=-1,http://webapi.amap.com/images/1.png,0:" +
		view.longitude + "," + view.latitude + "&key=ee95e52bf08006f63fd29bcfbcf21df0";
}
initialize = function(a, b) {
	if (!a.address || a.address == '') a.address = a.qu;
	var mapObj;
	var marker = new Array();
	var windowsArr = new Array();
	mapObj = new AMap.Map(a.id);

	function geocoder() {
		var MGeocoder; //加载地理编码插件     
		AMap.service(["AMap.Geocoder"], function() {
			MGeocoder = new AMap.Geocoder({
				radius: 5000 //范围，默认：500       
			}); //返回地理编码结果
			//地理编码       
			MGeocoder.getLocation(a.city + a.address, function(status, result) {
				if (status === 'complete' && result.info === 'OK') {
					var resultStr = ""; //地理编码结果数组
					var geocode = new Array();
					geocode = result.geocodes; //拼接输出html
					if (b == 1) { //                    
						latlng = addmarker(0, geocode[0], a);
					} else {
						latlng = addmarker(0, geocode[0]);
					}
					mapObj.setFitView();
				}
			});
		});
	}

	function addmarker(i, d, p) {
			if (a.latitude && a.longitude && !p) { //
				var latY = a.latitude;
				var lngX = a.longitude;
			} else { //
				var lngX = d.location.getLng();
				var latY = d.location.getLat();
			}
			view.latitude = latY;
			view.longitude = lngX;
			var markerOption = {
				map: mapObj,
				icon: "http://webapi.amap.com/images/" + (i + 1) + ".png",
				position: new AMap.LngLat(lngX, latY),
				draggable: true, //点标记可拖拽                       
				cursor: 'move', //鼠标悬停点标记时的鼠标样式                      
				raiseOnDrag: true
					//鼠标拖拽点标记时开启点标记离开地图的效果
			};
			var mar = new AMap.Marker(markerOption);
			marker.push(new AMap.LngLat(lngX, latY));
			var infoWindow = new AMap.InfoWindow({
				content: d.formattedAddress,
				autoMove: true,
				size: new AMap.Size(150, 0),
				offset: {
					x: 0,
					y: -30
				}
			});
			windowsArr.push(infoWindow);
			var aa = function(e) {
				view.latitude = mar.getPosition().lat;
				view.longitude = mar.getPosition().lng;
			};
			AMap.event.addListener(mar, "dragend", aa);
		} //地理编码返回结果展示            
	geocoder();
}

function mapModal(a,b) {
	temcity =a.areaText||ajax_send({}, "/dict/AREA/" + a.area + "/text", "GET").result.text;
	temcity = temcity.split("省");
	if (temcity.length == 2) { //
		temcity[0] = temcity[1];
	}
	temcity = temcity[0].split("市");
	var map = {
		id: "mapin",
		latitude: view.latitude,
		longitude: view.longitude,
		city: temcity[0] + "市",
		qu: temcity[1],
		address: a.address
	};
	if(b){
		map.latitude="";
		map.longitude="";
	}
	initialize(map);
	if(b) return;
	$("#map").modal("show");
}
function mapShow (view) {
	var mapImg=mapFn(view);
	 if(mapImg)	var temMapImg="<img src='"+mapImg+"'/>";
	else var temMapImg="未选择坐标";
	 $(".map-show").html(temMapImg);
}