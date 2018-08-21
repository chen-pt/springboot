package com.chenpt.designModel.simpleFactoryModel;

/**
 * @Author: chenpengtao
 * @Description:封装
 *
 * 对numA、numB进行加减运算
 *
 * @Date: created in 2018/7/18
 * @Modified By:
 */
public class Operation {

    public double numA;
    public double numB;

    public double getNumA() {
        return numA;
    }

    public void setNumA(double numA) {
        this.numA = numA;
    }

    public double getNumB() {
        return numB;
    }

    public void setNumB(double numB) {
        this.numB = numB;
    }

    /**
     * 操作数字返回结果
     * @return
     */
    public double result(){

        return numA+numB;
    }

}
