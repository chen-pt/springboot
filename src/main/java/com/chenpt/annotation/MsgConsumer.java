package com.chenpt.annotation;

import java.lang.annotation.*;

/**
 * 文件名:com.jk51.annotation.MsgConsumer
 * 描述:
 * 作者: wangzhengfei
 * 创建日期: 2017-02-09
 * 修改记录:
 */

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface MsgConsumer {

    String topicName() default "";

    String tagName() default "";

    String consumerGroup() default "dcg";

    String namesrvAddr() default "";

    int retryTimes() default 16;

    ConsumeType consumeType() default ConsumeType.Concurrently;

    public static enum ConsumeType{
        Orderly,
        Concurrently;
    }
}
