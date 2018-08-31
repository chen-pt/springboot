package com.chenpt.designModel.commandModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/31
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] args){
        Command command = new ConcreteCommand(new Receiver());
        Invoker invoker = new Invoker(command);
        invoker.action();
    }


}
