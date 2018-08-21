package com.chenpt.controller;

import com.chenpt.model.User;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

/**
 * 版权所有(C) 2017 上海银路投资管理有限公司
 * 描述:
 * 作者: chen_pt
 * 创建日期: 2018/5/29
 * 修改记录:
 */
@Controller
@RequestMapping("merchant")
public class LoginController {


    @RequestMapping("/login")
    public ModelAndView login() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("merchant/login/login");
        return mav;
    }



    @RequestMapping("/loginUser")
    public String loginUser(String username,String password,HttpSession session) {
        UsernamePasswordToken usernamePasswordToken=new UsernamePasswordToken(username,password);
        Subject subject = SecurityUtils.getSubject();
        try {
            subject.login(usernamePasswordToken);   //完成登录
            User user=(User) subject.getPrincipal();
            session.setAttribute("user", user);
            return "merchant/new-builtwechat";
        } catch(Exception e) {
            return "merchant/login";//返回登录页面
        }

    }

    @RequestMapping("/test")
    public String test() {

        return "merchant/new-builtwechat";
    }

    @RequestMapping("/home")
    public String test2() {

        return "merchant/new-builtwechat";
    }

    @RequestMapping("/loginOut")
    public String logOut(HttpSession session) {
        Subject subject = SecurityUtils.getSubject();
        subject.logout();
//        session.removeAttribute("user");
        return "merchant/login/login";
    }


}
