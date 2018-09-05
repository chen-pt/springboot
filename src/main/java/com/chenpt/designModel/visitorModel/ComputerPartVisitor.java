package com.chenpt.designModel.visitorModel;

/**
 * @Author: chen
 * @Description: 抽象访问者
 * @Date: created in 2018/9/4
 * @Modified By:
 */
public interface ComputerPartVisitor {

    // 声明一组重载的访问方法，用于访问不同类型的具体元素
    void visit(Keyboard keyboard);
    void visit(Mouse mouse);
    void visit(Computer computer);

}
