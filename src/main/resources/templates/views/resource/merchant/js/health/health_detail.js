/**
 * Created by Administrator on 2017/11/24.
 */
var vm = new Vue({
  el: '#health_detail',
  data: {
    healthDetailList:[],
    xindianlist:[],
  },
  mounted:function () {
    // var param = location.search;
      var url = window.location.href;
      var strs = url.split("/");
    // console.log(strs[strs.length-1]);

    var data = {};
    //后台为了和微信区分,改为id
    data.id =strs[strs.length-1];

    $.ajax({
      type:'post',
      data:data,
      url:"/merchant/healthDetailTable",
    }).then( function (res) {

      if(res.message == "Success"){
        // vm.healthDetailList = res.value.list;
        var data1=[];
        for(var i=0;i<res.value.list.length;i++){
          var data=res.value.list[i]
          for(var c=0;c<data.length;c++){
            data1.push(data[c]);
          }
        }

        vm.xindianlist=data1[data1.length-1];
        data1.pop();
        vm.healthDetailList=data1;

      }
    })

  },
  created:function () {

  },
  filters: {
    capitalize: function (value) {
      if (value=="查看详情"){
        return '无'
      }else{
        return value
      }

    }
  },
  computed: {
  },
  methods: {
    print:function () {
      // $("#table").printArea();
      $("#table").jqprint({
        debug: false,
        importCSS: true,
        printContainer: true,
        operaSupport: true
      });
    },
    returnList:function () {
      window.location.href="/merchant/health_list";
    },
    exportExcel:function () {
      $("#table2excel").table2excel({

        // 导出的Excel文档的名称
        name: "Excel Document Name",
        // Excel文件的名称
        filename: "体检报告",
        exclude_img:true,
      });
    }

  },
  watch:{

  },

})
