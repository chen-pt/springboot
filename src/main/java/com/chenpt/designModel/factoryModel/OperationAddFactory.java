package com.chenpt.designModel.factoryModel;

import com.chenpt.designModel.simpleFactoryModel.Operation;
import com.chenpt.designModel.simpleFactoryModel.OperatorAdd;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/18
 * @Modified By:
 */
public class OperationAddFactory implements IFactory {
    @Override
    public Operation creOperation() {
        return new OperatorAdd();
    }
}
