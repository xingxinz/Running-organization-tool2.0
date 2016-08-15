<?php
$st= Think\Think::instance('SaeStorage'); 
 return array(
     'TMPL_PARSE_STRING'=>array(
         '/joyball/1/Public/logs/' => $url=$st->getUrl('Public','logs') ,
    )
 );