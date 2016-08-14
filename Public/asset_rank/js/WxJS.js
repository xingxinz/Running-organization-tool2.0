var domain = document.domain;
var toUrl = 'http://' + domain + "/index.php/Home/API/"; //接口地址

  // --------------------微信API------------------------------ //
  var objectModel={};
  objectModel['url']=encodeURIComponent(window.location.href);
  console.log(objectModel);
  
var my={};
my['days']=$('#myDays').text();
my['time']=$('#myTime').text();
my['time']=my['time'].substring(0,5);
my['name']=$('#myName').attr('data');
console.log(my);

  $.ajax({
        cache: false,
        type: "POST",
        url: toUrl + "getWxSign",
        dataType: "json",
        data: objectModel,
        timeout: 30000,

        error: function(e){
          myApp.alert("微信接口错误");
        },
        success: function(data){
          console.log(data);
          wx.config({
            debug: false,
            appId: data['appId'],
            timestamp: data['timestamp'],
            nonceStr: data['nonceStr'],
            signature: data['signature'],
            jsApiList: [
              'onMenuShareTimeline',
              'onMenuShareAppMessage'// 所有要调用的 API 都要加到这个列表中
            ]
          });
        }
  });

  wx.ready(function () {
  // 在这里调用 API
    wx.onMenuShareTimeline({
      title: my['name']+' 今天'+my['time']+'早起签到,已经坚持'+my['days']+',约你来早起,敢吗', // 分享标题
      link: objectModel['url'], // 分享链接
      imgUrl:'' , // 分享图标
      success: function () { 
        alert('分享成功');
      },
      cancel: function () { 
      // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareAppMessage({
      title: my['name']+' 今天'+my['time']+'早起签到,已经坚持'+my['days']+',约你来早起,敢吗', // 分享标题
      desc: '趣键跑每日签到排名', // 分享描述
      link: objectModel['url'],
      imgUrl:'' ,// 分享图标
      success: function () { 
      	alert('分享成功');// 用户确认分享后执行的回调函数
      },
      cancel: function () { 
      // 用户取消分享后执行的回调函数
      }
    });
  });
