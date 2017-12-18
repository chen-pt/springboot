package com.chenpt.test;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 版权所有(C) 2017 上海银路投资管理有限公司
 * 描述:
 * 作者: chen_pt
 * 创建日期: 2017/12/13
 * 修改记录:
 */
@Controller
@RequestMapping("test")
public class TestController {


    @RequestMapping("home")
    public @ResponseBody String home(){

        return "homePage";
    }

}
