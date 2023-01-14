FROM node:18-bullseye

ARG PRISMA_ROOT=/prisma

ENV TZ Asia/Tokyo

RUN set -x \
    &&  apt update \
    &&  apt install -y \
    locales \
    &&  locale-gen ja_JP.UTF-8 \
    &&  localedef -f UTF-8 -i ja_JP ja_JP

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:jp
ENV LC_ALL ja_JP.UTF-8

WORKDIR ${PRISMA_ROOT}

ENTRYPOINT [ "/bin/bash", "-c", "/wait && tail -f /dev/null" ]
