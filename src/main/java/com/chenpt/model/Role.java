package com.chenpt.model;

import java.io.Serializable;
import java.util.Set;

/**
 * 版权所有(C) 2017 上海银路投资管理有限公司
 * 描述:  角色
 * 作者: chen_pt
 * 创建日期: 2018/5/29
 * 修改记录:
 */
public class Role implements Serializable {

    private Integer rid;
    private String rname;

    private Set<User> users;
    private Set<Module> modules;


    public Integer getRid() {
        return rid;
    }

    public void setRid(Integer rid) {
        this.rid = rid;
    }

    public String getRname() {
        return rname;
    }

    public void setRname(String rname) {
        this.rname = rname;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Set<Module> getModules() {
        return modules;
    }

    public void setModules(Set<Module> modules) {
        this.modules = modules;
    }
}
