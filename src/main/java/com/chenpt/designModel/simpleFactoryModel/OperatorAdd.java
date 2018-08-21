package com.chenpt.designModel.simpleFactoryModel;

import com.chenpt.designModel.simpleFactoryModel.Operation;

/**
 * @Author: chenpengtao
 * @Description: 加
 * @Date: created in 2018/7/18
 * @Modified By:
 */
public class OperatorAdd extends Operation {


    public double result(){

        return numA+numB;
    }

}
