package com.chenpt;

import com.alibaba.druid.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.env.SimpleCommandLinePropertySource;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * 文件名:com.chenpt.Bootstrap
 * 描述: 应用启动入口类，请勿随意改动
 * 作者: chenpt
 * 创建日期: 2017-12-15
 * 修改记录:
 */

@SpringBootApplication
@EnableAutoConfiguration
@ComponentScan(basePackages="com.chenpt")
@EnableAsync
@EnableCaching
public class Bootstrap {

    public static final Logger logger = LoggerFactory.getLogger(Bootstrap.class);

    public static final String ENV_KEY_PROFILE = "spring.profiles.active";

    private static final String DEFAULT_PROFILE = "dev";

    public static void main(String[] args) throws Exception {
        SpringApplication application = new SpringApplication(Bootstrap.class);
        SimpleCommandLinePropertySource source = new SimpleCommandLinePropertySource(args);
        if (!source.containsProperty(ENV_KEY_PROFILE) && !System.getenv().containsKey(ENV_KEY_PROFILE) && StringUtils.isEmpty(System.getProperty(ENV_KEY_PROFILE))) {
            logger.warn("未指定当前运行环境({}),使用默认环境[{}]", ENV_KEY_PROFILE, DEFAULT_PROFILE);
            application.setAdditionalProfiles(DEFAULT_PROFILE);
        }

        application.run(args);
    }
}



