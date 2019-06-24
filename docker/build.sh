#!/bin/bash

sudo docker build -t java-compile-run:1.0 ./build
sudo docker build -t java-build:1.0 ./submit/build
sudo docker build -t java-run:1.0 ./submit/run
