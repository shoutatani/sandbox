#!/bin/bash

echo "****** cd graphql root ******"
cd /graphql

echo "****** yarn install ******"
yarn install

echo "****** reset build... ******"
yarn build
yarn db:migrate

echo "****** start watching... ******"
yarn watch
