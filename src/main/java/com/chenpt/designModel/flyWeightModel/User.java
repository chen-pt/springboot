package com.chenpt.designModel.flyWeightModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/20
 * @Modified By:
 */
public class User {
    private String name;
    User(String name){
        this.name=name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
