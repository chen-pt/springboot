package com.chenpt.designModel.bridgeModel;

/**
 * @Author: chen
 * @Description: 抽象形状
 * @Date: created in 2018/8/27
 * @Modified By:
 */
public abstract class Shape {

    Color color;

    Shape(Color color){
        this.color=color;
    }

    abstract void isShape();

}
