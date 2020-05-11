$(window).on('load', function () {
    // Menu 選擇後的動作
    $(".bmsmenu").on("click", function () {
        let menuSelect = $(this).attr("id")
        if (menuSelect == "product") {
            getProductList()
        } else if (menuSelect == "event") {
            eventView()
        } else if (menuSelect == "chart") {
        	chartView()
        } else if (menuSelect == "reply") {
        	replyView()
        }
    })

    // Menu 點擊活動後呼叫之函數
    function eventView() {
        $("#eventDiv").show().siblings().hide()
		$("#tab1").show();
		$("#tab0").hide();
        $("#tab2").hide();
        createEventPagesNum();
    }
    
    function chartView() {
    	$("#ChartDiv").show().siblings().hide()
    	$("#ShowOrderChartBtn").click()
    }
    
	// Menu 點擊商品後呼叫之函數
	function getProductList(){
		$.getJSON("productJsonView", function( jdata ){
             productList = jdata;
             productView();
        })
    }getProductList()

    // Menu點擊商品後呼叫之函數
    // 將Json物件[Product]轉成表格並顯示
    function productView() {
        let txt // = "<table>"
        for (let i = productList.length - 1; i >= 0; i--) {
            let now = new Date()
            let uplt = productList[i].uploadTime
            let dwlt = productList[i].downloadTime
            let saleStatus = (Compare(now, dwlt) ? 0 : Compare(now, uplt) ? 1 : 2)
            txt += "<tr class='" + pStatus[saleStatus] + "'>"
            txt += "<td class='pStatus'>" + pStatus[saleStatus+3] + "</td>"
            txt += "<td>" + productList[i].productId + "</td>"
            txt += "<td>" + productList[i].productName + "</td>"
            txt += "<td>" + productList[i].tag + "</td>"
            txt += "<td>" + productList[i].price + "</td>"
            txt += "<td>" + productList[i].uploadTime + "</td>"
            txt += "<td>" + productList[i].downloadTime + "</td>"
            txt += "<td><button class='upl'>修改</button></td>"
            txt += "<td><button class='del'>刪除</button></td>"
            txt += "</tr>"
        }
		$("#productDiv").show().siblings().hide()
        
        if($("#insProduct").text()!="新增產品"){
        	productEdit = false
        	$("#insProduct").click()
//        	$("#iPDiv").hide()
//        	$("#productListTable").show()
//        	$("ul.pagination").show()
        }
        $("#productDiv").find("tbody#productList").html(txt).show()

        // 對修改/刪除的按鈕新增事件 (刪除)
        $(".upl,.del").on("click", function () {
            let id = parseInt($(this).parent().parent().find("td").eq(1).html())
            if ($(this).hasClass("del")) {
                if (confirm("您確定要刪除 產品編號:" + id + " 的產品嗎 ?")) {
                    txt = "您已確定刪除!";
                    $.ajax({
                        method: "GET",
                        url: 'product.del/' + id,
                    })
                    .done(function (data) {
                        alert("產品編號 " + id + " 的產品已成功刪除！");
                        getProductList("productJsonView")
                    })
                } else {
                    txt = "您已取消刪除！";
                }
            }
            if ($(this).hasClass("upl")) {
                let p = findProductById(id);
                $(".productListView,.pagination").hide()
                $("#iPDiv").show()
                $("#insProduct").text("放棄修改")
                $("#iPDiv").find("input[name=pId]").val(p.productId)
                $("#iPDiv").find("input[type=text][name=pName]").val(p.productName)
                $("#iPDiv").find("input[type=text][name=price]").val(p.price)
                $("#iPDiv").find("select[name=tagList]").val(tagList.indexOf(p.tag))
                $("#iPDiv").find("textarea[name=intro]").val(p.intro)
                if(p.productImage != null){
                	$("#iPDiv").find("img#Preview").attr("src", "data:image/jpeg;base64," + p.productImage)
                }else{
                	$("#iPDiv").find("img#Preview").attr("src", imgDefault)
            	}
                $("#iPDiv").find("input[type=date][name=uplTime]").val(left(p.uploadTime,10))
                $("#iPDiv").find("input[type=date][name=dwlTime]").val(left(p.downloadTime,10))
                // 現在的時間已經超過上架時間(即為已經開始販售之商品)不可再修改上架時間
                if(Compare(new Date(), p.uploadTime)){
                    $("#iPDiv").find("input[type=date][name=uplTime]").attr('disabled', true)
                }else{
                    $("#iPDiv").find("input[type=date][name=uplTime]").attr('disabled', false)
                }
            }
        })
        createProductPageNum()
    }
    
    $("#productDiv").on( "click", function( event ) {
    	let listItem = ["", "productId", "productName", "tag", "price", "uploadTime", "downloadTime", "intro"]
    	let id = parseInt($( event.target ).closest("#productList tr").find("td").eq(1).html());
    	let tdIndex = $( event.target ).closest("td").parents("tr").find("td").index($( event.target ).closest("td") );
    	let p = findProductById(id);
    	
    	if( !isNaN(id) && tdIndex < 7 ) {
	    	if(p.productImage != null){
	        	$("#msgImg").attr("src", "data:image/jpeg;base64," + p.productImage)
	        }else{
	        	$("#msgImg").attr("src", imgDefault)
	    	}
	    	msg = $("#messageContext").find("tr")
	    	for(let i=1;i<7;i++) {
	    		console.log(p[ ( listItem[i] ) ])
	    		msg.eq(i).find("td").eq(1).html( p[ ( listItem[i] ) ] )
//	    		msg.eq(i).find("td").eq(1).css("background-color", "red")
	    	}
	    	msg.eq(7).find("td").eq(0).html( p[ ( listItem[8] ) ] )
	    	$("#messageDiv").show()
    	} else {
    		$("#messageDiv").hide()
    	}
    });

    // 點擊新增產品按鈕的事件->若有進行修改按下取消按鈕 跳出詢問放棄的視窗 是則隱藏視窗 並清空資料
    $("#insProduct").click( function () {
        let actionName = $("input[name=pId]").val()!=""?"修改":"新增"
        // $("#iPDiv").load("insertProduct.html")
        if((!productEdit && $("#iPDiv").is(":visible")) || productEdit && $("#iPDiv").is(":visible") && confirm("是否要放棄本次的" + actionName + "？")){
            $("#iPDiv").hide()
            $("input[name=pId]").val("")
            productEdit = false
            $(".productListView,.pagination").show()
            $("#insProduct").text("新增產品")
            $("#iPDiv").find("input[type=date][name=uplTime]").attr('disabled', false)
        }else{
            if(!productEdit){
                $("#insProduct").text("放棄" + actionName)
                $("#iPDiv").find("input[type=text],input[type=Date]").val("")
                $("#iPDiv").find("input[type=Date]").val((new Date()).format("yyyy/MM/dd"))
                $("#iPDiv").find("textarea").val("")
                $("#iPDiv").find("img#Preview").attr("src", imgDefault)
            	$("#iPDiv").find("input[type=file]").val("")
                $("#iPDiv").show()
                // $("#iPDiv").find("input[type=date][name=uplTime]").attr('disabled',
				// false)
                $(".productListView,.pagination").hide()
            }
        }
    })

    // 新增/修改商品中的重設按鈕 若是修改則回覆該筆資料本來的樣子 不是則清空
    $("#resetProductBean").on("click", function() {
        id= $("input[name=pId]").val()
        if(id != ""){
            p = findProductById( id )
            $("#iPDiv").find("input[type=hidden][name=pId]").val(p.productId)
            $("#iPDiv").find("input[type=text][name=pName]").val(p.productName)
            $("#iPDiv").find("input[type=text][name=price]").val(p.price)
            $("#iPDiv").find("select[name=tagList]").val(tagList.indexOf(p.tag))
            $("#iPDiv").find("textarea[name=intro]").val(p.intro)
            $("#iPDiv").find("img#Preview").attr("src", "data:image/jpeg;base64," + p.productImage)
            $("#iPDiv").find("input[type=date][name=uplTime]").val(p.uploadTime.format("yyyy/MM/dd"))
            $("#iPDiv").find("input[type=date][name=dwlTime]").val(p.downloadTime.format("yyyy/MM/dd"))
        }else{
            $("#iPDiv").find("input:not([type=button]),textarea").val("")
            $("#iPDiv").find("img#Preview").attr("src", imgDefault)
            $("#iPDiv").find("select[name=tagList]").val(0)
        }
        $("#iPDiv").find("input[type=file]").val("")
    })
    
    // 新增/修改商品中的送出按鈕
    $("input#sendProductBean").on("click", function() {
    	var formdata = new FormData();
    	let id = $("input[name=pId]").val()
    	formdata.append("id" , id)
    	formdata.append("pName" , $("input[name=pName]").val())
    	formdata.append("price" , $("input[name=price]").val())
    	formdata.append("intro" , $("textarea[name=intro]").val())
    	formdata.append("tag" , tagList[parseInt($("select[name=tagList]").val())])
    	formdata.append("uplTime" , $("input[name=uplTime]").val())
    	formdata.append("dwlTime" , $("input[name=dwlTime]").val())
    	formdata.append("file" , $("input#pfile").get(0).files[0])
    	
    	$.ajax({
			url: "productBean",
			type: "POST",
			data: formdata,
		    async: false,
		    cache: false,
		    contentType: false,
		    processData: false,
		    success: function(data){
				alert("您已成功" + (id!=null?"新增":"修改") + "了一筆資料")
			},
			error: function(data){
				alert((id!=null?"新增":"修改") + "時發生了技術性的失誤！")
			}
		}).done(function() {
			getProductList()
		})
    })

    // 圖片直接替代 input/file
    $('#pfile').on("change", function () {
        var file = $('#pfile')[0].files[0];
        var reader = new FileReader;
        reader.onload = function (e) {
            $('#Preview').attr('src', e.target.result);
        };
        reader.readAsDataURL(file);
        productEdit = true
    });
    $("#Preview").on("click", function() {
        $("#pfile").click();
    })

    // 產品的上/下架時間 判斷 (目前只有判斷 下架日必須在上架日之後 且兩個日期都是[目前時間]之後)
    $("input[type=date]#uplTime").attr("min", (new Date()).format("yyyy-MM-dd")).on("change", function(){
        if(Date.parse($(this).val()).valueOf() > Date.parse($("input[type=date]#dwlTime").val()).valueOf() && Date.parse($("input[type=date]#dwlTime").val()).valueOf != null) {
            alert("到期日不得超過開始日")
            $("input[type=date]#dwlTime").val($(this).val())
        }
        $("input[type=date]#dwlTime").attr("min", $(this).val())
    })

    // 顯示/隱藏目前沒有再販售的商品
    $("#hideProductNotSales").on("click", function() {
        if($(".expired,.notyet").hasClass("hideClass")){
            $(".expired,.notyet").removeClass("hideClass")
            $(this).text("只顯示正在販售的商品")
        }else {
            $(".expired,.notyet").addClass("hideClass")
            $(this).text("顯示全部商品")
        }
        createProductPageNum()
    })
    
    //一鍵輸入產品新增
	$("input#oneKeyinInsert").on("click", function(){
		$("#iPDiv").find("input[type=text][name=pName]").val("NBA 2K20")
	    $("#iPDiv").find("input[type=text][name=price]").val(1790)
	    $("#iPDiv").find("select[name=tagList]").val(tagListIndexOf("運動"))
	    $("#iPDiv").find("textarea[name=intro]").val("《NBA 2K》系列持續進化，現已不單是個籃球模擬遊戲。《NBA 2K20》不僅提供最為出色的畫面與遊戲表現，也帶來各種創新的遊戲模式，以及無與倫比的球員操控與自訂體驗，2K遊戲開發部門不斷重新定義運動遊戲的可能性。此外，身臨其境的開放世界「街區」也讓《NBA 2K20》成為集合所有玩家與籃球員，一同開創未來籃球文化的平台。")
	    $("#iPDiv").find("input[type=date][name=uplTime]").val((new Date()).format("yyyy-MM-dd"))
	    $("#iPDiv").find("input[type=date][name=dwlTime]").val((parseInt((new Date()).format("yyyy")) + 1) + (new Date()).format("-MM-dd"))
	})

    // 判斷新增/修改狀態有沒有進行動作(方便關掉視窗時提醒放棄修改)
    $("#iPDiv").find("input,textarea").on("change", function() {
        productEdit = true
    })

    // 產生產品的頁碼
    function createProductPageNum(){
        pAllPage = Math.ceil( $("#productList>tr:not(.hideClass)").length / pPerPageNum )
        let txt = "<li><a href='#' class='button special'>Previous</a></li>"
        for(let i=0;i<pAllPage;i++){
            txt += "<li class='page'><a href='#'>" + (i + 1) + "</a></li>"
        }
        txt += "<li><a href='#' class='button special'>Next</a></li>"
        $("#productDiv ul.pagination").html(txt)

        // 此為翻頁的事件(翻到第幾頁)
        function turningPPage(page) {
            trLen = $("#productList>tr:not(.hideClass)").length
            $("#productList>tr:not(.hideClass)").hide()
            for(let i=(page-1)*pPerPageNum;i<page*pPerPageNum;i++){
                $("#productList>tr:not(.hideClass)").eq(i).show()
            }
        }

        
        // 點擊上/下頁的動作
        $("#productDiv a.button.special").on("click", function() {
            let page = parseInt($("#productDiv li.page.current>a").text())
            actionName = $(this).text()
            console.log("page: " + page)
            console.log("actionName: " + actionName)
            if( page > 1 && actionName == "Previous" ){
				$("#productDiv li.page").eq(page-2).addClass("current").siblings().removeClass("current")
                turningPPage(page-1)
            }else if( page < pAllPage && actionName == "Next" ){
				$("#productDiv li.page").eq(page).addClass("current").siblings().removeClass("current")
                turningPPage(page+1)
            }
        })

        // 點擊頁碼後的動作
        $("#productDiv li.page>a").on("click", function() {
            $(this).closest("li.page").addClass("current").siblings().removeClass("current")
            turningPPage($(this).text())
        })
        
        // 讓一開始都在第一頁
        $("#productDiv li.page>a").eq(0).click()
    }
// ------------------------------------------ 以下為活動的 JS -------------------------------------------------
    //活動標籤跳選
    $("#insEvent").click(function(){
    	$("#tab2").hide();
    	$("#tab1").hide();
    	$("#tab0").show();
    	$("#selectButton").hide();
    });
    
    $("#qurEvent").click(function(){
    	$("#tab2").hide();
    	$("#tab0").hide();
    	$("#tab1").show();
    	$("#selectButton").show();
    	createEventPagesNum();
    })
	//新增CKEditor
    var editorcontent;
	var responseEditorcontent;
	ClassicEditor
		.create(document.querySelector('#editor'), {
			toolbar: ['bold', 'italic', 'link',
				'bulletedList',
				'numberedList',
				'|', 'outdent', 'indent'],
			placeholder: '請輸入文章...',
		})
		.then(editor => {
			editorcontent = editor;
		})
		.catch(error => {
			console.error(error);
		});
	
	// 修改CKEditor
	ClassicEditor
	.create(document.querySelector('#editor2'), {
		toolbar: ['bold', 'italic', 'link',
			'bulletedList',
			'numberedList',
			'|', 'outdent', 'indent']
	})
	.then(editor => {
		responseEditorcontent = editor;
	})
	.catch(error => {
		console.error(error);
	});
	
	
	//一開始載入所執行的函數
	function reloadAllEvent(){
	$.ajax({
		url : "queryAllEvent",
		dataType : "json",
		type : "GET",
		success : function(response) {
			var txt = "";
			for (let i = response.length-1; i >= 0; i--) {
				var id = response[i].eventId;
				txt += "<tr><td>"+ response[i].eventId;
				txt += "<td>"+ response[i].productId;
				txt += "<td><img src='data:image/jpeg;base64," + response[i].eventImage + "' style='width:200px;hight:150px;'>";
				txt += "<td>"+ response[i].eventName;
				txt += "<td><button class='contentButton' type='button' >內文</button>";		
				txt += "<td>"+ response[i].startDate;
				txt += "<td>"+ response[i].endDate;
				txt += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" id="queryUpdateData">修改</button>';				
				txt += '<td><button type="button" class="btn btn-danger" id="delete">刪除</button>';
				txt += "<tr class='content' hidden><td colspan='3'></td><td id='"+id+"' colspan='4'>"+response[i].content+"</td><td colspan='2'></td></tr>"
						
			}
			$('#queryAllEvent').html(txt);

			$("button.contentButton").on("click",function(){			
				$(this).closest("tr").next().toggle();
		    })
		    createEventPagesNum();
			
		}
	});
	}
	
	// 查詢全部資料按鈕
	$(document).on('click', '#searchAllData', function() {
		$.ajax({
			url : "queryAllEvent",
			dataType : "json",
			type : "GET",
			success : function(response) {
				var txt = "";
				for (let i = response.length-1; i >= 0; i--) {
					var id = response[i].eventId;
					txt += "<tr><td>"+ response[i].eventId;
					txt += "<td>"+ response[i].productId;
					txt += "<td><img src='data:image/jpeg;base64," + response[i].eventImage + "' style='width:200px;hight:150px;'>";
					txt += "<td>"+ response[i].eventName;
					txt += "<td><button class='contentButton' type='button' >內文</button>";
					txt += "<td>"+ response[i].startDate;
					txt += "<td>"+ response[i].endDate;
					txt += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" id="queryUpdateData">修改</button>';									
					txt += '<td><button type="button" class="btn btn-danger" class="eventDel" id="delete">刪除</button>';
					txt += "<tr class='content' hidden><td colspan='3'></td><td id='"+id+"' colspan='4'>"+response[i].content+"</td><td colspan='2'></td></tr>";
				}
				$('#queryAllEvent').html(txt);	
				
				$("button.contentButton").on("click",function(){
					$(this).closest("tr").next().toggle();
			    })
			    
				createEventPagesNum();
				
			}
		});
	})
	
	var eventId = null;	
	
	
	// addEvent	
	$(document).on('click', '#add', function() {
		var myForm = document.getElementById('newEvent');
		var formData = new FormData(myForm);
		var insertImage =$('#imageUpload').get(0).files[0];
		
		formData.append("eventImage",insertImage);								
		formData.append("content",editorcontent.getData());			
		
			$.ajax({
				url : "addEvent",
				processData : false,
				contentType : false,
				type : "POST",
				data : formData,
				success : function(response) {
					alert("新增成功");										
					$("#tab1").show();
					$("#tab0").hide();
					$("#tab0").find("input[type=file]").val("");
					// location.reload();
					reloadAllEvent();
					createEventPagesNum();
					//清空欄位
					$("#tab0").find("input[type=date]").val("");
					$("#tab0").find("input[type=date]").val("");
					$("#tab0").find("input[type=file]").val("");
					$("#tab0").find("input[type=text]").val("");
					$("#tab0").find("img").attr("src","");
					editorcontent.setData("");
				},
			});				
		});
	// addEvent 底下清出按鈕
	$(document).on('click', '#clear', function() {
		editorcontent.setData("");
		$("#tab0").find("img").attr("src","");
	})
	// addEvent Demo button
	$("#demobutton").click(function(){
		$('input[name="startDate"]').val("2020-05-08");
		$('input[name="endDate"]').val("2020-05-09");								
		$('input[name="product_Id"]').val("1");
		$('input[name="eventName"]').val("《黑暗靈魂 3》死亡不是處罰 反倒是種象徵成長的獎勵");
		editorcontent.setData("《黑暗靈魂 3（DARK SOULS III）》是黑暗奇幻風格的動作角色扮演遊戲《黑暗靈魂（DARK SOULS）》系列最終作，玩家跟前作一樣在遊戲中扮演無法死去的不死人，為了將古代薪王帶回傳火祭祀場延續火焰照亮世界，不想因為薪王拋棄王位讓柴火燒完而成為空無一物乾柴，不死人們啟程前往尋找薪王們的下落，經歷無數的挫折與死亡之後，死後復活繼續挑戰不死詛咒的使命感將會侵蝕你的內心，讓你無法自拔。極具挑戰性又不會困難到無法通關的遊戲難度和令人回味無窮的世界觀故事背景，一直以來都是靈魂系列最吸引人的地方，《黑暗靈魂 3》時間點發生在一二代之後，主線劇情環繞在四名薪王身上，深淵監視者、噬神的艾爾德利奇、巨人尤姆、以及洛斯里克雙王子，眼尖的玩家應該馬上就能猜到其中兩名薪王是怎樣的身分吧？");
			
	})
	
	//updateEvent Demo button
	$("#demo2").click(function(){
		alert("新增成功");
		$('input[name="startDate1"]').val("2020-06-01");
		$('input[name="endDate1"]').val("2020-06-30");								
		$('input[name="productId1"]').val("1");
		$('input[name="eventName1"]').val("《黑暗靈魂 3》死亡不是處罰 反倒是種象徵成長的獎勵");
		responseEditorcontent.setData("《黑暗靈魂 3（DARK SOULS III）》是黑暗奇幻風格的動作角色扮演遊戲《黑暗靈魂（DARK SOULS）》系列最終作，玩家跟前作一樣在遊戲中扮演無法死去的不死人，為了將古代薪王帶回傳火祭祀場延續火焰照亮世界，不想因為薪王拋棄王位讓柴火燒完而成為空無一物乾柴，不死人們啟程前往尋找薪王們的下落，經歷無數的挫折與死亡之後，死後復活繼續挑戰不死詛咒的使命感將會侵蝕你的內心，讓你無法自拔。極具挑戰性又不會困難到無法通關的遊戲難度和令人回味無窮的世界觀故事背景，一直以來都是靈魂系列最吸引人的地方，《黑暗靈魂 3》時間點發生在一二代之後，主線劇情環繞在四名薪王身上，深淵監視者、噬神的艾爾德利奇、巨人尤姆、以及洛斯里克雙王子，眼尖的玩家應該馬上就能猜到其中兩名薪王是怎樣的身分吧？");
			
	})
	// 新增活動時  圖立即顯現
	$("#imageUpload").change(function(){
		var file = $('#imageUpload')[0].files[0];
		var reader = new FileReader;
		reader.onload = function(e) {
			$('#preview_Image').attr('src', e.target.result);
		};
		reader.readAsDataURL(file);
	});
	$("#preview_Image").click(function(){
		$("#imageUpload").click();
	});
	//修改活動時   立即
	$("#imageUpdate").change(function(){
		var file = $('#imageUpdate')[0].files[0];
		var reader = new FileReader;
		reader.onload = function(e) {
			$('#preview_Image2').attr('src', e.target.result);
		};
		reader.readAsDataURL(file);
	});
	$("#preview_Image2").click(function(){
		$("#imageUpdate").click();
	});

	// deleteEvent
	$(document).on("click", "#delete", function() {
		var checkstr = confirm("刪除該活動?");
		if (checkstr == true) {
			var $tr = $(this).parents("tr");
			eventId = $tr.find("td").eq(0).text(); // 抓取id值
			$(this).parents("tr").remove(); // 刪除整個欄位

			$.ajax({
				url : "deleteEvent",
				//dataType : "json",
				type : "POST",
				data : {"eventId": eventId},
				success : function(response) {
				}
			}).done(function (){
				reloadAllEvent();
				createEventPagesNum();				
					
			});
			alert("刪除成功");
		} else {
			return false;
		}
	});

	// 按下修改按鈕時 將需要修改的資料找出
	$(document).on('click', '#queryUpdateData', function() {
		var $tr = $(this).parents("tr");
		eventId = $tr.find("td").eq(0).text(); // 抓取id值
		$("#tab0").hide();
		$("#tab1").hide();
		$("#tab2").show();
		$.ajax({
			url : "queryEvent",
			dataType : "json",
			type : "GET",
			data : {eventId : eventId},
			success : function(response) {
				var txt = "活動編號 : "+response.eventId;
				$('input[name="startDate1"]').val(response.startDate);
				$('input[name="endDate1"]').val(response.endDate);								
				$('input[name="productId1"]').val(response.productId);
				$('input[name="eventName1"]').val(response.eventName);
				responseEditorcontent.setData(response.content);							
				$('img[name="eventImage2"]').attr("src","data:image/jpeg;base64,"+response.eventImage+"");
				$('p[name="eventId1"]').val(response.eventId);
				$('#eventId1').html(txt);						 
			},
		});		
	});				
	// searchButton 搜尋單筆資料
	$(document).on('click', '#search', function() {
		eventId = $("#se1").val();
		$.ajax({
			url : "queryEvent",
			dataType : "json",
			type : "GET",
			data : {eventId : eventId},
			success : function(response) {
				var txt = "";
				txt += "<tr class='thistr'><td>"+ response.eventId;
				txt += "<td>"+ response.productId;
				txt += "<td><img src='data:image/jpeg;base64," + response.eventImage + "' style='width:200px;hight:150px;'>";
				txt += "<td>"+ response.eventName;
				txt += "<td><button class='contentButton' type='button' >內文</button>";			
				txt += "<td>"+ response.startDate;
				txt += "<td>"+ response.endDate;
				txt += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" id="queryUpdateData">修改</button>';						
				txt += '<td><button type="button" class="btn btn-danger" id="delete">刪除</button>';	
				txt += "<tr class='content' hidden><td colspan='3'></td><td colspan='4'>"+response.content+"</td><td colspan='2'></td></tr>";
				$('#queryAllEvent').html(txt);	
				$("button.contentButton").on("click",function(){
					$(this).closest("tr").next().toggle();
			    })
			    
			},
		});				
	});
	
	
	// UpdateEventData
	$(document).on('click', '#SaveButton', function() {
		var myForm = document.getElementById('updateForm');
		var formData = new FormData(myForm);
		
		var updateImage =$('#imageUpdate').get(0).files[0];			

		if(updateImage != undefined){				
			formData.append("eventImage1","null");						
		}
		formData.append("eventImage1",updateImage);	
								
		formData.append("content1",responseEditorcontent.getData());			
		formData.append("eventId1",eventId);
			$.ajax({
				url : "updateEvent",
				processData : false,
				contentType : false,
				type : "POST",
				data : formData,
				success : function(response) {
					alert("修改成功");	
					$("#tab1").show();
					$("#tab2").hide();
					// location.reload();
					reloadAllEvent();
					
					$("#tab2").find("input[type=file]").val("");
				},
			});				
		});
	
	
	$(document).ready(function(){
		reloadAllEvent()
		createEventPagesNum()
	});




//-----活動頁面
 	// 產生活動的頁碼
	var ePerPageNum = 4;	//一頁幾筆
	var eAllPage=1;
	//var page = $("li.page>a").val();

	function createEventPagesNum(){
		var allDatalen = $("#tab1 tr:not(.content)").length;
		eAllPage = Math.ceil( ((allDatalen)-1) / ePerPageNum )
		let txt = "<li><a href='#' class='button special'>Previous</a></li>" //上一頁
		for(let i=0;i<eAllPage;i++){
	        txt += "<li class='page'><a href='#'>" + (i + 1) + "</a></li>"	//頁碼數
	    }	
		txt += "<li><a href='#' class='button special'>Next</a></li>"	//下一頁
	    $("#tab1 ul.pagination").html(txt)	
	
	

        // 此為翻頁的事件(翻到第幾頁)
        function turningEPage(page) {
            trLen = $("#queryAllEvent tr:not(.content)").length
            $("#queryAllEvent tr").hide()
            for(let i=(page-1)*ePerPageNum;i<page*ePerPageNum;i++){
                $("#queryAllEvent tr:not(.content)").eq(i).show()
            }
        }

     
            // 點擊上/下頁的動作
            $("#tab1 a.button.special").on("click", function() {
                let page = parseInt($("#tab1 li.page.current>a").text())
                actionName = $(this).text()
                if( page > 1 && actionName == "Previous" ){
    				$("#tab1 li.page").eq(page-2).addClass("current").siblings().removeClass("current")
                    turningEPage(page-1)
                }else if( page < eAllPage && actionName == "Next" ){
    				$("#tab1 li.page").eq(page).addClass("current").siblings().removeClass("current")
                    turningEPage(page+1)
                }
            })

            // 點擊頁碼後的動作
            $("#tab1 li.page>a").on("click", function() {
                $(this).closest("li.page").addClass("current").siblings().removeClass("current")
                turningEPage($(this).text())
            })

            // 讓一開始都在第一頁
            //turningEPage(1)
            $("#tab1 li.page").eq(0).find("a").click()
            

	}    
//修改 放棄 button
	$(document).on('click', '#closebtn', function() {
		
		$("#tab1").show();
		$("#tab2").hide();
		
	})

	
	// ----------------------------------------------- reply -------------------------------------------------
	
	function replyView() {
		$("#replyDiv").show().siblings().hide()
		var totalList = 0;
		var txt = "";
		$.ajax({
			url: "http://localhost:8080/GameShop/bmscomment",
			type: "GET",
			dataType: "json",
			success: function (data) {
				totalList = data.length;
				for (let i = 0; i < data.length; i++) {
					txt += '<tr><td>' + data[i].productId + '</td><td>' + data[i].comment + '</td><td>' + data[i].postDatetime + '</td><td id="replycontent' + i+ '">' + data[i].reply + '</td><td>' + data[i].replyDatetime + '</td><td><input id="reply' + i + '" type="text" name="reply"></input><input id="comId' + i + '" type="text" name="comId" hidden="hidden" value="' + data[i].comId + '"></input><button id="btn' + i + '">回覆</button></td></tr>';
				}
				$("#replyList").html(txt);
			}, error: function () {
				console.log("連線失敗");
			}
		}).done(function () {
			for (let i = 0; i < totalList; i++) {
				$("#btn" + i).click(function () {
					$.ajax({
						url: "http://localhost:8080/GameShop/reply",
						type: "GET",
						dataType: "json",
						data: {
							comId: $("#comId" + i).val(),
							reply: $("#reply" + i).val()
						},
						success: function (data) {
							if (data) {
								alert("success");
								$("#replycontent"+i).text($("#reply" + i).val());
							} else {
								alert("fail");
							}
						}, error: function () {
							console.log("連線失敗");
						}
					})
				})
			}
		})
	}
	
	// ----------------------------------------------- Chart -------------------------------------------------

	// 抓訂單清單的各產品的購買次數
    $.getJSON("OrderDetailStat", function( jdata ){
		orderStat = jdata;
	})
	
	$.getJSON("WishListChart", function( jdata ){
		wishList = jdata;
	})
	
	$("#ShowOrderChartBtn").on("click", function(){
		chartTitle.text = "產品銷售比例"

		let sum = 0;
		for(let i=0;i<orderStat.length;i++){
			sum += parseInt(orderStat[i].NumOfSales)
		}
		
		let data = [];
		for(let i=0;i<orderStat.length;i++){
			let obj = {
					"name": findProductById(parseInt(orderStat[i].productId)).productName,
					"y": ((parseInt(orderStat[i].NumOfSales)*100)/sum)
				}
			data.push(obj)
		}
		
		CreateChart( data );
	})
	
	$("#ShowPTagChartBtn").on("click", function(){
		chartTitle.text = "類別銷售比例"
		//將各個分類初始化
		let tagArray = [];
		for(let i=0;i<9;i++){
			let obj = {
					"name": tagList[i],
					"y": 0
			}
			tagArray.push(obj)
		}
		//求總銷售數量
		let sum = 0;
		for(let i=0;i<orderStat.length;i++){
			sum += parseInt(orderStat[i].NumOfSales)
		}
		//數出各分類的數量
		for(let i=0;i<orderStat.length;i++){
			let tagName = findProductById(parseInt(orderStat[i].productId)).tag
			for(let j=0;j<tagArray.length;j++){
				if( tagArray[j].name == tagName ){
					tagArray[j].y += ((parseInt(orderStat[i].NumOfSales)*100)/sum);
				}
			}
		}
		//清掉y=0的項目
		for(let i=tagArray.length-1;i>=0;i--){
			if( tagArray[i].y == 0 ){
				tagArray.splice(i, 1);
			}
		}
		
		
		CreateChart( tagArray );
	})
	
	$("#ShowWishChartBtn").on("click", function(){
		chartTitle.text = "產品願望占比"
		
		let sum = 0;
		for(let i=0;i<wishList.length;i++){
			sum += parseInt(wishList[i].NumOfWish)
		}
		
		let data = [];
		for(let i=0;i<wishList.length;i++){
			let obj = {
					"name": findProductById(parseInt(wishList[i].productId)).productName,
					"y": ((parseInt(wishList[i].NumOfWish)*100)/sum)
				}
			data.push(obj)
		}
		
		CreateChart( data );
	})

	

})// ---------------------------------------------------- End Document.ready -----------------------------------------------


