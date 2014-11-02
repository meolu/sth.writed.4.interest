<?php
/* *************************************************************************
 * File Name: sudoku.php
 * Author: wushuiyong
 * mail: wushuiyong@huamanshu.com
 * Created Time: Tue 05 Aug 2014 02:02:02 PM
 * ************************************************************************/
error_reporting(E_ALL^E_NOTICE);

class Sudoku {

    const LINES = 9;
    const H = 'h';
    const V = 'v';

    static $X = 'x';

    private $_count = 0;

    private $_guess = false;
    private $_buffer =[];
    private $_forecast = [];
    private $_rollback = 0;

    private $_base = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    private $_map = array(
        array(
            self::H => array(1, 2),
            self::V => array(3, 6),
        ),
        array(
            self::H => array(0, 2),
            self::V => array(4, 7),
        ),
        array(
            self::H => array(0, 1),
            self::V => array(5, 8),
        ),

        array(
            self::H => array(4, 5),
            self::V => array(0, 6),
        ),
        array(
            self::H => array(3, 5),
            self::V => array(1, 7),
        ),
        array(
            self::H => array(3, 4),
            self::V => array(2, 8),
        ),

        array(
            self::H => array(7, 8),
            self::V => array(0, 3),
        ),
        array(
            self::H => array(6, 8),
            self::V => array(1, 4),
        ),
        array(
            self::H => array(6, 7),
            self::V => array(2, 5),
        ),
    );
    private $_table = [];

    private $_left = [];

    private $_trytable = [];

    /**
     * @comment 初始化数独表
     * @param string $table
     */
    function __construct($table) {
        $this->_table = $table;
    }

    /**
     * @comment 横向检查某数字是否存在, 0 => start
     */
    function setHorizontal($field, $h) {
        foreach ($this->_trytable[$field] as $k => &$v) {
            $line = intval($h / 3);
            $k >= $line * 3 && $k < ($line + 1) * 3 && $v = self::$X;
        }
    }

    /**
     * @comment 纵向检查某数字是否存在
     */
    function setVerital($field, $c) {
        foreach ($this->_trytable[$field] as $k => &$v) {
            $line = $c % 3;
            ($k % 3) == $line && $v = self::$X;
        }
    }


    /**
     * @comment 获取横向数字
     */
    function getHorizontal($field, $pos) {
        $horizontal = [];
        $horNum = intval($pos / 3) * 3;
        $allField = array_merge($this->_map[$field][self::H], array($field));
        sort($allField);
        foreach ($allField as $field) {
            for ($i = $horNum; $i < $horNum + 3; $i++) {
                $horizontal[] = $this->_table[$field][$i];
            }
        }
        return $horizontal;
    }

    /**
     * @comment 获取纵向数字
     */
    function getVerital($field, $pos) {
        $coll  = $pos % 3; //$this->getVNum($pos, $v);
        $verital = [];
        $allField = array_merge($this->_map[$field][self::V], array($field));
        sort($allField);
        foreach ($allField as $field) {
            for ($i = $coll; $i < self::LINES - 2; $i += 3) {
                $verital[] = $this->_table[$field][$i];
            }
        }
        return $verital;
    }

    function setLeft($field) {
        $this->_left = $this->_base;
        for ($i = 0; $i < self::LINES; $i++) {
            unset($this->_left[$this->_table[$field][$i]-1]);
        }
    }

    /**
     * @comment 开始求解
     *
     */
    function explain() {
        while (!$this->isComplete()) {
            $mark = $this->_count;
            // 直接用数字来筛掉
            $this->solutionSingleNum();
            // 不行再看行、列、区1-9哪个可填
            //sleep(1); 看演示
            $mark == $this->_count && $this->solutionClean();
            //sleep(1); 看演示
            // 如果这样都不行，那只能猜了
            $mark == $this->_count && $this->solutionGuess();
            //echo "#", PHP_EOL;
        }
    }

    /**
     * @comment 求解方法1 单个数字扫描
     *
     */
    function solutionSingleNum() {
        for ($curr = 0; $curr < self::LINES; $curr++) {
            $this->_trytable = $this->_table;
            $this->setLeft($curr);
            foreach ($this->_left as $v) {
                $this->_trytable = $this->_table;
                foreach ($this->_map[$curr][self::H] as $field) {
                    foreach ($this->_table[$field] as $k => $item) {
                        $item == $v && $this->setHorizontal($curr, $k);
                    }
                }
//                echo "----- $v ------",PHP_EOL;
                foreach ($this->_map[$curr][self::V] as $field) {
                    foreach ($this->_table[$field] as $k => $item) {
                        $item == $v && $this->setVerital($curr, $k);
                    }
                }
                $fill = $this->isFill($curr);
                if (!$fill) continue;
                foreach ($this->_trytable[$curr] as $k => $item) {
                    if ($item === 0) {
                        $this->_table[$curr][$k] = $v;
                        $this->_count++;
#                        echo "--single--", PHP_EOL;
#                        $this->show();
                        break;
                    }
                }
//                print_r($this->_table[$curr]);
            }
        }
    }

