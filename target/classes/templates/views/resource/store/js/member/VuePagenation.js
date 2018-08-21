/**
 * Created by admin on 2017/11/29.
 */
define(['vue'],function (Vue) {
  var tm = '\<span class="pageinfo">' +
    '<div class="sui-pagination pagination-large">' +
    '<ul>' +
    '<li v-bind:class="[\'prev\',{\'disabled\':page==1}]"><a @click="btnClick(page-1)">«上一页</a></li>' +
    '<li v-bind:class="[{ \'active\': page == 1}]"><a @click="btnClick(1)">1</a></li>'+
    '<li v-bind:class="[\'dotted\',{\'hide\':(pages < displayPage || pageInfo[2] -1<(displayPage-2))}]"><span>...</span></li>'+
    '<template v-for="p in pageInfo">' +
    '<li v-if="p > 0 && pages > 2" v-bind:class="[{ \'active\': page == p, \'hide\':(p==1 || p==pages)}]"><a @click="btnClick(p)">{{p}}</a></li>'+
    '</template>'+
    '<li v-bind:class="[\'dotted\',{\'hide\':(pages < displayPage || pages -page<(displayPage-2))}]"><span>...</span></li>'+
    '<li v-bind:class="[{ \'active\': page == pages,\'hide\':pages == 1}]"><a @click="btnClick(pages)">{{pages}}</a></li>'+
    '<li :class="[\'next\', {\'disabled\':page==pages}]"><a @click="btnClick(parseInt(page)+1)">下一页»</a></li>' +
    '</ul>' +
    '<div>&nbsp;' +
    '<span>&nbsp;' +
    '<select class="page_size_select" style="width:80px;" @change="pageSizeChange($event.target.value)">' +
    '<option value="15" selected="">15</option>' +
    '<option value="30">30</option>' +
    '<option value="50">50</option>' +
    '<option value="100">100</option>' +
    '</select>&nbsp;共{{pages}}页({{total}}条记录)' +
    '</span>&nbsp;' +
    '<span>&nbsp;到&nbsp;' +
    '<input type="text" class="page-num" id="page_num">' +
    '<button type="button" class="page-confirm" v-on:click="jumpPage()">确定</button>&nbsp;页' +
    '</span>' +
    '</div>' +
    '</div>' +
    '</span>';

  var VuePagenation = Vue.extend({
    template: tm,
    props: {
      page: {
        type: [String, Number],
        required: true
      },
      pagesize:{
        type:[String,Number],
        required: true
      },

      pages: {
        type: [String, Number],
        required: true
      },
      total: {
        type: [String, Number],
        required: true
      },
      displayPage:{
        type:[String,Number],
        required:false,
        default:6
      }

    },
    computed: {
      pageInfo: function () {
        var ar = [];
        if(this.pages < this.displayPage || this.pages == this.displayPage + 1){ //数字全部显示
          for(var i = 1; i <= this.pages; i++){
            ar.push(i)
          }
        }else if(this.page < this.displayPage -1){//后面显示省略号
          for (var i = 1; i < this.displayPage; i++){
            ar.push(i)
          }
          ar.push(this.pages);
        }else if(this.page <= this.pages && this.page > this.pages - this.displayPage + 2){  //前面显示省略号
          ar.push(1);
          for (var i = this.pages - this.displayPage + 2; i <= this.pages; i++){
            ar.push(i);
          }
        }else{  //前后显示省略号
          ar.push(1);
          var d, e, f = (this.displayPage - 3) / 2;
          (this.displayPage - 3) % 2 == 0 ? d = e = f : (d = Math.floor(f), e = Math.ceil(f));
          for (var i = this.page - d; i <= this.page + e; i++){
            ar.push(i);
          }
          ar.push(this.pages);
        }
        return ar;
      }
    },
    methods: {
      btnClick: function (page) {
        {
          if (page != this.page && page <= this.pages && page > 0) {
            this.$parent.pageChange(page)
          }
        }
      },
      pageSizeChange:function (pageSize) {
        if(pageSize != this.pagesize){
          this.$parent.pageSizeChange(pageSize);
        }
      },
      jumpPage:function () {
        var page = $('#page_num').val();
        if(page != '' && page <= this.pages){
          this.btnClick(parseInt(page));
        }
      }
    }
  });
  window.VuePagenation = VuePagenation;
  return VuePagenation;
});
