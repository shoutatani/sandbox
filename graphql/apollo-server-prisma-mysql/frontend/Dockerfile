FROM node:18-bullseye

ARG FRONTEND_ROOT=/frontend

ENV TZ Asia/Tokyo

RUN set -x \
    &&  apt update \
    &&  apt install -y \
    locales \
    &&  locale-gen ja_JP.UTF-8 \
    &&  localedef -f UTF-8 -i ja_JP ja_JP

ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:jp
ENV LC_ALL ja_JP.UTF-8

COPY ./entrypoint.sh .

RUN set -x \
    && chmod +x ./entrypoint.sh

WORKDIR ${FRONTEND_ROOT}

COPY ./package.json .
COPY ./yarn.lock .

RUN set -x \
    && yarn install

ENTRYPOINT [ "/bin/bash", "-c" ]
CMD [ "../entrypoint.sh" ]
