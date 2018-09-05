package com.chenpt.designModel.visitorModel;

/**
 * @Author: chen
 * @Description:  抽象元素
 * @Date: created in 2018/9/4
 * @Modified By:
 */
public interface ComputerPart {

    public void accept(ComputerPartVisitor computerPartVisitor);

}
