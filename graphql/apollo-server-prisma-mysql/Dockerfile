FROM node:18-bullseye

ARG GRAPHQL_ROOT=/graphql

ENV TZ Asia/Tokyo

RUN set -x \
    &&  apt update \
    &&  apt install -y \
    locales \
    &&  locale-gen ja_JP.UTF-8 \
    &&  localedef -f UTF-8 -i ja_JP ja_JP

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN set -x \
    && chmod +x /wait

ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:jp
ENV LC_ALL ja_JP.UTF-8

COPY ./entrypoint.sh .

RUN set -x \
    && chmod +x ./entrypoint.sh

WORKDIR ${GRAPHQL_ROOT}

COPY ./graphql/package.json .
COPY ./graphql/yarn.lock .

RUN set -x \
    && yarn install

ENTRYPOINT [ "/bin/bash", "-c" ]
CMD [ "/wait && ../entrypoint.sh" ]
