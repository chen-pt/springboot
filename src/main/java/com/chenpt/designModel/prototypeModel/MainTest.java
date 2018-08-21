package com.chenpt.designModel.prototypeModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/1
 * @Modified By:
 */
public class MainTest {
    public static void main(String[] args){

        Resume resume = new Resume();
        WorkExperience workExperience = new WorkExperience();
        workExperience.setWorkDate("2015-2016");
        workExperience.setCompany("南京工作");
        resume.setName("大牛");
        resume.setAge("25");
        resume.setSex("男");
        resume.setWorkExperience(workExperience);

        Resume resume2 = (Resume)resume.clone();
        resume2.setName("老牛");
        WorkExperience workExperience2 = (WorkExperience)workExperience.clone();
        workExperience2.setWorkDate("2016-2018");
        workExperience2.setCompany("上海工作");
        resume2.setWorkExperience(workExperience2);

        resume.dispaly();
        resume2.dispaly();

        Integer a = 1;


    }
}
