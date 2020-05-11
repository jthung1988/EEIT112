<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
    <link rel="stylesheet" href="../css/BmsHomePage.css">
    <script src="https://code.jquery.com/jquery-3.5.0.min.js"></script>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="../js/BmsHomePage.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<!-- 活動用的 UI js -->
	<!-- 	<link rel="stylesheet"	href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"> -->
	<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
	<script src="https://cdn.ckeditor.com/ckeditor5/19.0.0/classic/ckeditor.js"></script>
	<!-- 活動用的 UI js END -->
<style>
/* 	#replyDiv table { */
/*     margin-bottom: 20px; */
/*     border-collapse: collapse; */
/*     background-color: rgb(172, 214, 255, 0.4); */
/* } */

/* #replyDiv  tr, td { */
/*     line-height: 50px; */
/*     height: 50px; */
/* } */
/* #replyDiv thead tr { */
/*     background-color: rgb(70, 163, 255, 0.4); */
/* } */

/* #replyDiv tbody tr { */
/*     background-color: rgb(132, 193, 255, 0.4); */
/* } */

/* #replyDiv button{ */
/*     border-radius: 5px; */
/*     width: 59px; */
/*     height: 37px; */
/*     margin: 1px; */
/*     background-color: rgb(95, 206, 192, 0.5); */
/* } */

/* #replyDiv td { */
/*     text-align: center; */
/*     padding: 2px; */
/*     width: 75px; */
/* } */

/* #replyDiv td:nth-child(1) { */
/*     width: 70px !important; */
/* } */
/* #replyDiv td:nth-child(2) { */
/*     width: 400px !important; */
/* } */
/* #replyDiv td:nth-child(3) { */
/*     width: 100px !important; */
/* } */
/* #replyDiv td:nth-child(4), td:nth-child(7) { */
/*     width: 200px !important; */
/* } */
/* #replyDiv td:nth-child(5) { */
/*     width: 100px !important; */
/* } */
/* #replyDiv td:nth-child(6), td:nth-child(7) { */
/*     width: 350px !important; */
/* } */


</style>
</head>

