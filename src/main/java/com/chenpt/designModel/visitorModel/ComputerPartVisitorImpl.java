package com.chenpt.designModel.visitorModel;

/**
 * @Author: chen
 * @Description: 具体访问者
 * @Date: created in 2018/9/4
 * @Modified By:
 */
public class ComputerPartVisitorImpl implements ComputerPartVisitor {
    @Override
    public void visit(Keyboard keyboard) {
        System.out.println("Displaying Keyboard.");
    }

    @Override
    public void visit(Mouse mouse) {
        System.out.println("Displaying Mouse.");
    }

    @Override
    public void visit(Computer computer) {
        System.out.println("Displaying Computer.");
    }
}
