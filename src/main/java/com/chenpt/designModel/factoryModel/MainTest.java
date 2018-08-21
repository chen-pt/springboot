package com.chenpt.designModel.factoryModel;

import com.chenpt.designModel.simpleFactoryModel.Operation;
import com.chenpt.designModel.simpleFactoryModel.OperationFactory;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/18
 * @Modified By:
 */
public class MainTest {
    public static void main(String[] args){

//        IFactory factory = new OperationAddFactory();
        IFactory factory = new OperationSubFactory();

        Operation operation = factory.creOperation();
        operation.setNumA(5);
        operation.setNumB(5);

        System.out.println(operation.result());

    }
}
