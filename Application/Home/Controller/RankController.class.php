<?php
namespace Home\Controller;
use Think\Controller;

class RankController extends Controller {
    private $options = array(
            'token'=>'weixin', //填写你设定的key
            'encodingaeskey'=>'6kzmD2pVGSV1HK9vXKpyFKFUviwI02UquFqltWaDqqd', //填写加密用的EncodingAESKey
            'appid'=>'wx81f64260178ef961', //填写高级调用功能的app id
            'appsecret'=>'630aad385d1eaa2eef012777ce8f9670' //填写高级调用功能的密钥
        );

	public function _initialize(){
		if ($_SERVER['SERVER_NAME'] == 'localhost'){
			session('wechat_openid','123456');
			session('user_id','999');
		}
	}	

	public function signRank(){
        $API=A('API');
        if(!isset($_SESSION['wechat_openid'])){
            $url = 'http://'.$_SERVER['SERVER_NAME'].'/index.php/Home/Rank/dailyRank';
            $API->getOauth($url,true);
            die();
                
        }else{
        	if(!isset($_SESSION['user_id'])){
                $User=M('User');
                $userinfo=$User->where('wechat_openid='.session('wechat_openid'))->find();
                if(!$userinfo){
                    echo "<h1>尚未绑定微信！</h1>";
                    die();
                }else{
                    session('user_id',$info['id']);
                }
            }
            
		$Rank=M('User');
		$list=$Rank->where('days > 0')->order('point desc,days desc')->select();
		$myRecord=$Rank->where('id='.session('user_id'))->find();

		foreach($list as $key => $val){ //确定用户排名
			if($val['id'] == session('user_id')){
				$myRecord['rank']=$key+1;
			}
		}
		if($myRecord['rank']==null){
			$myRecord['rank']=-1;
		}
		$this->assign('myRecord',$myRecord);
		$this->assign('list',$list);

		$this->display();
        }
	}
	
	public function dailyRank(){
        $API=A('API');
		
        if(!isset($_SESSION['wechat_openid'])){
            $url = 'http://'.$_SERVER['SERVER_NAME'].'/index.php/Home/Rank/dailyRank';
            $API->getOauth($url,true);
            die();
                
        }else{
        	if(!isset($_SESSION['user_id'])){
                //die();
                
                $User=M('User');
                $userinfo=$User->where('wechat_openid="'.session('wechat_openid').'"')->find();
                
                if(empty($userinfo)){
                    echo "<h1>尚未绑定微信！</h1>";
                    session(null);
                    die();
                }else{
                    session('user_id',$userinfo['id']);
                }
            }
            $Rank=M('Sign');
            $User=M('User');
            $time=strtotime("today");
            $list=$User->join('LEFT JOIN __SIGN__ ON __USER__.id=__SIGN__.user_id AND UNIX_TIMESTAMP(__SIGN__.time) > '.$time)->where('days > 0')->order('-(UNIX_TIMESTAMP(time)) desc,days desc')->select();
            $myRecord=$User->where('tryst_user.id='.session('user_id'))->join('LEFT JOIN __SIGN__ ON __USER__.id=__SIGN__.user_id')->order('UNIX_TIMESTAMP(time) desc')->find();
    
            foreach($list as $key => $val){ //确定用户排名
                if($val['user_id'] == session('user_id')){
                    $myRecord['rank']=$key+1;
                }
            }
            if($myRecord['rank']==null){
                $myRecord['rank']=-1;
            }
            $this->assign('myRecord',$myRecord);
            $this->assign('list',$list);
    
            $this->display();
        }
	}

}
