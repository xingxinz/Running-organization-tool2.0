<?php
namespace Home\Controller;
use Think\Controller;

class APIController extends Controller {
    private $options = array(
            'token'=>'weixin', //填写你设定的key
            'encodingaeskey'=>'6kzmD2pVGSV1HK9vXKpyFKFUviwI02UquFqltWaDqqd', //填写加密用的EncodingAESKey
            'appid'=>'wx81f64260178ef961', //填写高级调用功能的app id
            'appsecret'=>'630aad385d1eaa2eef012777ce8f9670' //填写高级调用功能的密钥
        );
	public function getActivity(){
		$table=M('Activity');
		$list=$table->order('time desc')->select();

		$User=M('User');
		foreach ($list as $key => $value) {
			$list[$key]['username']=$User->where('id='.$value['user_id'])->getField('username');
            $list[$key]['img']=$User->where('id='.$value['user_id'])->getField('face_url');
			$list[$key]['time']=date('m-d H:i',strtotime($value['time']));
		}
		$this->ajaxReturn($list);
	}

	//签到系统
	public function sign(string $openid){
		$msg_early=array('tooEarly'=>'你签到太早了，作弊可不好哦！','early'=>'你起来的好早，等5点后再来签到吧！');
        $msg_late="07:30后就不能签到了，明天早点起床啊！";
        $hour=time();
        
        //首先验证是否绑定公众号
        $User=M('User');
        $where['wechat_openid']=$openid;
        $info=$User->where($where)->select();

        if(empty($info)){
            $url=U('Home/API/bind','','',true);
            $msg="你还未绑定账号，<a href='".$url."'>请先绑定账号</a>";
            return $msg;
        }else{

            $id=$info[0]['id'];
            $Sign=M('Sign');
            
            $where1['user_id']=$id;
            $lastday=$Sign->where($where1)->order('time desc')->getField('time');   //得到上一次签到时间

            if(date('Ymd',strtotime($lastday))==date('Ymd')){   //判断是否签到
                $msg=array();
                $msg=array('time'=>date('H:i:s',strtotime($lastday)),
                           'color'=>'#337ab7',
                        'days'=>$info[0]['days'],
                        'keep'=>$info[0]['keepdays'],
                        'title'=>'你今天已经签过到了！',
                        'msg'=>'');
                return $msg;
            }
            
            if($hour<mktime(3)){        //5点至7点半签到
                return $msg_early['tooEarly'];
            }else if($hour<mktime(5)){
                return $msg_early['early'];
            }else if($hour>mktime(7,30)){
                $msg=array();
                $msg=array('time'=>"今天未签到",
                           'color'=>'#ff0000',
                        'days'=>$info[0]['days'],
                        'keep'=>$info[0]['keepdays'],
                       'title'=>"你比施建锋起的还晚，还有脸来签到吗，明天07:30之前就要来签到哦",    
                        'msg'=>'');
                return $msg;
            }
            
            $data['time']=date('Y-m-d H:i:s');
            $data['user_id']=$id;
            $Insertid=$Sign->add($data);        //签到存表
            $info[0]['days']++;                 //签到天数+1
            if(!$lastday || date('Ymd',strtotime($lastday." +1 day"))==date('Ymd')){
                $info[0]['keepdays']++;     //连续天数+1
            }else{
                $info[0]['keepdays']=0;     //连续天数置0
            }

            $User->save($info[0]);

            $seed=mt_rand(1,120);
            $SignMsg=M('Signmsg');
            $jitang=$SignMsg->where('id='.$seed)->getField('content');

            $msg=array();
            $msg=array('time'=>date('H:i:s',strtotime($data['time'])),
                       'color'=>'#337ab7',
                        'days'=>$info[0]['days'],
                        'keep'=>$info[0]['keepdays'],
                       'title'=>'恭喜你签到成功！'.$jitang,     //一日之计在于晨，新的一天要加油啊
                        'msg'=>'');
            if($openid == 'oP516v1IfZZV6fbxhzR7nkGR_Wy8'){
                $msg['title']='施总早上好！'.$jitang;
            }

            return $msg;
        }

        
        return $hour;
	}
    
