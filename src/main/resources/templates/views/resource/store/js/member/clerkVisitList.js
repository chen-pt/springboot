/**
 * Created by admin on 2017/12/12.
 */
$(function () {

  require.config({
    baseUrl: '/templates/views/resource/',
    paths:{
      'vue': 'public/vue',
      'core': 'merchant/js/lib/core',
      'vue-pagenation':'merchant/js/integral/VuePagenation'
    }
  });

  require(['vue','core','vue-pagenation'],function(Vue,core,VuePagenation){
    var v = new Vue({
      el: "#merchantReturnVist",
      data:{
        page: 1,//当前页
        pageSize:15,
        pages: 50,
        total: 50,
        displayPage:6,//分页菜单显示
        result:[],
        clerkList:[],
        msg: '',
        clerkVisitResult:[],
        // tradeIdList:[]
      },

      watch:{
        page:'getClerkVisitList',
        pageSize:'getClerkVisitList'
      },

      components:{
        "vue-pagenation":VuePagenation
      },
      methods:{
        //获取回访列表
        getClerkVisitList:function () {
          var _self = this;
          var url = core.getHost()+'/store/clerk/visitList';
          var param = {};
          param.page = _self.page;
          param.pageSize = _self.pageSize;
          var visitTime1 = $("#visitTime1").val();//开始
          var visitTime2 = $("#visitTime2").val();//结束
          // if((visitTime1 != '' && visitTime1!= null) && (visitTime2 == '' || visitTime2 == null)){
          //   alert("请输入结束回访时间!")
          //   return;
          // }
          // if((visitTime1 == '' || visitTime1 == null) && (visitTime2 != '' && visitTime2 != null)){
          //   alert("请输入开始回访时间!")
          //   return;
          // }
          var buyerName = $("input[name='buyerName']").val();//会员姓名
          var buyerMobile = $("input[name='buyerMobile']").val();//手机号
          var adminName = $("input[name='adminName']").val();//店员姓名
          var status = $("input[name='status']").val();//回访状态
          var goodsName = $("input[name='goodsName']").val();//商品名称
          var storeId = $("input[name=storesId]").val();//门店ID
          param.buyerName = buyerName;
          param.buyerMobile = buyerMobile;
          param.adminName = adminName;
          param.goodsName = goodsName;
          param.status = status;
          param.storeId = storeId;
          param.visitTime1 = visitTime1;
          param.visitTime2 = visitTime2;
          // window.location.reload();
          $.ajax({
            type:'post',
            data:param,
            url:url
          }).then( function (res) {
            console.log(res);
            if(res.message == "Success"){
              _self.result = res.value;
              _self.pages = res.value.totalPages;
              _self.total = res.value.total;
            }else {
              _self.result = [];
            }
          })
        },
        //根据单个或多个ID标记为已回访
        changeStatus: function (ids,activityId)
        {
          var listArray=this.result.items;
          var taskMap = {};
          $(listArray).each(function(k, v) {
            taskMap[v.id] = v
          });

          console.log(taskMap)

          //获取所有被选中的id
          var vids = "";
          var ckeckActivityIds="";
          $("input[name=vid]:checkbox:checked").each(function(){
            if($(this).prop("checked")){  //同样用prop获取标签的checked属性值
              vids += $(this).val()+",";

              if(activityId===undefined){
                ckeckActivityIds+=taskMap[$(this).val()].activityIds+",";
              }
            }
          });

          var vidsList=[];
          vidsList=vids.split(",");
          for(var i=0;i<vidsList.length-1;i++){
            if (taskMap[vidsList[i]].status==30 || taskMap[vidsList[i]].status==50){
              alert("选取的列表中有已回访的,已经是回访的不可标记为已回访")
              return
            }
          }

          var data = {};
          var daList = [];
          if(vids) {daList = vids.split(","); data.data = vids;}

          if(activityId===undefined){
            data.activityIds=ckeckActivityIds;
          }else{
            data.activityIds=activityId;
          }
          if(ids) {daList = [1,2];data.data = ids;}//单个的会覆盖批量的
          if(ids || vids != '') {
            if(confirm("已选择"+parseInt(daList.length-1)+"个回访任务,确定标记为已回访?")) {
              $.ajax({
                type: 'post',
                url: '/store/change/status',
                data: data,
                dataType: 'json'
              }).then(function (result) {
                console.log(result);
                if(result.message == "Success") {
                  alert("修改回访状态成功!");
                }else{
                  alert("修改回访状态失败!");
                }
                v.getClerkVisitList();//重新获取列表
              });

            }
          }else {
            alert("请先选择列表记录!");
          }
        },
        //转出
        deploy: function () {
          var userIds = $("#getIds").val(); //回访列表id
          if(!userIds) {
            alert("请先选择列表记录!");
            return;
          }

          var clerkInfo = $("input[name=id]:radio:checked").val(); //店员id和姓名, 门店ID
          if(!clerkInfo) {
            alert("请选择店员!");
            return;
          }
          var data = {userIds:userIds,clerkInfo:clerkInfo};
          $.ajax({
            type:"post",
            url:"/store/change/clerk",
            data:data
          }).then(function (result) {
            console.log(result);
            if(result.message == "Success") {
              alert("转出成功!");
              v.getClerkVisitList();
            }else {
              alert("转出失败!");
            }
          });
        },
        getClerkList: function (id,adminName,storeAdminId,storeAdminId,statu) {  //获取当前门店的店员列表

          if(statu!=undefined){
            if(statu==30 || statu==50){
              alert("已回访的不可转出")
              return
            }
          }

          var listArray=this.result.items;
          var taskMap = {};
          $(listArray).each(function(k, v) {
            taskMap[v.id] = v
          });

          var vids = "";  //回访列表id集合
          $("input[name=vid]:checkbox:checked").each(function(){
            if($(this).prop("checked")){
              vids += $(this).val()+",";
            }
          });

          if(id===undefined && vids==""){
            alert("请先选择列表记录!");
            return
          }

          if(statu===undefined){
            var vidsList=[];
            vidsList=vids.split(",");
            for(var i=0;i<vidsList.length-1;i++){
              if (taskMap[vidsList[i]].status==30 || taskMap[vidsList[i]].status==50){
                alert("选取的列表中有已回访的,请去掉")
                return
              }
            }
          }

          if(id) vids = id; //单条记录的覆盖选中的
          //将当前要转出的id存储到隐藏域中
          var idss;
          if (vids) {
            $("#toDeployLog").val(vids);
          }else {
            idss = $("#toDeployLog").val();
          }
          //搜索门店条件
          var data = {};
          var clerkName = $("input[name=clerkName]").val().trim();
          var clerkMobile = $("input[name=clerkMobile]").val().trim();
          var storeName = $("#storeName").val().trim();
          data.clerkName = clerkName;
          data.clerkMobile = clerkMobile;
          data.storeName = storeName;
          $.ajax({
            type:'post',
            url:'/store/getClerks',
            data: data
          }).then(function (res) {
            console.log(res);
            if(res.message == 'Success'){
              var mapList = res.value;
              $("#clerk_list").empty();
              if(mapList.total > 0) {
                var str = '';
                console.log(mapList.items)
                var list = mapList.items;
                if (vids) {
                  str = str+"<tr><input type='hidden' id='getIds' value='"+vids+"'/>"
                }else {
                  str = str+"<tr><input type='hidden' id='getIds' value='"+idss+"'/>"
                }
                for(var item in list){
                  str = str + "<td><input type='radio' name='id' value='"+list[item].storeadminId+","+list[item].clerkName+","+list[item].storeName+"'/> "+list[item].clerkName+"</td><td>"+list[item].mobile+"</td><td>"+list[item].storeName+"</td></tr>";
                }
                $("#clerk_list").append(str);
              }else {
                $("#clerk_list").append("<tr><td colspan='3'>暂无数据</td></tr>")
              }

            }else {
              _self.clerkList = [];
            }
          });
          $("#myModal").modal('show');

        },
        getClerkList2: function (id,adminName,storeAdminId,storeAdminId,statu) {  //获取当前门店的店员列表

          if(statu!=undefined){
            if(statu==30 || statu==50){
              alert("已回访的不可转出")
              return
            }
          }

          var listArray=this.result.items;
          var taskMap = {};
          $(listArray).each(function(k, v) {
            taskMap[v.id] = v
          });

          var vids = "";  //回访列表id集合
          $("input[name=vid]:checkbox:checked").each(function(){
            if($(this).prop("checked")){
              vids += $(this).val()+",";
            }
          });

          if(statu===undefined){
            var vidsList=[];
            vidsList=vids.split(",");
            for(var i=0;i<vidsList.length-1;i++){
              if (taskMap[vidsList[i]].status==30 || taskMap[vidsList[i]].status==50){
                alert("选取的列表中有已回访的,请去掉")
                return
              }
            }
          }

          if(id) vids = id; //单条记录的覆盖选中的
          //将当前要转出的id存储到隐藏域中
          var idss;
          if (vids) {
            $("#toDeployLog").val(vids);
          }else {
            idss = $("#toDeployLog").val();
          }
          //搜索门店条件
          var data = {};
          var clerkName = $("input[name=clerkName]").val().trim();
          var clerkMobile = $("input[name=clerkMobile]").val().trim();
          var storeName = $("#storeName").val().trim();
          data.clerkName = clerkName;
          data.clerkMobile = clerkMobile;
          data.storeName = storeName;
          $.ajax({
            type:'post',
            url:'/store/getClerks',
            data: data
          }).then(function (res) {
            console.log(res);
            if(res.message == 'Success'){
              var mapList = res.value;
              $("#clerk_list").empty();
              if(mapList.total > 0) {
                var str = '';
                console.log(mapList.items)
                var list = mapList.items;
                if (vids) {
                  str = str+"<tr><input type='hidden' id='getIds' value='"+vids+"'/>"
                }else {
                  str = str+"<tr><input type='hidden' id='getIds' value='"+idss+"'/>"
                }
                for(var item in list){
                  str = str + "<td><input type='radio' name='id' value='"+list[item].storeadminId+","+list[item].clerkName+","+list[item].storeName+"'/> "+list[item].clerkName+"</td><td>"+list[item].mobile+"</td><td>"+list[item].storeName+"</td></tr>";
                }
                $("#clerk_list").append(str);
              }else {
                $("#clerk_list").append("<tr><td colspan='3'>暂无数据</td></tr>")
              }

            }else {
              _self.clerkList = [];
            }
          });
          $("#myModal").modal('show');

        },
        //全选按钮
        selectAll: function () {
          //获取标签属性
          // var clas = [];
          var cla = $("#check").attr("class");
          cla = cla.split(" ")[2];
          if(!cla) {//要全选
            $("input[name=vid]").prop("checked",true);
          }else {
            $("input[name=vid]").prop("checked",false);
          }

        },
        // //获取门店列表
        // getStoresList: function() {
        //   $.ajax({
        //       type : 'post',
        //       url : "/merchant/getStoreList"
        //     }
        //   ).then(function (result) {
        //     if(result.message == 'Success') {
        //       $("#storeList").html("")
        //       var list = result.value;
        //       $("#storeList").append("<li role='presentation'><a role='menuitem' tabindex='-1' href='javascript:void(0);' value='0'>所有门店</a></li>");
        //       for(var item in result.value) {
        //         $("#storeList").append("<li role='presentation'><a role='menuitem' tabindex='-1' href='javascript:void(0);' value='"+list[item].id+"'>"+list[item].name+"</a></li>");
        //       }
        //
        //     }
        //   });
        //
        // },
        pageChange:function(page){
          this.page = page;
        },
        pageSizeChange:function(pageSize){
          this.pageSize = pageSize;
        },
        checkResult:function (id,activityIds) {
          var data={}
          data.id=id;
          data.activityIds=activityIds

          $.ajax({
            type: 'post',
            url: '/store/checkVisitResultWithStore',
            data: data,
            dataType: 'json'
          }).then(function (result) {
            // console.log(result.value)
            if(result.message == "Success") {
              v.clerkVisitResult=result.value;
              // console.log(v.clerkVisitResult)
              // console.log(v.clerkVisitResult.tradeIdList.length)
              // v.tradeIdList=result.value.tradeIdList
              $("#resultModal").modal('show');
            }else{
              alert("查看详情异常")
            }
          });


        }
      },

      filters:{
        dateFormat:function (time) {
          core.formatDate()
          return new Date(time).format();
        },
        getTitleHref:function(val){
          return '/store/shop_analysis?userId='+val.storeAdminId+"&storeId="+val.storeId+"&buyerId="+val.buyerId+"&id="+val.id+"&activityIds="+val.activityIds;
        }
      },
      mounted:function () {
        this.getClerkVisitList();
        // this.getStoresList();
      }

    });
  });



});
