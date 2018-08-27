package com.chenpt.designModel.bridgeModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/27
 * @Modified By:
 */
public class Circle extends Shape {

    Circle(Color color){
        super(color);
    }

    @Override
    void isShape() {
        color.isColor("圆形");
    }
}