    //绑定账号
    public function bind(){

    	$User=M('User');
        
        
        if(!session('wechat_openid')){
        	$this->getinfo();
        	exit();
        }else{
            $where['wechat_openid']=session('wechat_openid');
        	$info=$User->where($where)->select();
            if(empty($info)){
                $data['username']=session('wechat_nickname');		//写入数据库
                $data['sex']=session('wechat_sex');
                $data['wechat_openid']=session('wechat_openid');
                $data['count']=substr(md5(session('wechat_openid')),0,5);
                $data['face_url']=session('wechat_headimgurl');
                $res=$User->add($data);
                
                if($res !== false){
                    echo "<h1 style=\"font-size:100\">绑定成功</h1>";
                    exit;
                }
                else{
                    echo "<h1 style=\"font-size:100\">绑定失败请联系管理员</h1>";
                    exit;
                }
            }else{
                echo "<h1 style=\"font-size:100\">您已绑定公众号</h1>";
                exit;
            }
        }   
    }
    
    private function getinfo(){
    	$APPID='wx81f64260178ef961';
        $REDIRECT_URI='http://'.$_SERVER['SERVER_NAME'].'/index.php/Home/API/get_user_info';//'http://reserve.sinaapp.com/index.php/Wechat/Show/get_user_info';
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

        $this->redirect('API/bind');
    }
    
    public function getDetail(){        //0错误，1管理员，2成员，3未加入
    	$id=I('id');
    	if($id){
    		$Activity=M('Activity');
    		$Join=M('join');
            $User=M('User');

            $data['type']=3;
    		$data['activity']=$Activity->find($id);
            $data['admin']=$User->find($data['activity']['user_id']);
    		$data['member']=$Join->where('activity_id='.$id)->select();
            if($data['activity']['user_id']==session('user_id')){
                $data['type']=1;
            }else{
                foreach ($data['member'] as $key => $value) {
                    if($value['user_id']==session('user_id')){
                        $data['type']=2;
                        break;
                    }
                }
            }

    	}else{
    		$data['type']=0;
    		$data['err']='null';
    	}

    	$this->ajaxReturn($data);
    }

    /* @return 0-失败;1-成功;2-满员 */
    public function join(){
        $data['activity_id']=I('id');
        if($id){
            $Activity=M('Activity');
            $info=$Activity->find($data['activity_id']);

            if($info['total']==$info['now_total']){
                return $result['type']=2;
            }

            $data['user_id']=session('user_id');
            $Join=M('Join');
            $res1=$Join->add($data);         //成员入表
            $res2=$Activity->where('id='.$data['activity_id'])->setInc('now_total');

            if($res1 !== false && $res2 !== false){
                $result['type']=1;
                $this->ajaxReturn($result);
            }else{
                $result['type']=0;
                $this->ajaxReturn($result);
            }
        }
        else{
            $result['type']=0;
            $this->ajaxReturn($result);
        }
    }

    public function getuserinfo(){
        $id=session('user_id');
        $User=M('User');
        $list=$User->select($id);
        $this->ajaxReturn($list);
    }

    public function createActivity(){
        $data=I('post.');
        $data['user_id']=session('user_id');

        $table=M('activity');
        if($table->create()){
            $result = $table->add($data); // 写入数据到数据库
            if($result){
                $insertId = $result;
            }
        }

        $User=M('User');        //设置手机
        $res=$User->where('id='.$data['user_id'])->setField('phone',$data['phone']);

        redirect(__APP__."/Home/Index/index?id=$insertId");
    }

    public function getMyActivity(){
        $where['user_id']=session('user_id');
        $Activity=M('Activity');
        $Join=M('Join');

        $list=array('admin'=>array(),'member'=>array());
        $list['admin']=$Activity->where($where)->select();
        $joined=$Join->where($where)->select();

        foreach ($joined as $key => $value) {
            $list['member'][$key]=$Activity->find($value['activity_id']);
        }

        $User=M('User');        //获取创建者信息
        foreach ($list as $key => $value){
            foreach($value as $k => $v){
                    $list[$key][$k]['username']=$User->where('id='.$v['user_id'])->getField('username');
                    $list[$key][$k]['img']=$User->where('id='.$v['user_id'])->getField('face_url');
                    $list[$key][$k]['time']=date('m-d H:i',strtotime($v['time']));
            }
        }
        $this->ajaxReturn($list);
    }

    public function getWxSign(){
        $Wechat= new \Org\Com\TPWechat($this->$options);
        $res=$Wechat->getJsSign();
        $this->ajaxReturn($res);
    }
}