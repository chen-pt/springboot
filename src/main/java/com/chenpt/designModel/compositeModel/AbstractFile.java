package com.chenpt.designModel.compositeModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/27
 * @Modified By:
 */
public interface AbstractFile {

    void add(AbstractFile c);
    void remove(AbstractFile c);
    AbstractFile getChild(int i);
    void operation();

}
