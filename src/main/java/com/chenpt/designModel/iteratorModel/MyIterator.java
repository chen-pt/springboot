package com.chenpt.designModel.iteratorModel;

import com.sun.org.apache.xpath.internal.operations.Bool;

/**
 * @Author: chenpengtao
 * @Description: 定义抽象迭代器
 * @Date: created in 2018/8/20
 * @Modified By:
 */
public interface MyIterator {

    Boolean hasNext();
    Object next();

}
