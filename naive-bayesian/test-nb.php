<?php
include dirname(__FILE__) . '/nb.php';
$kw = $argv[1] ? $argv[1] : "smilar";

$nb = new BeiYeSi();
// 初始化数据字典，需要先把include conf-nb.php和this->dist = Conf::$DIST注释
// $nb->initDist();die;
$match = $nb->getSimilar($kw);
var_dump($match);