// 取字串左邊 num 位出來
function left(str, num) {
    return str.substring(0,num)
}

// 用產品編號查詢該產品的物件
function findProductById(id) {
	for (let i = 0; i < productList.length; i++) {
        if (parseInt(productList[i].productId) == parseInt(id)) {
            return productList[i]
        }
    }
}

// 傳入兩個時間參數 x, y 並比較 x 是否比 y 大，是則回傳 true
function Compare(x, y) {
    a = Date.parse(x).valueOf()
    b = Date.parse(y).valueOf()
    if (a > b) {
        return true
    } else {
        return false
    }
}

// 新增 JavaScript Data格式設定 .format 函數
// 參考資源 https://dotblogs.com.tw/felixfu/2014/12/29/147856
Date.prototype.format = function(fmt){
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// 圖表的 JS 套件 提供的方法 
// 修改為 傳 資料 Array> Object > key: name, y->(%)
function CreateChart( data ) {
	Highcharts.chart('container', {
	    chart: {
	        plotBackgroundColor: null,
	        plotBorderWidth: null,
	        plotShadow: false,
	        type: 'pie'
	    },
	    title: chartTitle,
	    tooltip: {
	        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	    },
	    accessibility: {
	        point: {
	            valueSuffix: '%'
	        }
	    },
	    plotOptions: {
	        pie: {
	            allowPointSelect: true,
	            cursor: 'pointer',
	            dataLabels: {
	                enabled: true,
	                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
	            }
	        }
	    },
	    series: [{
	        name: 'Brands',
	        colorByPoint: true,
	        data: data
	    }]
	});
}

var productList;
var imgDefault = "../img/BmsDefualtImg.jpg"
var chartTitle = { text: "產品銷售比例" }
var productEdit = false
var pPerPageNum = 5
var pAllPage = 0
var pPage = 0
var wishList;
var orderStat;

// 遊戲分類中英文對照參考
// https://blog.xuite.net/foreveriori/game/33551587-%E9%81%8A%E6%88%B2%E9%A1%9E%E5%9E%8B%E8%8B%B1%E6%96%87%E5%90%8D%E8%A9%9E%E8%A7%A3%E9%87%8B
var tagList = [
//	"Action",//"動作",
//	"RTS",// "策略",
//    "RPG",// "角色扮演",
//    "STG",// "射擊",
//    "SLG",// "模擬",
//    "AVG",// "冒險",
//    "ETC",// "休閒",
//    "SPG",// "運動",
//    "Horror",// "恐怖"
    "動作",
    "策略",
    "角色扮演",
    "射擊",
    "模擬",
    "冒險",
    "休閒",
    "運動",
    "恐怖"
]

// 產品狀態表
var pStatus = [
    "expired",
    "valid",
    "notyet",
    "已下架",
    "販售中",
    "未上架"
]

// 找分類陣列中索引
function tagListIndexOf(str) {
    for(let i=0;i<tagList.length;i++){
        if(str==tagList[i]){
            return i
        }
    }
}





