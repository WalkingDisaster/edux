#!/bin/sh

shopt -s extglob

# Web
cd web
ng build prod
cd ..

DIR="deployment/web"
if [ "$(ls $DIR)" ]; then
     rm -rd deployment/web/*
else
    echo "$DIR is Empty. Skipping cleanup"
fi
cp -r web/dist/* deployment/web
cd deployment/web
git add -A
git commit -m "deploy"
git push azure master
cd ../../

# API
DIR="deployment/api"
if [ "$(ls $DIR)" ]; then
     rm -rd deployment/api/*
else
    echo "$DIR is Empty. Skipping cleanup"
fi
cp -r api/!(node_modules) deployment/api
cd deployment/api
git add -A
git commit -m "deploy"
git push azure master
cd ../../