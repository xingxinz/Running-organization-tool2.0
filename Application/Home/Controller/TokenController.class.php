<?php
/*
    乐享其约
*/
namespace Home\Controller;
use Think\Controller;
//import("Org.Com.Wechat");
//require THINK_PATH.'Library/Org/Com/wechat.class.php';
class TokenController extends Controller {
    public function index(){
        
        define("TOKEN", "joyball");
      
        if (isset($_GET['echostr'])) {
          
            $this->valid();
          
        }else{
           
            //$this->responseMsg();
            $this->reply();
           
        }
       
    }

    public function reply(){
        $options = array(
            'token'=>'joyball', //填写你设定的key
            'EncodingAESKey'=>'BgjROqIeSw1xgheDGUmLbmZEcMhTlPyvrz3DKarJNmC',
            'appid'=>'wx81f64260178ef961', //填写高级调用功能的app id
            'appsecret'=>'630aad385d1eaa2eef012777ce8f9670' //填写高级调用功能的密钥
        );
        $weObj = new \Org\Com\Wechat($options);
        $weObj->valid();
        $msg=$weObj->getRev();
        $type=$msg->getRevType();
        switch($type) {
                case \Org\Com\TPWechat::MSGTYPE_TEXT:
                    $text=$msg->getRevContent();
                    if($text=='GuoxUnique'){
                        $weObj->text("http://joyball.guoxunique.com")->reply();
                    }
                    exit;
                    break;
                case \Org\Com\TPWechat::MSGTYPE_EVENT:
            		$event=$msg->getRevEvent();
                    break;
                case \Org\Com\TPWechat::MSGTYPE_IMAGE:
                    $weObj->text("别闹，我还不会识别图片额")->reply();
            		exit;
                    break;
                default:
                    $weObj->text("help info")->reply();
            		exit;
         }
        
        
        switch($event['event']) {
                case \Org\Com\Wechat::EVENT_SUBSCRIBE:
                    $weObj->text("hello,欢迎体验持健账号")->reply();
            		exit;
                    break;
                        
            	case \Org\Com\Wechat::EVENT_MENU_CLICK:
                    $key=$event['key'];
                    $openid=$msg->getRevFrom();
            // $weObj->text("$key")->reply();
                    break;
                
            	default:
            		//$weObj->text("$event[event]")->reply();
            		exit;
         }
        
        switch($key){
            case V1001_SIGN:
                $API=A('API');
                $msg=$API->sign($openid);
                if(!is_array($msg)){
                    $weObj->text("$msg")->reply();
                }
            	else{
                    $data=array(
                        "touser"=>$openid,
                        "template_id"=>"Of_uzcvexW5Gd20FBBqVofyXFslO042VDqoC4gGWh4c",
                        "url"=>"",
                        "topcolor"=>"#FF0000",
                        "data"=>array(
                            "first"=>array(
                                "value"=>"$msg[title]",
                                "color"=>"$msg[color]"    //参数颜色
                                ),
                            "keyword1"=>array(
                                "value"=>"$msg[time]",
                                "color"=>"$msg[color]"    //参数颜色
                                ),
                            "keyword2"=>array(
                                "value"=>"$msg[days]",
                                "color"=>"#173177"    //参数颜色
                                ),
                            "keyword3"=>array(
                                "value"=>"$msg[keep]",
                                "color"=>"#173177"    //参数颜色
                                ),
                            "remark"=>array(
                                "value"=>"$msg[msg]",
                                "color"=>"#ff0000"    //参数颜色
                                )
                            )
                        );
                    $weObj->sendTemplateMessage($data);
                    
                }
            	exit;
            
            default:
            	exit;
        }
        
                    
    }

    public function valid()
    {
        $echoStr = $_GET["echostr"];
        if($this->checkSignature()){
            echo $echoStr;
            exit;
        }
    }

    private function checkSignature()
    {
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];

        $token = TOKEN;
        $tmpArr = array($token, $timestamp, $nonce);
        sort($tmpArr,SORT_STRING);  //  正排序
        $tmpStr = implode( $tmpArr );   //数组变为字符串
        $tmpStr = sha1( $tmpStr );

        if( $tmpStr == $signature ){
            return true;
        }else{
            return false;
        }
    }
    
    
    
}
?>