<?php
include dirname(__FILE__) . '/nb.php';
$kw = $_GET['kw'] ? $_GET['kw'] : "seperate";

$b = new BeiYeSi();

$match = $b->getSort($kw);
var_dump($match);
echo $b->getWord();





