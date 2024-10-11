FROM centos:centos7

MAINTAINER 1559908987@qq.com

ENV TZ=Asia/Shanghai
ENV LANG C.UTF-8

RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && ln -sf /data/nginx/sbin/nginx /bin/nginx

RUN mkdir -p /data

WORKDIR /data

EXPOSE 8888

ADD ./dist ./dist
ADD ./nginx ./nginx

CMD ["nginx", "-g", "daemon off;"]
