package com.chenpt.controller;

import com.chenpt.model.PostInfo;
import com.chenpt.service.PostInfoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import java.util.List;

/**
 * 版权所有(C) 2017
 * 描述:
 * 作者: chen_pt
 * 创建日期: 2017/12/13
 * 修改记录:
 */
@Controller
@RequestMapping("merchant")
public class PostInfoController {

    @Resource
    private PostInfoService postInfoService;


    @RequestMapping("home")
    public ModelAndView returnAddTheme() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("merchant/new-builtwechat");
        return mav;
    }

    @RequestMapping("getLst")
    public @ResponseBody List<PostInfo> getLst(ModelMap map){

        return postInfoService.getLst();
    }

    @RequestMapping("reStr")
    public String reStr(ModelMap map){

        return "views/merchant/new-builtwechat";
    }

    @RequestMapping(value = "test", produces = "application/text; charset=utf-8")
    public @ResponseBody String getLstss(){

        return "返回信息";
    }


}
