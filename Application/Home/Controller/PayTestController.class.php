<?php
namespace Home\Controller;
use Think\Controller;

class PayTestController extends Controller {
	public function _initialize(){
		//引入WxPayPubHelper
		vendor('WxPay.WxPayJsApi');
        vendor('WxPay.notify');
	}

	public function index(){
		//①、获取用户openid
		$tools = new \JsApiPay();
        $openId = $tools->GetOpenid();
        $data= json_encode($tools->data);
		$this->assign('user',$data);
		//②、统一下单
        //首先 
		$input = new \WxPayUnifiedOrder();
		$input->SetBody("趣键跑早起挑战");
        $input->SetAttach($tools->data["access_token"]);
		$input->SetOut_trade_no(\WxPayConfig::MCHID.date("YmdHis"));
		$input->SetTotal_fee("1");
		$input->SetTime_start(date("YmdHis"));
		$input->SetTime_expire(date("YmdHis", time() + 600));
		$input->SetGoods_tag("早起挑战");
        $input->SetNotify_url("http://joyball.guoxunique.com/index.php/Home/PayTest/notify");
		$input->SetTrade_type("JSAPI");
		$input->SetOpenid($openId);
        try{
			$order = \WxPayApi::unifiedOrder($input);
        }catch (\Exception $e){
            $this->redirect('PayText/index');
        }
		
		$jsApiParameters = $tools->GetJsApiParameters($order);
		
        $this->assign('jsApiParameters',$jsApiParameters);
        
		//获取共享收货地址js函数参数
        //$editAddress = $tools->GetEditAddressParameters();
        //$this->assign('editAddress',$editAddress);
        
		//③、在支持成功回调通知中处理成功之后的事宜，见 notify.php
		/**
		 * 注意：
		 * 1、当你的回调地址不可访问的时候，回调通知会失败，可以通过查询订单来确认支付是否成功
		 * 2、jsapi支付时需要填入用户openid，WxPay.JsApiPay.php中有获取openid流程 （文档可以参考微信公众平台“网页授权接口”，
		 * 参考http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html）
		 */
		
        $Pay=M('Signpay');
        $userid= isset($_SESSION['user_id'])?session('user_id'):null;
        if($userid){
            $paid=$Pay->where('user_id='.$userid)->find();
        }
        if(!empty($paid)){
            $time=strtotime(date('Y-m-d',$paid['time'])." +1 day");
            $Sign=M('Sign');
            $days=count($Sign->where("user_id=".$userid." AND UNIX_TIMESTAMP(time) >".$time)->select());
        	$this->assign("days",$days);
        }
        $this->assign("paid",$paid);
        
        $this->display('index');
	}
    
    public function notify(){	//回调处理
        $Log=M('log');		//记录日志
        $msg='OK';
        // 缓存初始化
		S(array('expire'=>7200));
        
        $xml = $GLOBALS['HTTP_RAW_POST_DATA'];	//获取数据
		//如果返回成功则验证签名
		try {
			$result = \WxPayResults::Init($xml);
		} catch (\WxPayException $e){
			$msg = $e->errorMessage();
            $Log->add(array('type'=>"ERROR",'log'=>"$msg"));
            $this->callback($msg);
            exit();
		}
        
        //处理数据
        //$data=json_encode($result);
        $Log->add(array('type'=>"CALLBACK",'log'=>json_encode($result)));	//记录数据
        
        if(!array_key_exists("transaction_id", $result)){
			$msg = "输入参数不正确";
            $Log->add(array('type'=>"ERROR",'log'=>"$msg"));
			$this->callback($msg);
            exit();
		}
		//查询订单，判断订单真实性
        if(!(\PayNotifyCallBack::Queryorder($result["transaction_id"]))){
			$msg = "订单查询失败";
            $Log->add(array('type'=>"ERROR",'log'=>"$msg"));
			$this->callback($msg);
            exit();
		}
        
        //将订单写入数据库
        $openid=$result['openid'];			//获取用户详细信息
        $token=$result['attach'];
        
        $info = S($openid);			//首先从缓存中获取用户信息
        if(!$info){
            $url='https://api.weixin.qq.com/sns/userinfo?access_token='.$token.'&openid='.$openid.'&lang=zh_CN';  
            $html = file_get_contents($url);
            $info = json_decode($html,true);	
            S($openid,$info);		//将用户信息缓存，防止token失效后失败
        }
        
        $Log->add(array('type'=>"USERINFO",'log'=>json_encode($info)));
        
        $User=M('User');
        $user=$User->where("wechat_openid='".$info['unionid']."'")->find();
        //$Log->add(array('type'=>"TEST1",'log'=>json_encode($user)));
        if(empty($user)){	//加入数据库
            $join['wechat_openid']=$info['unionid'];
            $join['count']=substr(md5($info['unionid']),0,10);
            $join['sex']=$info['sex'];
            $join['face_url']=$info['headimgurl'];
            $join['username']=$info['nickname'];
            $join['regTime']=time();
            
            try{
            	$res=$User->add($join);
            } catch (\Exception $e){
                $msg = $e->getMessage();
                $Log->add(array('type'=>"JOIN ERROR",'log'=>"$msg"));
                exit();
            }
            
            $pay['user_id']=$res;
            
        }else{
            $pay['user_id']=$user['id'];
            //$Log->add(array('type'=>"TEST2",'log'=>$pay['user_id']));
        }
        
        $pay['pay_id']=$result['transaction_id'];		//加入已支付数据库
        $pay['time']=time();
        $Log->add(array('type'=>"JOIN",'log'=>json_encode($pay)));
        
        $Pay=M('Signpay');
        
        $isPaid=$Pay->where('pay_id='.$pay['pay_id'])->find();
        if(!empty($isPaid)){
            if($isPaid['user_id'] == $pay['user_id']){
        		$Log->add(array('type'=>"CALLBACK",'log'=>"REPEAT , SUCCESS REPALY"));
                $this->callback($msg,true);
                exit();
            }else{
                $Log->add(array('type'=>"USERID ERROR",'log'=>"id:".$isPaid['id']));
            }
        }
        
        
        $resid=$Pay->add($pay);
        $Log->add(array('type'=>"JOIN",'log'=>"$resid"));
        $Log->add(array('type'=>"SUCCESS",'log'=>"SUCCESS"));
        $this->callback($msg,true);
	}
    
    private function callback($msg,bool $state= null){		//回复微信服务器
        $NOTIFY= new \PayNotifyCallBack();
        if($state == null || $state == false){
            $NOTIFY->SetReturn_code("FAIL");
			$NOTIFY->SetReturn_msg($msg);
			$NOTIFY->ReplyNotify(false);
        }else{
            $NOTIFY->SetReturn_code("SUCCESS");
			$NOTIFY->SetReturn_msg("OK");
			$NOTIFY->ReplyNotify(false);
        }
    }
}
