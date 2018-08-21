package com.chenpt.designModel.decorateModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/31
 * @Modified By:
 */
public class Hero implements Learning {
    String name;

    public Hero (String name){
        this.name=name;
    }

    @Override
    public void Learn() {
        System.out.println(name+"-正在学习技能ing");
    }
}
