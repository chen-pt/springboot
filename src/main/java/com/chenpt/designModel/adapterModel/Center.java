package com.chenpt.designModel.adapterModel;

/**
 * @Author: chen
 * @Description: 中锋
 * @Date: created in 2018/8/24
 * @Modified By:
 */
public class Center implements Player {
    private String name;

    Center(String name){
        this.name=name;
    }

    @Override
    public void attack() {
        System.out.println("中锋进攻："+name);
    }

    @Override
    public void defense() {
        System.out.println("中锋防守："+name);
    }
}
