/**
 * Created by javen73 on 2018/4/16.
 */

var pageComponent = {
  template: `
      <div class="sui-pagination pagination-large" style="float:right">
        <ul>
          <li class="prev" :disabled="page == 1" @click="prePage">
            <a href="javascript:void(0)">上一页</a>
          </li>
          <li v-if="pages !== 1" :class="{'active':1 == page }" @click="goPage(1)">
            <a href="javascript:void(0)">1</a>
          </li>
          <li v-if="preClipped" class="dotted">
            <span>...</span>
          </li>
          <li v-for="index in pageCalc" :class="{'active':index==page}" @click="goPage(index)">
            <a href="javascript:void(0)">{{index}}</a>
          </li>
          <li v-if="backClipped" class="dotted">
            <span>...</span>
          </li>
          <li :class="{'active':page==pages}" @click="goPage(pages)" v-if="pages !== 0">
            <a href="javascript:void(0)">{{pages}}</a>
          </li>
          <li :disabled="page == pages" @click="nextPage">
            <a href="javascript:void(0)">下一页</a>
          </li>
        </ul>
        <div>
          &nbsp;
          <span>
            <select @change="changeSize" v-model="currentSize" style="width:40px;height:24px;">
                  <option :value="size" v-for="size in sizeList" :selected="currentSize===size">{{size}}</option>
             </select>
            共{{pages}}页({{total}}条记录)
          </span>
          &nbsp;
          <span>&nbsp;到&nbsp;
            <input type="text" class="page-num" v-model="jumpPage">
            <button class="page-confirm" @click="jump()">确定</button>
            &nbsp;页
          </span>
        </div>
      </div>  
    `,
  props: ['page', 'pages','pageSize','total'],
  data(){
    return{
      preClipped:false,
      backClipped:false,
      currentSize:this.pageSize,
      jumpPage:1,
      sizeList:[15,30,50,100],
      current:this.page
    }
  },
  methods: {
    goPage(current){
      this.$emit('update:page',current)
    },
    prePage(){
      let current = this.page - 1;
      if(current > 0 && current <= this.pages)
        this.goPage(current)
    },
    nextPage(){
      let current = this.page + 1
      if(current > 0 && current <= this.pages)
        this.goPage(current)
    },
    changeSize(){
      this.$emit('update:pageSize',this.currentSize)
    },
    jump(){
      if(!this.jumpPage)
        return;
      if(this.jumpPage>0 && this.jumpPage <= this.pages && this.jumpPage != this.page){
        this.goPage(this.jumpPage)
      }
    }
  },
  computed: {
    // 使用计算属性来得到每次应该显示的页码
    pageCalc: function () {
      let ret = []
      //收集当前页的前半页列表页码，并对省略进行判断标记
      if (this.page > 3) {
        // 当前页码大于三时，显示当前页码的前2个
        ret.push(this.page - 2)
        ret.push(this.page - 1)
        if (this.page > 4) {
          // 当前页与第一页差距4以上时显示省略号
          this.preClipped = true
        }
      } else {
        this.preClipped = false
        for (let i = 2; i < this.page; i++) {
          ret.push(i)
        }
      }
      //增加当前页
      if (this.page !== this.pages && this.page != 1) {
        ret.push(this.page)
      }
      //收集当前页码的后面的页码
      if (this.page < (this.pages - 2)) {
        // 显示当前页码的后2个
        ret.push(this.page + 1)
        ret.push(this.page + 2)
        if (this.page <= (this.pages - 3)) {
          // 当前页与最后一页差距3以上时显示省略号
          this.backClipped = true
        }
      } else {
        this.backClipped = false
        for (let i = (this.page + 1); i < this.pages; i++) {
          ret.push(i)
        }
      }
      console.log(ret)
      // 返回整个页码组
      return ret
    }
  }
}
