<?php

/**
 * @author wushuiyong@huamanshu.com
 * @date 2014/11/14 16:21:34
 **/

if ('POST' == $_SERVER['REQUEST_METHOD']) {
    $svnRepo = trim($_POST['svn']);
    $baseDir = trim($_POST['dir']);
    $files   = explode("\n", trim($_POST['files']));
    $files   = array_map('trim', $files);
    $result  = array();
    foreach ($files as $file) {
        if (empty($file)) continue;
        $destFile = rtrim($baseDir, '/') . '/' . ltrim($file, '/');
        $sourceFile = ltrim($file, '/');
        system("sh ./svn_sync.sh " . $svnRepo . " " . $sourceFile . " " .$destFile, $out);
        $result[$sourceFile] = $out;
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SVN 更新工具 v0.1</title>
</head>
<body>
    <form action="/svn.php" enctype="multipart/form-data" method="POST">
    版本：<input type="text" name="svn" style="width:600px" value="">
    <br/><br/>目录：<input name="dir" style="width:300px"><br/><br/>
    <textarea rows="10" cols="100" name="files"><?php echo $_POST['files'] ?></textarea>
    <br/><br/>
    <?php
        if ($result) {
            foreach ($result as $k => $v) {
                printf("%s <span style='color:%s'>%s</span><br>",
                    $k, $v ? "red" : "green", $v ?  "fail" : "ok");
            }
        }
    ?>
    <input type="submit" value="更新">
    </form>
</body>
<script src="http://code.jquery.com/jquery-latest.js"></script>
<script>
function addCookie(name, value, expiresHours){
    var cookieString = name+"="+escape(value);
    //判断是否设置过期时间
    if (expiresHours>0) {
        var date = new Date();
        date.setTime(date.getTime+expiresHours*3600*1000);
        cookieString = cookieString+"";
        expires = ""+date.toGMTString();
    }
    document.cookie = cookieString;
}

function getCookie(name){
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i<arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] == name) {
            return arr[1];
        }
    }
    return "";
}

var auto_dir = function(svn) {
    $.ajax({
        type: "POST",
        url: "/svn2dir.php",
        data: {svn: svn},
        dataType: "json",
        success: function(data) {
            if (data.errno) {
                $('input[name=dir]').val(data.dir);
                addCookie('svn', svn);
            }
        }
    })
}

$('input[name=svn]').keyup(function() {
    var svn = $(this).val();
    auto_dir(svn);
});

var cookie_svn = decodeURIComponent(getCookie('svn'));
if (cookie_svn) {
    $('input[name=svn]').val(cookie_svn);
    auto_dir(cookie_svn);
}
</script>
</html>
