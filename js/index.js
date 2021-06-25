if(1){ 
   Ip = "http://47.104.72.63:8080";
}else{
   Ip = "http://192.168.0.114:8080";
}
var Globaltoken = "";
var count = 20; 
var InterValObj;
var timer1 ;
var flag_Globaltoken = true
var CPAddress=""
$(function () {
  $.ajaxSetup({
    beforeSend: function (request) {
      request.setRequestHeader("Content-Type", "application/json");
      if (flag_Globaltoken){
        if (Globaltoken) {
          request.setRequestHeader("Authorization", "Bearer " + Globaltoken);
        }
      }
     
    },
  });

  if (
    localStorage.getItem("token")
   
  ) {

     Fnstep(-640);
     getUserInfo(localStorage.getItem('token'))
  }
   

  // 获取验证码
  $(".getqr").on("click", function () {

    if(Globaltoken){
      flag_Globaltoken = false
    }
    else {
      flag_Globaltoken = true
    }
    var emailval = $(".email2").val();

    if ($(this).hasClass("disabled")) {
      return false;
    }

    if (emailval == "") {
      $.tooltip("邮箱不能为空");
      return;
    }
    var validateReg =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!validateReg.test(emailval)) {
      $.tooltip("邮箱格式不正确");
      return;
    }
    if (!$(this).hasClass("disabled")) {
      $(this).addClass("disabled");
       InterValObj = setInterval(SetRemainTime, 1000);
    $.post(Ip + "/system/registry/sendEmail",JSON.stringify({ email: emailval }),function(result){
      if (result.code != 200) {
              $(".loading").hide();
              $.tooltip(result.msg);
              return;
            }
            $(".loading").hide();
            $.tooltip(result.msg, 2500, true);
            
    });
  }
  });

  $(".getqr1").on("click", function () {
    clearInterval(timer1)
    if(Globaltoken){
      flag_Globaltoken = false
    }
    else {
      flag_Globaltoken = true
    }
    var emailval = $(".email3").val();

    if ($(this).hasClass("disabled")) {
      return false;
    }
   
    if (!$(this).hasClass("disabled")) {
      $(this).addClass("disabled");
       InterValObj = setInterval(SetRemainTime1, 1000);
    $.post(Ip + "/system/registry/sendEmail",JSON.stringify({ email: emailval }),function(result){
      if (result.code != 200) {
              $(".loading").hide();
              $.tooltip(result.msg);
              return;
            }
            $(".loading").hide();
            $.tooltip(result.msg, 2500, true);
            
    });
  }
  });


  //注册
  $(".register").on("click", function () {
    var emailval = $(".email2").val();
    var username = $(".username").val();
    var pswd = $(".pswd").val();
    // var iphone = $(".iphone").val();
    var qrd = $(".qrd").val();
    var sexval = $("input[name='sex']:checked").val();
    var regval = "";

    if( pswd != "" && pswd.length < 5){
      $.tooltip(`密码长度不能小于6位`);
      return
    }

    if (
      username == "" ||
      emailval == "" ||
      pswd == "" ||
      sexval == "" ||
      qrd == ""
    ) {
      if ( username == "") {
        regval = "用户名";
      } else if (pswd == "") {
        regval = "密码";
      } else if (emailval == "" ) {
        regval = "邮箱";
      } else if (sexval == "" || sexval == "undefined") {
        regval = "性别";
      } else if (qrd == "") {
        regval = "验证码";
      }
      
      $.tooltip(`${regval}不能为空`);
      return;
    }
    
    

    // var iphoneReg = /^1[3456789]\d{9}$/;
    // if (!iphoneReg.test(iphone)) {
    //   $.tooltip("手机格式不正确");
    //   return;
    // }

    $(".loading").show();
    $.post(Ip + "/system/registry/registry",JSON.stringify({ email: emailval,userName: username, password: pswd,email: emailval,code: qrd,sex: sexval }),function(result){
      if (result.code != 200) {
        $(".loading").hide();
        $.tooltip(result.msg);
        return;
      }
      $(".loading").hide();
      $.tooltip(result.msg, 2500, true);
      Fnstep(-320);
    });

  });
  //登录
  $(".login").on("click", function () {
    flag_Globaltoken = false
    var loginname = $(".loginname").val();
    var loginpswd = $(".loginpswd").val();
    var regval = "";
    if (loginname == "" || loginpswd == "") {
      if (loginname == "") {
        regval = "用户名";
      } else if (loginpswd == "") {
        regval = "密码";
      }

      $.tooltip(`${regval}不能为空`);
      return;
    }
    $(".loading").show();
    $.post(Ip + "/login",JSON.stringify({ username: loginname, password: loginpswd }),function(result){
      if (result.code != 200) {
        $(".loading").hide();
        $.tooltip(result.msg);
        return;
      }
        $(".loading").hide();
        flag_Globaltoken = true
        $.tooltip(result.msg, 2500, true);
        localStorage.setItem("token", result.token);
        getUserInfo(result.token);
        Fnstep(-640);
        
    });
    
  });
 
  // $(".signup-form input").on("focus", function () {
  //   $(this).parent().addClass("border");
  // });
  // $(".signup-form input").on("blur", function () {
  //   $(this).parent().removeClass("border");
  // });


  $(".Withdraw").hDialog({ title: "提现",modalHide: false,height: 400});

  //提现
  $(".submitBtn").on("click", function () {
    flag_Globaltoken = true
    var toAddress = $(".toAddress").val();
    var amount = $(".amount").val();
    var email = $(".email3").val();
    var code = $('.code').val()
    if (toAddress == "" || amount == "") {
      if (toAddress == "") {
        regval = "钱包地址";
      } else if (amount == "") {
        regval = "提现金额";
      }

      $.tooltip(`${regval}不能为空`);
      return;
    }
    $(".loading").show();
    $.ajax({
      url: Ip + "/system/out/cppOutRecharge",
      type: "post",
      data: JSON.stringify({ amount, toAddress,email, code}),
      success: function (result) {
        if (result.code != 200) {
          $(".loading").hide();
          $.tooltip(result.msg);
          return;
        }
        $(".loading").hide();
        $("#HCloseBtn").click();
        $.tooltip(result.msg, 2500, true);
        getUserInfo(Globaltoken)

        
      },
    });
  });

  $('.getlogin').on('click',function(){
    Fnstep(-320);
  });
  $('.getback').on('click',function(){
    Fnstep(0);
  });




});

