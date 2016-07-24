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
  mainView.router.load({
    url:'http://' + domain + '/index.php/Home/Index/display.html',
    animatePages:false });
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
  console.log(123);
  var mySearchbar = myApp.searchbar('.searchbar', {
    searchList: '.list-block',
    searchIn: '.item-title, .item-subtitle'
  });

  if (a_id != null) {
    mainView.router.loadPage('http://' + domain + '/index.php/Home/Index/detail.html');
  }

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
  var pickerDescribe = myApp.picker({
    input: '#picker-date',
    rotateEffect: true,

    value: [today.getMonth(), today.getDate(), today.getFullYear(), today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],

    formatValue: function(p, values, displayValues) {
      return displayValues[0] + ' ' + values[1] + ', ' + values[2] + ' ' + values[3] + ':' + values[4];
    },

    cols: [
      // Months
      {
        values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
        displayValues: ('January February March April May June July August September October November December').split(' '),
        textAlign: 'left'
      },
      // Days
      {
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      },
      // Years
      {
        values: (function() {
          var arr = [];
          for (var i = 2016; i <= 2030; i++) { arr.push(i); }
          return arr;
        })(),
      },
      // Space divider
      {
        divider: true,
        content: '  '
      },
      // Hours
      {
        values: (function() {
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
        values: (function() {
          var arr = [];
          for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
          return arr;
        })(),
      }
    ]
  });
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
            button.data('id', u_info[0]['id']);
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
            var b = "";
            b += "<li class=swipeout>";
            b += "<div class=swipeout-content>";
            b += "<div class=item-content>";
            b += "<div class=item-media><img src=" + value['face_url'] + " width=44></div>";
            b += "<div class=item-inner>";
            b += "<div class=item-title-row>";
            b += "<div class=item-title>发起人：" + value['username'] + "</div>";
            b += "</div>";
            b += "<div class=item-subtitle>" + value['sex'] + "</div>";
            b += "</div></div></div>";
            b += "<div class=swipeout-content>";
            b += "<a href= class=bg-red>踢出</a>";
            b += "<div class=swipeout-content>";
            b += "</div>";
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
    var id=$$(this).data('id');
    console.log(id);
    if(id==undefined){
      myApp.alert('您已在该活动中！');
    }else{
      $$.ajax({
        cache: false,
        type: "POST",
        url: toUrl + "join",
        dataType: "json",
        data: id,
        timeout: 30000,

        error: function(e){
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
            button.text("Sorry,已经满员!");
            break;
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
            debug: true,
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
      title: '我创建了一个约跑，快来加入吧', // 分享标题
      link: 'http://'+domain+'/index.php/Home/Index?id='+a_id, // 分享链接
      imgUrl: '', // 分享图标
      success: function () { 
      // 用户确认分享后执行的回调函数
      },
      cancel: function () { 
      // 用户取消分享后执行的回调函数
      }
    });
  });
  
})


