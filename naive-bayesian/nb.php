<?php
/* *************************************************************************
 * File Name: nb.php
 * Author: wushuiyong
 * mail: wushuiyong@huamanshu.com
 * Created Time: Sat 02 Nov 2013 10:20:24 AM
 * ************************************************************************/

// 14 朴素贝叶斯拼写纠正算法
/**
 * 1.dist
 * 2.change keyword
*/
include_once  dirname(__FILE__) . '/conf-nb.php';

class BeiYeSi {

    public static $LETTERS = array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');

    public $dist  = array();

    public static $MATCH = array();

    public function __construct() {
        // conf-nb.php $dist
        $this->dist = Conf::$DIST;
    }

    /**
     * 把大文本big.txt分割出所有单词转存到conf-nb.php中
     *
     */
    public static function initDist() {
        $contents = file_get_contents('big.txt');

        $words = str_word_count($contents, 1);
        $distArr = array();
        foreach($words as $v) {
            $distArr[$v] = !isset($distArr[$v]) ? 1 : ($distArr[$v] + 1);
        }
        if (is_file('conf-nb.php') && is_writable('conf-nb.php')) {
            $f = fopen('conf-nb.php', 'w+');
            fwrite($f, "<?php \nclass Conf {\n public static" . ' $DIST = ' . var_export($distArr, true) . ";\n}");
            fclose($f);
        } else {
        }
    }

    /**
     * 做汉明距离为1的变形
     * delete    to t
     * transpose to ot
     * replace   to tt
     * insert    to tot
     **/
    public function alterOne($keyword) {
        $keyword = strtolower($keyword);
        $strlen  = strlen($keyword);
        $match   = array();

        switch('') {
            default :
            case 'delete' :
                for ($i = 0; $i < $strlen; $i ++) {
                    $match[] = substr_replace($keyword, '', $i, 1);
                }
                //break;
            case 'transpose' :
                for ($i = 0; $i < $strlen - 1; $i ++) {
                    $current    = substr($keyword, $i, 1);
                    $next       = substr($keyword, $i + 1, 1);
                    $tempStr    = substr_replace($keyword, $current, $i + 1, 1);
                    $match[] = substr_replace($tempStr, $next, $i, 1);
                }
                //break;
            case 'replace' :
                for ($i = 0; $i < $strlen; $i ++) {
                    foreach (self::$LETTERS as $letter) {
                        $match[] = substr_replace($keyword, $letter, $i, 1);
                    }
                }
            case 'insert' :
                for ($i = 0; $i <= $strlen; $i ++) {
                    foreach (self::$LETTERS as $letter) {
                        $match[] = substr($keyword, 0, $i) . $letter . substr($keyword, $i, $strlen);
                    }
                }
                break;
        }
        return array_unique($match);
    }

    public function getSimilar($keyword, $length = 10) {
        $similar = $this->alterOne($keyword);
        $match = array();

        foreach ($similar as $v) {
            if (isset($this->dist[$v])) {
                $match[$v] = $this->dist[$v];
            }
        }
        unset($similar);
        arsort($match);
        return array_slice($match, 0, $length);
    }

}

