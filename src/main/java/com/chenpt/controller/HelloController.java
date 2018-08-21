package com.chenpt.controller;

import com.chenpt.service.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;

/**
 * 版权所有(C) 2017 上海银路投资管理有限公司
 * 描述:
 * 作者: chen_pt
 * 创建日期: 2017/12/15
 * 修改记录:
 */
@Controller
@RequestMapping("hello")
public class HelloController {

    @Autowired
    private StringRedisTemplate redisTemplate;
    @Autowired
    private RedisService redisService;


    @RequestMapping("ht")
    public ModelAndView hello(){
        ModelAndView model = new ModelAndView();

        redisTemplate.opsForValue().set("hello","你好");

        model.addObject("hello","from ssd TemplateController.helloHtml");
        model.setViewName("/hello");
        return model;
    }

    @RequestMapping("redis")
    public @ResponseBody HashMap<String, Object> redis(){

//        redisService.putRedis();

        return redisService.putRedis();
    }

}
