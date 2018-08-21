package com.chenpt.annotation;

import org.springframework.web.bind.annotation.Mapping;

import java.lang.annotation.*;

/**
 * 文件名:com.jk51.annotation.
 * 描述: 定义类、方法是否必须登录，默认必须登录
 * 作者: wangzhengfei
 * 创建日期: 2017-01-16
 * 修改记录:
 */

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Mapping
public @interface LoginRequired {

    boolean required() default true;
}
