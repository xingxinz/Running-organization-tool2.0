<?php
return array(
	//'配置项'=>'配置值'
	///* 数据库设置 */
    'DB_TYPE'               =>  'mysql',     // 数据库类型
    'DB_HOST'               =>  '127.0.0.1', // 服务器地址
    'DB_NAME'               =>  'tryst_joyball',          // 数据库名
    'DB_USER'               =>  'root',      // 用户名
    'DB_PWD'                =>  '',          // 密码
    'DB_PORT'               =>  '3306',        // 端口
	'DB_PREFIX'             =>  'tryst_',    // 数据库表前缀
	'DB_CHARSET'            =>  'utf8',      // 数据库编码
    'DB_DEBUG'  =>  TRUE, // 数据库调试模式 开启后可以记录SQL日志

    //'DB_HOST'=>SAE_MYSQL_HOST_M,// 服务器地址
	// 'DB_NAME'=> SAE_MYSQL_DB,// 数据库名
	// 'DB_USER'=>SAE_MYSQL_USER,// 用户名
	// 'DB_PWD'=> SAE_MYSQL_PASS,// 密码

	'SESSION_AUTO_START' => true, //是否开启session
    //'SHOW_PAGE_TRACE'    => true,
	'MODULE_ALLOW_LIST'    =>    array('Home','Admin'),
 	'DEFAULT_MODULE'       =>    'Home'
);
