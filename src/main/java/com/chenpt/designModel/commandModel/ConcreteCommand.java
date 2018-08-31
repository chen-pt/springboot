package com.chenpt.designModel.commandModel;

/**
 * @Author: chen
 * @Description:  具体命令(我要十串羊肉串)
 * @Date: created in 2018/8/29
 * @Modified By:
 */
public class ConcreteCommand implements Command {
    private int num = 10;
    private Receiver receiver;

    ConcreteCommand(Receiver receiver){
        this.receiver=receiver;
    }


    @Override
    public void execute() {
        System.out.println("命令：我要"+num+"串羊肉串");
        receiver.action(num);
    }
}
