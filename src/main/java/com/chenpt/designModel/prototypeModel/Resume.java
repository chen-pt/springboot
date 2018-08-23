package com.chenpt.designModel.prototypeModel;

import java.io.Serializable;

/**
 * @Author: chenpengtao
 * @Description: 简历
 * @Date: created in 2018/8/1
 * @Modified By:
 */
public class Resume implements Cloneable,Serializable{
    private static final long serialVersionUID = 1L;

    private String name;
    private String sex;
    private String age;
    private WorkExperience workExperience;

    Resume(String name,String sex,String age){
        this.name=name;
        this.sex=sex;
        this.age=age;
        this.workExperience=new WorkExperience();
    }

    /**
     * 添加私有构造 克隆工作经历
     * @param workExperience
     */
    private Resume(WorkExperience workExperience){
        this.workExperience= (WorkExperience) workExperience.clone();
    }

    /**
     * 设置个人信息
     * @param sex
     * @param age
     */
    public void setPersonInfo(String sex,String age){
        this.sex=sex;
        this.age=age;
    }

    /**
     * 设置工作经历
     * @param workDate
     * @param company
     */
    public void setWorkExperience(String workDate, String company){
        this.workExperience.setWorkDate(workDate);
        this.workExperience.setCompany(company);
    }

    //描述
    public void dispaly(){
        System.out.println("姓名："+name+"\t年龄："+age+"\t性别："+sex);
        System.out.println("工作经历："+workExperience.getWorkDate()+age+"\t"+workExperience.getCompany());
    }

    /**
     * 重写了克隆方法
     * @return
     */
    public Object clone(){
        try {
            Resume resume = new Resume(this.workExperience);//调用私有构造器实现工作经历克隆
            //给对象属性重新赋值--最终返回的是深复制的resume对象
            resume.name=this.name;
            resume.sex=this.sex;
            resume.age=this.age;
            return resume;
        }catch (Exception e){
            return null;
        }

    }

}
