<?php
/* *************************************************************************
 * File Name: kmp.php
 * 有趣的KMP查找算法
 * Author: wushuiyong
 * mail: wushuiyong@huamanshu.com
 * Created Time: Fri 21 Nov 2014 09:57:30 AM
 * ************************************************************************/

// 对查找字符（串）进行计算匹配值
function KMPMatch($str) {
   $K = array(0);
   $M = 0;
   for($i=1; $i<strlen($str); $i++) {
       if ($str[$i] == $str[$M]) {
          $K[$i] = $K[$i-1] + 1;
          $M ++;
       } else {
          $M = 0;
          $K[$i] = $K[$M];
       }
   }
   return $K;
}


/**
 * KMP查找
 * @params $src string 源字符串
 * @params $find string 要查找字符串
 * @params @debug bool 是否显示查找过程
 * @return int 匹配的位置
 */
function KMP($src, $find, $debug = false) {
   $K = KMPMatch($find);
   for($i=0,$j=0; $i<strlen($src); ) {
       if ($j == strlen($find)) return $i-$j;

       // 是否显示查找过程
       if ($debug)  echo $i,"  ", $j, " ", $src[$i], $find[$j], PHP_EOL;

       if ($find[$j] === $src[$i]) {
           $j++;
           $i++;
       } else {
       if ($j === 0 && $find[$j] != $src[$i]) {
           $i++;
       }
           $j = $K[$j-1 >= 0 ? $j -1 : 0];
       }
   }
   return false;
}

