package com.chenpt.service;

import com.chenpt.config.CacheSetConfig;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashMap;

/**
 * 版权所有(C) 2017
 * 描述:
 * 作者: chen_pt
 * 创建日期: 2017/12/15
 * 修改记录:
 */
@Service
public class RedisService {


    @Cacheable(value = "IndexPage",key = CacheSetConfig.CACHE_TEST2)
    public HashMap<String, Object> putRedis(){
        HashMap<String, Object> map = new HashMap<>();
        map.put("K1","第一个");
        map.put("K2","第二个");
        map.put("K3","第三个ccc");

        return map;
    }

    @Cacheable(value = "IndexPage",key = CacheSetConfig.CACHE_TEST2)
    public HashMap<String, Object> getRedis(){
        HashMap<String, Object> map = new HashMap<>();
        map.put("K1","第一个sss");
        map.put("K2","第二个");
        map.put("K3","第三个");

        return map;
    }

}
