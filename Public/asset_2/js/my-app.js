// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Framework7.$;

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

var a_id=GetQueryString("id");    //活动ID
var u_id="";    //用户ID
var domain = document.domain;
if (domain == 'localhost') {    //本地测试出错请检查此处路径
  domain += '/joyball_f7';
}
var toUrl = 'http://' + domain + "/index.php/Home/API/";    //接口地址

//index init
  console.log(a_id);
  console.log(u_id);

  if(a_id!=null){
    mainView.router.loadPage('http://'+domain+'/index.php/Home/Index/detail.html');
  }

  var list=$$('.list-block');
  list.children().remove(); //清除页面

  $$.ajax({           //获取数据
    cache: false,
    type: "POST",
    url: toUrl+"getActivity",
    dataType: "json",
    data: 1,
    timeout: 30000,

    error: function() {
      myApp.alert("获取消息出错，请联系管理员");
      console.log(toUrl+"getActivity");
    },
    success: function(data) {
      console.log(data);
      list.append("<ul>");
      list=list.children();
      data.forEach(function(res){   //遍历数组
        var b="";
        b+=  "<li>";
        b+=  "<a href=http://"+domain+"/index.php/Home/Index/detail.html?id=1 class='item-link item-content' data-id="+res['id']+">";
        b+=  "<div class=item-media><img src="+res['img']+" width=80></div>";
        b+=  "<div class=item-inner>";
        b+=  "<div class=item-title-row>";
        b+=  "<div class=item-title>"+res['name']+"</div>";
        b+=  "<div class=item-after>"+res['username']+"</div>";
        b+=  "</div>";
        b+=  "<div class=item-subtitle>"+res['area']+"</div>";
        b+=  "<div class=item-subtitle>活动人数"+res['now_total']+"/"+res['total']+"</div>";
        b+=  "<div class=item-subtitle>"+res['time']+"</div>"; 
        b+=  "<div class=item-text>"+res['info']+"</div>";
        b+=  "</div></a>";
        list.append(b);
        list.append("</li>");       
      });
    },
  });
  
  

$$(document).on('click','.item-link', function (e) {
  a_id = $$(this).data('id');
});


$$(document).on('pageInit', '.page[data-page="organize"]', function (e) {
  // Following code will be executed for page with data-page attribute equal to "organize"
  var id = '<%=Session["user_id"] %>';
  console.log(id);
})
$$(document).on('pageInit', '.page[data-page="information"]', function (e) {
  // Following code will be executed for page with data-page attribute equal to "information"
  myApp.alert('Here comes About page');
})
$$(document).on('pageInit', '.page[data-page="detail"]', function (e) {
  // Following code will be executed for page with data-page attribute equal to "detail"
  if(a_id==""){
    mainView.router.loadPage('index.html');
  }else{
    console.log(a_id);

    var objectModel = {};
    objectModel['id'] = a_id;

    $$.ajax({
      cache: false,
      type: "POST",
      url: toUrl+"getDetail",
      dataType: "json",
      data: objectModel,
      timeout: 30000,


      error: function() {
        myApp.alert("获取消息出错，请联系管理员");
      },
      success: function(data) {
        console.log(data);
        // $("#d-name").val(data['activity']['name']);
        // $("#d-area").val(data['activity']['area']);
        // $("#d-time").val(data['activity']['time']);
        // $("#d-comment").val(data['activity']['info']);
        console.log('suc');

      },
    });

  }
})

// search bar
var mySearchbar = myApp.searchbar('.searchbar', {
    searchList: '.list-block',
    searchIn: '.item-title'
});  