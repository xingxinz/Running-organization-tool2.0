<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
        $User=M('User');
    	 if($this->is_weixin()){
    	 	if(!session('wechat_openid')){
                 $this->getinfo();
                exit();
            }
            $where['wechat_openid']=session('wechat_openid');

            $users=$User->where($where)->select();

                // var_dump($_SESSION);
                // echo '<br>';
                // var_dump($users[0]);
                // die();

            if($users){
                    //如果已经存在则直接登陆
                session('count',$users[0]['count']);
                session('username',$users[0]['username']);
                session('group',$users[0]['group']);
                session('user_id',$users[0]['id']);
                session('phone',$users[0]['phone']);
                session('sex',$users[0]['sex']);

                if(!$users[0]['face_url']){
                        //如果头像为空
                    $data=$users[0];
                    $data['face_url']=session('wechat_headimgurl');

                    $result=$User->setField($data);
                }
            }
            else{       //不存在直接注册
                $data['username']=session('wechat_nickname');
                $data['sex']=session('wechat_sex');
                $data['wechat_openid']=session('wechat_openid');
                $data['count']=substr(md5(session('wechat_openid')),0,5);
                $data['face_url']=session('wechat_headimgurl');
                $res=$User->add($data);
                session('user_id',$res);
                session('group',4);
                session('count',$data['count']);
                session('username',$data['username']);
            }
    	 }elseif($_SERVER['SERVER_NAME']=='localhost'){
            session('user_id',999);
            session('group',4);
            session('count','testcount');
            session('username','测试用户名');
         }

        // $API=A('API');
        // $list=$API->getActivity();
        // $this->assign('list',$list);

        //获取我加入的activity
        // $id=session('user_id');
        // if($id){
        //     $Join=M('Join');
        //     $mylist=$Join->where('tryst_join.user_id='.$id)->join("JOIN tryst_activity ON tryst_join.activity_id=tryst_activity.id")->select();
        //     $this->assign('mylist',$mylist);
        // }


        $this->display();
    }

    protected function is_weixin(){
        if ( strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger') !== false ) {
                return true;
        }
        return false;
    }

    private function getinfo(){
    	$APPID='wx81f64260178ef961';
        $REDIRECT_URI='http://'.$_SERVER['SERVER_NAME'].'/index.php/Home/Index/get_user_info';//'http://reserve.sinaapp.com/index.php/Wechat/Show/get_user_info';
        //var_dump($REDIRECT_URI);
        //die();
        $scope='snsapi_userinfo';//需要授权
        $state='login';
        $url='https://open.weixin.qq.com/connect/oauth2/authorize?appid='.$APPID.'&redirect_uri='.urlencode($REDIRECT_URI).'&response_type=code&scope='.$scope.'&state='.$state.'#wechat_redirect';

        header("Location:".$url);
    }

    public function get_user_info(){
        $code = $_GET['code'];//获取code
        $appid='wx81f64260178ef961';
        $appsecret='630aad385d1eaa2eef012777ce8f9670';
        //通过code换取网页授权access_token
        $weixin =  file_get_contents("https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$appid."&secret=".$appsecret."&code=".$code."&grant_type=authorization_code");
        //对JSON格式的字符串进行编码
        $jsondecode = json_decode($weixin);
        //转换成数组
        $array = get_object_vars($jsondecode);
        //输出openid
        $openid = $array['openid'];
        $access_token=$array['access_token'];

        // echo $openid;
        $options = array(
            'token'=>'weixin', //填写你设定的key
            'encodingaeskey'=>'6kzmD2pVGSV1HK9vXKpyFKFUviwI02UquFqltWaDqqd', //填写加密用的EncodingAESKey
            'appid'=>'wx81f64260178ef961', //填写高级调用功能的app id
            'appsecret'=>'630aad385d1eaa2eef012777ce8f9670' //填写高级调用功能的密钥
        );

        $weObj = new \Org\Com\WechatAuth($options['appid'],$options['appsecret'],$access_token);
        $user=$weObj->getUserInfo($openid);
        session('wechat_nickname',$user['nickname']);
        session('wechat_headimgurl',$user['headimgurl']);
        session('wechat_sex',$user['sex']);
        session('wechat_openid',$user['openid']);

        $this->redirect('Index/index');
    }

    
}