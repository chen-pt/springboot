package com.chenpt.designModel.facadeModel;

/**
 * @Author: chenpengtao
 * @Description: 外观类
 * @Date: created in 2018/8/10
 * @Modified By:
 */
public class Facade {

    SubSystemOne subSystemOne;
    SubSystemTwo subSystemTwo;
    SubSystemThree subSystemThree;

    public Facade(){
        subSystemOne = new SubSystemOne();
        subSystemTwo = new SubSystemTwo();
        subSystemThree = new SubSystemThree();
    }

    public void startMethod(){
        subSystemOne.Method1();
        subSystemTwo.Method2();
        subSystemThree.Method3();
    }

}
