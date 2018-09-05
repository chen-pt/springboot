package com.chenpt.designModel.visitorModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/9/4
 * @Modified By:
 */
public class Keyboard implements ComputerPart {
    @Override
    public void accept(ComputerPartVisitor computerPartVisitor) {
        computerPartVisitor.visit(this);
    }
}
