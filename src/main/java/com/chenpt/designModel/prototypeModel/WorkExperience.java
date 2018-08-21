package com.chenpt.designModel.prototypeModel;

/**
 * @Author: chenpengtao
 * @Description: 工作经历
 * @Date: created in 2018/8/1
 * @Modified By:
 */
public class WorkExperience implements Cloneable{

    private String workDate;
    private String company;

    public WorkExperience(String workDate,String company){
        this.workDate=workDate;
        this.company=company;
    }

    public WorkExperience(){}

    public String getWorkDate() {
        return workDate;
    }

    public void setWorkDate(String workDate) {
        this.workDate = workDate;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }
    public Object clone(){
        try {
            return super.clone();
        }catch (Exception e){
            return null;
        }

    }
}
