<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT");
header("Content-type:application/json; charset=utf-8");

$svnRepo = $_POST['svn'];
$svn = dirname($svnRepo);

$svn2dir = array(
    'https://great-company/branches/lbsimage' => '/dir/of/lbsimage',
    'https://great-company/branches/app' => '/dir/of/app',
    'https://great-company/branches/webroot' => '/dir/of/webroot',

);

$data = array(
    'errno' => (int)isset($svn2dir[$svn]),
);

if (isset($svn2dir[$svn])) {
    $data['dir'] = $svn2dir[$svn];
}

echo json_encode($data);

