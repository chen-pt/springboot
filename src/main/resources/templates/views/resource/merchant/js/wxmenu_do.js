var wxMenu = {
	init: function() {//初始化方法
		//菜单有子菜单的显示
		wxMenu.dot_show();
		wxMenu.publicEvent();//初始化初始化事件方法
		$(".jsMenu").eq(0).trigger("click"); //触发第一个菜单的点击事件		
	},
	publicEvent: function() {
		//点击提供连接
		$(".support_link").find("a").on("click", function() {
			$(this).parents(".support_link").find(".radio span").removeClass("active");
			$(this).prev().find("span").addClass("checked");
			$(".support_link").find("a").removeClass("active");
			$(this).addClass("active");
		});
		//左侧菜单的切换
		//一级菜单
		$("#menuList").delegate(".jsMenu", "click", function(e) {
			//alert("1");
			//此处从后台要id值;
			var id_name = $(this).attr("id");
			$(".menu_form_area").attr("data-id", id_name); //右侧的值和左侧的点击菜单一致
			$(".current").removeClass("current");
			$(".jsMenu").children(".sub_pre_menu_box").hide(); //初始化
			$(this).addClass("current").children(".sub_pre_menu_box").show(); //当前的一级菜单高亮一级菜单的框
			// $(this).find(".jslevel2").removeClass("current");//二级菜单移除框
			var menu2_len = $(this).find(".sub_pre_menu_list").children().length; //二级菜单的个数
			var menu_name = $(this).find(".js_l1Title").text().trim();
			$(".menu_form_area .global_info").text(menu_name);
			$(".js_menu_name").val(menu_name); //初始化菜单名称
			$(".js_menuTitle").text("菜单名称")
			$("#jsDelBt").text("");
			$(".title.js_menuContent").text("菜单内容");
			$(".js_titleNolTips").text("字数不超过5个字符")
			$("#js_none").hide(); //一级菜单右侧
			$("#js_rightBox").show(); //一级菜单右侧
			/*if(menu2_len == 1) {
				$(".menu_form_bd .menu_content_container").show();
				$(".frm_control_group").eq(1).show();
				$("#js_innerNone").hide();
				//$(this).find(".icon_menu_dot").hide();
				wxMenu.dot_show();
				$(".menu_form_area .frm_control_group").show();
				$(".menu_form_area .menu_content_container").show();
			}
			if(menu2_len >= 2) {*/
				$(".menu_form_bd .menu_content_container").hide();
				$(".frm_control_group").eq(1).hide();
				$("#js_innerNone").show();
				//$(this).find(".icon_menu_dot").show();

				$(".menu_form_area .frm_control_group").eq(1).hide();
				$(".menu_form_area .menu_content_container").hide();
			//}

			wxMenu.is_left_right(); //一级菜单左右移动

		});
		//要传给后台的值
		$(".js_menu_name").blur(function(e) {
			var id_name = $(".menu_form_area").attr("data-id");
			var menu_name = $(this).val(); //要传给后台的值	
			//console.log(menu_name)
			var len = menu_name.trim().length;
			var c_menu_box = $(this).parents(".menu_form_area").attr("data-id");
			if(len > 0) {
				if($(".frm_msg.fail").is(":hidden")) {
					$(".menu_form_area").find(".global_info").text(menu_name);
					var class_name = $("#" + c_menu_box).attr("class");
					console.log(class_name);
					if(class_name.indexOf("jslevel2") != -1) {
						$("#" + c_menu_box).find(".js_l2Title").text(menu_name);
					}
					if(class_name.indexOf("jslevel1") != -1) {
						$("#" + c_menu_box).find(".js_l1Title").text(menu_name);
					}
				}
			}
		});

		//删除确定菜单框
		$("#js_confirm").click(function(e) {
			var menu_1_len = $(".jslevel1").length; //一级菜单的个数
			var id_name = $(".menu_form_area").attr("data-id");
			$("#" + id_name).remove(); //编辑菜单被删除;
			//console.log("#" + id_name);
			wxMenu.dot_show();
			//$(".jsMenu.jslevel1.current").remove();//删除一级菜单
			//var menu2_len=$(".current").length;
			// console.log(menu2_len)
			/* if(menu2_len==1){
			  $(".current").parents(".jslevel1").find(".icon_menu_dot").hide();
		  }*/
			// $(".jslevel2.current").remove();//删除二级菜单
			$("#js_none").show(); //一级菜单右侧
			$("#js_rightBox").hide(); //一级菜单右侧

			if(menu_1_len == 3) {
				//$("#menuList").append("<li class='js_addMenuBox pre_menu_item size1of3 add_menu1'>"+"<a href='javascript:void(0);' class='pre_menu_link' title='添加菜单'>"+'<i class="icon16_common add_gray"></i>'+"</a>"+"</li>")
			}
			if(menu_1_len == 2) {
				$(".jslevel1").removeClass("size1of3").addClass("size1of2")
			}
			if(menu_1_len == 1) {
				$(".js_addMenuBox").find(".pre_menu_link").append('<span class="js_addMenuTips">添加菜单</span>');
			}

		});

		//菜单名称的字数计数
		$(".js_menu_name").keyup(function() {
			var t = $(this)
			wxMenu.input_count(t);
		});

		//一级菜单添加
		$("#menuList").delegate(".add_menu1", "click", function() {
			$("#js_rightBox").show();
			$("#js_none").hide();
			$(".current").removeClass("current");
			var menu1_len = $("#menuList").children().length;
			//console.log(menu1_len);
			//后台调取的id
			var id_menu = wxMenu.add_id($(this));
			//add_id();
			if(menu1_len == 1) {
				$(this).before('<li class="jsMenu pre_menu_item jslevel1 size1of2" id=' + id_menu + '>' +
					'<a href="javascript:void(0);" class="pre_menu_link" draggable="false">' +
					' <i class="icon_menu_dot js_icon_menu_dot dn" style="display: none;"></i>' +
					' <i class="icon20_common sort_gray"></i>' +
					' <span class="js_l1Title">菜单名称</span>' +
					'</a>' +
					' <div class="sub_pre_menu_box" style="">' +
					' <ul class="sub_pre_menu_list">' +

					' <li class="js_addMenuBox add_menu2"><a href="javascript:void(0);" class="jsSubView js_addL2Btn" title="添加子菜单" draggable="false"><span class="sub_pre_menu_inner js_sub_pre_menu_inner"><i class="icon16_common add_gray"></i></span></a></li>' +
					' </ul>' +
					' <i class="arrow arrow_out"></i>' +
					'<i class="arrow arrow_in"></i>' +
					'</div>' +
					'</li>');
				$(this).find(".js_addMenuTips").remove();
				$("#js_none").hide(); //一级菜单右侧
				$("#js_rightBox").show(); //一级菜单右侧	
				$(".menu_form_area .frm_control_group").show();
				$(".menu_form_area .menu_content_container").show();
				$(".menu_form_area #js_innerNone").hide();
				for(var i = 0; i < $(".jsMenu").length - 1; i++) {
					$(".jsMenu").eq(i).find(".sub_pre_menu_box").hide();
				}

			}
			if(menu1_len == 2) {
				$(".jslevel1").removeClass("size1of2").addClass("size1of3");
				$(this).before('<li class="jsMenu pre_menu_item grid_item jslevel1 size1of3" id=' + id_menu + '>' +
					'<a href="javascript:void(0);" class="pre_menu_link" draggable="false">' +
					' <i class="icon_menu_dot js_icon_menu_dot" style="display: none;"></i>' +
					'<i class="icon20_common sort_gray"></i>' +
					'<span class="js_l1Title">菜单名称</span>' +
					'</a>' +
					' <div class="sub_pre_menu_box js" style="">' +
					' <ul class="sub_pre_menu_list">' +

					'<li class="js_addMenuBox add_menu2"><a href="javascript:void(0);" class="jsSubView js_addL2Btn" title="添加子菜单" draggable="false"><span class="sub_pre_menu_inner js_sub_pre_menu_inner"><i class="icon16_common add_gray"></i></span></a></li>' +
					' </ul>' +
					'<i class="arrow arrow_out"></i>' +
					'<i class="arrow arrow_in"></i>' +
					'</div>' +
					'</li>');
				$("#js_none").hide(); //一级菜单右侧
				$("#js_rightBox").show(); //一级菜单右侧
				$(".menu_form_area .frm_control_group").show();
				$(".menu_form_area .menu_content_container").show();
				$(".menu_form_area #js_innerNone").hide();
				for(var i = 0; i < $(".jsMenu").length - 1; i++) {
					$(".jsMenu").eq(i).find(".sub_pre_menu_box").hide();
					// $(".jsMenu").eq(i).removeClass("current");
				}
			}
			if(menu1_len == 3) {
				$(this).before('<li class="jsMenu pre_menu_item grid_item jslevel1 size1of3" id=' + id_menu + '>' +
					'<a href="javascript:void(0);" class="pre_menu_link" draggable="false">' +

					' <i class="icon_menu_dot js_icon_menu_dot" style="display: none;"></i>' +
					'<i class="icon20_common sort_gray"></i>' +
					'<span class="js_l1Title">菜单名称</span>' +
					'</a>' +
					' <div class="sub_pre_menu_box" style="">' +
					' <ul class="sub_pre_menu_list">' +

					'<li class="js_addMenuBox add_menu2"><a href="javascript:void(0);" class="jsSubView js_addL2Btn" title="添加子菜单" draggable="false"><span class="sub_pre_menu_inner js_sub_pre_menu_inner"><i class="icon16_common add_gray"></i></span></a></li>' +
					' </ul>' +
					'<i class="arrow arrow_out"></i>' +
					'<i class="arrow arrow_in"></i>' +
					'</div>' +
					'</li>');
				$("#js_none").hide(); //一级菜单右侧
				$("#js_rightBox").show(); //一级菜单右侧
				$(".menu_form_area .frm_control_group").show();
				$(".menu_form_area .menu_content_container").show();
				$(".menu_form_area #js_innerNone").hide();
				for(var i = 0; i < $(".jsMenu").length - 1; i++) {
					$(".jsMenu").eq(i).find(".sub_pre_menu_box").hide();
					//$(".jsMenu").eq(i).removeClass("current");
				}
			}
			$(this).click();
			wxMenu.is_left_right(); //一级菜单左右移动
		});
		//二级菜单点击
		$("#menuList").delegate(".jslevel2", "click", function(e) {
			e.stopImmediatePropagation();
			var id_name = $(this).attr("id");
			$(".menu_form_area").attr("data-id", id_name); //右侧的值和左侧的点击菜单一致
			$(".menu_form_area #js_innerNone").hide();
			$(".current").removeClass("current");
			$(this).addClass("current");
			$(".jslevel1").removeClass("current");
			var menu2_text = $(this).find("a").text().trim();
			var menu2_url = $(this).find(".js_l2Title").attr("data-src") && $(this).find(".js_l2Title").attr("data-src").trim();
			$(".menu_form_area").find(".global_info").text(menu2_text);
			$(".menu_form_area").find(".js_menuTitle").text("子菜单名称");
			$(".menu_form_area").find(".js_menu_name").val(menu2_text);
			if($(".menu_form_area").find(".default_url[data-src='" + menu2_url + "']").length > 0) {
				$(".menu_form_area").find(".default_url").removeClass("active");
				$(".menu_form_area").find("#urlText").val("");
				$(".menu_form_area").find(".default_url[data-src='" + menu2_url + "']").addClass("active");
			} else {
				$(".menu_form_area").find(".default_url").removeClass("active");
				$(".menu_form_area").find("#urlText").val(menu2_url);
				$(".menu_form_area").find(".default_url[data-src='user-defined']").addClass("active");
			}
			$(".menu_form_area").find(".js_titleNolTips").text("字数不超过5个字符");
			$("#jsDelBt").text("删除子菜单");
			$(".title.js_menuContent").text("子菜单内容");
			$(".frm_control_group").eq(1).show();
			$(".menu_content_container").show();
			$("#js_none").hide();
			$("#js_rightBox").show();
			wxMenu.is_up_down();
		});
		//二级菜单添加
		$("#menuList").delegate(".add_menu2", "click", function(e) {
			//右侧菜单
			e.stopImmediatePropagation();
			$("#js_none").hide();
			$("#js_rightBox").show();
			//一级菜单的处理
			$(".menu_form_area #js_innerNone").hide(); //子菜单个数不能0;
			$(".frm_msg.fail").eq(0).hide();
			$(".current").removeClass("current"); //删除所有高亮样式；
			//后天调去id值;
			var id_menu2 = wxMenu.add_id($(this));
	
			if($(this).parents(".jsMenu").find(".jslevel2").length < 5) {
				$(this).before('<li  class="jslevel2" id=' + id_menu2 + '>' + '<a href="javascript:void(0);" class="jsSubView"><span class="sub_pre_menu_inner js_sub_pre_menu_inner"><i class="icon20_common sort_gray"></i><span class="js_l2Title" data-encodeurl="1" data-src="">子菜单名称</span></span></a><div class="move_box"><span class="move_up" onclick="wxMenu.move_up(this)"></span><span class="move_down" onclick="wxMenu.move_down(this)"></span></div></li>')
					// console.log($(".jsMenu").attr("class"));
					//$(this).parents(".jsMenu").removeClass("current");//二级菜单的颜色框
				$(this).parents(".jslevel1").find(".icon_menu_dot").show(); //可以单写一个函数
				//二级菜单的编辑框
				var menu2_text = $(this).siblings(".current").find("a").text().trim();
				console.log(menu2_text);
				$(".menu_form_area").find(".global_info").text(menu2_text);
				$(".menu_form_area").find(".js_menuTitle").text(menu2_text);
				$(".menu_form_area").find(".js_menu_name").val(menu2_text);
				$(".menu_form_area").find(".js_titleNolTips").text("字数不超过6个字符");
				$("#jsDelBt").text("删除子菜单");
				$(".title.js_menuContent").text("子菜单内容");
				$(".menu_form_area .frm_control_group").show();
				$(".menu_form_area .menu_content_container").show();
				var len = $(this).parents(".jsMenu").find(".jslevel2").length;
				$(this).parents(".jsMenu").find(".jslevel2").eq(len - 1).click(); //新添加的子菜单被点击
			} else {
				var len = $(this).parents(".jsMenu").find(".jslevel2").length;
				$(this).parents(".jsMenu").find(".jslevel2").eq(len - 1).click();
				alert("最多添加5个子菜单")
			}
			//second_id();
			wxMenu.is_up_down(); //调用
	
		});
		$("#js_rightBox").delegate(".default_url", "click", function(e) {
			e.stopImmediatePropagation();
			var id_name = $(".menu_form_area").attr("data-id");
			$("#" + id_name).find(".js_l2Title").attr("data-encodeurl", "1");
			$("#" + id_name).find(".js_l2Title").attr("data-src", $(this).attr("data-src"));
		});
		$("#js_rightBox").delegate("#urlText", "blur", function(e) {
			e.stopImmediatePropagation();
			var id_name = $(".menu_form_area").attr("data-id");
			$("#" + id_name).find(".js_l2Title").attr("data-src", $(this).val());
			$("#" + id_name).find(".js_l2Title").attr("data-encodeurl", "");
		});

	},
	dot_show: function() {
		//菜单有子菜单的显示
		var len = $(".jslevel1").length;
		for(var i = 0; i < len; i++) {
			var len_2 = $(".jslevel1").eq(i).find(".jslevel2").length;
			//alert(len_2);
			if(len_2 > 0) {
				$(".jslevel1").eq(i).find(".js_icon_menu_dot").show();
			} else {
				$(".jslevel1").eq(i).find(".js_icon_menu_dot").hide();
			}
		}
	},
	input_count: function(t) {
		var menu_text = $(t).val();
		var len = 0;
		var text_len = menu_text.length;

		for(var i = 0; i < text_len; i++) {
			if(menu_text.charCodeAt(i) > 256) {
				//$(this).attr('maxlength','9');
				len += 1;
			} else {
				//$(this).attr('maxlength','18');
				len += 0.5;
			}
		}

		//一级菜单
		if($(".menu_form_area .global_info").text().trim() == "菜单名称") {
			if(len > 4) {
				$(".frm_msg.fail").eq(0).show();
				$(".frm_msg.fail").eq(1).hide();
			}
			if(len <= 4 && len > 0) {
				$(".frm_msg.fail").eq(1).hide();
				$(".frm_msg.fail").eq(0).hide();
			}
			if(len == 0) {
				$(".frm_msg.fail").eq(0).hide();
				$(".frm_msg.fail").eq(1).show();
			}
		}
		//二级菜单
		if($(".menu_form_area .global_info").text().trim() == "子菜单名称") {

			if(len > 8) {
				$(".frm_msg.fail").eq(0).show();
				$(".frm_msg.fail").eq(1).hide();
			}
			if(len <= 8 && len > 0) {

				$(".frm_msg.fail").eq(1).hide();
				$(".frm_msg.fail").eq(0).hide();
			}
			if(len == 0) {
				$(".frm_msg.fail").eq(0).hide();
				$(".frm_msg.fail").eq(1).show();
			}
		}

		// console.log(len);
	},
	second_id : function(){//暫時不用
		for(var i = 0; i < $(".jsMenu").length; i++) {
			//console.log($(".jsMenu").length)
			var z_id = $(".jsMenu").eq(i).attr("id");
			var z_id_index = z_id.split("_")[2];
			for(var j = 0; j < $(".jsMenu").eq(i).find(".jslevel2").length; j++) {
				$(".jsMenu").eq(i).find(".jslevel2").eq(j).attr("id", "j_m_" + z_id_index + "_" + j);
			}
		}
		//var i=$(".jslevel2").parents(".jsMenu").attr("id");
	},
	add_id : function(t) {
		var t = t;
		var class_name = $(t).attr("class");
		//alert(class_name);
		//主菜单
		if(class_name.indexOf("add_menu1") != -1) {
			var menu_len = $(".jslevel1").length;
			var max = 0;
			for(var i = 0; i < menu_len; i++) {
				var id_index = Number($(".jslevel1").eq(i).attr("id").split("_")[2]);
				if(max < id_index) {
					max = id_index;
				}
			}
			return "z_m_" + (max + 1);
		}
		if(class_name.indexOf("add_menu2") != -1) {
			var menu_len = $(t).parents(".jslevel1").find(".jslevel2").length;
			var max = 0;
			var z_index = $(t).parents(".jslevel1").attr("id").split("_")[2];
			for(var i = 0; i < menu_len; i++) {
				var id_index = Number($(t).parent().find(".jslevel2").eq(i).attr("id").split("_")[3]);
				//alert(id_index)
				if(max < id_index) {
					max = id_index;
				}
			}
			return "j_m_" + z_index + "_" + (max + 1);
		}

	},
	//左移动函数
	move_left : function(ode) {
		var middleHtml = ""; //留替换用
		var thisHtml = ""; //当前移动的内容
		var thatHtml = ""; //要交换的内容
		thisHtml = $(ode).parents(".jsMenu").html();
		$(ode).parents(".jsMenu").removeClass("current");
		$(ode).parents(".jsMenu").prev().addClass("current");
		middleHtml = $(ode).parents(".jsMenu").prev().html();
		$(ode).parents(".jsMenu").prev().html(thisHtml);
		$(ode).parents(".jsMenu").html(middleHtml);
		wxMenu.is_left_right(); //一级菜单左右移动
	
	},
	//右移动函数
	move_right : function(ode) {
		var middleHtml = ""; //留替换用
		var thisHtml = ""; //当前移动的内容
		var thatHtml = ""; //要交换的内容
		$(ode).parents(".jsMenu").removeClass("current");
		$(ode).parents(".jsMenu").next().addClass("current");
		thisHtml = $(ode).parents(".jsMenu").html();
		middleHtml = $(ode).parents(".jsMenu").next().html();
		$(ode).parents(".jsMenu").next().html(thisHtml);
		$(ode).parents(".jsMenu").html(middleHtml);
		wxMenu.is_left_right(); //一级菜单左右移动
	},
	
	//上移动函数
	move_up : function(ode) {
		var middleHtml = ""; //留替换用
		var thisHtml = ""; //当前移动的内容
		var thatHtml = ""; //要交换的内容
		thisHtml = $(ode).parents(".jslevel2").html();
		$(ode).parents(".jslevel2").removeClass("current");
		$(ode).parents(".jslevel2").prev().addClass("current");
		middleHtml = $(ode).parents(".jslevel2").prev().html();
		$(ode).parents(".jslevel2").prev().html(thisHtml);
		$(ode).parents(".jslevel2").html(middleHtml);
		wxMenu.is_up_down(); //上下移动函数调用
	
	},
	//下移动函数
	move_down : function(ode) {
		var middleHtml = ""; //留替换用
		var thisHtml = ""; //当前移动的内容
		var thatHtml = ""; //要交换的内容
		$(ode).parents(".jslevel2").removeClass("current");
		$(ode).parents(".jslevel2").next().addClass("current");
		thisHtml = $(ode).parents(".jslevel2").html();
		middleHtml = $(ode).parents(".jslevel2").next().html();
		$(ode).parents(".jslevel2").next().html(thisHtml);
		$(ode).parents(".jslevel2").html(middleHtml);
		wxMenu.is_up_down(); //上下移动函数调用
	},
	
	//函数判断是否可以上下移动
	is_up_down : function() {
		$(document).find(".sub_pre_menu_list").each(function(index, element) {
			var liNum = $(element).find(".jslevel2").length - 1;
			$(element).find(".jslevel2").find(".move_up,.move_down").show();
			$(element).find(".jslevel2").eq(0).find(".move_up").hide();
			$(element).find(".jslevel2").eq(liNum).find(".move_down").hide();
		});
	},
	//函数判断是否可以左右移动
	is_left_right : function() {
		$(document).find(".pre_menu_list").each(function(index, element) {
			var liNum = $(element).find(".jsMenu").length - 1;
			$(element).find(".jsMenu").find(".move_left,.move_right").show();
			$(element).find(".jsMenu").eq(0).find(".move_left").hide();
			$(element).find(".jsMenu").eq(liNum).find(".move_right").hide();
		});
	}
}



// JavaScript Document
$(document).ready(function(e) {
	//页面加载完毕时调用
	wxMenu.init();//微信菜单初始化方法		
});

