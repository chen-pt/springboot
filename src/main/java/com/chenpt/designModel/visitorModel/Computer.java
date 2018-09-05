package com.chenpt.designModel.visitorModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/9/4
 * @Modified By:
 */
public class Computer implements ComputerPart {

    ComputerPart[] parts;

    public Computer(){
        parts = new ComputerPart[]{new Keyboard(),new Mouse()};
    }

    @Override
    public void accept(ComputerPartVisitor computerPartVisitor) {
        for (int i=0;i<parts.length;i++) {
            parts[i].accept(computerPartVisitor);
        }
        computerPartVisitor.visit(this);
    }
}
