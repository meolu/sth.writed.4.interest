<?php
error_reporting(E_ALL ^ E_NOTICE);

// 14 朴素贝叶斯拼写纠正算法
/**
 * 1.dist
 * 2.change keyword
*/
class BeiYeSi {

    public static $LETTERS = array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');

    public static $DIST  = array();

    public static $MATCH = array();

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

        if (is_file('conf-nb.php') && is_writable('nb-conf.php')) {
            $fileHandle = fopen('dist.php', 'w');
            fwrite($fileHandle, "<?php \r\n" . '$dist = ' . var_export($distArr, true) . ';');
            fclose($fileHandle);
        } else {
        }
    }

    public function mountDist() {
        include_once  dirname(__FILE__) . '/conf-nb.php';
        self::$DIST = $dist;
    }

    public function alterOne($keyword) {
        $keyword     = strtolower($keyword);
        $strlen      = strlen($keyword);
        self::$MATCH = array();

        switch('') {
            default :
            case 'delete' :
                for ($i = 0; $i < $strlen; $i ++) {
                    self::$MATCH[] = substr_replace($keyword, '', $i, 1);
                }
                //break;
            case 'transpose' :
                for ($i = 0; $i < $strlen - 1; $i ++) {
                    $current    = substr($keyword, $i, 1);
                    $next       = substr($keyword, $i + 1, 1);
                    $tempStr    = substr_replace($keyword, $current, $i + 1, 1);
                    self::$MATCH[] = substr_replace($tempStr, $next, $i, 1);
                }
                //break;
            case 'replace' :
                for ($i = 0; $i < $strlen; $i ++) {
                    foreach (self::$LETTERS as $letter) {
                        self::$MATCH[] = substr_replace($keyword, $letter, $i, 1);
                    }
                }
            case 'insert' :
                for ($i = 0; $i <= $strlen; $i ++) {
                    foreach (self::$LETTERS as $letter) {
                        self::$MATCH[] = substr($keyword, 0, $i) . $letter . substr($keyword, $i, $strlen);
                    }
                }
                //break;
                break;
        }
        self::$MATCH = array_unique(self::$MATCH);
    }

    public function getSort($keyword) {
        self::alterOne($keyword);
        self::mountDist();
        $alter = self::$MATCH;
        // var_dump(self::$MATCH);
        self::$MATCH = array();

        foreach ($alter as $value) {
            if (isset(self::$DIST[$value])) {
                self::$MATCH[$value] = self::$DIST[$value];
            }
        }
        arsort(self::$MATCH);
        return self::$MATCH;
    }

    public function getWord() {
        return current(array_keys(self::$MATCH));
    }
}

