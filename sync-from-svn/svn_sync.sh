#########################################################################
# File Name: svn_sync.sh
# mail: wushuiyong@huamanshu.com
# Created Time: Fri 14 Nov 2014 04:21:30 PM CST
# usage: sh ./svn_sync.sh https://great-company/branch-svn lib/DBFactory.php /dir/of/lib/DBFactory.php 
#########################################################################
#endif  //__SVN_SYNC_SH_
#!/bin/bash

# svn 分支
svn_rope=$1
# 要拉取的文件
sync_file=$2
# 目标文件
target_file=$3

svn_dir=$(basename $svn_rope)

if [ ! -d $svn_dir ]
then
    /home/map/.jumbo/bin/svn co $svn_rope 1>/dev/null
fi

source_file=$svn_dir"/"$sync_file
echo $source_file $target_file >> /tmp/xx
return

if [ -f $source_file ]
then
    cp $source_file $target_file
else
	exit 1
fi

