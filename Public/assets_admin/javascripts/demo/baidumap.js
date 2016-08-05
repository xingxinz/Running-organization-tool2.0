$(document).ready(function() {
		// 初始化地图,设置城市和地图级别
		var map = new BMap.Map('map');
		map.centerAndZoom('北京', 12);
		map.enableScrollWheelZoom();

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

		//建立一个自动完成的对象
		var ac = new BMap.Autocomplete({
			"input": "locationInput",
			"location": map
		});

		//地址解析器
		var geoEncoder = new BMap.Geocoder();

		function encodeAddr(addr) {
			geoEncoder.getPoint(addr, function(point) {
				if (point) {
					map.centerAndZoom(point, 16);
					map.addOverlay(new BMap.Marker(point));
					console.log('encode addr:' + addr + ' lng:' + point.lng + ' lat:' + point.lat);
					//自动写入当前位置
					currentLocation.set(point.lng, point.lat, addr);
				} else {
					console.log('no result encode');
				}
			});
		}

		//进入之后自动定位
		var autoGeoLocation = function() {
			//先根据ip定位所在城市
			var myCity = new BMap.LocalCity();
			myCity.get(function(result) {
				var cityName = result.name;
				map.setCenter(cityName);
				encodeAddr(cityName);
				console.log("localCity:" + cityName);
			});
			//再根据浏览器GPS或A-GPS定位
			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(function(r) {
				if (this.getStatus() == BMAP_STATUS_SUCCESS) {
					var mk = new BMap.Marker(r.point);
					mk.setAnimation(BMAP_ANIMATION_BOUNCE);
					map.addOverlay(mk);
					map.panTo(r.point);
					var name = r.address.city + ',' + r.address.province + ',' + r.address.district + ',' + r.address.street + ',' + r.address.streetNumber;
					//写入当前位置
					currentLocation.set(r.point.lng, r.point.lat, name);
					$("#locationText").empty();
					$("#locationText").append('<img src="Public/asset_1/img/location-logo.png" width="20px" height="20px" alt="">');
					if(!r.address.district && !r.address.street){
						$("#locationText").append('当前位置：获取失败，请手动选择');
					}else{
						$("#locationText").append('当前位置：'+r.address.district+r.address.street);
					}
					
					console.log('geolocation success:' + r.point.lng + ',' + r.point.lat);
				} else {
					console.log('geolocation failed' + this.getStatus());
				}
			});
		}();

		//逆向解析地址，可以从地图点选
		map.addEventListener('click', function(e) {
			var pt = e.point;
			geoEncoder.getLocation(pt, function(rs) {
				map.clearOverlays();
				var mk = new BMap.Marker(pt);
				map.addOverlay(mk);
				map.panTo(pt);
				mk.setAnimation(BMAP_ANIMATION_BOUNCE);
				var addComp = rs.addressComponents;
				var name = addComp.province + "," + addComp.city + "," + addComp.district + "," + addComp.street + "," + addComp.streetNumber;
				currentLocation.set(pt.lng, pt.lat, name);
				locationDisplay(addComp);
				console.log('addr selected:' + name);
			});
		});

		function locationDisplay(pos) {
			name = '';
			if (pos.province == pos.city) {
				name = name + pos.province;
			} else {
				name = name + pos.province + pos.city;
			}
			name = name + pos.district + pos.street;
			if (pos.streetNumber != '') {
				name = name + pos.streetNumber;
			}
			$('#locationInput').val(name);
		}

		//鼠标放在下拉列表上的事件
		ac.addEventListener('onhighlight', function(e) {
			var str = "";
			var _value = e.fromitem.value;
			var value = "";
			if (e.fromitem.index > -1) {
				value = _value.province + _value.city + _value.district + _value.street + _value.business;
			}
			str = "userFromItem index = " + e.fromitem.index + ",value = " + value;

			value = "";
			if (e.toitem.index > -1) {
				_value = e.toitem.value;
				value = _value.province + _value.city + _value.district + _value.street + _value.business;
			}
			str += "userToItem index = " + e.toitem.index + ",value = " + value;
			console.log(str);
		});

		//鼠标点击下拉列表后的事件
		var myValue;
		ac.addEventListener("onconfirm", function(e) {
			var _value = e.item.value;
			myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
			console.log("userConfirm index = " + e.item.index + ",value = " + myValue);

			setPlace();
		});

		function setPlace() {
			map.clearOverlays(); //清除地图上所有覆盖物
			function myFun() {
				var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
				map.centerAndZoom(pp, 18);
				mk = new BMap.Marker(pp);
				map.addOverlay(mk); //添加标注
				mk.setAnimation(BMAP_ANIMATION_BOUNCE);
				currentLocation.set(pp.lng, pp.lat, myValue);
				console.log("pp lng:" + pp.lng + " lat:" + pp.lat);
			}
			var local = new BMap.LocalSearch(map, { //智能搜索
				onSearchComplete: myFun
			});
			local.search(myValue);
		}

		//提交点选
		$('#submitMap').click(function() {
			//appendText = '<input id="locationInfo" name="locationInfo" type="text" value="' + currentLocation.lng + '|' + currentLocation.lat + '|' + currentLocation.name + '"/>';
			//$('#locationInfo').remove();
			//$('#test').append(appendText);
			//写入当前位置
				currentLocation.set(currentLocation.lng, currentLocation.lat, currentLocation.name);
				var loc=currentLocation.name.split(",");
				$("#locationText").empty();
				$("#locationText").append('<img src="Public/asset_1/img/location-logo.png" width="20px" height="20px" alt="">');
				$("#locationText").append('当前位置：'+loc[2]+loc[3]);
		});

});