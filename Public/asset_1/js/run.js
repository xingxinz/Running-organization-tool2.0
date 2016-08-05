// timepicker
$("#datetime-picker").datetimePicker({
  //value: ['2005', '12', '04', '9', '34']
  //  注释后点击自动显示系统时间
});

// 点击修改个人信息
$("#edit").click(function(event) {
  /* Act on the event */
  $(".update-info").removeAttr('disabled');
});

$(function() {
  $(document).on("pageInit", function() {
    $("#join-in").click(function() {
      $.toast("操作成功");
    });
  });
  $.init();
});

// 传递信息给detail
$(".get-detail").click(function(){
  /* Act on the event */
  $.toast("123");
  var id = $(this).attr("value");
  console.log(id);
  var domain = document.domain;
  if (domain == 'localhost') {
    domain += '/joyball/1';
  }

  var toUrl = 'http://' + domain + "/index.php/Home/API/getDetail";
  var objectModel = {};
  objectModel['id'] = id;
  console.log(objectModel);
  $.ajax({
    cache: false,
    type: "POST",
    url: toUrl,
    dataType: "json",
    data: objectModel,
    timeout: 30000,


    error: function() {
      alert("获取消息出错，请联系管理员");
    },
    success: function(data) {
      $("#d-name").val('');
      $("#d-area").val('');
      $("#d-time").val('');
      $("#d-comment").val('');
      console.log(data);
      $("#d-name").val(data['activity']['name']);
      $("#d-area").val(data['activity']['area']);
      $("#d-time").val(data['activity']['time']);
      $("#d-comment").val(data['activity']['info']);
      console.log('suc');

    },
  });
});

// 点击出现分享提示幕布
$("#btn-share").click(function(e) {
  /* Act on the event */
  $("#mcover").css('display', 'block');
  $("#header-hide").css('z-index', '-2');
  $("#content-hide").css('z-index', '-1');
});
// 点击幕布消失
$("#mcover").click(function(e) {
  /* Act on the event */
  $(this).css('display', 'none');
});

$("#join-in").click(function(event) {
  
});
// Remain to be done
//显示一个消息，会在2秒钟后自动消失

// Join in
$(function() {
  $(document).on("pageInit", function() {
    $("#join-in").click(function() {
      $.toast("操作成功");
    });
  });
  // $.init();
});

// top-op
$(function() {
  var Accordion = function(el, multiple) {
    this.el = el || {};
    this.multiple = multiple || false;

    // Variables privadas
    var links = this.el.find('.link');
    // Evento
    links.on('click', { el: this.el, multiple: this.multiple }, this.dropdown)
  }

  Accordion.prototype.dropdown = function(e) {
    var $el = e.data.el;
    $this = $(this),
      $next = $this.next();

    $next.slideToggle();
    $this.parent().toggleClass('open');

    if (!e.data.multiple) {
      $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
    };
  }

  var accordion = new Accordion($('#accordion'), false);
});

// 点击menu效果
$("#menu").click(function(e) {
  /* Act on the event */
  flag = $("#hide-menu").css("opacity");
  flag = flag == 0 ? 1 : 0;
  $("#hide-menu").css("opacity", flag);
});
//  点击保存个人信息
$("#settings").click(function(event) {
  /* Act on the event */
  $(".update-info").attr('disabled', 'disabled');
});
