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
            'appid'=>'wx68fdd3097b99d582', //填写高级调用功能的app id
            'appsecret'=>'b43365db0cb477e11734b852d2a37c6d' //填写高级调用功能的密钥
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
                    }else if($text=='pay'){
                        $weObj->text('http://'.$_SERVER['SERVER_NAME'].'/index.php/Home/PayTest/index')->reply();
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
         				$str[0]="终于等到你".json_decode('"\ud83d\ude48"')."\n";
						$str[1]="\n这里有最及时的体育资讯\n这里有最in最嗨的体育活动\n这里有最靠谱的小编\n帮你实现科学运动健康瘦身\n";
                        $str[2]="\n没错".json_decode('"\ud83d\ude46"')."\n这里是全宇宙最有态度的跑步健身公众号。\n趣健跑".json_decode('"\ud83d\udc83"')."\n";
                        $str[3 ]="\n如果你也是不有趣会死星人，欢迎随时戳下方菜单栏涨姿势。\n欢迎调戏，我们很正经。".json_decode('"\ud83c\udf1a"');
                        $weObj->text($str[0].$str[1].$str[2].$str[3])->reply();
            		exit;
                    break;
                        
            	case \Org\Com\Wechat::EVENT_MENU_CLICK:
                    $key=$event['key'];
                    $openid=$msg->getRevFrom();
            		$unionid=$weObj->getUserInfo($openid);
            // $weObj->text("$key")->reply();
                    break;
                
            	default:
            		//$weObj->text("$event[event]")->reply();
            		exit;
         }
        
        switch($key){
            case V1001_SIGN:
            //$weObj->text("$openid")->reply();
                $API=A('API');
                $msg=$API->sign($unionid['unionid']);
                $weObj->text("$msg")->reply();

            	exit;
            
            case V1001_ASK:

                $weObj->text("有任何问题都可以留言，小编看到后会回复你哒！")->reply();

            	exit;
            
            case V1001_CHAT:
            	$weObj->text("欢迎调戏，我们很正经。".json_decode('"\ud83c\udf1a"'))->reply();

            	exit;
            
            case V1001_WAIT:
            	$weObj->text("敬请期待！")->reply();
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
