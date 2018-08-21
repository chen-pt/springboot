package com.chenpt.config;

import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.bind.RelaxedPropertyResolver;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * 阿里巴巴druid连接池
 * Created by chenpt on 2017/12/15.
 */
@Configuration
public class DruidConfiguration implements EnvironmentAware {

    @Resource
    private Environment environment;


    /**
     * 日志记录器
     */
    private static final Logger logger = LoggerFactory.getLogger(DruidConfiguration.class);

    private RelaxedPropertyResolver resolver;


    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
        this.resolver = new RelaxedPropertyResolver(environment,"spring.datasource.");
    }


    @Bean
    public ServletRegistrationBean druidServlet() {
        logger.info("init Druid Servlet Configuration ");
        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean();
        servletRegistrationBean.setServlet(new StatViewServlet());
        servletRegistrationBean.addUrlMappings("/druid/*");
        Map<String, String> initParameters = new HashMap<>();
        initParameters.put("loginUsername", resolver.getProperty("monitorUserName"));// 用户名
        initParameters.put("loginPassword",resolver.getProperty("monitorPassword"));// 密码
        // 禁用HTML页面上的“Reset All”功能
        initParameters.put("resetEnable", resolver.getProperty("resetEnable"));
        // IP白名单 (没有配置或者为空，则允许所有访问)
        initParameters.put("allow", resolver.getProperty("allow"));
        //IP黑名单 (存在共同时，deny优先于allow)
        initParameters.put("deny", resolver.getProperty("deny"));
        servletRegistrationBean.setInitParameters(initParameters);
        return servletRegistrationBean;
    }

    @Bean
    public FilterRegistrationBean filterRegistrationBean() {
        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();
        filterRegistrationBean.setFilter(new WebStatFilter());
        filterRegistrationBean.addUrlPatterns("/*");
        filterRegistrationBean.addInitParameter("exclusions", "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");
        return filterRegistrationBean;
    }
}
