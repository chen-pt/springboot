package com.chenpt.service;

import com.chenpt.mapper.UserMapper;
import com.chenpt.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 版权所有(C) 2017 上海银路投资管理有限公司
 * 描述:
 * 作者: chen_pt
 * 创建日期: 2018/5/29
 * 修改记录:
 */
@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;


    public User findByUserName(String userName){

        return userMapper.findByUserName(userName);
    }

}
