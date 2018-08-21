package com.chenpt.designModel.simpleFactoryModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/18
 * @Modified By:
 */
public class OperationFactory {


    public static Operation createOperation(String operation){
        Operation oper = null;
        switch (operation){
            case "+":
                oper = new OperatorAdd();
                break;
            case "-":
                oper = new OperatorSub();
                break;
        }
        return oper;
    }


}
