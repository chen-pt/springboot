/**
 * Created by Administrator on 2017/9/28.
 */
 var vm = new Vue({
    el: '#exchangeManage_list',
    data: {
      name:"",
      phone:"",
      // pageNum:1,
      // pageSize:15,
      exchangeManageList:[],
      total: "",     // 记录总条数
      display: 15,   // 每页显示条数
      current: 1,   // 当前的页数
      pagegroup: 5,
      pages:"" ,//总共多少页
      input_current:"",
      // starttime:"",
      // endtime:""
    },
    computed: {
      page: function () { // 总页数
        return Math.ceil(this.total / this.display);
      },
      grouplist: function () { // 获取分页页码
        var len = this.page, temp = [], list = [], count = Math.floor(this.pagegroup/ 2), center = this.current;
        if (len <= this.pagegroup) {
          while (len--) {
            temp.push({text: this.page - len, val: this.page - len});
          }
          ;
          return temp;
        }
        while (len--) {
          temp.push(this.page - len);
        }
        ;
        var idx = temp.indexOf(center);
        (idx < count) && ( center = center + count - idx);
        (this.current > this.page - count) && ( center = this.page - count);
        temp = temp.splice(center - count - 1, this.pagegroup);
        do {
          var t = temp.shift();
          list.push({
            text: t,
            val: t
          });
        } while (temp.length);
        if (this.page > this.pagegroup) {
          (this.current > count + 1) && list.unshift({text: '...', val: list[0].val - 1});
          (this.current < this.page - count) && list.push({text: '...', val: list[list.length - 1].val + 1});
        }
        return list;
      }
    },
    watch: {
      // 如果 display 发生改变，这个函数就会运行
      display: function () {
        this.getData()
      }
    },
    mounted () {
      this.getData();
    },
    created: function () {
      // getExaminationList();
    },
    methods: {
      getData:function () {
        axios.post('/jk51b/exchangeManage/getlist', {
          name: this.name,
          phone: this.phone,
          pageNum:this.current,
          pageSize:this.display,
          starttime:$('#start_time').val(),
          endtime:$('#end_time').val()
        }).then(function (response) {
          // console.log(response)
            // console.log(response.value.list)
            this.exchangeManageList=response.data.value.list
          this.total=response.data.value.total
            this.current=response.data.value.pageNum
          this.pages=response.data.value.pages

          // console.log(this.exchangeManageList)
        }.bind(this))
          .catch(function (response) {

            console.log("error ....")

        });

      },

      setCurrent: function (idx) {
        // console.log(this.page)
        // console.log(idx)
        if (this.current != idx && idx > 0 && idx < this.page + 1) {
          this.current = idx;
          this.getData()
        }
      },

      timeFormate : function (time) {
        var date  = new Date(time).Format("yyyy-MM-dd hh:mm:ss");
        return date;
      },

      changeById : function (id) {
        axios.post('/jk51b/exchangeManage/changeStatus', {
          id:id
        }).then(function (response) {
          this.getData()
        }.bind(this))
          .catch(function (response) {

            console.log("error ....")

          });
      },
      deleteById : function (id) {
        axios.post('/jk51b/exchangeManage/update', {
          id:id
        }).then(function (response) {
          this.getData()
        }.bind(this))
          .catch(function (response) {

            console.log("error ....")

          });
      },


    }
  })




//列表
var curPage = 1;
var totalNum = 0;
var pageSize = 15;


//时间格式化
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
