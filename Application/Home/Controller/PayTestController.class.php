<?php
namespace Home\Controller;
use Think\Controller;

class PayTestController extends Controller {
	public function _initialize(){
		//引入WxPayPubHelper
		vendor('WxPay.WxPayJsApi');
		$logHandler= new \CLogFileHandler("__PUBLIC__/logs/".date('Y-m-d').'.log');
		$log = Log::Init($logHandler, 15);
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
		$input->SetAttach("趣键跑早起挑战");
		$input->SetOut_trade_no(\WxPayConfig::MCHID.date("YmdHis"));
		$input->SetTotal_fee("1");
		$input->SetTime_start(date("YmdHis"));
		$input->SetTime_expire(date("YmdHis", time() + 600));
		$input->SetGoods_tag("早起挑战");
        $input->SetNotify_url("http://joyball.guoxunique.com/index.php/Home/PayTest/notify");
		$input->SetTrade_type("JSAPI");
		$input->SetOpenid($openId);
		$order = \WxPayApi::unifiedOrder($input);

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

        $this->display('index');
	}
    
    public function notify(){
		Log::DEBUG("begin notify");
		$notify = new \PayNotifyCallBack();
		$notify->Handle(false);
	}
}