<body>
	<div class="bms">
		<div class="header">
			<h1>GameGuild's 後臺管理系統</h1>
			<div class="logout">
				<a href="Logout"><b>登&nbsp;出</b></a>
			</div>
		</div>

		<div id="asideLeft">
            <ul>
                <li id="product" class="bmsmenu"><a href="#">商品</a></li>
                <li id="event" class="bmsmenu"><a href="#">活動</a></li>
				<li id="chart" class="bmsmenu"><a href="#">圖表</a></li>
				<li id="reply" class="bmsmenu"><a href="#">評論</a></li>
            </ul>
        </div>

        <div class="main">
            <div id="article" class="article">
                <div id="messageDiv" hidden>
                	<div id="messageContext">
                		<table>
                			<tr><td colspan="2"><img id="msgImg"></td></tr>
                			<tr><td>產品編號</td><td></td></tr>
                			<tr><td>產品名稱</td><td></td></tr>
                			<tr><td>類別</td><td></td></tr>
                			<tr><td>價格</td><td></td></tr>
                			<tr><td>上架日期</td><td></td></tr>
                			<tr><td>下架日期</td><td></td></tr>
                			<tr><td rowspan="2" colspan="2">遊戲描述</td></tr>
                		</table>
                	</div>
                </div>

                <div id="ChartDiv" class="section" hidden>
                	<div id="productListMenu" class="sectionMenu">
	                    <button id="ShowOrderChartBtn" class="button">產品銷售比例</button>
	                    <button id="ShowPTagChartBtn" class="button">類別銷售比例</button>
	                    <button id="ShowWishChartBtn" class="button">願望占比</button>
					</div>
                	<figure class="highcharts-figure">
					    <div id="container"></div>
					    <p class="highcharts-description">
					        
					    </p>
					</figure>
					<table>
						
					</table>
                </div>
                
                <div id="productDiv" class="section" hidden>
                    <div id="productListMenu" class="sectionMenu">
	                    <button id="insProduct" class="button">新增產品</button>
	                    <button id="hideProductNotSales" class="productListView button">只顯示架上商品</button>
					</div>
					<div id="iPDiv" hidden>
						<form action="xxxController" method="post" enctype="multipart/form-data">
							<input type="hidden" name="pId">
							<table>
								<!-- 	test id -->
								<tr>
									<td>遊戲封面</td>
									<td colspan="3">
										<img id="Preview" src="../img/BmsDefualtImg.jpg">
										<input id="pfile" type="file" name="file" accept=".png, .jpg, .jpeg" hidden></td>
								</tr>
								<tr>
									<td>遊戲名稱</td>
									<td><input type="text" name="pName"></td>
									<td rowspan="2">分類</td>
									<td rowspan="2">
										<select name="tagList">
											<option value="0">動作</option>
											<option value="1">策略</option>
											<option value="2">角色扮演</option>
											<option value="3">射擊</option>
											<option value="4">模擬</option>
											<option value="5">冒險</option>
											<option value="6">休閒</option>
											<option value="7">運動</option>
											<option value="8">恐怖</option>
										</select>
									</td>
								</tr>
								<tr>
									<td>價格</td>
									<td><input type="text" name="price"></td>
								</tr>
								<tr>
									<td>描述</td>
									<td colspan="3">
										<textarea name="intro" cols="50" rows="5" placeholder="輸入遊戲的描述"></textarea></td>
								</tr>
								<tr>
									<td>上架時間</td>
									<td><input type="date" name="uplTime" id="uplTime"></td>
									<td>下架時間</td>
									<td><input type="date" name="dwlTime" id="dwlTime"></td>
								</tr>
								<tr>
									<td colspan="2">
										<input type="button" id="sendProductBean" value="確定送出" /></td>
									<td colspan="2">
										<input type="button" id="resetProductBean" value="重設" /></td>
								</tr>
								<tr>
									<td colspan="4">
										<input type="button" id="oneKeyinInsert" value="一鍵輸入"></td>
								</tr>
							</table>
						</form>
					</div>
					<table id="productListTable" class="productListView">
						<thead>
							<tr>
								<td>產品狀態</td>
								<td>產品編號</td>
								<td>產品名稱</td>
								<td>分類</td>
								<td>價格</td>
								<td>上架時間</td>
								<td>下架時間</td>
								<td></td>
								<td></td>
							</tr>
						</thead>
						<tbody id="productList">
						</tbody>
					</table>
					<ul class="pagination"></ul>
				</div>

                <div id="eventDiv" class="section" hidden>
                	<div id="eventMenu" class="sectionMenu">
	                	<button id="insEvent" class="button">新增活動</button>
						<button id="qurEvent" class="productListView button">查詢活動</button>					
						<label id="selectButton">
							<input type="text" id="se1" placeholder="請輸入想搜尋的活動編號">
							<button id="search">查詢</button>
							<button id="searchAllData">查詢全部活動</button>
						</label>
					</div>
					<!-- 第一個標籤 -->
					<div id="tab0" class="" style="display: block;" >
						<form id="newEvent"  name="newEvent" method="POST" enctype="multipart/form-data">	
							<table id="insertEvent">
								<thead>
									<tr>
										<td colspan="4"><h2>新增活動</h2></td>
									</tr>
								</thead>
								<tr>
									<td>活動起始時間 : <input type="date" id="startDate"	name="startDate"></td>
									<td>活動結束時間 : <input type="date" id="endDate" name="endDate"></td>
								</tr>
								<tr>
									<td>活動圖檔:&nbsp;<input type="file" id="imageUpload"	name="eventImage" multiple="multiple" accept=".png, .jpg, .jpeg" style="width: 227px" />
									</td><td rowspan="3"><img id="preview_Image" src="#" style='width:200px;hight:150px;'/>
									</td>
								</tr>
								<tr>
									<td>產品編號 : <input type="text" name="product_Id"></td>
								</tr>
								<tr>
									<td>活動標題 : <input type="text" name="eventName"></td>
								</tr>
								<tr>
									<td colspan="2">活動內文 : <textarea id="editor" name="content"></textarea></td>
								</tr> 
								<tr>
									<td colspan="2">
										<input type="button" id="add"  value="新增活動"/>
										<input type="reset"  id="clear" value="清除" id="reset" />
										<input type="button" value="Demo" id="demobutton"/>
									</td>							
								</tr>
							</table>
						</form>
					</div>
					<!-- 第二個標籤 -->
					<div id="tab1" class="" style="width:1000px">								
						<div>
							<table id="eventListTable">
								<thead >
									<tr>
										<td>活動編號</td>
										<td>產品編號</td>
										<td>活動照片</td>
										<td>活動名稱</td>
										<td>活動內文</td>
										<td>開始日期</td>
										<td>結束日期</td>
										<td colspan='2'>設定</td>
									</tr>
								</thead>
								
								<tbody id="queryAllEvent">
								</tbody>
							</table>
							<ul class="pagination"></ul>									
						</div>
					</div>
		       		<!-- 第三個標籤 -->
					<div id="tab2" class="container" hidden>
						<form id="updateForm" name="updateForm"  method="POST" enctype="multipart/form-data" >													
							<table id="updateEvent">
								<tr>
									<td name="eventId1" id="eventId1"></td>
								</tr>
								<tr>
									<td>活動起始時間 : <input type="date" id="startDate1" name="startDate1"></td>
								</tr>
								<tr>
									<td>活動結束時間 : <input type="date" id="endDate1" name="endDate1"></td>
								</tr>
								<tr>
									<td>活動圖檔 : <input type="file" id="imageUpdate" name="eventImage1" multiple="multiple" accept=".png, .jpg, .jpeg"/><img id="preview_Image2" name="eventImage2" alt="" src="" style='width:200px;hight:150px;'>	</td>
								</tr>
								<tr>
									<td>產品編號 <input type="text" name="productId1"></td>
								</tr>
								<tr>
									<td>活動標題 : <input type="text" name="eventName1"></td>
								</tr>									
								<tr>
									<td>活動內文 : <textarea id="editor2" name="content1"></textarea></td>
								</tr>
								<tr>
									<td><button type="button" id="SaveButton" >Save</button>
								   		<button type="button" id="closebtn">close</button>
								   </td>
								</tr> 																							
							</table>																																																																																													
						</form>																								
					</div>
					</div>
						
					<div id="replyDiv" hidden>
						<table id="replyTable">
							<thead>
								<tr>
									<td>遊戲編號</td>
									<td>玩家評論</td>
									<td>評論時間</td>
									<td>回覆內容</td>
									<td>回覆時間</td>
									<td>編輯回覆</td>
								</tr>
							</thead>
							<tbody id="replyList">
							</tbody>
						</table>
					</div>
					
				</div>
			</div>
		</div>

</body>

</html>