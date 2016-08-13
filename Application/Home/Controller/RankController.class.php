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
            if(!isset($_SESSION['user_id'])){
                $url = 'http://'.$_SERVER['SERVER_NAME'].'/index.php/Home/Rank/signRank';
                $API->getOauth($url);
                die();
            }else{
                echo "<h1>尚未绑定微信！</h1>";
                die();
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
	
	public function dailyRank(){
        $API=A('API');
		
        if(!isset($_SESSION['wechat_openid'])){
            if(!isset($_SESSION['user_id'])){
                $url = 'http://'.$_SERVER['SERVER_NAME'].'/index.php/Home/Rank/dailyRank';
                $API->getOauth($url);
                die();
            }else{
                echo "<h1>尚未绑定微信！</h1>";
                die();
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
