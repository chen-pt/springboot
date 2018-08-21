package com.chenpt.controller;

import com.chenpt.common.dto.ResultData;
import com.chenpt.service.RedisService;
import org.apache.rocketmq.common.message.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.concurrent.TimeUnit;

/**
 * 版权所有(C) 2017 上海银路投资管理有限公司
 * 描述:
 * 作者: chen_pt
 * 创建日期: 2018/6/27
 * 修改记录:
 */
@Controller
@RequestMapping("redis/test/")
public class RedisTestController {
    @Autowired
    private StringRedisTemplate redisTemplate;
    @Autowired
    private RedisService redisService;

    @RequestMapping("adds")
    public @ResponseBody ResultData testRedis(){
        ResultData data = new ResultData();
        String s = redisTemplate.opsForValue().get("hello");

        redisTemplate.opsForValue().set("hello2","",30, TimeUnit.SECONDS);

        data.setData(s);
        return data;
    }

    @RequestMapping("add")
    public @ResponseBody ResultData testR(){
        ResultData data = new ResultData();
        Message message = new Message();
        message.setBody("hello".getBytes());

//        CloudQueue queue = CloudQueueFactory.create("testHelloWord");

        try {
//            queue.putMessage(message);
        } catch (Exception e) {
        }


        return data;
    }

}
