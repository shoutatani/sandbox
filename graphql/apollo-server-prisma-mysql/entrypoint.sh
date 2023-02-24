#!/bin/bash

echo "****** cd graphql root ******"
cd /graphql

echo "****** yarn install ******"
yarn install

echo "****** reset dev db... ******"
yarn build
yarn reset-dev-db

echo "****** start watching... ******"
yarn watch
