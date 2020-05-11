<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="css/style.css">
<!-- css for phone -->
<link rel="stylesheet" media="screen and  (max-width: 700px)" href="css/style700.css" />
<!-- favicon -->
<link rel="shortcut icon" href="img/favicon.ico"/>
	
<title>修改會員資料</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<style>

body{
	font-family: Microsoft JhengHei;
	background: url("img/skytower.jpg") no-repeat;
	background-size: cover;
}

</style>
</head>

<body>

<!--Navigator-->
    <nav>
        <ul class="ul1">
            <li><a href="index.html">HOME</a>
            <li><a href="Event">NEWS</a>
            <li><a id="navShop" href="Shop">SHOP</a>
            <li><a href="processArticle">BLOG</a>
            <li><a href="Chatroom">CHAT</a>
            <li id="hello"><a href="myProfile">會員中心</a>
        </ul>
        <a href="#"><input type="button" class="loginz" value="${login_btn}" /></a>	
    </nav>

<!--Wishlist & Shopping cart &top-->
        <a href="showWish.controller"><input type="button" class="wishlist" title="願望清單"></a>
        <a href="prePay.controller"><input type="button" class="shoppingcart" title="購物車"></a>
		<a href="#"><input type="button" class="topbutton"></a>
	
<!-- main -->
	<div class="titledec">
        <div class="titletext">修改會員資料</div>
	</div>

	<div id="profileForm">
	<fieldset>
		<legend>會員資料</legend>
		<form action="#" method="POST" enctype="multipart/form-data">
			<img style="cursor: pointer;width:150px;height:150px" class="imgUserPhoto" alt="" title="點擊圖片更換大頭貼">
			<input class="inputUserPhoto" type="file" name="userImg" hidden="hidden"><br />
			<label for="userAccount">帳號:</label><input type="text" id="userAccount" name="userAccount" readonly="readonly">
			<div class="check"><img src=""></div><br />
			<label for="userName">姓名:</label><input type="text" id="userName" name="userName">
            <div class="check"><img src=""></div><br />

            <label for="nickName">暱稱:</label><input type="text" id="nickName" name="nickName">
            <div class="check" id="checkNickName"><img src=""></div><br />
            <label for="oriPwd">原密碼:</label><input type="password" id="oriPwd" name="oriPwd" placeholder="必填">
            <div class="check" id="checkOriPwd"><img src=""></div><br />
			<span class="note">(請輸入原密碼)</span><br />
			
            <label for="userPwd">新密碼:</label><input type="password" id="userPwd" name="userPwd">
            <div class="check" id="checkPwd"><img src=""></div><br />
            <span class="note">(不改密碼可不填)</span><br />

            <label for="recheckPwd">再次輸入新密碼:</label><input type="password" id="recheckPwd" name="recheckPwd"
                            placeholder="Re-Enter Password">
            <div class="check" id="recheckPwd"><img src=""></div><br />

            <label for="mail">E-mail:</label><input type="text" id="mail" name="mail">
            <div class="check" id="checkMail"><img src=""></div><br />
			<hr>
			<label>詳細資訊</label><br />
			<label style="width:60px">性別:</label>
			<input type="radio" class="gender" name="gender" value="m">
			<label class="gender">男</label>
			<input type="radio" class="gender" name="gender" value="f">
			<label class="gender">女</label>
			<input type="radio" class="gender" name="gender" value="o">
			<label style="width:50px">其他</label><br />

			<label for="birthday">生日:</label><input type="text" id="birthday" name="birthday"><br />
			<label for="address">地址:</label><input type="text" id="address" name="address"><br />
			<label for="phone">電話:</label><input type="text" id="phone" name="phone"><br /><br />
			<button class="registerconfirm">儲存</button><input class="cancel_btn" type="button" value="取消">
		</form>
		<div class="message"></div>
	</fieldset>
</div>
	
	<a href="index.html"><input type="button" class="morebutton" style="margin-top:50px;" value="回到首頁"></a>
	
	<!--footer-->
    <footer>
        <div class="foot">
            <H2>©COPYRIGHT 2020 EEIT112 GameGuild Production</H2>
            <H6>All copyrights and trademarks are the property of their respective owners.</H6>
        </div>
    </footer>
	
