package com.chenpt.designModel.mediatorModel;

/**
 * @Author: chen
 * @Description: 抽象国家类持有一个中介者对象
 * @Date: created in 2018/8/28
 * @Modified By:
 */
public abstract class Country {

    UniteNations uniteNations;

    Country(UniteNations uniteNations){
        this.uniteNations = uniteNations;
    }

}
