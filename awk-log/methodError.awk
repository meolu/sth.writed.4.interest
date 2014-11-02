#########################################################################
# File Name: methodError.awk
# Author: wushuiyong
# mail: wushuiyong@huamanshu.com
# use:awk -vs="method" -ve="param" -f method.awk xxx.wf.log
# 用途：打印日志中错误的方法以及个数
# Created Time: Thu 10 Apr 2014 07:15:00 PM
#########################################################################
#!/bin/awk -f

BEGIN {
	re = sprintf("%s(.*)%s", s, e);
	printf("---------------------------------------------------------\n");
	printf("错误方法\t\t\t数量\n");
	printf("---------------------------------------------------------\n");
}
/WARNING.*method/ {
	match($0, re, arr); 
	list[arr[1]]++;
}
END{
	for (k in list) printf("%s %d\n", k, list[k]);
}
