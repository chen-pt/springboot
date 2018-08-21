/**
 * Created by Administrator on 2016/9/1.
 */
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
                getList(this);
            }
        }
    });
    function getList(_self){
        $(function(){
            var url=YBZF.hostname + '/test/get_stored_value_list';
            YBZF.services({
                url:url,
                type:'post'
            }).done(function(data) {
                // console.log(data);
                _self.result = data.result;
                _self.status = data.status;
                if (data.status) {

                }
            });
        });
    }
});