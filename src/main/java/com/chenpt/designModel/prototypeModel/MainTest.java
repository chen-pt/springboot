package com.chenpt.designModel.prototypeModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/1
 * @Modified By:
 */
public class MainTest {
    public static void main(String[] args){

        Resume resume = new Resume("大鸟","男","25");
        resume.setWorkExperience("2015-2016","南京工作");

        Resume resume2 = (Resume)resume.clone();
        resume2.setPersonInfo("男","26");
        resume2.setWorkExperience("2016-2018","上海工作");

        resume.dispaly();
        resume2.dispaly();

    }
}
