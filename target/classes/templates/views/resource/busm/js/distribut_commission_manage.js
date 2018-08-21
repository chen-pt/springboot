/**
 * Created by Administrator on 2016/8/31.
 */
require(['common', 'core/pagin', 'vue', 'sui'], function(YBZF, pagin, Vue) {

    Vue.config.delimiters=["<%=", "%>"];
    // Vue.config.silent = true;
    var vm = new Vue({
        el:"#site-list",
        replace: false,
        template: '#site-list-temp',
        data:function(){
            return { result:'',status:''}
        },
        ready: function () {
            var _self=this;
            _self.getstoredvalueList();

        },
        methods:{
            getstoredvalueList:function () {
                getList(this,1);
            }
        }
    });
    function getList(_self,pageno){
        $(function(){
            var url=YBZF.hostname + '/distribut/rewardManage';
            var datas = {};
            datas.current_page= pageno || 1;
            datas.per_page=$('.page-size-sel').val() || 15;
            pagesize = $('.page-size-sel').val() || 15;
            YBZF.services({
                url:url,
                type:'post',
                data:datas,
            }).done(function(data) {
                _self.result = data.result;
                _self.status = data.status;
                if (data.status) {
                    var $pagin = $('#pagination');
                    pagin($pagin, pageno, data.result.total_pages, pagesize, data.result.total_items, getList.bind(self,vm));
                    $pagin.show();
                }else {
                    $pagin.hide();
                }
            });
        });
    }
});