<?php
//test 4 script
include 'kmp.php';

// 测试下是否可用
 $src = 'BBC ABCDAB ABCDABCDABDE';
 $par = 'ABCDABD';

 // 匹配值
 echo "匹配值:", implode(" ", KMPMatch($par)), PHP_EOL;
 // 在给定的字符串中查找特定字符（串）
 echo  KMP($src, $par, true), PHP_EOL;
