package com.chenpt.designModel.bridgeModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/27
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] args){
        Color color1 = new Red();
        Color color2 = new Green();
        Shape shape1 = new Circle(color1);
        Shape shape2 = new Circle(color2);

        shape1.isShape();
        shape2.isShape();
    }

}
