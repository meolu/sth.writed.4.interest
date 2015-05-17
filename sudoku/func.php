<?php
/* *****************************************************************
 * @Author: wushuiyong
 * @Created Time : 六  5/16 17:46:14 2015
 *
 * @File Name: func.php
 * @Description:
 * *****************************************************************/
public function createMonthlySettlementReport() {
    $allPublisher = $dataPublisher = $publisher = [];
    
    $separator = '#'; //txt的分隔符
    $content = 'publisherid' . $separator . 'systemInput' . $separator . 'mediaConfirm';
    
    $month = date('Y-m', strtotime('-1 month'));
    $fileDir = CONFIG_DOWNLOAD_FILE_BASE_PATH . '/alliance/settlement/';
    
    //获取网盟有效网站主
<<<<<<< HEAD
    $sql = 'SELECT `ID`, `qihu_publisherid` FROM `publisher` WHERE `source_platform` = 1';
=======
    $sql = 'SELECT distinct `ID`, `qihu_publisherid` FROM `publisher` WHERE `source_platform` = 1 AND `disabled` = 0';
>>>>>>> origin/master
    $res = Yii::app() -> db -> createCommand($sql) -> queryAll();
    
    if ($res) {
        foreach ($res as $row) {
            $allPublisher[$row['ID']] = $row['qihu_publisherid'];
        }
    }
    unset($res);
    
    //查询media_income表中当月的唯一publisherid
    $sql = "SELECT DISTINCT(`publisherid`) AS publisherid FROM `media_income` WHERE `date` = '$month'";
    $res = Yii::app() -> db -> createCommand($sql) -> queryAll();
    
    if ($res) {
        foreach ($res as $row) {
            $dataPublisher[] = $row['publisherid'];
        }
    }
    unset($res);
    
    //找出两者的并集
    $publisher = array_intersect(array_keys($allPublisher), $dataPublisher);
    
    //查找并集的数据并做统计
    if ($publisher) {
        $publisher = implode(',', $publisher);
    
        $sql = "SELECT `publisherid`, SUM(`estimatedincome`) AS estimatedincome, SUM(`income`) AS income
                FROM `media_income`
                WHERE `date` = '$month' AND `publisherid` IN ($publisher)
                GROUP BY `publisherid`";
    
        $res = Yii::app() -> db -> createCommand($sql) -> queryAll();
    
        if ($res) {
            //生成文件
        
            $fileName = $fileDir . $month;
            $fp = fopen($fileName . '.txt', 'w');
        
            fwrite($fp, $content . "\n");
        
            foreach ($res as $row) {
                $content = [];
                $content[] = $allPublisher[$row['publisherid']];
                $content[] = $row['estimatedincome']; //系统录入费用
                $content[] = $row['income']; //媒介确认费用
            
                fwrite($fp, implode($separator, $content) . "\n");
            }
        
            fclose($fp);
        
            //打包文件
            $zip = new ZipArchive();
            if ($r = $zip -> open($fileName . '.zip', ZIPARCHIVE::CREATE)) {
                $zip -> addFile($fileName . '.txt', $month . '.txt');
                $zip -> close();
            }
        }
    }
}
