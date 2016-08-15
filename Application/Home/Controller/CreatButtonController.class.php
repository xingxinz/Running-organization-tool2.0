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
			"name":"健身吧",
			"sub_button":[
				{
					"type":"view",
					"name":"高能歌单",
					"url":"http://music.163.com/m/playlist?id=431352322&userid=123909975&from=singlemessage&isappinstalled=0#?thirdfrom=wx"
				},
				{
					"type":"view",
					"name":"比心贴士",
					"url":"http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzI4MjM5MzIxNg==#wechat_webview_type=1&wechat_redirect"
				},
				{
					"type":"view",
					"name":"装备推荐",
					"url":"http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzI4MjM5MzIxNg==#wechat_webview_type=1&wechat_redirect"
				}
			]},
            
			{
			"name":"主题吧",
			"sub_button":[
				{
					"type":"view",
					"name":"趣奥运",
					"url":"http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzI4MjM5MzIxNg==#wechat_webview_type=1&wechat_redirect"
				},
				{
					"type":"click",
					"name":"马拉松赛事",
					"key":"V1001_WAIT"
				},
				{
					"type":"view",
					"name":"男神女神励志贴",
					"url":"http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzI4MjM5MzIxNg==#wechat_webview_type=1&wechat_redirect"
				}
			]}, 
            
			{
			"name":"互动吧",
			"sub_button":[
            	{
					"type":"click",
					"name":"早起签到",
					"key":"V1001_SIGN"
				},
				{
					"type":"click",
					"name":"瞎扯",
					"key":"V1001_ASK"
                },
				{
					"type":"click",
					"name":"趣约趣跑",
					"key":"V1001_WAIT"
				},
				{
					"type":"click",
					"name":"调戏小编",
					"key":"V1001_CHAT"
                },
				
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
