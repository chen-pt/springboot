package com.chenpt.designModel.visitorModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/9/4
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] args){
        ComputerPart part = new Computer();
        part.accept(new ComputerPartVisitorImpl());

        System.out.println(2<<1);
    }

}
