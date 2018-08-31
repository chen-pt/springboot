package com.chenpt.designModel.commandModel;

/**
 * @Author: chen
 * @Description: 执行类
 * @Date: created in 2018/8/31
 * @Modified By:
 */
public class Invoker {

    private Command command;

    Invoker(Command command){
        this.command=command;
    }

    public void action(){
        command.execute();
    }

}
