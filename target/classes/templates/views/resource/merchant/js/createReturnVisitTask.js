/**
 * Created by admin on 2017/12/28.
 */
$(function () {
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  require.config({
    baseUrl: '/templates/views/resource/',
    paths:{
      'vue': 'public/vue',
      'core': 'merchant/js/lib/core',
      'vue-pagenation':'merchant/js/integral/VuePagenation',
    }
  });

  require(['vue','core','vue-pagenation'],function(Vue,core,VuePagenation){
    var v = new Vue({
      el: "#createReturnVisit",
      /*data:{
        page: 1,//当前页
        pageSize:15,
        pages: 50,
        total: 50,
        displayPage:6,//分页菜单显示
        resultActList:[],//活动列表
        resultActInfo:[],//活动详情
        partInGoodsInfo:[],//参与商品集合
        partInStoresList:[],//参与门店集合
        clerkList:[],
        msg: ''
      },*/
      data:function () {
        var data = {page: {},pageSize:{},pages: {},total: {},curPage: {},totalNum: {},pageLength: {},displayPage:{},resultActList:[],resultActInfo:[],partInGoodsInfo:[],partInStoresList:[],clerkList:[],goodsBox:{},storeList:{},storeAdminList:[],stores:[],passDays:{},msg: '',SumPerson:0, SumTask:0,itemNumAll:0,memberList: [],crowdName: '',storeValue: '',labelGroup: '',show: false,chuanName:'',chuanId:[],index:[],showTags:[],groupCount:0,visitMembersGroup:[],labelCount:0,memberIds:'',goodsIds:'',
          loading: false,ldCount:0,agCount:0,bmCount:0,zjfCount:0,sjfCount:0,xjfCount:0,mdhdCount:0,jdhdCount:0,mdjlCount:0,jdjlCount:0,tagType:'',onConflict:false,returnList:[],deleteList:[],chklabelAttribute:[],areaList:[],yiWeiZhi:{},baseLabelMap:{},baseLabelMapByBirthday:{},baseLabelMapByShengxiaoXingzuo:{},baseLabelMapByRegist:{},healthLabelMapByGaoxueya:{},healthLabelMapByGaoxuezhi:{},healthLabelMapByTangniaobing:{},customLabelListMap:[],tradesLabelMap:{},disStoreActivityMap:{},disStoreAddressMap:{},disContendStoreActivitMap:{},disContendStoreAddressMap:{},sex:[],age:[],birthday:[],constellation:[],zodiac:[],registration:[],region:[],regionW:[],bargain_money:[],bargain_count:[],pre_transaction:[],refund_probability:[],ever_buy:[],add_integral:[],consume_integral:[],residue_integral:[],buy_period:[],dis_store_activity:[],dis_store_address:[],dis_contend_store_activity:[],dis_contend_store_address:[],custom_label:[],hyperlipidemia_label:[],hypertension_label:[],diabetes_label:[],
          ParamsAreaW:[],Params:{}};
        data.page = 1;
        data.pageSize = 15;
        data.pages = 50;
        data.total = 50;
        data.curPage = 1;
        data.totalNum = 0;
        data.pageLength = 15;
        data.displayPage = 6;
        data.passDays = 90;
        data.impotentIds="";
        data.activityGoodsIds="";
        //回访会员，回访商品数据
        data.SumPerson=0;
        data.activityInfo=[];
        data.activityInfos=[];
        data.SumTask=22;
        data.itemNumAll=0;
        data.returnVisitNum=0;
        //会员分组 标签列表相关
        data.showTags=[[],[],[],[],[],[],[],[],[],[]];//回显内容(大于3个)和id
        data.groupCount=0;//统计人数弹窗
        data.visitMembersGroup=[];//会员分组 右侧回显
        data.memberIds="";//查询会员后返回的id值
        data.goodsIds="";//查询商品后返回的id值
        //会员标签 相关
        data.labelCount=0;//统计人数弹窗
        data.loading= false;//加载
        data.ldCount=0;//加载个数(ajax)
        data.agCount=0;//年龄加载（普通+已知未知）
        data.bmCount=0;//成交金额加载（普通+未知）
        data.zjfCount=0;//赚取积分加载（普通+未知）
        data.sjfCount=0;//剩余积分加载（普通+未知）
        data.xjfCount=0;//消耗积分加载（普通+未知）
        data.mdhdCount=0;//门店活动加载（普通+未知）
        data.jdhdCount=0;//竞店活动加载（普通+未知）
        data.mdjlCount=0;//门店距离加载（普通+未知）
        data.jdjlCount=0;//竞店距离加载（普通+未知）

        data.tagType='';//标题名字

        data.areaList=[];//区域
        data.yiWeiZhi={
          ageYizhiWeizhiListMap:[],//年龄标签(已知未知)
          areaYizhiWeizhiListMap:{},//地区标签(已知未知)
          weizhiBargainMoneyMap:{},//成交金额标签(未知)
          yizhiBargainMoneyMap:{},//成交金额标签(已知)
          weiizhiAddIntegrateMap:{},//赚取积分标签(未知)
          yizhiAddIntegrateMap:{},//赚取积分标签(已知)
          weiizhiResidueIntegrateMap:{},//剩余积分标签(未知)
          yizhiResidueIntegrateMap:{},//剩余积分标签(已知)
          weiizhiConsumeIntegrateMap:{},//消费积分标签(未知)
          yizhiConsumeIntegrateMap:{},//消费积分标签(已知)
          weiizhiDisStoreAddressMap:{},//收货地址标签(未知)
          yizhiDisStoreAddressMap:{},//收货地址标签(已知)
          weiizhiDisStoreActivityMap:{},//活动标签(未知)
          yizhiDisStoreActivityMap:{},//活动标签(已知)
        };//已知未知
        data.baseLabelMap={//基础标签
          sexMap:[],//性别
        };
        data.baseLabelMapByBirthday={
          ageListMap:[],//年龄标签
          birthdayListMap:[],//生日标签
        };
        data.baseLabelMapByShengxiaoXingzuo={
          shengxiaoMap:{},//生肖
          xingzuoMap:{},//星座
        };
        data.baseLabelMapByRegist={
          registerMap:[],//注册时间
        };
        data.healthLabelMapByGaoxueya={//健康标签
          healIllByGaoxueyaListMap:[],//高血压
        };
        data.healthLabelMapByGaoxuezhi={//健康标签
          healIllByGaoxuezhiListMap:[],//高血脂
        };
        data.healthLabelMapByTangniaobing={//健康标签
          healIllByTangniaobingListMap:[]//糖尿病
        };
        data.customLabelListMap=[];//自定义标签
        data.tradesLabelMap={//交易金额
          bargainCountListMap:[],//成功交易次数
            bargainMoneyListMap:[],//成功交易金额
            preTransactionListMap:[],//客单价
            EverBuyListMap:[],//购买过（购买时段）
            refundProbabilityListMap:[],//退款率
            buyPeriodListMap:[],//购买周期
            addIntegralListMap:[],//赚取积分
            consumeIntegralListMap:[],//消耗积分
            residueIntegralListMap:[],//剩余积分
        };
        data.disStoreActivityMap={//距离标签
          disStoreActivityListMap:[],//门店距离（高频活动）
        };
        data.disStoreAddressMap={//距离标签
          disStoreAddressListMap:[],//门店距离（收货地址）
        };
        data.disContendStoreActivitMap={//距离标签
          disContendStoreActivityListMap:[],//竞店距离（高频活动）
        };
        data.disContendStoreAddressMap={//距离标签
          disContendStoreAddressListMap:[],//竞店距离（收货地址）
        };
        //临时存放变量
        //右侧显示标签
        data.sex=[];
        data.age=[];
        data.birthday=[];
        data.constellation=[];
        data.zodiac=[];
        data.registration=[];
        data.region=[];
        data.regionW=[];//地区 已知未知
        data.bargain_money=[];
        data.bargain_count=[];
        data.pre_transaction=[];
        data.refund_probability=[];
        data.ever_buy=[];
        data.add_integral=[];
        data.consume_integral=[];
        data.residue_integral=[];
        data.buy_period=[];
        data.dis_store_activity=[];
        data.dis_store_address=[];
        data.dis_contend_store_activity=[];
        data.dis_contend_store_address=[];
        data.custom_label=[];
        data.hyperlipidemia_label=[];
        data.hypertension_label=[];
        data.diabetes_label=[];

        data.ParamsAreaW=[];//区域 已知未知(实时人数)
        data.Params={
          sex:[],//性别(以下皆实时人数)
          age:[],//年龄
          birthday:[],//生日
          xingzuo:[],//星座
          shengxiao:[],//生肖
          register:[],//注册时间
          area:[],//区域
          bargainMoney:[],//成交金额
          bargainCount:[],//成交次数
          preTransaction:[],//客单价
          refundProbability:[],//退款率
          everBuy:[],//购买过
          buyPeriod:[],//购买周期
          addIntegral:[],//获取积分
          consumeIntegral:[],//消耗积分
          residueIntegral:[],//剩余积分
          disStoreActivity:[],//门店活动
          disStoreAddress:[],//门店地址
          disContendStoreActivity:[],//竟店活动
          disContendStoreAddress:[],//竟店地址
          healthGaoXueYa:[],//高血压
          healthGaoXueZhi:[],//高血脂
          healthTangNiaoBing:[],//糖尿病
          custom:[],//自定义标签

        };
        return data;
      },
      // created(){
      // },
      watch:{
        passDays: function () {
          var _self=this;
          if(!$("input[name=passDay]").val()){
            layer.msg("天数不能为空!");
            return false;
          }
          //判断是否已选
          if($("#showReturnVisitTask").length <= 0) {
            return false;
          }
          $("#showReturnVisitTask").remove();
          //不为空表示指定的会员,为空表示全部会员
          var memberId = $("#memberId").val();//用于判断符合条件的会员是否在参与商品内
          var passDays = $("input[name=passDay]").val();
          var data = {};
          data.memberId = memberId;//参与对象ID
          data.passDays = passDays;
          //判断选择的是活动还是指定
          var selectGoodsIds = $("input[name=__goodsIds]").val();
          if(selectGoodsIds) {//指定的商品
            data.goodsIds = selectGoodsIds;
            var url = core.getHost()+"/merchant/queryAccordAppointGoods";
            $.ajax({
              type: "POST",
              url: url,
              data: data
            }).then(function (result) {

              if("Success" == result.message) {
                //check按钮切换到当前选项
                $(".selectItems input").each(function () {
                  if($(this).attr("id")=='selectReturnVisitMembers4'){
                    $(this).attr("checked", true);
                    $(this).parent().addClass("checked");
                  }
                  else{
                    $(this).attr("checked", false);
                    $(this).parent().removeClass("checked");
                  }
                });
                //传值
                var val = result.value;
                _self.itemNumAll=val.goodsNum;
                _self.goodsIds=val.goodsIds;
                $("#taskNum").val(val.returnVisitNum);
                $("#goodsChoice").append("<span id='showReturnVisitTask'><font color='#1e90ff' size='4'>共选择"+val.goodsNum+"个商品"+val.returnVisitNum+"个顾客符合条件 将产生"+val.returnVisitNum+"个回访任务</font></span>");

              }
            });

          }else {//活动的商品
            var goodsIds = $("#partInGoodsIds").val();
            var goodsType = $("#goodsType").val();
            data.goodsIds = goodsIds;
            data.goodsType = goodsType;//商品ID类型
            var url = core.getHost()+"/merchant/queryAccordCustomerNum";
            $.ajax({
              type: "POST",
              url: url,
              data: data
            }).then(function (result) {
              if("Success" == result.message) {
                //check按钮切换到当前选项
                $(".selectItems input").each(function () {
                  if($(this).attr("id")=='selectReturnVisitMembers4'){
                    $(this).attr("checked", true);
                    $(this).parent().addClass("checked");
                  }
                  else{
                    $(this).attr("checked", false);
                    $(this).parent().removeClass("checked");
                  }
                });
                //传值
                var val = result.value;
                _self.itemNumAll=val.goodsNum;
                _self.goodsIds=val.goodsIds;
                $("#taskNum").val(val.returnVisitNum);
                $("#goodsChoice").append("<span id='showReturnVisitTask'><font color='#1e90ff' size='4'>共选择"+val.goodsNum+"个商品"+val.returnVisitNum+"个顾客符合条件 将产生"+val.returnVisitNum+"个回访任务</font></span>");
              }
            });


          }

        },
        loading:function (val, oldVal) {
          var _self=this;
          if(_self.loading==false){
            $(".loading").removeClass("showDiv").addClass("hideDiv");
            $(".zhezhao").removeClass("showDiv").addClass("hideDiv");
          }
          if(_self.loading==true){
            $(".loading").removeClass("hideDiv").addClass("showDiv");
            $(".zhezhao").removeClass("hideDiv").addClass("showDiv");
          }
        },
        page:'allocateTask',
        pageSize:'allocateTask'
      },

      components:{
        "vue-pagenation":VuePagenation
      },
      methods:{
        //获取活动下拉框
        getActivityInfoList:function() {
          var _self = this;
          var url = core.getHost()+'/merchant/getActivityInfoList';
          $.ajax({
            type:'post',
            url:url
          }).then(function (result) {
            console.log(result);
            /*var actList = result.value;
            $("#activityMenu").html("")
            $("#activityMenu").append("<li role='presentation'><a role='menuitem' tabindex='-1' href='javascript:void(0);' value='0'>活动名称</a></li>");
            for(var item in actList) {
              $("#activityMenu").append("<li role='presentation'><a role='menuitem' tabindex='-1' v-on:click='getActivityInfo("+actList[item].activityId+")' value='"+actList[item].activityId+"'>"+actList[item].activityName+"</a></li>");
            }*/
            if("Success" == result.message) {
              _self.resultActList = result.value;
            }else {
              _self.resultActList = [];
            }

          });

        },
        //获取单个活动详情
        getActivityInfo:function (activityId) {
          var _self = this;
          // alert(activityId);
          $("#activityId").val(activityId);
          var data = {};
          data.activityId = activityId;
          var url = core.getHost()+"/merchant/getActivityByActId";
          $.ajax({
            type: "POST",
            url: url,
            data: data
          }).then(function (result) {
            var _self = this;
            console.log(result);
            if("Success" == result.message) {
              // _self.resultActInfo = result.value;
              var actInfo = result.value;
              //活动名称
              $("#actName").html("<font size='4' color='#1e90ff'>"+actInfo.activityName+"</font>");
              //参与对象
              var memType = actInfo.memberType;//参与对象类型
              if(0 == memType) {//全部会员
                $("#partInMember").html("<font size='4' color='#1e90ff'>全部会员</font>");
              }else if(1 == memType) {//指定标签会员
                var partInObj = actInfo.partInObject;
                var labels = "";
                for (var item in partInObj) {
                  labels += partInObj[item].crowdName+" ";//标签名称
                }
                $("#partInMember").html("<font size='4' color='#1e90ff'>"+labels + "共"+actInfo.partInNumber+"名顾客"+"</font>");
              }else if(2 == memType) {//指定会员
                $("#partInMember").html("<font size='4' color='#1e90ff'>共"+actInfo.partInNumber+"名顾客</font>");
              }else if(3 == memType) {
                $("#partInMember").html("<font size='4' color='#1e90ff'>共"+actInfo.partInNumber+"名顾客</font>");
              }
              //将参与对象信息放入隐藏域
              $("#memberType").val(actInfo.memberType);
              $("#memberId").val(actInfo.membersId);
              $("#goodsType").val(actInfo.goodsInfo.goodsType);
              if("0" == actInfo.goodsInfo.goodsType) {
                $("#pIGoods").prop("style","display: none");
                $("#partInGoods").html("<font size='4' color='#1e90ff'>适用全部商品</font>");
              }else {
                if($("#partInGoods").html()) {
                  $("#partInGoods").html("");
                }
                $("#pIGoods").prop("style","display: inline");
              }
              $("#partInGoodsIds").val(actInfo.goodsInfo.goodsIds);//参与商品ID,根据类型判断
              if("-1" == actInfo.applyStoresType) {
                $("#pIStore").prop("style","display: none");
                $("#partInStores").html("<font size='4' color='#1e90ff'>适用全部门店</font>");
              }else {
                if($("#partInStores").html()) {
                  $("#partInStores").html("")
                }
                $("#pIStore").prop("style","display: inline");
              }
              $("#partInStoresType").val(actInfo.applyStoresType);
              $("#partInStoresIds").val(actInfo.applyStoresIds);
              //参与商品
              // _self.partInGoodsInfo = actInfo.goodsInfo;
              //参与门店
              //活动时间
              var startTime = actInfo.activityStartTime;
              var endTime = actInfo.activityEndTime;
              var beginTime = startTime.year+"-"+startTime.monthValue+"-"+startTime.dayOfMonth;
              Date.prototype.Format = function (fmt) { //author: meizz
                var o = {
                  "M+": this.getMonth() + 1, //月份
                  "d+": this.getDate(), //日
                  "h+": this.getHours(), //小时
                  "m+": this.getMinutes(), //分
                  "s+": this.getSeconds(), //秒
                  "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                  "S": this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
              }
              // var currentTime = new Date().Format("yyyy-MM-dd");
              var start = new Date(beginTime.replace(/\-/g, "\/"));
              var now = new Date();
              now.setDate(now.getDate()+2);//当前时间加两天
              var currentTime = new Date(now.Format("yyyy-MM-dd").replace(/\-/g, "\/"));
              if(start - currentTime >=  0) {
                $("#startTime").prop("style","display: inline");
              }else {
                $("#startTime").prop("style","display: none");
              }

              $("#actTime").html("<font size='4'>"+startTime.year+"-"+startTime.monthValue+"-"+startTime.dayOfMonth+"--"+endTime.year+"-"+endTime.monthValue+"-"+endTime.dayOfMonth+"</font>");
              //清空指定商品右侧列表
              var selectGoods = $(".can_del_tr");
              for (var i = 0; i < selectGoods.length; i++) {
                selectGoods[i].remove();
              }
              //清空店员右侧列表
              var logs = $(".clerkLog");
              for(var i = 0; i < logs.length; i++) {
                logs[i].remove();
              }
              //清除店员数据
              $("#clerkReturnVisitData").val("");
              $("#alreadyDistribute").html('');
              $("#leftTaskNum").html('');
              //去除任务描述
              if($("#showReturnVisitTask").length > 0) {
                $("#showReturnVisitTask").remove();
              }
              //置空任务总数
              $("#taskNum").val("");
              //清空已分配信息
              if ($("#distributeTaskTips").html()) {
                $("#distributeTaskTips").html("");
              }
              //清空指定商品信息
              $("input[name=__goodsIds]").val("");
            }
          });
        },
        /**
         * 参与商品
         */
        getPartInGoodsInfo:function () {
          var _self = this;
          var goodsIds = $("#partInGoodsIds").val();//参与商品ID
          var goodsType = $("#goodsType").val();
          var url = core.getHost()+"/merchant/getPartInGoods";
          var data = {};
          data.goodsIds = goodsIds;
          data.goodsType = goodsType;
          if ("0" == goodsType) {//0为全部商品
            _self.partInGoodsInfo = [];
          }else {
            $.ajax({
              type: "POST",
              url: url,
              data: data
            }).then(function (result) {
              if("Success" == result.message) {
                _self.partInGoodsInfo = result.value;
              }else {
                _self.partInGoodsInfo = [];
              }
            });
          }
          var classStr = $("#partInGoodsWin").attr("class");
          if('sui-modal hide fade' == classStr) {
            $("#partInGoodsWin").attr({class:'sui-modal show fade'});
          }
        },
        //适用门店
        getPartInStoresList:function () {
          var _self = this;
          //如果类型为-1,则为全部门店
          var partInStoresType = $("#partInStoresType").val();
          var partInStoresIds = $("#partInStoresIds").val();
          if("-1" != partInStoresType) {
            var url = core.getHost()+"/merchant/getPartInStores";
            var data = {};
            data.partInStoresType = partInStoresType;
            data.partInStoresIds = partInStoresIds;
            $.ajax({
              type: "POST",
              url: url,
              data: data
            }).then(function (result) {
              if("Success" == result.message) {
                _self.partInStoresList = result.value;
              }else {
                _self.partInStoresList = [];
              }
            });

          }else {
            _self.partInStoresList = [];
          }
          //手动显示弹窗
          var classStr = $("#partInStoresWin").attr("class");
          if('sui-modal hide fade' == classStr) {
            $("#partInStoresWin").attr({class:'sui-modal show fade'});
          }

        },
        //指定活动商品
        showActivityGoods:function() {
          var showTask = $("#showReturnVisitTask");
          if(showTask.length > 0) {
            showTask.remove();
          }
          $("#showSelectGoods").prop("style","display:inline");
        },

        /**
         * 全部参与对象可创建的回访数
         */
        getCanCreateTask:function () {
          var memberId = $("#memberId").val();//参与对象ID集合
          $.ajax({
            type: "POST",
            url: core.getHost()+"/merchant/selectReturnVisitNum"
          }).then(function (result) {
            if("Success" == result.message) {
              var val = result.value;
              $("#taskNum").val(val.returnVisitNum);
            }
          });
        },

        //活动商品
        /**
         * 查询所有活动商品可以创建的回访数
         */
        hideActivityGoods:function () {
          $("#showSelectGoods").prop("style","display:none");
          //根据活动商品查询符合条件的顾客
          // alert($("input[name=passDay]").val());
          var passDays = $("input[name=passDay]").val();
          var goodsIds = $("#partInGoodsIds").val();
          var goodsType = $("#goodsType").val();
          var memberId = $("#memberId").val();//用于判断符合条件的会员是否在参与商品内
          var data = {};
          data.passDays = passDays;
          data.goodsIds = goodsIds;
          data.goodsType = goodsType;//商品ID类型
          data.memberId = memberId;//参与对象ID

          var url = core.getHost()+"/merchant/queryAccordCustomerNum";
          $.ajax({
            type: "POST",
            url: url,
            data: data
          }).then(function (result) {
            if("Success" == result.message) {

              if($("#showReturnVisitTask").length > 0) {
                $("#showReturnVisitTask").remove();
              }
              var val = result.value;
              $("#taskNum").val(val.returnVisitNum);
              $("#goodsChoice").append("<span id='showReturnVisitTask'><font color='#1e90ff' size='4'>共选择"+val.goodsNum+"个商品"+val.returnVisitNum+"个顾客符合条件 将产生"+val.returnVisitNum+"个回访任务</font></span>");
            }
          });
          //清除指定商品的右侧列表
          var trs = $(".can_del_tr");
          for (var i = 0; i < trs.length; i++) {
            trs[i].remove();
          }
          //清除指定商品中的数据
          var goodsIds = $("input[name=__goodsIds]").val("");
        },

        /**
         * 指定活动商品可创建的回访数
         */
        appointGoods: function () {
          var _self=this;
          //不为空表示指定的会员,为空表示全部会员
          var memberId = $("#memberId").val();//用于判断符合条件的会员是否在参与商品内
          var passDays = $("input[name=passDay]").val();
          //指定的商品ID
          var goodsIds = $("input[name=__goodsIds]").val();
          if(!goodsIds) {
            alert("请先选择要指定的商品!");
            return false;
          }else {
            var data = {};
            data.memberId = memberId;
            data.passDays = passDays;
            data.goodsIds = goodsIds;
            $(".selectItems input").each(function () {
              if($(this).attr("id")=='selectReturnVisitMembers4'){
                $(this).attr("checked", true);
                $(this).parent().addClass("checked");
              }
              else{
                $(this).attr("checked", false);
                $(this).parent().removeClass("checked");
              }
            });
            //其他
            if($("#showReturnVisitTask").length > 0) {
              $("#showReturnVisitTask").remove();
            }
            _self.goodsIds=goodsIds;
            _self.itemNumAll=goodsIds.split(",").length;
            _self.infoForVisit();

          }
          $("#confirmAppointGoods").attr("data-ok","modal");
        },
        /**
         * 指定商品取消按钮
         */
        clearSelectGoods:function () {
          var rightList = $("input[name=grid]");
          // this.goodsBox.$parent = $('#much_select_goods');//指定商品弹窗对象
          rightList.each(function () {
            // var isSelected = $(this).parent().hasClass("checked");
            // if (isSelected) {
              var goodsId = $(this).parents(".can_del_tr").find("td:last-child").find('[name="goods_id"]').val();
              $(this).parents(".can_del_tr").remove();
              var goodsIdArr = $('#much_select_goods').find('input[name=__goodsIds]').val().split(',');
              $.each(goodsIdArr, function (index, value) {
                if (value == goodsId) {
                  goodsIdArr = goodsIdArr.slice(0, index).concat(goodsIdArr.slice(index + 1))//两个数组拼接
                  return false;
                }
              });
              $('#much_select_goods').find('input[name=__goodsIds]').val(goodsIdArr.join(','))
              //已指定商品个数
              $('#much_select_goods').find('.select_goods_total').html($('#much_select_goods').find('.select_goods_list tr').length)
              $('#select_goods_num').html($('#much_select_goods').find('.select_goods_list tr').length);
            // }
          });
        },
        //查询参与商品列表
        getPIGoodsList: function () {
          //参加商品的类型和ID
          var _self = this;
          var classify = $("input[name=classify]").val();
          // var goodsType = $("#goodsType").val();
          // var partInGoodsIds = $("#partInGoodsIds").val();
          //获取筛选条件
          var goodsTitle = $("#goodsTitle").val();
          var goodsName = $("#goodsName").val();
          var detailTpl = $("#detailTpl").val();
          var goodsCode = $("#goodsCode").val();
          var goodsPrice1 = $("#goodsPrice1").val();
          var goodsPrice2 = $("#goodsPrice2").val();
          if(parseInt(goodsPrice2)-parseInt(goodsPrice1) < 0) {
            alert("请重新填写起始价格和结束价格!");
            return false;
          }
          var pageNum = _self.curPage;
          var pageLength = _self.pageLength;
          var data = {};
          data.curPage = pageNum;
          data.pageLength = pageLength;
          data.classify = classify;
          // data.goodsType = goodsType;
          // data.partInGoodsIds = partInGoodsIds;
          data.goodsTitle = goodsTitle;
          data.goodsName = goodsName;
          data.detailTpl = detailTpl;
          data.goodsCode = goodsCode;
          data.goodsPrice1 = goodsPrice1*10*10;
          data.goodsPrice2 = goodsPrice2*10*10;
          var url = "/merchant/getPIGoodsList";
          $.ajax({
            type: "POST",
            url: url,
            data: data
          }).then(function (result) {
            console.log(result);
            if("Success" == result.message) {
              _self.partInGoodsInfo = result.value;
              _self.pages = result.value.totalPages;
              _self.total = result.value.total;
              _self.totalNum = result.value.total;
              $("#last_page_index").html(result.value.totalPages);
              $("#page_count").html("共" + result.value.totalPages + "页");
              $("#row_count").html("("+result.value.total+"条记录)");

              if($('.pageinfo1')){
                $('.pageinfo1').remove();
              }

              $("#goodsList").append("<span class='pageinfo1'></span>")

              $('.pageinfo1').pagination({
                pages: result.value.totalPages,
                styleClass: ['pagination-large'],
                showCtrl: true,
                displayPage: 6,
                currentPage: _self.curPage,
                onSelect: function (num) {
                  _self.curPage = num;
                  v.getPIGoodsList();
                }
              });
              v.getNum();
            }else {
              _self.partInGoodsInfo = [];
            }
          });

          $('#much_select_goods').on('okHide', function(e){console.log('okHide')})
          var classStr = $("#much_select_goods").attr("class");
          if('sui-modal hide fade' == classStr) {
            $("#much_select_goods").attr({class:'sui-modal show fade'});
          }
        },
        /**
         * 添加分页的页数选择
         */
        getNum: function () {
          var _sel = this;
          $('.pageinfo1').find('span:contains(共)').append("<span id='m_t_n'>(" + _sel.totalNum + "条记录)</span>");
          //页码选择
          var pagearr = [15,30,50,100];

          var pageselect = '<select class="page_size_select" style="width: 50px;">';

          $.each(pagearr, function(){

            if(this==_sel.pageLength)
            {
              pageselect =pageselect+'<option value="'+this+'"  selected>'+this+'</option>';
            }else{
              pageselect =pageselect+'<option value="'+this+'">'+this+'</option>';
            }
          });

          pageselect = pageselect+'</select>&nbsp;';

          $('.pageinfo1').find('span:contains(共)').prepend(pageselect);

          $('.page_size_select').change(function () {
            _sel.pageLength = $('.page_size_select').val();
            v.getPIGoodsList();
          })
        },
        /**
         * 参加商品
         */
        partIn:function (event) {
          var _self = this;
          var tag = _self.goodsBox.$parent = $('#much_select_goods');//指定商品弹窗对象
          // var tag = _self.goodsBox.$parent.find('.select_goods_btn');
          // var goodsBox = {};
          var _self = event.currentTarget;
          var label = {}
          label.goods_id = $(_self).parent().find('[name="goods_id"]').val()
          label.goods_title = $(_self).parent().find('[name="goods_title"]').val()
          label.goods_code = $(_self).parent().find('[name="goods_code"]').val()
          label.shop_price = $(_self).parent().find('[name="shop_price"]').val()
          // label.disc_price = $(_self).parent().find('[name="disc_price"]').val()
          var type = tag.find('input[name=__showGoodsType]').val()
          v.selectGoods(label, type)
        },
        /**
         * 根据数据和类型在右边Table中显示
         * @param data
         * @param type
         */
        selectGoods:function (data, type) {
          // var goodsBox = {};
          var _self = this;
          _self.goodsBox.$parent = $('#much_select_goods');//指定商品弹窗对象`
          type = type ? type : 1
          type = parseInt(type)
          _self.goodsBox.$parent.find('tbody.show_goods_title').html($('#show_goods_title_' + type).html())
          _self.goodsBox.$parent.find('#goodsBoxTabOne td.operator_position').html($('#operate_right_data_' + type).html())
          //判断新添加的值是否为空
          if (!_self.goodsBox.$parent.find('.select_goods_list [name=goods_id][value=' + data.goods_id + ']').val()) {
            var oldGoodsIds = _self.goodsBox.$parent.find('input[name=__goodsIds]').val()
            _self.goodsBox.$parent.find('input[name=__goodsIds]').val(oldGoodsIds ? oldGoodsIds + ',' + data.goods_id : data.goods_id)
            var template = document.getElementById('select_goods_list_template_' + type).innerHTML
            var doTT = doT.template(template)
            _self.goodsBox.$parent.find('.select_goods_list').append(doTT(data))
            _self.goodsBox.$parent.find('.select_goods_total').html(_self.goodsBox.$parent.find('.select_goods_list tr').size())//已指定商品个数
            $('#select_goods_num').html(_self.goodsBox.$parent.find('.select_goods_list tr').size())
          } else {
            layer.msg('该商品已被选择！')
          }
        },
        /**
         * 从右侧Table中移除
         */
        removeGoods: function(e) {
          var e = e || window.event;
          var target = e.target || e.srcElement;
          if(target.nodeName.toLowerCase() === 'a'){
            // alert('a' + target.nodeName.toLowerCase());
            // alert(event.currentTarget.nodeName)
            // var _self = event.currentTarget;
            this.goodsBox.$parent = $('#much_select_goods');//指定商品弹窗对象
            // var goodsId = $(_self).parent().find('[name=goods_id]').val()
            // alert(target.parentNode.childNodes[1].nodeName);
            var goodsId = target.parentNode.childNodes[1].value;
            $(target).parents('.can_del_tr').remove();//移除tr

            var goodsIdArr = this.goodsBox.$parent.find('input[name=__goodsIds]').val().split(',')
            $.each(goodsIdArr, function (index, value) {
              if (value == goodsId) {
                goodsIdArr = goodsIdArr.slice(0, index).concat(goodsIdArr.slice(index + 1))//两个数组拼接
                return false;
              }
            })
            this.goodsBox.$parent.find('input[name=__goodsIds]').val(goodsIdArr.join(','))
            //已指定商品个数
            this.goodsBox.$parent.find('.select_goods_total').html(this.goodsBox.$parent.find('.select_goods_list tr').length)
            $('#select_goods_num').html(this.goodsBox.$parent.find('.select_goods_list tr').length)
          }


        },
        /**
         * 根据siteId分页查询门店店员列表
         */
        allocateTask:function () {
          $("#confirmInfo").attr("data-dismiss","");
          //点击之前先判断是否指定了回访任务
          var taskNum = $("#taskNum").val();
          if(!taskNum || '0' == taskNum) {
            // alert("请先指定回访任务!");
            layer.msg('无任务可分配，请调整后重试！');
            /*$('#allocate_task').on('okHide', function(e){console.log('okHide')})
            var classStr = $("#allocate_task").attr("class");
            if('sui-modal hide fade' == classStr) {
              $("#allocate_task").attr({class:'sui-modal show fade'});
            }*/
            // $("#allocate_task").attr({class:'sui-modal hide fade'});
            // $("#allocate_task").attr({'aria-hidden':'true'});
            // $("#allocate_task").attr("aria-hidden", function() { return true });
            return false;
          }

          var _self = this;
          var data = {};
          //搜索条件
          var storeCode = $("#storeId").val();//门店编号
          var clerkName = $("#clerkName").val();//店员姓名
          var pageNum = _self.page;
          var pageSize = _self.pageSize;
          data.pageNum = pageNum;
          data.pageSize = pageSize;
          data.storeCode = storeCode;
          data.clerkName = clerkName;
          var url = core.getHost()+"/merchant/getMerchantStores"
          $.ajax({
            type: "POST",
            data: data,
            url:url
          }).then(function (result) {
            console.log(result);
            if("Success" == result.message) {
              _self.storeAdminList = result.value;
              _self.pages = result.value.totalPages;
              _self.total = result.value.total;
            }else {
              _self.storeAdminList = [];
            }
          });

          var taskNum = $("#taskNum").val();
          $("#totalTaskNum").html(taskNum);//总回访数
          var alread = $("#alreadyDistribute").html();
          if(!alread) {
            $("#alreadyDistribute").html(0);
          }
          var left = $("#leftTaskNum").html();
          // if(!left && '' != left) {
          if(alread) {
            $("#leftTaskNum").html(parseInt(taskNum)-parseInt(alread))//剩余回访数
          }else {
            $("#leftTaskNum").html(taskNum)
          }

          //查询门店列表
          $.ajax({
            type: "POST",
            url: core.getHost()+"/merchant/getAllStores"
          }).then(function (result) {
            if("Success" == result.message) {
              _self.stores = result.value;
            }else {
              _self.stores = [];
            }
          });

          $("#allocate_task").modal("show");
          $('#allocate_task').on('okHide', function(e){console.log('okHide')})
          var classStr = $("#allocate_task").attr("class");
          if('sui-modal hide fade' == classStr) {
            $("#allocate_task").attr({class:'sui-modal show fade'});
          }
        },

        /**
         * 指定分配回访任务的店员
         */
        addDistribution:function (storeAdminName,storeName,storesNumber,storeAdminId,mobile,storeId) {
          //根据storeId和storeAdminId判断
          if (!$("#addDisAdmin").find("[name=tojudge][value='"+storeId+","+storeAdminId+"']").val()) {
            var singleLog = "<tr class='clerkLog'><td width='20%' align='left'><input type='hidden' name='tojudge' value='"+storeId+","+storeAdminId+"'/><input type='checkbox' name='selectedAdmin' value='"+storeAdminId+","+storeAdminName+","+storeName+","+storesNumber+","+mobile+","+storeId+"' />"+storeAdminName+"</td><td width='25%' style='text-align: left'>"+storeName+"</td><td width='12%'style='text-align: right'>"+storesNumber+"</td><td width='30%' style='text-align: center'><input type='text' name='distributeNum' value='' size='5'/></td><td width='15%' style='text-align: center'><a href='javascript:void(0)'>移除</a></td></tr>"
            $("#addDisAdmin").append(singleLog);
          }else {
            layer.msg('该店员已被选择！')
          }

        },
        /**
         * 获取分配任务右侧数据
         */


        getAllTaskAdmin:function () {
          //先判断回访任务是否分配完毕
          var taskNum = $("#taskNum").val();
          var alreadyDistribute =  $("#alreadyDistribute").html();
          if(taskNum != alreadyDistribute) {
            layer.msg('回访任务尚未分配完毕！');
            return false;
          }
          var allInputs = $("input[name=selectedAdmin]");
          // alert(allInputs.length);
          //判断右侧列表有没有空值或0
          var datas = [];
          var peoNum1 = 0;
          var peoNum2 = 0;
          var disNum1 = 0;
          var disNum2 = 0;
          var taskMap = new Map();
          var disNum = 0;//任务数
          var peoNum = 1;//分配人数
          var nums = 0;//键值对数
          for (var i = 0; i < allInputs.length; i++) {
            // alert(allInputs[i].nodeName)
            // alert(allInputs[i].parentNode.parentNode.childNodes[3].firstElementChild.value)
            var distriNum = allInputs[i].parentNode.parentNode.childNodes[3].firstElementChild.value;//当前店员分配任务数
            if(!distriNum || 0 == distriNum) {
              alert('分配数不能为0或空！');
              return false;
            }else {
              // alert(distriNum);
              var data = {"value":allInputs[i].value,"distributeNum":distriNum};
              datas.push(data);
              // disNum1 = distriNum;
              if(disNum != distriNum) {
                var peoNum = 1;
                nums += 1;
                taskMap.set(nums,peoNum+","+distriNum);
                disNum = distriNum;
              }else {
                peoNum = parseInt(peoNum)+1;
                taskMap.set(nums,peoNum+","+disNum);
              }
            }

          }
          $("#confirmInfo").attr("data-dismiss","modal");
          $("#clerkReturnVisitData").val(JSON.stringify(datas));
          //分配完显示提示语
          //总330个任务 12个店员 6个店员每人28  6个店员每人27
          var str = "";
          var clerks = allInputs.length;
          str += "<font size='4' color='#1e90ff'>总"+taskNum+"个任务 "+clerks+"个店员";
          for (var a = 1; a <= nums; a++) {
            var info =  taskMap.get(a).split(",");
            str += " " + info[0] + "个店员每人" + info[1];
          }
          str += "</font>";
          $("#distributeTaskTips").html(str);
        },


        /**
         * 通过事件委派调用
         * 移除
         */
        removeRightStoreAdmin: function (e) {
          var e = e || window.event;
          var target = e.target || e.srcElement;
          if(target.nodeName.toLowerCase() === 'a'){
            // alert("已移除!");
            //<tr>
            // <td width='20%'><input type='hidden' name='tojudge' value='"+storeId+","+storeAdminId+"'/><input type='checkbox' name='selectedAdmin' value='"+storeAdminId+","+storeAdminName+","+storeName+","+storesNumber+","+mobile+","+storeId+"' />"+storeAdminName+"</td>
            // <td width='30%'>"+storeName+"</td>
            // <td width='10%'>"+storesNumber+"</td>
            // <td width='25%' style='text-align: center'><input type='text' name='distributeNum' value='' size='1.5'/></td>
            // <td width='10%'><a href='javascript:viod(0)'>移除</a></td>
            // </tr>"
            // alert(target.parentNode.parentNode.nodeName)

            //移除之前获取标签中的分配数 添加到剩余中
            var distributeNum = target.parentNode.parentNode.childNodes[3].firstElementChild.value;
            if(distributeNum) {
              $("#alreadyDistribute").html(parseInt($("#alreadyDistribute").html())-parseInt(distributeNum));
              $("#leftTaskNum").html(parseInt($("#leftTaskNum").html())+parseInt(distributeNum));
            }
            target.parentNode.parentNode.remove();
            //清空存储分配任务的隐藏域
            $("#clerkReturnVisitData").val("");

          }/*else if(target.nodeName.toLowerCase() === 'input') {
            //获取之前任务数
            $("#")
            $("#distributeNum").change(function () {
              alert($("#distributeNum").val())
            });
          }*/

        },
        /**
         * 任务分配 input框发生改变
         */
        inputIncident: function (e) {
          // alert($("#distributeNum").val())
          // var obj = event.currentTarget;
          var target = e.target || e.srcElement;
          if (target.type.toLowerCase() == "checkbox") return false;
          var val = target.value;
          //修改分配任务量
          var leftTaskNum = $("#leftTaskNum").html();//剩余回访数
          if(parseInt(val) > parseInt(leftTaskNum)) {
            target.value = 0;
            layer.msg('分配任务数不能大于剩余任务总数！');
            var allInputs = $("input[name=selectedAdmin]");
            var alreadyDis = 0;
            for (var i = 0; i　< allInputs.length; i++) {
              var distributeNum = allInputs[i].parentNode.parentNode.childNodes[3].firstElementChild.value;
              if(distributeNum) {
                alreadyDis = parseInt(alreadyDis) + parseInt(distributeNum);//当前店员分配任务数
              }
            }
            $("#alreadyDistribute").html(alreadyDis);//已分配
            var taskNum = $("#taskNum").val();
            $("#leftTaskNum").html(parseInt(taskNum)-parseInt(alreadyDis));//剩余回访数
            return false;
            // $("#leftTaskNum").html(parseInt(leftTaskNum)-parseInt(leftTaskNum));
            // $("#alreadyDistribute").html(parseInt($("#alreadyDistribute").html())+parseInt(leftTaskNum));
          }else {
            // $("#leftTaskNum").html(parseInt(leftTaskNum)-parseInt(val));
            // $("#alreadyDistribute").html(parseInt($("#alreadyDistribute").html())+parseInt(target.value));
            var allInputs = $("input[name=selectedAdmin]");
            var alreadyDis = 0;
            for (var i = 0; i　< allInputs.length; i++) {
              var distributeNum = allInputs[i].parentNode.parentNode.childNodes[3].firstElementChild.value;
              if(distributeNum) {
                alreadyDis = parseInt(alreadyDis) + parseInt(distributeNum);//当前店员分配任务数
              }
            }
            $("#alreadyDistribute").html(alreadyDis);//已分配
            var taskNum = $("#taskNum").val();
            $("#leftTaskNum").html(parseInt(taskNum)-parseInt(alreadyDis));//剩余回访数
          }

        },
        /**
         * 店员平均分配任务
         */
        averageAllocation: function () {
          //获取右侧店员列表
          // var clerkList = $(".can_del_tr");
          var allInputs = $("input[name=selectedAdmin]");
          if(!allInputs.length > 0) {
            layer.msg('请先选择店员！');
            return false;
          }
          var total = allInputs.length;
          //获取总任务数
          var taskNum = $("#taskNum").val();
          var averageNum = parseInt(parseInt(taskNum)/parseInt(total));//平均数
          var remainder = parseInt(taskNum)%parseInt(total);//余数

          var flag = 0;

          //fixme 判断已分配数是否大于剩余任务数

          for (var c = 0; c < allInputs.length; c++) {
            if (flag < remainder) {
              allInputs[c].parentNode.parentNode.childNodes[3].firstElementChild.value=averageNum+1;
            }else {
              allInputs[c].parentNode.parentNode.childNodes[3].firstElementChild.value=averageNum;
            }
            flag += 1;
          }
          var taskNum = $("#taskNum").val();
          $("#alreadyDistribute").html(taskNum);//已分配数
          $("#leftTaskNum").html(0);//剩余任务数
        },
        /**
         * 清空平均分配数
         */
        clearTheData: function () {
          var allInputs = $("input[name=selectedAdmin]");
          for (var i = 0; i < allInputs.length; i++) {
            allInputs[i].parentNode.parentNode.childNodes[3].firstElementChild.value="";
          }
          $("#alreadyDistribute").html(0);//已分配数
          var taskNum = $("#taskNum").val();
          $("#leftTaskNum").html(taskNum);//剩余任务数
          //清空存储分配任务的隐藏域
          $("#clerkReturnVisitData").val("");

        },
        /**
         * 分配店员取消按钮
         */
        clearAllClerkData: function () {
          //清空右侧列表
        var logs = $(".clerkLog");
        for(var i = 0; i < logs.length; i++) {
          logs[i].remove();
        }
          //清除店员数据
        $("#clerkReturnVisitData").val("");
        $("#alreadyDistribute").html('');
        $("#leftTaskNum").html('');
        },
        /**
         * 指定商品左侧全选按钮
         */
        goodsSelectAll: function () {
          var isSelect = $("#select_all_goods_btn").prop("checked");
          var gleft = $("input[name=goodsLog]");
          if(isSelect) {
            gleft.each(function () {
              var isSelected = $(this).parent().hasClass("checked");
              if (!isSelected) {
                $(this).parent().prop("class","checkbox-pretty inline checked");
              }
            });
          }else {
            gleft.each(function () {
              var isSelected = $(this).parent().hasClass("checked");
              if (isSelected) {
                $(this).parent().prop("class","checkbox-pretty inline");
              }
            });
          }

        },
        /**
         * 指定商品左侧批量参加
         */
        batchPartInGoods: function () {
          var gleft = $("input[name=goodsLog]");
          var _self = this;
          gleft.each(function () {
            var isSelected = $(this).parent().hasClass("checked");
            if(isSelected) {

              var tag = _self.goodsBox.$parent = $('#much_select_goods');//指定商品弹窗对象
              var label = {}
              var lastChild = $(this).parents(".leftGoodsList").find("td:last-child");
              label.goods_id = lastChild.find('[name="goods_id"]').val()
              label.goods_title = lastChild.find('[name="goods_title"]').val()
              label.goods_code = lastChild.find('[name="goods_code"]').val()
              label.shop_price = lastChild.find('[name="shop_price"]').val()
              // label.disc_price = $(_self).parent().find('[name="disc_price"]').val()
              var type = tag.find('input[name=__showGoodsType]').val()
              v.selectGoods(label, type)
            }

          });

        },
        /**
         * 指定商品右侧列表全选
         */
        selectAllRightGoods: function () {
          var isSelect = $("#remove_all_goods_btn").prop("checked");
          var rightList = $("input[name=grid]");
          if(isSelect) {
            rightList.each(function () {
              var isSelected = $(this).parent().hasClass("checked");
              if (!isSelected) {
                $(this).parent().prop("class","checkbox-pretty inline checked");
              }
            });
          }else {
            rightList.each(function () {
              var isSelected = $(this).parent().hasClass("checked");
              if (isSelected) {
                $(this).parent().prop("class","checkbox-pretty inline");
              }
            });
          }

        },
        batchRemoveRightGoods: function () {
          var isSelect = $("#remove_all_goods_btn").prop("checked");
          if(isSelect) {
            $("#remove_all_goods_btn").prop("checked",false);
          }
          var rightList = $("input[name=grid]");
          // this.goodsBox.$parent = $('#much_select_goods');//指定商品弹窗对象
          rightList.each(function () {
            var isSelected = $(this).parent().hasClass("checked");
            if (isSelected) {
              var goodsId = $(this).parents(".can_del_tr").find("td:last-child").find('[name="goods_id"]').val();
              $(this).parents(".can_del_tr").remove();
              var goodsIdArr = $('#much_select_goods').find('input[name=__goodsIds]').val().split(',');
              $.each(goodsIdArr, function (index, value) {
                if (value == goodsId) {
                  goodsIdArr = goodsIdArr.slice(0, index).concat(goodsIdArr.slice(index + 1))//两个数组拼接
                  return false;
                }
              });
              $('#much_select_goods').find('input[name=__goodsIds]').val(goodsIdArr.join(','))
              //已指定商品个数
              $('#much_select_goods').find('.select_goods_total').html($('#much_select_goods').find('.select_goods_list tr').length)
              $('#select_goods_num').html($('#much_select_goods').find('.select_goods_list tr').length);
            }
          });
        },
        /**
         * 分配任务左侧全选按钮
         */
        selectAllLeftClerks: function () {
          var isSelect = $(".select_all_clerks_btn").prop("checked");
          var cleft = $("input[name=cid]");
          if(isSelect) {
            cleft.each(function () {
              var isSelected = $(this).prop("checked");
              if(!isSelected) {
                $(this).prop("checked",true);
              }
            });
          }else {
            cleft.each(function () {
              var isSelected = $(this).prop("checked");
              if(isSelected) {
                $(this).prop("checked",false);
              }
            });
          }
        },
        /**
         * 左侧店员批量添加
         */
        batchPartInLeft: function () {
          var cleft = $("input[name=cid]");
          cleft.each(function () {
            var isSelected = $(this).prop("checked");
            if(isSelected) {
              var _parent = $(this).parent();
              var storeAdminName = _parent.find("input[name=storeAdminName]").val();
              // alert(_parent.parent().prop('tagName'));
              var storeName = _parent.parent().find("td[name=storeName]").html();
              var storesNumber = _parent.parent().find("td[name=storesNumber]").html();
              var storeAdminId = _parent.find("input[name=storeadminId]").val();
              var mobile = _parent.find("input[name=mobile]").val();
              var storeId = _parent.find("input[name=storeId]").val();
              // storeAdminName,storeName,storesNumber,storeAdminId,mobile,storeId

              //根据storeId和storeAdminId判断
              if (!$("#addDisAdmin").find("[name=tojudge][value='"+storeId+","+storeAdminId+"']").val()) {
                var singleLog = "<tr class='clerkLog'><td width='20%' align='left'><input type='hidden' name='tojudge' value='"+storeId+","+storeAdminId+"'/><input type='checkbox' name='selectedAdmin' value='"+storeAdminId+","+storeAdminName+","+storeName+","+storesNumber+","+mobile+","+storeId+"' />"+storeAdminName+"</td><td width='25%' style='text-align: left'>"+storeName+"</td><td width='12%'style='text-align: right'>"+storesNumber+"</td><td width='30%' style='text-align: center'><input type='text' name='distributeNum' value='' size='5'/></td><td width='15%' style='text-align: center'><a href='javascript:void(0)'>移除</a></td></tr>"
                $("#addDisAdmin").append(singleLog);
              }else {
                layer.msg('店员已被选择！');
              }
            }
          });
        },
        /**
         * 分配任务右侧全选按钮
         */
        selectAllRightClerks: function () {
          var isSelect = $(".unselect_all_clerks_btn").prop("checked");
          var cRight = $("input[name=selectedAdmin]");
          if(isSelect) {
            cRight.each(function () {
              var isSelected = $(this).prop("checked");
              if(!isSelected) {
                $(this).prop("checked",true);
              }
            });
          }else {
            cRight.each(function () {
              var isSelected = $(this).prop("checked");
              if(isSelected) {
                $(this).prop("checked",false);
              }
            });
          }
        },
        /**
         * 右侧店员列表批量移除
         */
        batchRemoveRight: function () {
          var cRight = $("input[name=selectedAdmin]");
          cRight.each(function(){
            var isSelected = $(this).prop("checked");
            if(isSelected) {
              // alert($(this).parent().parent(".clerkLog").prop("tagName"));
              var selectedLogs = $(this).parent().parent(".clerkLog");
              // var logs = $(".clerkLog");
              // for(var i = 0; i < selectedLogs.length; i++) {
                selectedLogs.remove();
              // }
            }
          });
          //清除店员数据
          $("#clerkReturnVisitData").val("");

          var allInputs = $("input[name=selectedAdmin]");
          var alreadyDis = 0;
          for (var i = 0; i　< allInputs.length; i++) {
            var distributeNum = allInputs[i].parentNode.parentNode.childNodes[3].firstElementChild.value;
            if(distributeNum) {
              alreadyDis = parseInt(alreadyDis) + parseInt(distributeNum);//当前店员分配任务数
            }
          }
          $("#alreadyDistribute").html(alreadyDis);//已分配
          var taskNum = $("#taskNum").val();
          $("#leftTaskNum").html(parseInt(taskNum)-parseInt(alreadyDis));//剩余回访数

        },
        /**
         * 创建回访任务
         */
        createReturnVisitTask:function () {
          var _self=this;
          // var object = $("#clerkReturnVisitData").val();//分配店员
          if(!$("#visitName").val()){
            alert("请填写回访名称!");
            return false;
          }
          if(!$("#clerkReturnVisitData").val()) {
            alert("任务未分配，请分配后再提交!");
            return false;
          }
          var datas = [];
          var allInputs = $("input[name=selectedAdmin]");//右侧指定的店员列表
          // alert(allInputs.length);
          for (var i = 0; i < allInputs.length; i++) {
            // alert(allInputs[i].nodeName)
            // alert(allInputs[i].parentNode.parentNode.childNodes[3].firstElementChild.value)
            var distriNum = allInputs[i].parentNode.parentNode.childNodes[3].firstElementChild.value;//当前店员分配任务数
            // alert(distriNum);
            var dataVal = {"value": allInputs[i].value, "distributeNum": distriNum};
            datas.push(dataVal);
          }
          datas = JSON.stringify(datas);
          var data = {"obj":datas};
          var activityIds=[];
          var aids=_self.activityInfo;
          for(var i in aids){
            var id = aids[i].promotionId;
            activityIds.push(id);
          }

          //获取主推
          _self.selectImpotent();
          data.activityIds=activityIds.toString();
          data.impotentIds=_self.impotentIds;
          data.goodsIds=_self.activityGoodsIds;
          data.visitName=$("#visitName").val();
          data.memberId=_self.memberIds;
          data.sumPerson=_self.SumPerson;
          var memberSource=[];
          var sourceType=$("input[name='selectReturnVisitMembers'][checked]").val();
          if(sourceType == 0){
            if(!_self.isEmpty(_self.sex)) memberSource.push(_self.sex.toString());
            if(!_self.isEmpty(_self.age)) memberSource.push(_self.age.toString());
            if(!_self.isEmpty(_self.birthday)) memberSource.push(_self.birthday.toString());
            if(!_self.isEmpty(_self.constellation)) memberSource.push(_self.constellation.toString());
            if(!_self.isEmpty(_self.zodiac)) memberSource.push(_self.zodiac.toString());
            if(!_self.isEmpty(_self.registration)) memberSource.push(_self.registration.toString());
            if(!_self.isEmpty(_self.region)) memberSource.push(_self.region.toString());
            if(!_self.isEmpty(_self.regionW)) memberSource.push(_self.regionW.toString());
            if(!_self.isEmpty(_self.bargain_money)) memberSource.push(_self.bargain_money.toString());
            if(!_self.isEmpty(_self.bargain_count)) memberSource.push(_self.bargain_count.toString());
            if(!_self.isEmpty(_self.pre_transaction)) memberSource.push(_self.pre_transaction.toString());
            if(!_self.isEmpty(_self.refund_probability)) memberSource.push(_self.refund_probability.toString());
            if(!_self.isEmpty(_self.ever_buy)) memberSource.push(_self.ever_buy.toString());
            if(!_self.isEmpty(_self.add_integral)) memberSource.push(_self.add_integral.toString());
            if(!_self.isEmpty(_self.consume_integral)) memberSource.push(_self.consume_integral.toString());
            if(!_self.isEmpty(_self.residue_integral)) memberSource.push(_self.residue_integral.toString());
            if(!_self.isEmpty(_self.buy_period)) memberSource.push(_self.buy_period.toString());
            if(!_self.isEmpty(_self.dis_store_activity)) memberSource.push(_self.dis_store_activity.toString());
            if(!_self.isEmpty(_self.dis_store_address)) memberSource.push(_self.dis_store_address.toString());
            if(!_self.isEmpty(_self.dis_contend_store_activity)) memberSource.push(_self.dis_contend_store_activity.toString());
            if(!_self.isEmpty(_self.custom_label)) memberSource.push(_self.custom_label.toString());
            if(!_self.isEmpty(_self.hyperlipidemia_label)) memberSource.push(_self.hyperlipidemia_label.toString());
            if(!_self.isEmpty(_self.hypertension_label)) memberSource.push(_self.hypertension_label.toString());
            if(!_self.isEmpty(_self.diabetes_label)) memberSource.push(_self.diabetes_label.toString());
          }else if(sourceType == 2){
            memberSource=_self.visitMembersGroup;
          }else{
            memberSource="0";
          }
          data.memberSource=memberSource.toString();
          data.activityInfos=_self.activityInfos;
          // console.log(data,"datadatadatadata")
          //回访对象
          // var partInType = $("input[name=partInType]").parents(".checked").children().val();
          //回访对象类型
          // data.partInType = partInType;
          // if("0" == partInType) {//全部参与对象,不考虑会员和购买商品的关系
          //   var memberType = $("#memberType").val();
          //   var memberId = $("#memberId").val();
          //   data.memberType = memberType;
          //   data.memberId = memberId;
          // }else if("1" == partInType) {//手动过滤
          //   /**
          //    * 获取回访对象
          //    * 获取会员ID
          //    * 获取购买天数
          //    * 获取指定的商品
          //    */
          //   //根据选中的参与对象来获取商品
          //   // var isNeedType;//0 活动商品 不需要使用  1 指定商品 需要使用goodsType
          //
          //   var memberId = $("#memberId").val();
          //   var passDays = $("input[name=passDay]").val();
          //   var goodsIds = $("input[name=__goodsIds]").val();//有值,表示指定商品
          //   var goodsIdsStr;
          //   if(goodsIds) {//指定商品
          //     goodsIdsStr = goodsIds;
          //   }else {//全部活动商品
          //     var partInGoodsIds =  $("#partInGoodsIds").val();
          //     var goodsType = $("#goodsType").val();
          //     data.goodsType = goodsType;//有goodsType则根据goodsType去获取商品ID
          //     goodsIdsStr = partInGoodsIds;
          //   }
          //   data.memberId = memberId;
          //   data.passDays = passDays;
          //   data.goodsIdsStr = goodsIdsStr;
          //   data.memberId = memberId;
            /*if("0" == partInType) {//全部参与对象
              //商品类型
              goodsIds = $("#partInGoodsIds").val();
              isNeedType = 1;
            }else if ("1" == partInType) {//指定参与
              var goodsId = $("input[name=__goodsIds]").val();
              if(goodsId) {//选择的指定商品
                isNeedType = 0;
                goodsIds = $("input[name=__goodsIds]").val();
              }else {//选择的活动商品
                isNeedType = 1;
                goodsIds = $("#partInGoodsIds").val();
              }*/

          // }else {
          //   alert("请先指定回访对象!");
          //   return false;
          // }

          //回访时间
          var type = $("input[name=returnVisitTime]").parents(".checked").children().val();
          data.timeType = type;//回访时间类型
          var returnVisitTime;
          if("0" == type) {//活动开始前一天
            returnVisitTime = $("#actTime").children().html();//活动时间
          }else if("1" == type) {//创建后立即回访
            returnVisitTime = "";
          }else if("2" == type) {//自定义时间
            returnVisitTime = $("#demo3").val();
            if(!returnVisitTime) {
              alert("请设置回访时间!");
              return false;
            }
            //判断时间是否大于等于当前时间
            //自定义时间只能选择明天
            var d1 = new Date(returnVisitTime.replace(/\-/g, "\/"));
            var now = new Date();
            now.setDate(now.getDate()+1);//当前时间加一天
            var currentTime = new Date(now.Format("yyyy-MM-dd").replace(/\-/g, "\/"));
            if(d1 - currentTime < 0) {
              alert("回访时间不能小于等于当天时间!");
              return false;
            }
          }else {
            alert("请设置回访时间!")
            return false;
          }

          //活动ID 活动名称
          var activityId = $("#activityId").val();
          var actName = $("#actName").children().html();
          //应访会员数
          var totalTaskNum = $("#totalTaskNum").html();
          //要回访的商品 goodsIdsStr

          data.returnVisitTime = returnVisitTime;
          // data.activityId = activityId;
          // data.actName = actName;
          // data.totalTaskNum = totalTaskNum;
          // data = Object.assign(object);

          var url = core.getHost()+"/merchant/toCreateReturnVisitTask";
          //发送请求之前按键置为不可点
        $("#createReturnTask").prop("disabled","disabled");
          // layer.msg('回访任务正在创建中,请稍等！');
          alert('回访任务正在创建中,请稍等！');
          $.ajax({
            type: "POST",
            url: url,
            data: data
          }).then(function (result) {
            if("Success" == result.message) {
              alert("回访任务创建成功!");
              window.location.href="/merchant/activity/list";
            }else {
              alert("回访任务创建失败!");
            }
          });
        },

        /*formatDate: Date.prototype.Format = function (fmt) { //author: meizz
          var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
        },*/


        getClerkList: function (id) {  //获取当前门店的店员列表
          var vids = "";  //回访列表id集合
          $("input[name=vid]:checkbox:checked").each(function(){
            if($(this).prop("checked")){
              vids += $(this).val()+",";
            }
          });
          if(id) vids = id; //单条记录的覆盖选中的
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
            url:'/merchant/getMerchantClerks',
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
                str = str+"<tr><input type='hidden' id='getIds' value='"+vids+"'/>"
                for(var item in list){
                  str = str + "<td><input type='radio' name='id' value='"+list[item].id+","+list[item].clerkName+","+list[item].storeId+"'/> "+list[item].clerkName+"</td><td>"+list[item].mobile+"</td><td>"+list[item].storeName+"</td></tr>";
                }
                $("#clerk_list").append(str);
              }else {
                $("#clerk_list").append("<tr><td colspan='3'>暂无数据</td></tr>")
              }

            }else {
              _self.clerkList = [];
            }
          });
          var classStr = $("#myModal").attr("class");
          if('sui-modal hide fade' == classStr) {
            $("#myModal").attr({class:'sui-modal show fade'});
          }
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
        //获取门店列表
        getStoresList: function() {
          $.ajax({
              type : 'post',
              url : "/merchant/getStoreList"
            }
          ).then(function (result) {
            if(result.message == 'Success') {
              $("#storeList").html("")
              var list = result.value;
              $("#storeList").append("<li role='presentation'><a role='menuitem' tabindex='-1' href='javascript:void(0);' value='0'>所有门店</a></li>");
              for(var item in result.value) {
                $("#storeList").append("<li role='presentation'><a role='menuitem' tabindex='-1' href='javascript:void(0);' value='"+list[item].id+"'>"+list[item].name+"</a></li>");
              }

            }
          });

        },
        pageChange: function(page){
            this.page = page;
        },
        pageSizeChange: function(pageSize){
            this.pageSize = pageSize;
        },
        //标签相关
        //全部会员
        selectMemberLabel:function (){
          //check按钮切换到当前选项
          $(".selectItems input").each(function () {
            if($(this).attr("id")=='selectReturnVisitMembers0'){
              $(this).attr("checked", true);
              $(this).parent().addClass("checked");
            }
            else{
              $(this).attr("checked", false);
              $(this).parent().removeClass("checked");
            }
          });
          this.memberIds="0";
          this.SumPerson="0";
          this.labelCount=0;
          this.groupCount=0;
          this.infoForVisit();
        },
        //全部商品
        selectGoodsLabel:function (){
          //check按钮切换到当前选项
          $(".selectItems input").each(function () {
            if($(this).attr("id")=='selectReturnVisitMembers3'){
              $(this).attr("checked", true);
              $(this).parent().addClass("checked");
            }
            else{
              $(this).attr("checked", false);
              $(this).parent().removeClass("checked");
            }
          });
          this.goodsIds="0";
          this.itemNumAll = 0;
          this.infoForVisit();
        },
        // 显示遮罩层（标签列表）
        showZhezhao:function (){
          $(".loading").removeClass("hideDiv").addClass("showDiv");
          $(".zhezhao").removeClass("hideDiv").addClass("showDiv");
          console.log("showZhezhao");
        },
        // 隐藏遮罩层（标签列表）
        hideZhezhao:function (){
          $(".loading").removeClass("showDiv").addClass("hideDiv");
          $(".zhezhao").removeClass("showDiv").addClass("hideDiv");
          console.log("hideZhezhao");
        },
        //获取标签列表(初始化)
        getTagList:function(){
          var _self=this;
          _self.tagType='getBase';_self.ldCount=0;
          setTimeout(() => {_self.getBaseLabel();}, 10)
          // 手动打开弹窗
          var classStr = $("#returnVisitMembersByTag").attr("class");
          if('sui-modal hide fade' == classStr) {
            $("#returnVisitMembersByTag").attr({class:'sui-modal show fade'});
          }
        },
        //获取标签列表(各大tab切换)
        getBaseLabel:function(){
          var _self=this;
          _self.agCount=0;_self.ldCount=0;
          $.ajax({
            type: "post",
            url: "/merchant/labelsecond/getBaseLabelBySex",
            dataType: "json",
            success: function(data) {
              console.log(data,"获取基础标签性别");
              if(data.baseLabelMap){
                _self.baseLabelMap=data.baseLabelMap;
                _self.ldCount=_self.ldCount+1;
                if(_self.ldCount == 7){
                  _self.loading=false;
                  _self.hideZhezhao();
                  _self.changeTab(0);

                }
              }
            },
            error: function() {
              console.log("请求失败！");
            }
          });

          $.ajax({
            type: "post",
            url: "/merchant/labelsecond/getBaseLabelByBirthday",
            dataType: "json",
            success: function(data) {
              console.log(data,"获取基础标签生日年龄");
              if(data.baseLabelMap){
                _self.baseLabelMapByBirthday=data.baseLabelMap;
                _self.agCount=_self.agCount+1;
                if(_self.agCount == 2){
                  _self.baseLabelMapByBirthday.ageListMap.push(_self.yiWeiZhi.ageYizhiWeizhiListMap[0]);
                  _self.baseLabelMapByBirthday.ageListMap.push(_self.yiWeiZhi.ageYizhiWeizhiListMap[1]);
                }
                _self.ldCount=_self.ldCount+1;
                if(_self.ldCount == 7){
                  _self.loading=false;
                  _self.hideZhezhao();
                  _self.changeTab(0);
                }
              }
            },
            error: function() {
              console.log("请求失败！");
            }
          });
          $.ajax({
            type: "post",
            url: "/merchant/labelsecond/getBaseLabelByShengxiaoXingzuo",
            dataType: "json",
            success: function(data) {
              console.log(data,"获取基础标签生肖星座");
              if(data.baseLabelMap){
                _self.baseLabelMapByShengxiaoXingzuo=data.baseLabelMap;
                _self.ldCount=_self.ldCount+1;
                if(_self.ldCount == 7){
                  _self.loading=false;
                  _self.hideZhezhao();
                  _self.changeTab(0);
                }
              }
            },
            error: function() {
              console.log("请求失败！");
            }
          });
          $.ajax({
            type: "post",
            url: "/merchant/labelsecond/getBaseLabelByRegist",
            dataType: "json",
            success: function(data) {
              console.log(data,"获取基础标签注册时间");
              if(data.baseLabelMap){
                _self.baseLabelMapByRegist=data.baseLabelMap;
                _self.ldCount=_self.ldCount+1;
                if(_self.ldCount == 7){
                  _self.loading=false;
                  _self.hideZhezhao();
                  _self.changeTab(0);
                }
              }
            },
            error: function() {
              console.log("请求失败！");
            }
          });
          $.ajax({
            type: "post",
            url: "/merchant/labelsecond/getAgeYizhiWeizhi",
            dataType: "json",
            success: function(data) {
              console.log(data,"获取基础标签年龄生日(已知未知)");
              _self.yiWeiZhi.ageYizhiWeizhiListMap=[];
              if(data.ageYizhiWeizhiListMap){
                _self.yiWeiZhi.ageYizhiWeizhiListMap=data.ageYizhiWeizhiListMap;
              }
              _self.agCount=_self.agCount+1;
              if(_self.agCount == 2){
                _self.baseLabelMapByBirthday.ageListMap.push(_self.yiWeiZhi.ageYizhiWeizhiListMap[0]);
                _self.baseLabelMapByBirthday.ageListMap.push(_self.yiWeiZhi.ageYizhiWeizhiListMap[1]);
              }
              _self.ldCount=_self.ldCount+1;
              if(_self.ldCount == 7){

                _self.loading=false;
                _self.hideZhezhao();
                _self.changeTab(0);
              }
            },
            error: function() {
              console.log("请求失败！");
            }
          });
// 区域
          $.ajax({
            type: "post",
            url: "/merchant/labelsecond/getAreaLabel",
            dataType: "json",
            success: function(data) {
              console.log(data,"基础标签的区域");
              if(data.areaList){
                _self.areaList=data.areaList;
                _self.ldCount=_self.ldCount+1;
                if(_self.ldCount == 7){
                  _self.loading=false;
                  _self.hideZhezhao();
                  _self.changeTab(0);
                }
              }
            },
            error: function() {
              console.log("请求失败！");
            }
          });
//区域未知
          $.ajax({
            type: "post",
            url: "/merchant/labelsecond/getAreaYizhiWeizhi",
            dataType: "json",
            success: function(data) {
              console.log(data,"基础标签的区域(已知未知)");
              if(data){
                _self.yiWeiZhi.areaYizhiWeizhiListMap=data;
                _self.ldCount=_self.ldCount+1;
                if(_self.ldCount == 7){
                  _self.loading=false;
                  _self.hideZhezhao();
                  _self.changeTab(0);
                }
              }
            },
            error: function() {
              console.log("请求失败！");
            }
          });
        },
        getTradesLabelClick:function(){
          var _self=this;
          _self.loading=true;_self.tagType='getTrades';_self.ldCount=0;
          setTimeout(() => {
            _self.ldCount=0;
            _self.bmCount=0;_self.zjfCount=0;_self.sjfCount=0;_self.xjfCount=0;
            //成功交易金额普通
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getTradesLabelOne",
              dataType: "json",
              success: function(data) {
                console.log(data,"成功交易金额.........");
                if(data.tradesLabelMap){
                  _self.tradesLabelMap.bargainMoneyListMap =data.tradesLabelMap.bargainMoneyListMap;
                  _self.bmCount=_self.bmCount+1;
                  if(_self.bmCount == 2){
                    _self.tradesLabelMap.bargainMoneyListMap.push(_self.yiWeiZhi.weizhiBargainMoneyMap);
                    _self.tradesLabelMap.bargainMoneyListMap.push(_self.yiWeiZhi.yizhiBargainMoneyMap);
                  }
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 10){
                    _self.loading=false;
                    _self.changeTab(1);

                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });

            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getTradesLabelTwo",
              dataType: "json",
              success: function(data) {
                console.log(data,"成功交易次数................");
                if(data.tradesLabelMap){
                  _self.tradesLabelMap.bargainCountListMap=data.tradesLabelMap.bargainCountListMap;
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 10){
                    _self.loading=false;
                    _self.changeTab(1);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getTradesLabelThree",
              dataType: "json",
              success: function(data) {
                console.log(data,"客单价......");
                if(data.tradesLabelMap){
                  _self.tradesLabelMap.preTransactionListMap =data.tradesLabelMap.preTransactionListMap;
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 10){
                    _self.loading=false;
                    _self.changeTab(1);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getTradesLabelFore",
              dataType: "json",
              success: function(data) {
                console.log(data,"退款率.........购买过............");
                if(data.tradesLabelMap){
                  _self.tradesLabelMap.EverBuyListMap =data.tradesLabelMap.EverBuyListMap;
                  _self.tradesLabelMap.refundProbabilityListMap =data.tradesLabelMap.refundProbabilityListMap;
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 10){
                    _self.loading=false;
                    _self.changeTab(1);
                  }
                }

              },
              error: function() {
                console.log("请求失败！");
              }
            });
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getTradesLabelFive",
              dataType: "json",
              success: function(data) {
                console.log(data,"购买周期............");
                if(data.tradesLabelMap){
                  _self.tradesLabelMap.buyPeriodListMap =data.tradesLabelMap.buyPeriodListMap;
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 10){
                    _self.loading=false;
                    _self.changeTab(1);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });
            //积分普通
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getTradesLabelSix",
              dataType: "json",
              success: function(data) {
                console.log(data,"赚取积分............消耗积分..................剩余积分");
                if(data.tradesLabelMap){
                  _self.tradesLabelMap.addIntegralListMap =data.tradesLabelMap.addIntegralListMap;
                  _self.tradesLabelMap.consumeIntegralListMap =data.tradesLabelMap.consumeIntegralListMap;
                  _self.tradesLabelMap.residueIntegralListMap =data.tradesLabelMap.residueIntegralListMap;
                  _self.zjfCount=_self.zjfCount+1;_self.xjfCount=_self.xjfCount+1;_self.sjfCount=_self.sjfCount+1;
                  if(_self.zjfCount == 2){
                    _self.tradesLabelMap.addIntegralListMap.push(_self.yiWeiZhi.weiizhiAddIntegrateMap);
                    _self.tradesLabelMap.addIntegralListMap.push(_self.yiWeiZhi.yizhiAddIntegrateMap);
                  }
                  if(_self.sjfCount == 2){
                    _self.tradesLabelMap.residueIntegralListMap.push(_self.yiWeiZhi.weiizhiResidueIntegrateMap);
                    _self.tradesLabelMap.residueIntegralListMap.push(_self.yiWeiZhi.yizhiResidueIntegrateMap);
                  }
                  if(_self.xjfCount == 2){
                    _self.tradesLabelMap.consumeIntegralListMap.push(_self.yiWeiZhi.weiizhiConsumeIntegrateMap);
                    _self.tradesLabelMap.consumeIntegralListMap.push(_self.yiWeiZhi.yizhiConsumeIntegrateMap);
                  }
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 10){
                    _self.loading=false;
                    _self.changeTab(1);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });
            //成功交易金额未知
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getBargainMoneyYizhiWeizhi",
              dataType: "json",
              success: function(data) {
                console.log(data,"成功交易金额.........(未知)");
                if(data.weizhiBargainMoneyMap){
                  _self.yiWeiZhi.weizhiBargainMoneyMap =data.weizhiBargainMoneyMap;
                  _self.yiWeiZhi.yizhiBargainMoneyMap =data.yizhiBargainMoneyMap;
                  _self.bmCount=_self.bmCount+1;
                  if(_self.bmCount == 2){
                    _self.tradesLabelMap.bargainMoneyListMap.push(_self.yiWeiZhi.weizhiBargainMoneyMap);
                    _self.tradesLabelMap.bargainMoneyListMap.push(_self.yiWeiZhi.yizhiBargainMoneyMap);
                  }
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 10){
                    _self.loading=false;
                    _self.changeTab(1);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });
            //赚取积分(已知未知)
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getAddIntegrateYizhiWeizhi",
              dataType: "json",
              success: function(data) {
                console.log(data,"赚取积分(已知未知)");
                if(data.weiizhiAddIntegrateMap){
                  _self.yiWeiZhi.weiizhiAddIntegrateMap =data.weiizhiAddIntegrateMap;
                  _self.yiWeiZhi.yizhiAddIntegrateMap =data.yizhiAddIntegrateMap;
                  _self.zjfCount=_self.zjfCount+1;
                  if(_self.zjfCount == 2){
                    _self.tradesLabelMap.addIntegralListMap.push(_self.yiWeiZhi.weiizhiAddIntegrateMap);
                    _self.tradesLabelMap.addIntegralListMap.push(_self.yiWeiZhi.yizhiAddIntegrateMap);
                  }
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 10){
                    _self.loading=false;
                    _self.changeTab(1);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });
            //剩余积分(已知未知)
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getResidueIntegrateYizhiWeizhi",
              dataType: "json",
              success: function(data) {
                console.log(data,"剩余积分(已知未知)");
                if(data.weiizhiResidueIntegrateMap){
                  _self.yiWeiZhi.weiizhiResidueIntegrateMap =data.weiizhiResidueIntegrateMap;
                  _self.yiWeiZhi.yizhiResidueIntegrateMap =data.yizhiResidueIntegrateMap;
                  _self.sjfCount=_self.sjfCount+1;
                  if(_self.sjfCount == 2){
                    _self.tradesLabelMap.residueIntegralListMap.push(_self.yiWeiZhi.weiizhiResidueIntegrateMap);
                    _self.tradesLabelMap.residueIntegralListMap.push(_self.yiWeiZhi.yizhiResidueIntegrateMap);
                  }
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 10){
                    _self.loading=false;
                    _self.changeTab(1);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });
            //消耗积分(已知未知)
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getConsumeIntegrateYizhiWeizhi",
              dataType: "json",
              success: function(data) {
                console.log(data,"消耗积分(已知未知)");
                if(data.weiizhiConsumeIntegrateMap){
                  _self.yiWeiZhi.weiizhiConsumeIntegrateMap =data.weiizhiConsumeIntegrateMap;
                  _self.yiWeiZhi.yizhiConsumeIntegrateMap =data.yizhiConsumeIntegrateMap;
                  _self.xjfCount=_self.xjfCount+1;
                  if(_self.xjfCount == 2){
                    _self.tradesLabelMap.consumeIntegralListMap.push(_self.yiWeiZhi.weiizhiConsumeIntegrateMap);
                    _self.tradesLabelMap.consumeIntegralListMap.push(_self.yiWeiZhi.yizhiConsumeIntegrateMap);
                  }
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 10){
                    _self.loading=false;
                    _self.changeTab(1);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });

          }, 10);


        },
        getDistanceLabelClick:function(){
          var _self=this;
          _self.loading=true;_self.tagType='getDistance';_self.ldCount=0;
          setTimeout(() => {
            _self.ldCount=0;
            _self.mdhdCount=0;_self.jdhdCount=0;_self.mdjlCount=0;_self.jdjlCount=0;
            //查询门店距离(高频活动)
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getDistanceLabelByDisStoreActivity",
              dataType: "json",
              success: function(data) {
                console.log(data,"获取距离标签。。。。。。。。。。。。。。");
                if(data.distanceLabelMap){
                  _self.disStoreActivityMap=data.distanceLabelMap;
                  _self.mdhdCount=_self.mdhdCount+1;
                  if(_self.mdhdCount == 2){
                    _self.disStoreActivityMap.disStoreActivityListMap.push(_self.yiWeiZhi.weiizhiDisStoreActivityMap);
                    _self.disStoreActivityMap.disStoreActivityListMap.push(_self.yiWeiZhi.yizhiDisStoreActivityMap);
                  }
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 6){
                    _self.loading=false;_self.changeTab(2);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });

            //查询门店距离(收货地址)
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getDistanceLabelByDisStoreAddress",
              dataType: "json",
              success: function(data) {
                console.log(data,"获取距离标签。。。。。。。。。。。。。。");
                if(data.distanceLabelMap){
                  _self.disStoreAddressMap=data.distanceLabelMap;
                  _self.mdjlCount=_self.mdjlCount+1;
                  if(_self.mdjlCount == 2){
                    _self.disStoreAddressMap.disStoreAddressListMap.push(_self.yiWeiZhi.weiizhiDisStoreAddressMap);
                    _self.disStoreAddressMap.disStoreAddressListMap.push(_self.yiWeiZhi.yizhiDisStoreAddressMap);
                  }
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 6){
                    _self.loading=false;_self.changeTab(2);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });

            //查询竞店距离(高频活动)
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getDistanceLabelByDisContendStoreActivity",
              dataType: "json",
              success: function(data) {
                console.log(data,"获取距离标签。。。。。。。。。。。。。。");
                if(data.distanceLabelMap){
                  _self.disContendStoreActivitMap=data.distanceLabelMap;
                  _self.jdhdCount=_self.jdhdCount+1;
                  if(_self.jdhdCount == 2){
                    _self.disContendStoreActivitMap.disContendStoreActivityListMap.push(_self.yiWeiZhi.weiizhiDisStoreActivityMap);
                    _self.disContendStoreActivitMap.disContendStoreActivityListMap.push(_self.yiWeiZhi.yizhiDisStoreActivityMap);
                  }
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 6){
                    _self.loading=false;_self.changeTab(2);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });

            //查询竞店距离(收货地址)
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getDistanceLabelBydisContendStoreAddress",
              dataType: "json",
              success: function(data) {
                console.log(data,"获取距离标签。。。。。。。。。。。。。。");
                if(data.distanceLabelMap){
                  _self.disContendStoreAddressMap=data.distanceLabelMap;
                  _self.jdjlCount=_self.jdjlCount+1;
                  if(_self.jdjlCount == 2){
                    _self.disContendStoreAddressMap.disContendStoreAddressListMap.push(_self.yiWeiZhi.weiizhiDisStoreAddressMap);
                    _self.disContendStoreAddressMap.disContendStoreAddressListMap.push(_self.yiWeiZhi.yizhiDisStoreAddressMap);
                  }
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 6){
                    _self.loading=false;_self.changeTab(2);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });

            //查询门店/竞店距离(高频活动-有活动/没有活动)
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getDisStoreActivityYizhiWeizhi",
              dataType: "json",
              success: function(data) {
                console.log(data,"获取距离标签(有活动/没有活动)。。。。。。。。。。。。。。");
                if(data.weiizhiDisStoreActivityMap){
                  _self.yiWeiZhi.weiizhiDisStoreActivityMap =data.weiizhiDisStoreActivityMap;
                  _self.yiWeiZhi.yizhiDisStoreActivityMap =data.yizhiDisStoreActivityMap;
                  _self.mdhdCount=_self.mdhdCount+1;
                  if(_self.mdhdCount == 2){
                    _self.disStoreActivityMap.disStoreActivityListMap.push(_self.yiWeiZhi.weiizhiDisStoreActivityMap);
                    _self.disStoreActivityMap.disStoreActivityListMap.push(_self.yiWeiZhi.yizhiDisStoreActivityMap);
                  }
                  _self.jdhdCount=_self.jdhdCount+1;
                  if(_self.jdhdCount == 2){
                    _self.disContendStoreActivitMap.disContendStoreActivityListMap.push(_self.yiWeiZhi.weiizhiDisStoreActivityMap);
                    _self.disContendStoreActivitMap.disContendStoreActivityListMap.push(_self.yiWeiZhi.yizhiDisStoreActivityMap);
                  }
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 6){
                    _self.loading=false;_self.changeTab(2);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });
            //查询门店/竞店距离(收货地址-有地址/没有地址)
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getDisStoreAddressYizhiWeizhi",
              dataType: "json",
              success: function(data) {
                console.log(data,"获取距离标签(有地址/没有地址)。。。。。。。。。。。。。。");
                if(data.weiizhiDisStoreAddressMap){
                  _self.yiWeiZhi.weiizhiDisStoreAddressMap =data.weiizhiDisStoreAddressMap;
                  _self.yiWeiZhi.yizhiDisStoreAddressMap=data.yizhiDisStoreAddressMap;
                  _self.mdjlCount=_self.mdjlCount+1;
                  if(_self.mdjlCount == 2){
                    _self.disStoreAddressMap.disStoreAddressListMap.push(_self.yiWeiZhi.weiizhiDisStoreAddressMap);
                    _self.disStoreAddressMap.disStoreAddressListMap.push(_self.yiWeiZhi.yizhiDisStoreAddressMap);
                  }
                  _self.jdjlCount=_self.jdjlCount+1;
                  if(_self.jdjlCount == 2){
                    _self.disContendStoreAddressMap.disContendStoreAddressListMap.push(_self.yiWeiZhi.weiizhiDisStoreAddressMap);
                    _self.disContendStoreAddressMap.disContendStoreAddressListMap.push(_self.yiWeiZhi.yizhiDisStoreAddressMap);
                  }
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 6){
                    _self.loading=false;_self.changeTab(2);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });


          }, 10)
        },
        getHealthLabelClick:function(){
          var _self=this;
          _self.loading=true;_self.tagType='getHealth';_self.ldCount=0;
          setTimeout(() => {

            _self.ldCount=0;
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getHealthLabelByGaoxueya",
              dataType: "json",
              success: function(data) {
                console.log(data,"获取健康标签数据高血压");
                if(data.healthLabelMap){
                  _self.healthLabelMapByGaoxueya=data.healthLabelMap;
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 3){
                    _self.loading=false;_self.changeTab(3);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });

            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getHealthLabelByGaoxuezhi",
              dataType: "json",
              success: function(data) {
                console.log(data,"获取健康标签数据高血脂");
                if(data.healthLabelMap){
                  _self.healthLabelMapByGaoxuezhi=data.healthLabelMap;
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 3){
                    _self.loading=false;_self.changeTab(3);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });

            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getHealthLabelByTangniaobing",
              dataType: "json",
              success: function(data) {
                console.log(data,"获取健康标签数据糖尿病");
                if(data.healthLabelMap){
                  _self.healthLabelMapByTangniaobing=data.healthLabelMap;
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 3){
                    _self.loading=false;_self.changeTab(3);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });
          }, 10)
        },
        getCustomLabelClick:function(){
          var _self=this;
          _self.loading=true;_self.tagType='getCustom';_self.ldCount=0;
          setTimeout(() => {
            _self.ldCount=0;
            $.ajax({
              type: "post",
              url: "/merchant/labelsecond/getCustomLabel",
              dataType: "json",
              success: function(data) {
                console.log(data,"获取自定义标签");
                if(data.customLabelListMap){
                  _self.customLabelListMap=data.customLabelListMap;
                  _self.ldCount=_self.ldCount+1;
                  if(_self.ldCount == 1){
                    _self.loading=false;_self.changeTab(4);
                  }
                }
              },
              error: function() {
                console.log("请求失败！");
              }
            });

          }, 10)
        },
        //会员标签 选中市
        checkAll: function (event, itemName) {
          var _self=this;
          var e = event.currentTarget;
          var aa = document.getElementsByName(itemName);
          for (var i = 0; i < aa.length; i++) {
            aa[i].checked = e.checked;
          }
          //check样式完毕，开始计算人数
          _self.region=[];
          $(".base_label .region .label_different .region_alls .region_only input").each(function () {
            if($(this).is(':checked')){
              console.log("勾选市");
              _self.region.push($(this).attr("showLabel"));
              //选中该市下面所有的区的regionid
              $(this).parent().parent().parent().find(".region_msg").find("label").each(function () {
                _self.Params.area.push($(this).attr("region_id"));
              })
            }
            else{
              $(this).parent().parent().parent().find(".region_msg").find("label").each(function () {
                if($(this).find("input").is(':checked')){
                  console.log("勾选区");
                  _self.region.push($(this).attr("showLabel"));
                  _self.Params.area.push($(this).attr("region_id"));
                }
                else{
                  //取消选择
                  for(var i=0;i<_self.Params.area.length;i++){
                    if(_self.Params.area[i]==$(this).attr("region_id")){
                      _self.Params.area.splice(i,1);
                    }
                  }
                }//else end
              })
            }
          })
          //清除普通区域包含的内
          for(var i=0;i<_self.Params.area.length;i++){
            if(_self.Params.area[i]=='已知区域'||_self.Params.area[i]=='未知区域'){
              _self.Params.area.splice(i,1);
            }
          }
          var tempRegion=[];
          for(var i=0;i<_self.region.length;i++){
            if(_self.region[i]!='已知区域' && _self.region[i]!='未知区域'){
              tempRegion.push(_self.region[i]);
            }
          }
          _self.region=tempRegion;
          //和原数据拼合
          for(var i=0;i<_self.ParamsAreaW.length;i++){
            _self.Params.area.push(_self.ParamsAreaW[i]);
          }
          for(var i=0;i<_self.regionW.length;i++){
            _self.region.unshift(_self.regionW[i]);
          }

          //剔除重复数据
          _self.Params.area=_self.unique(_self.Params.area);
          _self.region=_self.unique(_self.region);
          _self.getLabelCount();
        },
        //会员标签 选中区
        checkItem: function (event, allName, index) {
          var _self=this;
          var e = event.currentTarget;
          var all = document.getElementsByName(allName)[0];
          if (!e.checked) {
            $("." + "select_all_btn" + index).attr("checked", false);
            $('.select_all_btn').parent().removeClass("checked");

          } else {
            //如果所有区都被选了，市也选上
            var aa = document.getElementsByName(e.name);
            var j=0;
            for (var i = 0; i < aa.length; i++)
              if (aa[i].checked){j++};
            if(j==aa.length){
              $("." + "select_all_btn" + index).attr("checked", true);
              $('.select_all_btn').parent().addClass("checked");
            }


          }
          //check样式完毕，开始计算人数
          _self.region=[];
          $(".base_label .region .label_different .region_alls .region_only input").each(function () {
            if($(this).is(':checked')){
              console.log("勾选市");
              _self.region.push($(this).attr("showLabel"));
              //选中该市下面所有的区的regionid
              $(this).parent().parent().parent().find(".region_msg").find("label").each(function () {
                _self.Params.area.push($(this).attr("region_id"));
              })
            }
            else{
              $(this).parent().parent().parent().find(".region_msg").find("label").each(function () {
                if($(this).find("input").is(':checked')){
                  console.log("勾选区");
                  _self.region.push($(this).attr("showLabel"));
                  _self.Params.area.push($(this).attr("region_id"));
                }
                else{
                  //取消选择
                  for(var i=0;i<_self.Params.area.length;i++){
                    if(_self.Params.area[i]==$(this).attr("region_id")){
                      _self.Params.area.splice(i,1);
                    }
                  }
                }//else end
              })
            }
          })
          //清除普通区域包含的内
          for(var i=0;i<_self.Params.area.length;i++){
            if(_self.Params.area[i]=='已知区域'||_self.Params.area[i]=='未知区域'){
              _self.Params.area.splice(i,1);
            }
          }
          var tempRegion=[];
          for(var i=0;i<_self.region.length;i++){
            if(_self.region[i]!='已知区域' && _self.region[i]!='未知区域'){
              tempRegion.push(_self.region[i]);
            }
          }
          _self.region=tempRegion;
          //和原数据拼合
          for(var i=0;i<_self.ParamsAreaW.length;i++){
            _self.Params.area.push(_self.ParamsAreaW[i]);
          }
          for(var i=0;i<_self.regionW.length;i++){
            _self.region.unshift(_self.regionW[i]);
          }

          //剔除重复数据
          _self.Params.area=_self.unique(_self.Params.area);
          _self.region=_self.unique(_self.region);
          _self.getLabelCount();
        },
        // checkbeforeSubmits(type,lbName,lbType,id){//多个分组检测人数
        //   CheckbeforeSubmit(type,lbName,lbType,id);
        // },
        //会员标签 切换tab
        changeTab:function(index){
          $("#returnVisitMembersByTagNav .nav li").each(function () {
            if($(this).attr("val")==index){
              $(this).addClass("active");
            }
            else{
              $(this).removeClass("active");
            }
          });
          $("#returnVisitMembersByTagNav .all_labels .show").each(function () {
            if($(this).attr("val")==index){
              $(this).show();
            }
            else{
              $(this).hide();
            }
          })
        },
        //会员标签 删除重复区
        unique:function(arr){
      var tmp = new Array();

      for(var m in arr){
        tmp[arr[m]]=1;
      }
      var tmparr = new Array();

      for(var n in tmp){
        tmparr.push(n);
      }
      return tmparr;
    },
        //会员标签 左边选中
        clickTagItem: function (event, type) {
          var _self=this;
          var e = event.currentTarget;
          var showLabel=$(e).attr("showLabel");
          var labelattribute=$(e).attr("labelattribute");
          if(type=='sex'){
              if($(e).hasClass("active")){
                  if(_self.sex.indexOf(showLabel)>=0){
                    _self.sex.splice(_self.sex.indexOf(showLabel),1);
                  }
              }
              else{
                _self.sex.push(showLabel);
              }
              _self.Params.sex=_self.sex;
          }
          if(type=='age'){
            if($(e).hasClass("active")){
              if(_self.age.indexOf(showLabel)>=0){
                _self.age.splice(_self.age.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.age.length;i++){
                  if(_self.Params.age[i]==labelattribute){
                    _self.Params.age.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.age.push(showLabel);
              _self.Params.age.push(labelattribute);
            }

          }
          if(type=='birthday'){
            var showAttr=$(e).attr("showlbAttr");
            if($(e).hasClass("active")){
              if(_self.birthday.indexOf(showLabel)>=0){
                _self.birthday.splice(_self.birthday.indexOf(showLabel),1);
                _self.Params.birthday.splice(_self.Params.birthday.indexOf(showAttr),1);
              }
            }
            else{
              _self.birthday.push(showLabel);
              _self.Params.birthday.push(showAttr);
            }
          }
          if(type=='constellation'){
            if($(e).hasClass("active")){
              if(_self.constellation.indexOf(showLabel)>=0){
                _self.constellation.splice(_self.constellation.indexOf(showLabel),1);
              }
            }
            else{
              _self.constellation.push(showLabel);
            }
            _self.Params.xingzuo=_self.constellation;
          }
          if(type=='zodiac'){
            if($(e).hasClass("active")){
              if(_self.zodiac.indexOf(showLabel)>=0){
                _self.zodiac.splice(_self.zodiac.indexOf(showLabel),1);
              }
            }
            else{
              _self.zodiac.push(showLabel);
            }
            _self.Params.shengxiao=_self.zodiac;
          }
          if(type=='register'){
            if($(e).hasClass("active")){
              if(_self.registration.indexOf(showLabel)>=0){
                _self.registration.splice(_self.registration.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.register.length;i++){
                  if(_self.Params.register[i]==labelattribute){
                    _self.Params.register.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.registration.push(showLabel);
              _self.Params.register.push(labelattribute);
            }

          }
          if(type=='regionW'){
            var _self=this;
            //var e = event.currentTarget;
            //区域（已知未知）
            _self.regionW=[];_self.ParamsAreaW=[];
            $(".base_label .region .label_different .region_weizhi .region_only input").each(function () {
              if($(this).is(':checked')){
                _self.regionW.push($(this).parent().attr("showLabel"));
                _self.ParamsAreaW.push($(this).parent().attr("region_id"));
              }
              else{
                //取消选择
                for(var i=0;i<_self.ParamsAreaW.length;i++){
                  if(_self.ParamsAreaW[i]==$(this).parent().attr("region_id")){
                    _self.ParamsAreaW.splice(i,1);
                  }
                }

                for(var i=0;i<_self.regionW.length;i++){
                  if(_self.regionW[i]==$(this).parent().attr("showLabel")){
                    _self.regionW.splice(i,1);
                  }
                }
              }//else end
            })
            //清除普通区域包含的内
            for(var i=0;i<_self.Params.area.length;i++){
              if(_self.Params.area[i]=='已知区域'||_self.Params.area[i]=='未知区域'){
                _self.Params.area.splice(i,1);
              }
            }
            var tempRegion=[];
            for(var i=0;i<_self.region.length;i++){
              if(_self.region[i]!='已知区域' && _self.region[i]!='未知区域'){
                tempRegion.push(_self.region[i]);
              }
            }
            _self.region=tempRegion;
            //和原数据拼合
            for(var i=0;i<_self.ParamsAreaW.length;i++){
              _self.Params.area.push(_self.ParamsAreaW[i]);
            }
            for(var i=0;i<_self.regionW.length;i++){
              _self.region.unshift(_self.regionW[i]);
            }
            //剔除重复数据
            _self.Params.area=_self.unique(_self.Params.area);
            _self.region=_self.unique(_self.region);
          }
          if(type=='region'){
            //区域未做（普通）
            //见 checkItem 和checkAll
          }
          if(type=='bargain_money'){
            if($(e).hasClass("active")){
              if(_self.bargain_money.indexOf(showLabel)>=0){
                _self.bargain_money.splice(_self.bargain_money.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.bargainMoney.length;i++){
                  if(_self.Params.bargainMoney[i]==labelattribute){
                    _self.Params.bargainMoney.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.bargain_money.push(showLabel);
              _self.Params.bargainMoney.push(labelattribute);
            }

          }
          if(type=='bargain_count'){
            if($(e).hasClass("active")){
              if(_self.bargain_count.indexOf(showLabel)>=0){
                _self.bargain_count.splice(_self.bargain_count.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.bargainCount.length;i++){
                  if(_self.Params.bargainCount[i]==labelattribute){
                    _self.Params.bargainCount.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.bargain_count.push(showLabel);
              _self.Params.bargainCount.push(labelattribute);
            }

          }
          if(type=='pre_transaction'){
            if($(e).hasClass("active")){
              if(_self.pre_transaction.indexOf(showLabel)>=0){
                _self.pre_transaction.splice(_self.pre_transaction.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.preTransaction.length;i++){
                  if(_self.Params.preTransaction[i]==labelattribute){
                    _self.Params.preTransaction.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.pre_transaction.push(showLabel);
              _self.Params.preTransaction.push(labelattribute);
            }

          }
          if(type=='refund_probability'){
            if($(e).hasClass("active")){
              if(_self.refund_probability.indexOf(showLabel)>=0){
                _self.refund_probability.splice(_self.refund_probability.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.refundProbability.length;i++){
                  if(_self.Params.refundProbability[i]==labelattribute){
                    _self.Params.refundProbability.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.refund_probability.push(showLabel);
              _self.Params.refundProbability.push(labelattribute);
            }

          }
          if(type=='ever_buy'){
            if($(e).hasClass("active")){
              if(_self.ever_buy.indexOf(showLabel)>=0){
                _self.ever_buy.splice(_self.ever_buy.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.everBuy.length;i++){
                  if(_self.Params.everBuy[i]==labelattribute){
                    _self.Params.everBuy.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.ever_buy.push(showLabel);
              _self.Params.everBuy.push(labelattribute);
            }

          }
          if(type=='buy_period'){
            if($(e).hasClass("active")){
              if(_self.buy_period.indexOf(showLabel)>=0){
                _self.buy_period.splice(_self.buy_period.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.buyPeriod.length;i++){
                  if(_self.Params.buyPeriod[i]==labelattribute){
                    _self.Params.buyPeriod.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.buy_period.push(showLabel);
              _self.Params.buyPeriod.push(labelattribute);
            }

          }
          if(type=='add_integral'){
            if($(e).hasClass("active")){
              if(_self.add_integral.indexOf(showLabel)>=0){
                _self.add_integral.splice(_self.add_integral.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.addIntegral.length;i++){
                  if(_self.Params.addIntegral[i]==labelattribute){
                    _self.Params.addIntegral.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.add_integral.push(showLabel);
              _self.Params.addIntegral.push(labelattribute);
            }

          }
          if(type=='consume_integral'){
            if($(e).hasClass("active")){
              if(_self.consume_integral.indexOf(showLabel)>=0){
                _self.consume_integral.splice(_self.consume_integral.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.consumeIntegral.length;i++){
                  if(_self.Params.consumeIntegral[i]==labelattribute){
                    _self.Params.consumeIntegral.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.consume_integral.push(showLabel);
              _self.Params.consumeIntegral.push(labelattribute);
            }

          }
          if(type=='residue_integral'){
            if($(e).hasClass("active")){
              if(_self.residue_integral.indexOf(showLabel)>=0){
                _self.residue_integral.splice(_self.residue_integral.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.residueIntegral.length;i++){
                  if(_self.Params.residueIntegral[i]==labelattribute){
                    _self.Params.residueIntegral.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.residue_integral.push(showLabel);
              _self.Params.residueIntegral.push(labelattribute);
            }

          }
          if(type=='dis_store_activity'){
            if($(e).hasClass("active")){
              if(_self.dis_store_activity.indexOf(showLabel)>=0){
                _self.dis_store_activity.splice(_self.dis_store_activity.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.disStoreActivity.length;i++){
                  if(_self.Params.disStoreActivity[i]==labelattribute){
                    _self.Params.disStoreActivity.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.dis_store_activity.push(showLabel);
              _self.Params.disStoreActivity.push(labelattribute);
            }

          }
          if(type=='dis_store_address'){
            if($(e).hasClass("active")){
              if(_self.dis_store_address.indexOf(showLabel)>=0){
                _self.dis_store_address.splice(_self.dis_store_address.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.disStoreAddress.length;i++){
                  if(_self.Params.disStoreAddress[i]==labelattribute){
                    _self.Params.disStoreAddress.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.dis_store_address.push(showLabel);
              _self.Params.disStoreAddress.push(labelattribute);
            }

          }
          if(type=='dis_contend_store_activity'){
            if($(e).hasClass("active")){
              if(_self.dis_contend_store_activity.indexOf(showLabel)>=0){
                _self.dis_contend_store_activity.splice(_self.dis_contend_store_activity.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.disContendStoreActivity.length;i++){
                  if(_self.Params.disContendStoreActivity[i]==labelattribute){
                    _self.Params.disContendStoreActivity.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.dis_contend_store_activity.push(showLabel);
              _self.Params.disContendStoreActivity.push(labelattribute);
            }

          }
          if(type=='dis_contend_store_address'){
            if($(e).hasClass("active")){
              if(_self.dis_contend_store_address.indexOf(showLabel)>=0){
                _self.dis_contend_store_address.splice(_self.dis_contend_store_address.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.disContendStoreAddress.length;i++){
                  if(_self.Params.disContendStoreAddress[i]==labelattribute){
                    _self.Params.disContendStoreAddress.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.dis_contend_store_address.push(showLabel);
              _self.Params.disContendStoreAddress.push(labelattribute);
            }

          }
          if(type=='diabetes_label'){
            if($(e).hasClass("active")){
              if(_self.diabetes_label.indexOf(showLabel)>=0){
                _self.diabetes_label.splice(_self.diabetes_label.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.healthTangNiaoBing.length;i++){
                  if(_self.Params.healthTangNiaoBing[i]==labelattribute){
                    _self.Params.healthTangNiaoBing.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.diabetes_label.push(showLabel);
              _self.Params.healthTangNiaoBing.push(labelattribute);
            }

          }
          if(type=='hypertension_label'){
            if($(e).hasClass("active")){
              if(_self.hypertension_label.indexOf(showLabel)>=0){
                _self.hypertension_label.splice(_self.hypertension_label.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.healthGaoXueZhi.length;i++){
                  if(_self.Params.healthGaoXueZhi[i]==labelattribute){
                    _self.Params.healthGaoXueZhi.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.hypertension_label.push(showLabel);
              _self.Params.healthGaoXueZhi.push(labelattribute);
            }

          }
          if(type=='hyperlipidemia_label'){
            if($(e).hasClass("active")){
              if(_self.hyperlipidemia_label.indexOf(showLabel)>=0){
                _self.hyperlipidemia_label.splice(_self.hyperlipidemia_label.indexOf(showLabel),1);
                for(var i=0;i<_self.Params.healthGaoXueYa.length;i++){
                  if(_self.Params.healthGaoXueYa[i]==labelattribute){
                    _self.Params.healthGaoXueYa.splice(i,1);
                  }
                }
              }
            }
            else{
              _self.hyperlipidemia_label.push(showLabel);
              _self.Params.healthGaoXueYa.push(labelattribute);
            }

          }
          if(type=='custom_label'){
            if($(e).hasClass("active")){
              if(_self.custom_label.indexOf(showLabel)>=0){
                _self.custom_label.splice(_self.custom_label.indexOf(showLabel),1);
              }
            }
            else{
              _self.custom_label.push(showLabel);
            }
            _self.Params.custom=_self.custom_label;
          }
          //重新计算人数
          _self.getLabelCount();
        },

        //会员标签右边打叉 删除
        removeVisitMembersTag:function(event, type){
          var _self=this;
          var e = event.currentTarget;
          var deletelabel=$(e).attr("deletelabel");
          if(type=='sex'){
            _self.sex.splice($.inArray(deletelabel,_self.sex),1);
            $(".base_label .sex .label_different span").each(function () {
              if($(this).attr("labelattribute")==deletelabel){
                $(this).removeClass("active");
              }
            })
            _self.Params.sex=_self.sex;
          }
          if(type=='age'){
            _self.age.splice($.inArray(deletelabel,_self.age),1);
            $(".base_label .age .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.age.length;i++){
                  if(_self.Params.age[i]==$(this).attr("labelattribute")){
                    _self.Params.age.splice(i,1);
                  }
                }
              }

            })
          }
          if(type=='birthday'){
            _self.birthday.splice($.inArray(deletelabel,_self.birthday),1);
            $(".base_label .birthday .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.birthday.length;i++){

                  if(_self.Params.birthday[i]==$(this).attr("showlbAttr")){
                    _self.Params.birthday.splice(i,1);
                  }

                }
              }
            })

          }
          if(type=='constellation'){
            _self.constellation.splice($.inArray(deletelabel,_self.constellation),1);
            $(".base_label .constellation .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
              }
            })
            _self.Params.xingzuo=_self.constellation;
          }
          if(type=='zodiac'){
            _self.zodiac.splice($.inArray(deletelabel,_self.zodiac),1);
            $(".base_label .zodiac .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
              }
            })
            _self.Params.shengxiao=_self.zodiac;
          }
          if(type=='register'){
            _self.registration.splice($.inArray(deletelabel,_self.registration),1);
            $(".base_label .registration .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.register.length;i++){
                  if(_self.Params.register[i]==$(this).attr("labelattribute")){
                    _self.Params.register.splice(i,1);
                  }
                }
              }
            })

          }
          if(type=='region'){
            _self.region.splice($.inArray(deletelabel,_self.region),1);
            _self.Params.area.splice($.inArray(deletelabel,_self.region),1);
            $(".base_label .region .label_different .region_alls .region_only label").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                //取消市（右侧已选标签）
                $(this).parent().parent().find("input").attr("checked",false);
                //取消该市下面所有的区的regionid
                $(this).parent().parent().find(".region_msg").find("label").each(function () {
                  for(var i=0;i<_self.Params.area.length;i++){
                    if(_self.Params.area[i]==$(this).attr("region_id")){
                      _self.Params.area.splice(i,1);
                    }
                  }
                })
              }
              else{
                $(this).parent().parent().find(".region_msg").find("label").each(function () {
                  //取消区（右侧已选标签）
                  if($(this).attr("showlabel")==deletelabel){
                    $(this).find("input").attr("checked",false);
                    for(var i=0;i<_self.Params.area.length;i++){
                      if(_self.Params.area[i]==$(this).attr("region_id")){
                        _self.Params.area.splice(i,1);
                      }
                    }
                  }
                })
              }

            })
            //剔除重复数据
            _self.Params.area=_self.unique(_self.Params.area);
          }
          if(type=='bargain_money'){
            _self.bargain_money.splice($.inArray(deletelabel,_self.bargain_money),1);
            $(".transaction .bargain_money .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.bargainMoney.length;i++){
                  if(_self.Params.bargainMoney[i]==$(this).attr("labelattribute")){
                    _self.Params.bargainMoney.splice(i,1);
                  }
                }
              }
            })
          }
          if(type=='bargain_count'){
            _self.bargain_count.splice($.inArray(deletelabel,_self.bargain_count),1);
            $(".transaction .bargain_count .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.bargainCount.length;i++){
                  if(_self.Params.bargainCount[i]==$(this).attr("labelattribute")){
                    _self.Params.bargainCount.splice(i,1);
                  }
                }
              }
            })
          }
          if(type=='pre_transaction'){
            _self.pre_transaction.splice($.inArray(deletelabel,_self.pre_transaction),1);
            $(".transaction .pre_transaction .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.preTransaction.length;i++){
                  if(_self.Params.preTransaction[i]==$(this).attr("labelattribute")){
                    _self.Params.preTransaction.splice(i,1);
                  }
                }
              }
            })
          }
          if(type=='refund_probability'){
            _self.refund_probability.splice($.inArray(deletelabel,_self.refund_probability),1);
            $(".transaction .refund_probability .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.refundProbability.length;i++){
                  if(_self.Params.refundProbability[i]==$(this).attr("labelattribute")){
                    _self.Params.refundProbability.splice(i,1);
                  }
                }
              }
            })
          }
          if(type=='ever_buy'){
            _self.ever_buy.splice($.inArray(deletelabel,_self.ever_buy),1);
            $(".transaction .ever_buy .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.everBuy.length;i++){
                  if(_self.Params.everBuy[i]==$(this).attr("labelattribute")){
                    _self.Params.everBuy.splice(i,1);
                  }
                }
              }
            })

          }
          if(type=='buy_period'){
            _self.buy_period.splice($.inArray(deletelabel,_self.buy_period),1);
            $(".transaction .buy_period .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.buyPeriod.length;i++){
                  if(_self.Params.buyPeriod[i]==$(this).attr("labelattribute")){
                    _self.Params.buyPeriod.splice(i,1);
                  }
                }
              }
            })
          }
          if(type=='add_integral'){
            _self.add_integral.splice($.inArray(deletelabel,_self.add_integral),1);
            $(".transaction .add_integral .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.addIntegral.length;i++){
                  if(_self.Params.addIntegral[i]==$(this).attr("labelattribute")){
                    _self.Params.addIntegral.splice(i,1);
                  }
                }
              }
            })
          }
          if(type=='consume_integral'){
            _self.consume_integral.splice($.inArray(deletelabel,_self.consume_integral),1);
            $(".transaction .consume_integral .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.consumeIntegral.length;i++){
                  if(_self.Params.consumeIntegral[i]==$(this).attr("labelattribute")){
                    _self.Params.consumeIntegral.splice(i,1);
                  }
                }

              }
            })
          }
          if(type=='residue_integral'){
            _self.residue_integral.splice($.inArray(deletelabel,_self.residue_integral),1);
            $(".transaction .residue_integral .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.residueIntegral.length;i++){
                  if(_self.Params.residueIntegral[i]==$(this).attr("labelattribute")){
                    _self.Params.residueIntegral.splice(i,1);
                  }
                }
              }
            })

          }
          if(type=='dis_store_activity'){
            _self.dis_store_activity.splice($.inArray(deletelabel,_self.dis_store_activity),1);
            $(".distance .dis_store_activity .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.disStoreActivity.length;i++){
                  if(_self.Params.disStoreActivity[i]==$(this).attr("labelattribute")){
                    _self.Params.disStoreActivity.splice(i,1);
                  }
                }
              }
            })

          }
          if(type=='dis_store_address'){
            _self.dis_store_address.splice($.inArray(deletelabel,_self.dis_store_address),1);
            $(".distance .dis_store_address .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.disStoreAddress.length;i++){
                  if(_self.Params.disStoreAddress[i]==$(this).attr("labelattribute")){
                    _self.Params.disStoreAddress.splice(i,1);
                  }
                }
              }
            })

          }
          if(type=='dis_contend_store_activity'){
            _self.dis_contend_store_activity.splice($.inArray(deletelabel,_self.dis_contend_store_activity),1);
            $(".distance .dis_contend_store_activity .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.disContendStoreActivity.length;i++){
                  if(_self.Params.disContendStoreActivity[i]==$(this).attr("labelattribute")){
                    _self.Params.disContendStoreActivity.splice(i,1);
                  }
                }
              }
            })

          }
          if(type=='dis_contend_store_address'){
            _self.dis_contend_store_address.splice($.inArray(deletelabel,_self.dis_contend_store_address),1);
            $(".distance .dis_contend_store_address .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.disContendStoreAddress.length;i++){
                  if(_self.Params.disContendStoreAddress[i]==$(this).attr("labelattribute")){
                    _self.Params.disContendStoreAddress.splice(i,1);
                  }
                }
              }
            })


          }
          if(type=='diabetes_label'){
            _self.diabetes_label.splice($.inArray(deletelabel,_self.diabetes_label),1);
            $(".health .diabetes_label .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.healthTangNiaoBing.length;i++){
                  if(_self.Params.healthTangNiaoBing[i]==$(this).attr("labelattribute")){
                    _self.Params.healthTangNiaoBing.splice(i,1);
                  }
                }
              }
            })
          }
          if(type=='hypertension_label'){
            _self.hypertension_label.splice($.inArray(deletelabel,_self.hypertension_label),1);
            $(".health .hypertension_label .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.healthGaoXueZhi.length;i++){
                  if(_self.Params.healthGaoXueZhi[i]==$(this).attr("labelattribute")){
                    _self.Params.healthGaoXueZhi.splice(i,1);
                  }
                }
              }
            })
          }
          if(type=='hyperlipidemia_label'){
            _self.hyperlipidemia_label.splice($.inArray(deletelabel,_self.hyperlipidemia_label),1);
            $(".health .hyperlipidemia_label .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.healthGaoXueYa.length;i++){
                  if(_self.Params.healthGaoXueYa[i]==$(this).attr("labelattribute")){
                    _self.Params.healthGaoXueYa.splice(i,1);
                  }
                }
              }
            })
          }
          if(type=='custom_label'){
            _self.custom_label.splice($.inArray(deletelabel,_self.custom_label),1);
            $(".custom .custom_label .label_different span").each(function () {
              if($(this).attr("showlabel")==deletelabel){
                $(this).removeClass("active");
                for(var i=0;i<_self.Params.custom.length;i++){
                  if(_self.Params.custom[i]==$(this).attr("labelattribute")){
                    _self.Params.custom.splice(i,1);
                  }
                }
              }
            })
            _self.Params.custom=_self.custom_label;
          }


          //重新计算人数
          _self.getLabelCount();
        },



        //获取会员分组列表
        selectAllMemberLabel:function(currentPage){
          //check按钮
          $("#selectReturnVisitMembers2 input").attr("checked", true);
          //读取会员列表
          var _self=this;
          var pageSize = 6;
          if(isNaN(currentPage)){currentPage=''}
          $.ajax({
            type: "post",
            url: "/merchant/labelsecond/selectAllMemberLabel",
            data: {
              "crowdName": $("#label_name").val(),
              "page" : currentPage,
              "pageSize" : pageSize,
            },
            dataType: "json",
          }).then(function (result) {
            if(result.status== 0) {
              _self.memberList=[];
              console.log(result, "data标签组合列表");
              _self.memberList = result.allLabel.list;

              // ----分页-----
              if(result.allLabel.list.length > 0){
                pagination_pages = result.allLabel.pages;
                pagination_totals = result.allLabel.total;
                _self.addpage(result.allLabel.pageNum, result.allLabel.total, pageSize);
                $(".noData").remove();
                //check 回显
                if(_self.visitMembersGroup && _self.visitMembersGroup.length>0){
                  setTimeout(function(){
                  for(var i=0; i<_self.visitMembersGroup.length;i++){
                    $(".label_content #fund_table .groupChkbox input").each(function () {
                      if( $(this).parent().attr('showName')==_self.visitMembersGroup[i]){
                        $(this).attr("checked", true);
                      }
                    })
                  }//for end
                  },300);


                }


              }else{
                pagination_pages = 1;
                pagination_totals = 0;
                itemsCount = 0;
                if($("tr").hasClass('noData')){}
                else{
                  $("tbody").append("<tr class='noData'><td colspan='6' style='text-align: center'>暂无数据</td></tr>");
                }

              }

            }
          });
          // 手动打开弹窗
          var classStr = $("#returnVisitMembersByGroup").attr("class");
          if('sui-modal hide fade' == classStr) {
            $("#returnVisitMembersByGroup").attr({class:'sui-modal show fade'});
          }
        },

        //选择回访会员 按标签选择-提交
        submitVisitMembersByTag:function(){
          var _self=this;
          //check按钮切换到当前选项
          $(".selectReturnVisitMembers input").each(function () {
            if($(this).attr("id")=='selectReturnVisitMembers1'){
              $(this).attr("checked", true);
              $(this).parent().addClass("checked");
            }
            else{
              $(this).attr("checked", false);
              $(this).parent().removeClass("checked");
            }
          });
          //传值
          $.ajax({
            type: "post",
            url: "/merchant/labelsecond/getMemberIdsToInsert",
            dataType: "json",
            data:{
              labelParams: JSON.stringify(_self.Params),
            },
            success: function(data) {
              //console.log(data,"选择回访会员 按标签选择 返回id");
              if(data.status==0){
                _self.memberIds=data.memberIds;
                _self.infoForVisit();

              }
              else if(data.status==-1){
                console.log(data.msg);
              }
              else{
                console.log("查询人数失败");
              }

            },
            error: function() {
              console.log("请求失败！");
            }
          });
        },
        //选择回访会员 按分组选择-提交
        submitVisitMembersByGroup:function(){
          var _self=this;
          //check按钮切换到当前选项
          $(".selectReturnVisitMembers input").each(function () {
            if($(this).attr("id")=='selectReturnVisitMembers2'){
              $(this).attr("checked", true);
              $(this).parent().addClass("checked");
            }
            else{
              $(this).attr("checked", false);
              $(this).parent().removeClass("checked");
            }
          });
          //传值
          $.ajax({
            type: "post",
            url: "/merchant/labelsecond/getMemberIdForVisitByPeopleIds",
            dataType: "json",
            data:{
              labelNames: _self.visitMembersGroup.toString(),
            },
            success: function(data) {
              //console.log(data,"选择回访会员 按分组选择 返回id");
              if(data.status==0){
                _self.memberIds=data.memberIds;
                _self.infoForVisit();
              }
              else if(data.status==-1){

                console.log(data.msg);
              }
              else{
                console.log("查询人数失败");
              }

            },
            error: function() {
              console.log("请求失败！");
            }
          });
        },
        //会员分组 列表 展示缩略
        countLi:function (val,index) {
          var len=0;
          var jsonStrCut=[];
          if (val && val.length > 0) {
            var jsonStr= JSON.parse(val);
            for(var i in jsonStr){
              //处理未知字样
              var temp=jsonStr[i];

              if((i=='sex'||i=='age'||i=='birthday') && temp.length>0){
                for(var j=0;j<temp.length;j++){
                  if(temp[j]=='未知'){
                    switch (i){
                      case 'sex':
                        temp[j]='性别未知';
                        break;
                      case 'age':
                        temp[j]='年龄未知';
                        break;
                      case 'birthday':
                        temp[j]='生日未知';
                        break;
                      default:
                        break;
                    }

                  }
                }
                for(var j=0;j<temp.length;j++){
                  if(temp[j]=='已知'){
                    switch (i){
                      case 'age':
                        temp[j]='年龄已知';
                        break;
                      case 'birthday':
                        temp[j]='生日已知';
                        break;
                      default:
                        break;
                    }

                  }
                }
                jsonStr[i]=temp;
              }
              if((i=='disStoreActivity'||i=='disStoreAddress'||i=='disContendStoreActivity'||i=='disContendStoreAddress'||i=='healthGaoXueYa'||i=='healthGaoXueZhi'||i=='healthTangNiaoBing') && temp.length>0){
                for(var j=0;j<temp.length;j++){
                  switch (i){
                    case 'disStoreActivity':
                      temp[j]='门店距离（高频活动）'+temp[j];
                      break;
                    case 'disStoreAddress':
                      temp[j]='门店距离（收货地址）'+temp[j];
                      break;
                    case 'disContendStoreActivity':
                      temp[j]='竞店距离（高频活动）'+temp[j];
                      break;
                    case 'disContendStoreAddress':
                      temp[j]='竞店距离（收货地址）'+temp[j];
                      break;
                    case 'healthGaoXueYa':
                      temp[j]='高血压'+temp[j];
                      break;
                    case 'healthGaoXueZhi':
                      temp[j]='高血脂'+temp[j];
                      break;
                    case 'healthTangNiaoBing':
                      temp[j]='糖尿病'+temp[j];
                      break;
                    default:
                      break;
                  }
                }
                jsonStr[i]=temp;
              }

            }
            //处理字样end

            for(var i in jsonStr){
              if(len<3 && jsonStr[i].length){
                jsonStrCut.push(jsonStr[i]);
              }
              len+=jsonStr[i].length;
              if(len>3){
                break;
              }
            }
            if(len>3){
              this.cutCountLi(jsonStrCut,index);
            }
            return len;

          }// if end
        },
        //大于三个的，剪切
        cutCountLi:function(arr,index) {
          var _self=this;
          if (_self.index.indexOf(index) < 0) {
            var arr2 = (arr + '').split(',');//将数组转字符串后再以逗号分隔转为数组
            arr2 = arr2.splice(0, 3);
            arr2.push("……");
            _self.showTags[index] = arr2;
            _self.index.push(index);
          }
        },
        // 数据转换
        changeJson: function (val) {
          if (val && val.length > 0) {
            return $.parseJSON(val);
          }
        },
        //会员分组翻页
        addpage: function(currentPage, total, pageSize) {
          var _self=this;
          $('#pageinfo').pagination({
            itemsCount: currentPage,
            pageSize: pageSize,
            styleClass: ['pagination-large'],
            showCtrl: true,
            displayPage: 10,
            currentPage: currentPage,
            onSelect: function (num) {
              _self.selectAllMemberLabel(num);
            }
          });

          $('#pageinfo').pagination('updateItemsCount', total, currentPage);
          $('#pageinfo').find('span:contains(共)').append("(" +  total + "条记录)");
        },

        infoForVisit:function () {
          var _self = this;
          var url="/merchant/promotions/infoForVisit";
          var param={};
          if(_self.goodsIds && _self.memberIds){
            param.goodIds=_self.goodsIds;
            param.userIds=_self.memberIds;
            console.log(param);
            $.ajax({
              type:'POST',
              data:param,
              url:url
            }).then( function (res) {
              console.log(res);
              if(res != null && res.message == "Success"){
                _self.activityInfo = res.value.list;
                _self.returnVisitNum=res.value.total;
                _self.activityGoodsIds=res.value.goodsIds;
                $("#taskNum").val(_self.returnVisitNum);
                var infos=[];
                for(var i in res.value.list){
                  infos.push(res.value.list[i]);
                }
                infos=JSON.stringify(infos);
                _self.activityInfos=infos;
              };
              $(".zhezhao1").hide();
              $(".loading1").hide();
            })
          }


        },
        //会员分组 勾选checkbox
        checkGroupItem: function (event, crowdName) {
          var _self=this;
          var e = event.currentTarget;
          if($(e).is(':checked')){
            _self.visitMembersGroup.push(crowdName);
          }
          else{
            if(_self.visitMembersGroup.indexOf(crowdName)>=0){
              _self.visitMembersGroup.splice(_self.visitMembersGroup.indexOf(crowdName),1);
              $(e).attr("checked", false);
            }

          }
          //重新计算人数
          _self.getGroupCount();
        },
        isEmpty:function (obj) {
          if (obj == null) return true;
          if (obj.length > 0)    return false;
          if (obj.length === 0)  return true;
          for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
          }
          return true;
        },

        //会员分组右边打叉 删除
        removeVisitMembersGroup:function(item){
          var _self=this;
          _self.visitMembersGroup.splice(_self.visitMembersGroup.indexOf(item),1);
          $(".label_content #fund_table .groupChkbox input").each(function () {
              if($(this).is(':checked') && $(this).parent().attr('showName')==item ){
                $(this).attr("checked", false);
              }
          })
          //重新计算人数
          _self.getGroupCount();
        },
        //会员分组 重置
        reserveVisitMembersGroup:function(){
          var _self=this;
          _self.visitMembersGroup=[];
          //当前页面的check取消
          $(".label_content #fund_table .groupChkbox input").each(function () {
            $(this).attr("checked", false);
          })
          //重新计算人数
          _self.getGroupCount();

        },
        //会员标签 重置
        reserveVisitMembersTag:function(){

          var _self=this;
          //清空数值
          _self.sex=[];
          _self.age=[];
          _self.birthday=[];
          _self.constellation=[];
          _self.zodiac=[];
          _self.registration=[];
          _self.region=[];
          _self.regionW=[];
          _self.bargain_money=[];
          _self.bargain_count=[];
          _self.pre_transaction=[];
          _self.refund_probability=[];
          _self.ever_buy=[];
          _self.add_integral=[];
          _self.consume_integral=[];
          _self.residue_integral=[];
          _self.buy_period=[];
          _self.dis_store_activity=[];
          _self.dis_store_address=[];
          _self.dis_contend_store_activity=[];
          _self.dis_contend_store_address=[];
          _self.custom_label=[];
          _self.hyperlipidemia_label=[];
          _self.hypertension_label=[];
          _self.diabetes_label=[];

          _self.ParamsAreaW=[];
          _self.Params={
            sex:[],age:[],birthday:[],xingzuo:[],shengxiao:[],register:[],area:[],bargainMoney:[],
            bargainCount:[],preTransaction:[],refundProbability:[],everBuy:[],buyPeriod:[],addIntegral:[],
            consumeIntegral:[],residueIntegral:[],disStoreActivity:[],disStoreAddress:[],
            disContendStoreActivity:[],disContendStoreAddress:[],healthGaoXueYa:[],healthGaoXueZhi:[],healthTangNiaoBing:[],custom:[],

          };
          //重新计算人数
          _self.getLabelCount();
          //清空左侧
          $(".base_label .sex .label_different span").each(function () {
            $(this).removeClass("active");
          })//性别
          $(".base_label .age .label_different span").each(function () {
            $(this).removeClass("active");
          })//年龄
          $(".base_label .birthday .label_different span").each(function () {
            $(this).removeClass("active");
          })//生日
          $(".base_label .constellation .label_different span").each(function () {
            $(this).removeClass("active");
          })//星座
          $(".base_label .zodiac .label_different span").each(function () {
            $(this).removeClass("active");
          })//生肖
          $(".base_label .registration .label_different span").each(function () {
            $(this).removeClass("active");
          })//注册时间
          $(".base_label .region .label_different .region_weizhi .region_only input").each(function () {
            $(this).attr("checked",false);
          })//所在区域(已知未知)
          $(".base_label .region .label_different .region_alls input").each(function () {
            $(this).attr("checked",false);
          })//所在区域(普通)
          $(".transaction .bargain_money .label_different span").each(function () {
            $(this).removeClass("active");
          })//成交金额
          $(".transaction .bargain_count .label_different span").each(function () {
            $(this).removeClass("active");
          })//成交次数
          $(".transaction .pre_transaction .label_different span").each(function () {
            $(this).removeClass("active");
          })//客单价
          $(".transaction .refund_probability .label_different span").each(function () {
            $(this).removeClass("active");
          })//退款率
          $(".transaction .ever_buy .label_different span").each(function () {
            $(this).removeClass("active");
          })//购买过
          $(".transaction .buy_period .label_different span").each(function () {
            $(this).removeClass("active");
          })//购买周期
          $(".transaction .add_integral .label_different span").each(function () {
            $(this).removeClass("active");
          })//赚取积分
          $(".transaction .consume_integral .label_different span").each(function () {
            $(this).removeClass("active");
          })//消耗积分
          $(".transaction .residue_integral .label_different span").each(function () {
            $(this).removeClass("active");
          })//剩余积分
          $(".distance .dis_store_activity .label_different span").each(function () {
            $(this).removeClass("active");
          })//门店距离（高频活动）
          $(".distance .dis_store_address .label_different span").each(function () {
            $(this).removeClass("active");
          })//门店距离（收货地址）
          $(".distance .dis_contend_store_activity .label_different span").each(function () {
            $(this).removeClass("active");
          })//竞店距离（高频活动）
          $(".distance .dis_contend_store_address .label_different span").each(function () {
            $(this).removeClass("active");
          })//竞店距离（收货地址）
          $(".custom .custom_label .label_different span").each(function () {
            $(this).removeClass("active");
          })//自定义
          $(".health .hypertension_label .label_different span").each(function () {
            $(this).removeClass("active");
          })//高血脂
          $(".health .hyperlipidemia_label .label_different span").each(function () {
            $(this).removeClass("active");
          })//高血压
          $(".health .diabetes_label .label_different span").each(function () {
            $(this).removeClass("active");
          })//糖尿病


        },

        //会员分组 统计人数
        getGroupCount:function(){
          var _self=this;
          $("#groupCcount").html("正在计算中...").css("font-size","14px");
          $.ajax({
            type: "post",
            url: "/merchant/labelsecond/getMemberIdForVisitByPeopleCount",
            dataType: "json",
            data:{
              labelNames: _self.visitMembersGroup.toString(),
            },
            success: function(data) {
//    console.log(data,"实时查询人数");
              if(data.status==0){
                _self.SumPerson=data.count;
                _self.groupCount=data.count;
                _self.labelCount=0;
                $("#groupCount").html(_self.SumPerson+"人");
                $(".number_people2 h5").html("");
              }
              else if(data.status==-1){
                _self.SumPerson=0;
                $("#groupCount").html(_self.SumPerson+"人");
                $(".number_people2 h5").html(data.msg);
              }
              else{
                console.log("查询人数失败");
              }

            },
            error: function() {
              console.log("请求失败！");
            }
          });
        },
        selectImpotent:function () {
          var _self=this;
          var impotent_ids = new Array();
          $('input[name="impotent"]:checked').each(function () {
            impotent_ids.push($(this).val());
          });
          impotent_ids = impotent_ids.join(',');
          _self.impotentIds=impotent_ids;
        },
        //会员标签 统计人数
        getLabelCount:function(){
          var _self=this;
           //console.log(_self.Params,"_self.Params",JSON.stringify(_self.Params),'labelParams实时查询人数');
          $("#labelCount").html("正在计算中...").css("font-size","14px");
          $.ajax({
            type: "post",
            url: "/merchant/labelsecond/getLabelCount",
            dataType: "json",
            data:{
              labelParams: JSON.stringify(_self.Params),
            },
            success: function(data) {
//    console.log(data,"实时查询人数");
              if(data.status==0){
                _self.SumPerson=data.count;
                _self.labelCount=data.count;
                _self.groupCount=0;
                $("#labelCount").html(_self.SumPerson+"人");
                $(".number_people2 h5").html("");
              }
              else if(data.status==-1){
                _self.SumPerson=0;
                $("#labelCount").html(_self.SumPerson+"人");
                $(".number_people2 h5").html(data.msg);
              }
              else{
                console.log("查询人数失败");
              }

            },
            error: function() {
              console.log("请求失败！");
            }
          });
        },


      },



      filters:{
        dateFormat:function (time) {
          core.formatDate()
          return new Date(time).format();
        }
      },
      mounted:function () {
        // this.getClerkVisitList();
        // this.getStoresList();
        this.getActivityInfoList();//加载活动列表
        // this.getActivityInfo();
        // this.allocateTask();//获取门店管理员列表
        // this.getPIGoodsList();
      }

    });
  });



});
