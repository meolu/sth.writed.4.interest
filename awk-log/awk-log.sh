#########################################################################
# File Name: analyseLog.sh
# Author: wushuiyong
# mail: wushuiyong@huamanshu.com
# use: sh analyseLog.sh
# 用途：下载使用者选定的单元、服务器、模块、时间对应的日志文件，并进行自定义日志分析脚本
# Created Time: Fri 11 Apr 2014 10:14:50 AM CST
#########################################################################
#!/bin/bash


# 下载日志文件
function download() {
    currentDate=`date +%Y%m%d%H -d now`
    read -p "请输入日志时间(当前时间 ${currentDate} )：" logDate
    echo -e  "\033[32m开始下载日志文件...\033[0m";
    # 循环服务器下载日志文件
    for machine in ${machines};
    do
        if [ ! -d ${machine} ]; 
        then
            mkdir -p ${project}/${machine}
        fi
        expect downloadLog.exp $machine ${project}.log.wf.${logDate};
    done
    echo -e  "\033[32m日志文件下载完毕\033[0m";
}

# 机器选择和下载日志
function machineAndLog() {
    i=0
    echo "[all]all machines"
    # 输出机器给用户选择
    for machine in ${machines[@]};
    do
        echo "[${i}]${machine}"
        ((i++))
    done

    read -p "请选择单台机器或全部机器：" machineNo
    # 开始下载日志文件
    if [ $machineNo = "all" ];then
        echo -e "\033[32m已选全部机器\033[0m"
        machines=${machines[@]}
        download
    else
        echo -e "\033[32m已选${machines[$machineNo]}\033[0m"
        machines=${machines[$machineNo]}
        download
    fi

    fileStr='';
    for machine in $machines;
    do
        fileStr="${fileStr} ${project}/${machine}/*.log.wf* "
    done

    # 自定义错误分析脚本（分析报错方法和数量)
    echo -e  "\033[32m开始错误分析...";
    awk  -vs="method" -ve="param" -f methodError.awk $fileStr
    echo -e  "---------------------------------------------------------\033[0m";
}

# 入口
# 机器配置
machines=(great-compony-server-1 great-compony-server-2 great-compony-server-3);
machineAndLog
