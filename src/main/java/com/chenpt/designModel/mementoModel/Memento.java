package com.chenpt.designModel.mementoModel;

/**
 * @Author: chen
 * @Description: 备忘录类
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public class Memento {

    private String state;

    //构造方法将相关数据导入
    Memento(String state){
        this.state = state;
    }

    //需要保存的数据属性，可以是多个
    public String getState() {
        return state;
    }


}
