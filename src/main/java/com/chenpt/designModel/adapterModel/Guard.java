package com.chenpt.designModel.adapterModel;

/**
 * @Author: chen
 * @Description:  后卫
 * @Date: created in 2018/8/24
 * @Modified By:
 */
public class Guard implements Player{
    private String name;

    Guard(String name){
        this.name=name;
    }

    @Override
    public void attack() {
        System.out.println("后卫进攻："+name);
    }

    @Override
    public void defense() {
        System.out.println("后卫防守："+name);
    }

}