    /**
     * @comment 求解方法2 看行、列、区1-9哪个可填
     *
     */
   function solutionClean() {
        for ($curr = 0; $curr < self::LINES; $curr++) {
            foreach ($this->_table[$curr] as $k => $v) {
                if (0 === $v) {
                    // 单个9宫格内可填数字
                    $this->_left = array_diff($this->_base, $this->_table[$curr]);
                    //$h = $this->getHNum($curr, $k);
                    //echo "h> $h $k", PHP_EOL;
                    $horizontalArr = $this->getHorizontal($curr, $k);
                    //print_r($horizontalArr);

                    //$c = $this->getVNum($curr, $k);
                    //echo "=== line $v", PHP_EOL;
                    $veritalArr = $this->getVerital($curr, $k);
                    $collection = array_merge($horizontalArr, $veritalArr);
                    $collection = array_unique($collection);
                    $this->_left = array_diff($this->_base, $collection);
                    if (1 === count($this->_left)) {
                        //echo "==$curr, $k", PHP_EOL;
                        //print_r($veritalArr); print_r($horizontalArr);
                        $this->_table[$curr][$k] = array_pop($this->_left);
                        $this->_count++;
                        //echo "--clean--", PHP_EOL;
                        //$this->show();
                        break;
                    }
                }
            }
        }
    }

    /**
     * @comment 求解方法3 不行就只能猜了
     *
     */
   function solutionGuess() {
        if (!$this->_guess) {
            $this->guess();
        }
        $this->_table = $this->_buffer;
        $forecast = current($this->_forecast);
        next($this->_forecast);
        #echo "--guess--\n";
        $this->_table[$forecast[0]][$forecast[1]] = $forecast[2];
    }

    function guess() {
        $this->_guess  = true;
        $this->_buffer = $this->_table;
        for ($curr = 0; $curr < self::LINES; $curr++) {
            foreach ($this->_table[$curr] as $k => $v) {
                if (0 === $v) {
                    // 单个9宫格内可填数字
                    $this->_left = array_diff($this->_base, $this->_table[$curr]);
                    $horizontalArr = $this->getHorizontal($curr, $k);
                    $veritalArr = $this->getVerital($curr, $k);
                    $collection = array_merge($horizontalArr, $veritalArr);
                    $collection = array_unique($collection);
                    $this->_left = array_diff($this->_base, $collection);
                    $guessBits = count($this->_left);
                    foreach ($this->_left as $l) {
                        $this->_forecast[$guessBits][] = [$curr, $k, $l];
                    }
                }
            }
        }
        sort($this->_forecast);
        $t = [];
        foreach ($this->_forecast as $v) {
            foreach ($v as $i) {
                $t[] = $i;
            }
        }
        $this->_forecast = $t;
    }


    function getHNum($field, $k) {
        return intval($field / 3) * 3 + intval($k / 3);
    }

    function getVNum($field, $k) {
        return $field % 3 * 3 + $k % 3;
    }

    function isFill($field) {
        $ret = array_count_values($this->_trytable[$field]);
        return $ret[0] === 1;
    }

    function isComplete() {
        for ($i = 0; $i < self::LINES; $i++) {
            if (array_count_values($this->_table[$i])[0]) {
                return false;
            }
        }
        return true;
    }

    function show() {
        for ($i = 0; $i < 7; $i+=3) {
            for ($j = $i; $j < $i + 3; $j++) {
                for ($k = 0; $k < 3; $k++) {
                    printf("%s ", $this->_table[$j][$k] ? $this->_table[$j][$k] : ' ');
                }
            }
            echo PHP_EOL;
            for ($j = $i; $j < $i + 3; $j++) {
                for ($k = 3; $k < 6; $k++) {
                    printf("%s ", $this->_table[$j][$k] ? $this->_table[$j][$k] : ' ');
                }
            }
            echo PHP_EOL;
            for ($j = $i; $j < $i + 3; $j++) {
                for ($k = 6; $k < 9; $k++) {
                    printf("%s ", $this->_table[$j][$k] ? $this->_table[$j][$k] : ' ');
                }
            }
            echo PHP_EOL;
        }
        echo PHP_EOL;
    }
}

