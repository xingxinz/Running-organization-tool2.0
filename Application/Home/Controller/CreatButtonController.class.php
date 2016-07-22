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
            "type":"click",
            "name":"早起签到",
            "key":"V1001_SIGN"
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
        $appid = "wx81f64260178ef961";
        $appsecret = "630aad385d1eaa2eef012777ce8f9670";
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