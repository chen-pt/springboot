package com.chenpt.designModel.stateModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/31
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] args){
        Context context = new Context();
        StateA stateA = new StateA();
        StateB stateB = new StateB();

        context.setState(stateA);
        System.out.println(context.getState());

        context.setState(stateB);
        System.out.println(context.getState());
    }

}
