package com.chenpt.designModel.iteratorModel;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: chenpengtao
 * @Description: 聚集类
 * @Date: created in 2018/8/20
 * @Modified By:
 */
public class Aggregate {
    private List<Object> list = new ArrayList<>();

    public MyIterator getIterator(){
        return new InnerIterator();
    }

    public void add(Object obj){
        list.add(obj);
    }


    //使用内部类来定义迭代器
    private class InnerIterator implements MyIterator{
        int i=0;
        public Boolean hasNext(){
            if(i<list.size()){
                return true;
            }
            return false;
        }

        public Object next(){
            return list.get(i++);
        }
    }

}
