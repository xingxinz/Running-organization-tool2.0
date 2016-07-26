// Initialize app
var myApp = new Framework7({
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Framework7.$;

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

var a_id = GetQueryString("id"); //活动ID
var u_info = ""; //用户信息
var a_info = ""; //活动信息
var domain = document.domain;
if (domain == 'localhost') { //本地测试出错请检查此处路径
  domain += '/Running-organization-tool2.0';
}
var toUrl = 'http://' + domain + "/index.php/Home/API/"; //接口地址

$$.ajax({ //获取用户信息
  cache: false,
  type: "POST",
  url: toUrl + "getuserinfo",
  dataType: "json",
  data: 1,
  timeout: 30000,

  error: function() {
    myApp.alert("获取消息出错，请联系管理员");
  },
  success: function(data) {
    u_info = data.concat();
    console.log(u_info);
  },
});
//index init
  //myApp.alert(123);
  
  mainView.router.loadPage({
      url:'http://' + domain + '/index.php/Home/Index/display.html',
      animatePages:false });
  if (a_id != null) {
    //mainView.router.loadPage('http://' + domain + '/index.php/Home/Index/detail.html');
    myApp.onPageAfterAnimation('index', function(page){
      mainView.router.loadPage({
        url:'http://' + domain + '/index.php/Home/Index/detail.html',
        //animatePages:false 
        });
    });
  }

  //myApp.alert(456);


function getActivityId(e) {
  console.log($$(e));
  console.log(this);
  a_id =$$(e).data('id');
  mainView.router.loadPage('http://' + domain + '/index.php/Home/Index/detail.html');
}
// DISPLAY.js
$$(document).on('pageInit', '.page[data-page="index"]', function(e) {

  // search bar
  var mySearchbar = myApp.searchbar('.searchbar', {
    searchList: '.list-block',
    searchIn: '.item-title, .item-subtitle, .item-after'
  });

  var list = $$('.list-block');
  list.children().remove(); //清除页面

  $$.ajax({ //获取数据
    cache: false,
    type: "POST",
    url: toUrl + "getActivity",
    dataType: "json",
    data: 1,
    timeout: 30000,

    error: function() {
      myApp.alert("获取消息出错，请联系管理员");
      console.log(toUrl + "getActivity");
    },
    success: function(data) {
      console.log(data);
      list.append("<ul>");
      list = list.children();
      if(data.length==0){
          var b = "";
          b += "<li>";
          b += "<div class=item-inner>";
          b += "<div class=item-title-row>";
          b += "<div class=item-title>当前无成员加入</div>";
          b += "</div>";
          b += "</div>";
          b += "</li>";
          list.append(b);
      }else{
          data.forEach(function(res) { //遍历数组
          var b = "";
          b += "<li>";
          b += "<a  class='item-link item-content' data-id=" + res['id'] + " onclick=getActivityId(this)>";
          b += "<div class=item-media><img src=" + res['img'] + " width=80></div>";
          b += "<div class=item-inner>";
          b += "<div class=item-title-row>";
          b += "<div class=item-title>" + res['name'] + "</div>";
          b += "<div class=item-after>" + res['username'] + "</div>";
          b += "</div>";
          b += "<div class=item-subtitle>" + res['area'] + "</div>";
          b += "<div class=item-subtitle>活动人数" + res['now_total'] + "/" + res['total'] + "</div>";
          b += "<div class=item-subtitle>" + res['time'] + "</div>";
          b += "<div class=item-text>" + res['info'] + "</div>";
          b += "</div></a>";
          list.append(b);
          list.append("</li>");
        });
      }
    }
  });

});
// ORGANIZE.js
$$(document).on('pageInit', '.page[data-page="organize"]', function(e) {
  // Following code will be executed for page with data-page attribute equal to "organize"
  $$("#username").val('');
  $$("#phone").val('');
  $$("#username").val(u_info[0]['username']);
  $$("#phone").val(u_info[0]['phone']);

  //---------------------- timepicker ---------------------------------//
  var today = new Date();

  var getDays = function(max) {
      var days = [];
      for(var i=1; i<= (max||31);i++) {
          days.push(i < 10 ? "0"+i : i);
      }
      return days;
  };

  var getDaysByMonthAndYear = function(month, year) {
      var int_d = new Date(year, parseInt(month)+1-1, 1);
      var d = new Date(int_d - 1);
      return getDays(d.getDate());
  };

  var formatNumber = function (n) {
      return n < 10 ? "0" + n : n;
  };

  var initMonthes = ('01 02 03 04 05 06 07 08 09 10 11 12').split(' ');

  var initYears = (function () {
      var arr = [];
      for (var i = today.getFullYear(); i <= 2050; i++) { arr.push(i); }
      return arr;
  })();

  var pickerDescribe = myApp.picker({
    input: '#picker-date',
    rotateEffect: false,  //为了性能

    value: [today.getFullYear(), formatNumber(today.getMonth()+1), formatNumber(today.getDate()), today.getHours(), formatNumber(today.getMinutes())],

    formatValue: function (p, values, displayValues) {
        return values[0] + '-' + values[1] + '-' + values[2] + ' ' + values[3] + ':' + values[4];
    },

    onChange: function (picker, values, displayValues) {
        var days = getDaysByMonthAndYear(picker.value[1], picker.value[0]);
        var currentValue = picker.value[2];
        if(currentValue > days.length) {
          currentValue = days.length;
          picker.cols[2].setValue(currentValue);
        }
    },

    cols: [
        // Years
    {
        values: initYears
    },
    // Months
    {
        values: initMonthes
    },
    // Days
    {
        values: getDays()
    },

    // Space divider
    {
        divider: true,
        content: '  '
    },
    // Hours
    {
        values: (function () {
            var arr = [];
            for (var i = 0; i <= 23; i++) { arr.push(i); }
            return arr;
        })(),
    },
    // Divider
    {
        divider: true,
        content: ':'
    },
    // Minutes
    {
        values: (function () {
            var arr = [];
            for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
            return arr;
        })(),
    }]    
  });
  //---------------------- timepickerend ---------------------------------//
})

// INFORMATION.js
$$(document).on('pageInit', '.page[data-page="information"]', function(e) {
  // Following code will be executed for page with data-page attribute equal to "information"
  $$("#i-name").val('');
  $$("#i-phone").val('');
  $$("#i-name").val(u_info[0]['username']);
  $$("#i-phone").val(u_info[0]['phone']);

  var tab2 = $$('#tab2').find('div');
  var tab3 = $$('#tab3').find('div');
  tab2.children().remove(); //清除页面
  tab3.children().remove(); //清除页面
  $$.ajax({
      cache: false,
      type: "POST",
      url: toUrl + "getMyActivity",
      dataType: "json",
      data: 1,
      timeout: 30000,

      error: function() {
        myApp.alert("获取消息出错，请联系管理员");
      },
      success: function(data){
        console.log(data);
        // --------------------自己创建----------------------- //
        tab2.append("<ul>");
        tab2 = tab2.children();
        if(data['admin'].length==0){     
            var b = "";
            b += "<li>";
            b += "<div class=item-inner>";
            b += "<div class=item-title-row>";
            b += "<div class=item-title>当前无创建活动</div>";
            b += "</div>";
            b += "</div>";
            b += "</li>";
            tab2.append(b);
        }else{
            data['admin'].forEach(function(res) { //遍历数组
            var b = "";
            b += "<li>";
            b += "<a  class='item-link item-content' data-id=" + res['id'] + " onclick=getActivityId(this)>";
            b += "<div class=item-media><img src=" + res['img'] + " width=80></div>";
            b += "<div class=item-inner>";
            b += "<div class=item-title-row>";
            b += "<div class=item-title>" + res['name'] + "</div>";
            b += "<div class=item-after>" + res['username'] + "</div>";
            b += "</div>";
            b += "<div class=item-subtitle>" + res['area'] + "</div>";
            b += "<div class=item-subtitle>活动人数" + res['now_total'] + "/" + res['total'] + "</div>";
            b += "<div class=item-subtitle>" + res['time'] + "</div>";
            b += "<div class=item-text>" + res['info'] + "</div>";
            b += "</div></a>";
            tab2.append(b);
            tab2.append("</li>");
          });
        }
        // --------------------自己创建end----------------------- //
        
        // --------------------自己加入----------------------- //
        tab3.append("<ul>");
        tab3 = tab3.children();
        if(data['member'].length==0){     
            var b = "";
            b += "<li>";
            b += "<div class=item-inner>";
            b += "<div class=item-title-row>";
            b += "<div class=item-title>当前无加入活动</div>";
            b += "</div>";
            b += "</div>";
            b += "</li>";
            tab3.append(b);
        }else{
            data['member'].forEach(function(res) { //遍历数组
            var b = "";
            b += "<li>";
            b += "<a  class='item-link item-content' data-id=" + res['id'] + " onclick=getActivityId(this)>";
            b += "<div class=item-media><img src=" + res['img'] + " width=80></div>";
            b += "<div class=item-inner>";
            b += "<div class=item-title-row>";
            b += "<div class=item-title>" + res['name'] + "</div>";
            b += "<div class=item-after>" + res['username'] + "</div>";
            b += "</div>";
            b += "<div class=item-subtitle>" + res['area'] + "</div>";
            b += "<div class=item-subtitle>活动人数" + res['now_total'] + "/" + res['total'] + "</div>";
            b += "<div class=item-subtitle>" + res['time'] + "</div>";
            b += "<div class=item-text>" + res['info'] + "</div>";
            b += "</div></a>";
            tab3.append(b);
            tab3.append("</li>");
          });
        }
        // --------------------自己加入end----------------------- //
      }
  });
});

// DETAIL.js
$$(document).on('pageInit', '.page[data-page="detail"]', function(e) {
  // Following code will be executed for page with data-page attribute equal to "detail"
  if (a_id == "") {
    myAPP.alert("参数错误");
    mainView.router.loadPage('index.html');
  } else {
    console.log(a_id);

    var objectModel = {};
    objectModel['id'] = a_id;

    $$.ajax({
      cache: false,
      type: "POST",
      url: toUrl + "getDetail",
      dataType: "json",
      data: objectModel,
      timeout: 30000,


      error: function() {
        myApp.alert("获取消息出错，请联系管理员");
      },
      success: function(data) {
        a_info=data;
        console.log(data);
        $$("#d-username").val(''); //基础信息
        $$("#d-name").val('');
        $$("#d-area").val('');
        $$("#d-time").val('');
        $$("#d-comment").val('');
        $$("#d-username").val(data['admin']['username']);
        $$("#d-name").val(data['activity']['name']);
        $$("#d-area").val(data['activity']['area']);
        $$("#d-time").val(data['activity']['time']);
        $$("#d-comment").val(data['activity']['info']);

        var button = $$("#btn_join"); //修改按键，0错误，1管理员，2成员，3未加入
        button.text('');
        button.removeData('id');
        switch (data['type']) {
          case 1:
          case 2:
            button.text("已加入");
            break;
          case 3:
            button.text("点击加入");
            button.data('id', a_id);
            break;
          default:
            myApp.alert("Error");
        }

        var admin = $$("#admin").find("ul").find("li").find("div"); //添加发起人
        admin.children().remove();
        var b = "";
        b += "<div class=item-media><img src=" + data['admin']['face_url'] + " width=44></div>";
        b += "<div class=item-inner>";
        b += "<div class=item-title-row>";
        b += "<div class=item-title>发起人：" + data['admin']['username'] + "</div>";
        b += "</div>";
        b += "<div class=item-subtitle>" + data['admin']['phone'] + "</div>";
        b += "</div>";
        admin.append(b);

        var member = $$("#member").find("ul"); //添加成员
        member.children().remove();
        if (data['member'].length == 0) {
          var b = "";
          b += "<li>";
          b += "<div class=item-inner>";
          b += "<div class=item-title-row>";
          b += "<div class=item-title>当前无成员加入</div>";
          b += "</div>";
          b += "</div>";
          b += "</li>";
          member.append(b);
        } else {
          $$.each(data['member'], function(key, value) {
            console.log(value);
            var b = "";
            b += "<li class=swipeout>";
            b += "<div class=swipeout-content>";
            b += "<div class=item-content>";
            b += "<div class=item-media><img src=" + value['face_url'] + " width=44></div>";
            b += "<div class=item-inner>";
            b += "<div class=item-title-row>";
            b += "<div class=item-title>" + value['username'] + "</div>";
            b += "</div>";
            b += "<div class=item-subtitle>" + value['sex'] + "</div>";
            b += "</div></div></div>";
            if(u_info[0]['id']==a_info['admin']['id']){
              b += "<div class=swipeout-actions-right>";
              b += "<a href='#' class='deleteMember bg-red' data-user_id="+value['id']+" data-info_id="+a_info['activity']['id']+">踢出</a>";
              b += "</div>";
            }
            b += "</li>";
            member.append(b);
          });
        }


        console.log('suc');

      },
    });

  }

  //点击加入
  $$("#btn_join").click(function(e){
    var objectModel={};
    objectModel['id']=$$(this).data('id');
    console.log(objectModel);
    if(objectModel['id']==undefined){
      myApp.alert('您已在该活动中！');
    }else{
      $$.ajax({
        cache: false,
        type: "POST",
        url: toUrl + "join",
        dataType: "json",
        data: objectModel,
        timeout: 30000,

        error: function(e){
          console.log(e);
          myApp.alert("系统错误");
        },
        success: function(data){
          switch(data['type'])
          {
          case 1:
            myApp.alert("加入成功");
            mainView.router.refreshPage();
            break;
          case 2:
            myApp.alert("Sorry,已经满员!");
            break;
          default:
            myApp.alert("Error");
            break;
          }
        }
      });
    }
  });

  //踢出组员
  $$('.deleteMember').on('click',function(){
    myApp.alert('sure?');
    var objectModel={};
    objectModel['user_id']=$$(this).data('user_id');
    objectModel['info_id']=$$(this).data('info_id');
    console.log(objectModel);
    if(objectModel['user_id']==undefined || objectModel['info_id']==undefined){
      myApp.alert('没有权限!');
    }else{
      $$.ajax({
        cache: false,
        type: "POST",
        url: toUrl + "deleteMember",
        dataType: "json",
        data: objectModel,
        timeout: 30000,

        error: function(e){
          console.log(e);
          myApp.alert("系统错误");
        },
        success: function(data){
          switch(data['type'])
          {
          case 1:
            myApp.alert("踢出成功");
            mainView.router.refreshPage();
            break;
          case 0:
          default:
            myApp.alert("Error");
            break;
          }
        }
      });
    }
  });

  // 点击出现分享提示幕布
  $$("#btn-share").click(function(e) {
    /* Act on the event */
    $$("#mcover").css('display', 'block');
    $$(".page-content").css('z-index', '-8');
    $$(".navbar").css('z-index', '-6');
    $$("#content-hide").css('z-index', '-1');

  });
  // 点击幕布消失
  $$("#mcover").click(function(e) {
    /* Act on the event */
    $$(this).css('display', 'none');
    $$(".page-content").css('z-index', '1');
    $$(".navbar").css('z-index', '1');
    $$("#content-hide").css('z-index', '1');
  });

  // --------------------微信API------------------------------ //
  var objectModel={};
  objectModel['url']=window.location.href;
  console.log(objectModel);
  $$.ajax({
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
      title: '这里有一个约跑,'+a_info['activity']['time']+'我在'+a_info['activity']['area']+'等你', // 分享标题
      link: 'http://'+domain+'/index.php/Home/Index?id='+a_id, // 分享链接
      imgUrl: u_info['0']['face_url'], // 分享图标
      success: function () { 
      // 用户确认分享后执行的回调函数
      },
      cancel: function () { 
      // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareAppMessage({
      title: '这里有一个约跑,'+a_info['activity']['time']+'我在'+a_info['activity']['area']+'等你', // 分享标题
      link: 'http://'+domain+'/index.php/Home/Index?id='+a_id, // 分享链接
      imgUrl: u_info['0']['face_url'], // 分享图标
      success: function () { 
      // 用户确认分享后执行的回调函数
      },
      cancel: function () { 
      // 用户取消分享后执行的回调函数
      }
    });
  });
  
})


