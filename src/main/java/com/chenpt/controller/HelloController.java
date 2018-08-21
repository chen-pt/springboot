package com.chenpt.controller;

import com.chenpt.service.RedisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.util.HashMap;
import java.util.Map;

/**
 * 版权所有(C) 2017 上海银路投资管理有限公司
 * 描述:
 * 作者: chen_pt
 * 创建日期: 2017/12/15
 * 修改记录:
 */
@Controller
@RequestMapping("/demo/hello")
public class HelloController {
    private static Logger logger = LoggerFactory.getLogger(HelloController.class);

//    @Autowired
//    private StringRedisTemplate redisTemplate;
    @Autowired
    private RedisService redisService;


    @RequestMapping("ht")
    public ModelAndView hello(){
        logger.info("ht日志打印------------");

        ModelAndView model = new ModelAndView();

//        redisTemplate.opsForValue().set("hello","你好");

        model.addObject("hello","我进来拉");
        model.setViewName("/demo/hello");
        return model;
    }

    @RequestMapping("redisput")
    public @ResponseBody HashMap<String, Object> redisput(){


        return redisService.putRedis();
    }
    @RequestMapping("redisget")
    public @ResponseBody HashMap<String, Object> redisget(){


        return redisService.getRedis();
    }

    /**
     * 图片导入
     * @param request
     * @return
     */
    @RequestMapping("upload")
    public @ResponseBody String upload(HttpServletRequest request){

        try {

            MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest)request;

            MultipartFile file = multipartHttpServletRequest.getFile("file");

            InputStream inputStream = file.getInputStream();

            FileOutputStream outputStream = new FileOutputStream("D:\\888.jpg");
            byte[] bytes = new byte[1024];//缓存区
            int a = 0;
            while ((a=inputStream.read(bytes))!=-1){
                outputStream.write(bytes,0,a);
            }
            file.transferTo(new File("D:\\777.jpg"));
            outputStream.close();
            inputStream.close();
            outputStream.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return "ok";
    }


}
