<?php

include dirname(__FILE__) .  '/sudoku.php';
include dirname(__FILE__) .  '/conf-sudoku.php';
$sudo = new Sudoku($tableHardHard1);
$sudo->show();
$sudo->explain();
$sudo->show();
