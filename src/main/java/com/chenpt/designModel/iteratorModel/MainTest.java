package com.chenpt.designModel.iteratorModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/20
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] args){
        Aggregate aggregate = new Aggregate();
        aggregate.add("上海");
        aggregate.add("南京");
        aggregate.add("北京");

        for (MyIterator it = aggregate.getIterator();it.hasNext();){
            Object o = it.next();
            System.out.println(o.toString());
        }
    }

}
