package com.chenpt.designModel.simpleFactoryModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/18
 * @Modified By:
 */
public class MainTest {
    public static void main(String[] args){

//        Operation operation = OperationFactory.createOperation("+");
        Operation operation = OperationFactory.createOperation("-");
        operation.setNumA(5);
        operation.setNumB(5);

        System.out.println(operation.result());

    }
}