<script>
		//user image <input>
		function readURL(input) {
			if (input.files && input.files[0]) {
				var reader = new FileReader();
				reader.onload = function (e) {
					$(".imgUserPhoto").attr("src", e.target.result);
				}
				reader.readAsDataURL(input.files[0]);
			}
		}
		$(".inputUserPhoto").change(function () {
			readURL(this);
		});
		$(".imgUserPhoto").click(function () {
			$(".inputUserPhoto").click();
		});

		//get data
		var nickName,mail;
		var queryProfile = function(){
			$.ajax({
				url: "http://localhost:8080/GameShop/serchProfile",
				type: "POST",
				dataType: "json",
				success: function (data) {
					nickName = data.nickName;
					mail = data.mail;
					$("#userAccount").val(data.userAccount);
					$("#userName").val(data.userName);
					$("#nickName").val(data.nickName);
					$("#mail").val(data.mail);
					$("#birthday").val(data.birthday);
					$("#address").val(data.address);
					$("#phone").val(data.phone);
					if(data.gender == "m"){
						$("input.gender").eq(0).attr("checked","checked");
					}else if(data.gender == "f"){
						$("input.gender").eq(1).attr("checked","checked");
					}else{
						$("input.gender").eq(2).attr("checked","checked");
					}
					if (data.userImg == null || data.userImg == 0) {  
						$(".imgUserPhoto").attr("src", "img/defaultUserImg.jpg");
					} else {
						$(".imgUserPhoto").attr("src", "data:image/jpeg;base64," + data.userImg);
					}
				}
			})
		}

		$(document).ready(function () {
			queryProfile();
		})

		//check data right
        var regUserAccount = new RegExp(/^[a-zA-Z0-9]{6,18}$/);
        var regUserPwd = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z\d].{6,12}$/);
        var regMail = new RegExp(/\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+/);
		var errorOriPwd = 0, errorNickName =0, errorPwd = 0, errorMail = 0;
		

        $("#nickName").blur(function(){
            let ajaxFlag = true;
        $("#checkNickName img").css("visibility", "visible");
        if (ajaxFlag && $(this).val().length>0) {
            ajaxFlag = false;
            console.log("thisvalue = " + $(this).val());
            $.ajax({
                url: "http://localhost:8080/GameShop/isNickNameExist",
                type: "GET",
                data : {"nickName":$(this).val()},
                dataType:"json",
                success: function(data){
                    if(data && $("#nickName").val()!=nickName){
                        alert("此暱稱已存在");
                        $("#checkNickName img").attr("src", "img/Wrong.png");
                        errorAcc = 1;
                    }else{
                        $("#checkNickName img").attr("src", "img/Right.png");
                        errorAcc = 0;
                    }
                },error: function(){
                    console.log("連線失敗");
                }
            }).done(ajaxFlag = true);
        } else {
            $("#checkNickName img").attr("src", "img/Wrong.png");
            errorNickName = 1;
        }
        });
        $("#userPwd").blur(function(){
            $("#checkPwd img").css("visibility","visible");
            if(regUserPwd.test($(this).val()) || $(this).val() == ""){
                $("#checkPwd img").attr("src","img/Right.png");
                errorPwd = 0;
            }else{
                $("#checkPwd img").attr("src","img/Wrong.png");
                errorPwd = 1;
            }
        });
        $("#recheckPwd").blur(function(){
            $("#recheckPwd img").css("visibility","visible");
            if($(this).val() == $("#userPwd").val()){
                $("#recheckPwd img").attr("src","img/Right.png");
            }else{
                $("#recheckPwd img").attr("src","img/Wrong.png");
            }
        });
        $("#mail").blur(function(){
            let ajaxFlag = true;
        $("#checkMail img").css("visibility", "visible");
        if (regMail.test($(this).val())) {
            ajaxFlag = false;
            console.log("thisvalue = " + $(this).val());
            $.ajax({
                url: "http://localhost:8080/GameShop/isMailExist",
                type: "GET",
                data : {"mail":$(this).val()},
                dataType:"json",
                success: function(data){
                    console.log(data);
                    if(data && $("#mail").val()!=mail){
                        alert("此信箱已存在");
                        $("#checkMail img").attr("src", "img/Wrong.png");
                        errorAcc = 1;
                    }else{
                        $("#checkMail img").attr("src", "img/Right.png");
                        errorAcc = 0;
                    }
                },error: function(){
                    console.log("連線失敗");
                }
            }).done(ajaxFlag = true);
        } else {
            $("#checkMail img").attr("src", "img/Wrong.png");
            errorMail = 1;
        }
        });


		$(".registerconfirm").click(function (e) {
				if (errorOriPwd == 0 && errorNickName == 0, errorPwd == 0 && errorMail == 0) {
					e.preventDefault();
					var form = $('form')[0];
					var formData = new FormData(form);
					$.ajax({
						url: "http://localhost:8080/GameShop/modifyProfile",
						type: "POST",
						data: formData,
						contentType: false,
						cache: false,
						processData: false,
						success: function (data) {
							if (data.length == 0 || data === "undefined" || data == null) {
								$(".message").text("資料不正確，修改失敗!").css("color", "red");
							} else {
								console.log(data)
								$(".message").text("修改成功!").css("color", "green");
							}
						}
						, done: function (data) {
							queryProfile();
						}
						, error: function (data) {
							$(".message").text("連線失敗，修改失敗").css("color", "red")
							console.log('無法送出');
						}

					})
				}else{
					$(".message").text("資料不正確，請再次確認").css("color", "red");
				}

			})

			$(".cancel_btn").click(function () {
				location.replace("index.html")
			})

	</script>
</body>

</html>