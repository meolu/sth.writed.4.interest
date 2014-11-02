#!/bin/bash

#######  切换同 hosts 工具  ##########
#######  v0.1               ##########
#######  author wushuiyong  ##########
#######  usage: sh switch-hosts dev  ##########
#######  date 2013.9.12     ##########

HOSTS="/etc/hosts"
#存放hosts_*路径
BASE="./"
SWITCH=$1

HOSTSINPUT=$BASE"hosts_"$SWITCH

if [ -f $HOSTSINPUT ]; then
	echo "switching $SWITCH ..."
    cat $HOSTSINPUT > $HOSTS
fi
