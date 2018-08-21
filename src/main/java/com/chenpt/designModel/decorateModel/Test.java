package com.chenpt.designModel.decorateModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/1
 * @Modified By:
 */
public class Test implements Cloneable {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void tostring(){
        System.out.println("看看"+name);
    }


    public Object clone(){
        try {
            Test test = (Test) super.clone();
            return test;
        }catch (Exception e){
            return null;
        }
    }
}
