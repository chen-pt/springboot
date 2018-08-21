package com.chenpt.designModel.factoryModel;

import com.chenpt.designModel.simpleFactoryModel.Operation;
import com.chenpt.designModel.simpleFactoryModel.OperatorSub;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/18
 * @Modified By:
 */
public class OperationSubFactory implements IFactory {
    @Override
    public Operation creOperation() {
        return new OperatorSub();
    }
}
