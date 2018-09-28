#!/bin/bash

gksudo -- bash -c "curl -u TOMCATSECRETUSER293:TOMCATSECRETPASSWORD3984 -s http://127.0.0.1:8080/manager/text/undeploy?path=/server; curl --upload-file ./build/libs/server.war -u TOMCATSECRETUSER293:TOMCATSECRETPASSWORD3984 -s http://127.0.0.1:8080/manager/text/deploy?path=/server&update=true"