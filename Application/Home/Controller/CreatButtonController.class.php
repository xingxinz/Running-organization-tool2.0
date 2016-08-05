<?php
namespace Home\Controller;
use Think\Controller;
class CreatButtonController extends Controller {
    public function index(){
        echo 2222;
    }

    //创建菜单
    public function creat_button(){
        $jsonmenu = '{
          "button":[
			{
			"name":"Have fun",
			"sub_button":[
				{
					"type":"click",
					"name":"关于我们",
					"key":"V1001_ABOUT"
				},
				{
					"type":"click",
					"name":"调戏小编",
					"key":"V1001_CHAT"
				},
				{
					"type":"view",
					"name":"减肥互助社区",
					"url":"http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzI4MjM5MzIxNg==#wechat_webview_type=1&wechat_redirect"
				},
				{
					"type":"view",
					"name":"男神女生励志贴",
					"url":"http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzI4MjM5MzIxNg==#wechat_webview_type=1&wechat_redirect"
				}
			]},
            
			{
			"name":"Keep Hea",
			"sub_button":[
				{
					"type":"view",
					"name":"定制运动计划",
					"url":"http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzI4MjM5MzIxNg==#wechat_webview_type=1&wechat_redirect"
				},
				{
					"type":"view",
					"name":"养生知识",
					"url":"http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzI4MjM5MzIxNg==#wechat_webview_type=1&wechat_redirect"
				},
				{
					"type":"view",
					"name":"拉伸塑形",
					"url":"http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzI4MjM5MzIxNg==#wechat_webview_type=1&wechat_redirect"
				},
				{
					"type":"view",
					"name":"燃脂瘦身",
					"url":"http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzI4MjM5MzIxNg==#wechat_webview_type=1&wechat_redirect"
				}
			]}, 
            
			{
			"name":"Running",
			"sub_button":[
				{
					"type":"view",
					"name":"马拉松赛事",
					"url":"http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzI4MjM5MzIxNg==#wechat_webview_type=1&wechat_redirect"
				},
				{
					"type":"view",
					"name":"跑步音乐",
					"url":"http://music.163.com/m/playlist?id=431352322&userid=123909975&from=singlemessage&isappinstalled=0#?thirdfrom=wx"
				},
				{
					"type":"view",
					"name":"我要约跑",
					"url":"http://joyball.guoxunique.com"
				},
				{
					"type":"click",
					"name":"早起签到",
					"key":"V1001_SIGN"
				}
			]
            } 
          ]
         }';
       
        $access_token=$this->get_access_token();
        $url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=".$access_token;
        $result = $this->https_request($url, $jsonmenu);
        var_dump($result);
    }

    public function https_request($url,$data = null){
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
        if (!empty($data)){
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        }
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($curl);
        curl_close($curl);
        return $output;
    }

    //得到access_token
    public function get_access_token(){
        $appid = "wx68fdd3097b99d582";
	    $appsecret = "b43365db0cb477e11734b852d2a37c6d";
        $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appid&secret=$appsecret";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); 
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);
        $jsoninfo = json_decode($output, true);
        $access_token = $jsoninfo["access_token"];
        return $access_token;
    }
}
