// Initialize app
var myApp = new Framework7();

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

$$.ajax({     //获取用户信息
  cache: false,
  type: "POST",
  url: toUrl + "getuserinfo",
  dataType: "json",
  data: 1,
  timeout: 30000,

  error: function(){
    myApp.alert("获取消息出错，请联系管理员");
  },
  success: function(data){
    u_info=data.concat();
    console.log(u_info);
  },
});
//index init
console.log(a_id);

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
    data.forEach(function(res) { //遍历数组
      var b = "";
      b += "<li>";
      b += "<a  class='item-link item-content' data-id=" + res['id'] + ">";
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
  },
});



$$(document).on('click', '.item-link', function(e) {
  a_id = $$(this).data('id');
  mainView.router.loadPage('http://' + domain + '/index.php/Home/Index/detail.html');
});

// ORGANIZE.js
$$(document).on('pageInit', '.page[data-page="organize"]', function(e) {
  // Following code will be executed for page with data-page attribute equal to "organize"
  $$("#username").val('');
  $$("#phone").val('');
  $$("#username").val(u_info[0]['username']);
  $$("#phone").val(u_info[0]['phone']);
})

// INFORMATION.js
$$(document).on('pageInit', '.page[data-page="information"]', function(e) {
  // Following code will be executed for page with data-page attribute equal to "information"

})

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
        $$("#d-username").val('');    //基础信息
        $$("#d-name").val('');
        $$("#d-area").val('');
        $$("#d-time").val('');
        $$("#d-comment").val('');
        $$("#d-username").val(data['admin']['username']);
        $$("#d-name").val(data['activity']['name']);
        $$("#d-area").val(data['activity']['area']);
        $$("#d-time").val(data['activity']['time']);
        $$("#d-comment").val(data['activity']['info']);

        var button=$$("#btn_join");   //修改按键，0错误，1管理员，2成员，3未加入
        button.text('');
        button.removeData('id');
        switch(data['type'])
        {
        case 1:
        case 2:
          button.text("已加入");
          break;
        case 3:
          button.text("点击加入");
          button.data('id',u_info[0]['id']);
          break;
        default:
          myApp.alert("Error");
        }

        var admin=$$("#admin").find("ul").find("li").find("div");     //添加发起人
        admin.children().remove();
        var b="";
        b += "<div class=item-media><img src="+data['admin']['face_url']+" width=44></div>";
        b += "<div class=item-inner>";
        b += "<div class=item-title-row>";
        b += "<div class=item-title>发起人：" + data['admin']['username'] + "</div>";
        b += "</div>";
        b += "<div class=item-subtitle>" + data['admin']['phone'] + "</div>";
        b += "</div>";
        admin.append(b);

        var member=$$("#member").find("ul");      //添加成员
        member.children().remove();
        if(data['member'].length==0){
          var b="";
          b += "<li>";
          b += "<div class=item-inner>";
          b += "<div class=item-title-row>";
          b += "<div class=item-title>当前无成员加入</div>";
          b += "</div>";
          b += "</div>";
          b += "</li>";
          member.append(b);
        }
        else{
          $$.each(data['member'],function(key,value){
            var b="";
            b += "<li class=swipeout>";
            b += "<div class=swipeout-content>";
            b += "<div class=item-content>";
            b += "<div class=item-media><img src="+value['face_url']+" width=44></div>";
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
  });
})

// search bar
var mySearchbar = myApp.searchbar('.searchbar', {
  searchList: '.list-block',
  searchIn: '.item-title'
});