$('.logout').on('click',function(){
  Fnstep(0);
  localStorage.removeItem('token');
  flag_Globaltoken = false
  clearInterval(timer1)
 
  
})

function getUserInfo(token) {
  clearInterval(timer1)
  Globaltoken = token;
  $.get(Ip + "/system/registry/getUserInfo",function(result){
    if(result.code == 401){
      $.tooltip(result.msg);
      localStorage.removeItem('token');
      flag_Globaltoken = false
      Fnstep(0);
      return;
    }
    if (result.code != 200) {
      $.tooltip(result.msg);
      return;
    }
    var cppRemain = result.data.cppRemain;
    var cppAddress = result.data.cppAddress;
    var email = result.data.email;
    var qrcode = $('#qrcode')
    if (qrcode.html() !== '') qrcode.html('')
    new QRCode(document.getElementById("qrcode"), {
      text: cppAddress,
      width: 180,
      height: 180,
    });
    $(".mymoney").text(cppRemain);
     var stradress = cppAddress
         stradress =  '*****'+ stradress.substr(10,30) + '*****'
    $(".cppAddress").text(stradress);
    
    CPAddress = cppAddress
    $(".email3").val(email);
    setInval(token)
  });
}
function setInval(token) {
   timer1 = setInterval(function(){
    if(token){
      getUserInfo(token)
    }
    
  },1000*10)
}

function Fnstep(left) {
  var _boxCon = $(".box-con");
  $(".loading").hide();
  $(_boxCon).css({
    marginLeft: left,
  });
}
function SetRemainTime() {
  if (count == 0) {
    clearInterval(InterValObj);
    $(".getqr").removeClass("disabled").text("重新发送");
    count = 20
  } else {
    count--;
    $(".getqr").text(count + "s 后重发");
  }
}
function SetRemainTime1() {
  if (count == 0) {
    clearInterval(InterValObj);
    $(".getqr1").removeClass("disabled").text("重新发送");
    count = 20
  } else {
    count--;
    $(".getqr1").text(count + "s 后重发");
  }
}



var clipboard = new Clipboard('.copytext', {
    text: function() {
        return CPAddress;
    }
});

clipboard.on('success', function(e) {
    $.tooltip("复制成功", 1500, true);
});

