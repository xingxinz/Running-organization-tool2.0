$(document).ready(function() {
	//初始化地图
	var map = new qq.maps.Map($('#mapDisplay')[0], {
		zoom: 8
	});

	//当前位置变量
	var currentLocation = {
		lng: null,
		lat: null,
		name: null,
		set: function(lng, lat, name) {
			this.lng = lng;
			this.lat = lat;
			this.name = name;
			console.log(this);
		},
	};

	var getLocation = function() {
		//根据IP定位
		//获取城市列表接口设置中心点
		citylocation = new qq.maps.CityService({
			complete: function(result) {
				console.log('city Result:' + result.detail.name + '  ' + result.detail.latLng);
				map.setCenter(result.detail.latLng);
				// console.dir(result)
				currentLocation.set(result.detail.latLng.lng, result.detail.latLng.lat, result.detail.name)
			}
		});
		//根据用户IP查询城市信息。
		citylocation.searchLocalCity();
		//根据浏览器地理位置定位
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		}
	}();

	//地理位置和坐标转换解析器
	//getAddress(根据坐标解析)  getLocation(根据地址解析)
	var geoCoder = new qq.maps.Geocoder({
		complete: function(result) {
			currentLocation.set(result.detail.location.lng,result.detail.location.lat,result.detail.address)
		},
		error:function(){
			console.log('地址转换失败');
		}
	});


	//转换坐标切换地图的地理位置
	function showPosition(position) {
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		var latLng=new qq.maps.LatLng(lat,lng);
		geoCoder.getAddress(latLng);
		//调用地图命名空间中的转换接口   type的可选值为 1:gps经纬度，2:搜狗经纬度，3:百度经纬度，4:mapbar经纬度，5:google经纬度，6:搜狗墨卡托
		qq.maps.convertor.translate(latLng, 1, function(res) {
			//取出经纬度并且赋值
			latlng = res[0];
			console.log('GPS Location:' + latlng);
			map.panTo(latlng);
			//设置marker标记
			var marker = new qq.maps.Marker({
				map: map,
				position: latlng
			});
		});
	}

	//地图点选
	//地图点击事件
	qq.maps.event.addListener(map,'click',function(event){
		console.log(event);
	});
});


