<?php
namespace Admin\Controller;
use Think\Controller;
class IndexController extends Controller {
   

    //首页
    public function index(){
        $this->assign('username',session('username'));
        $this->assign('id',session('id'));
        $link=isset($_SESSION['id'])?U("Admin/Index"):U("PlatHome/Register/email");
        $this->assign('link',$link);
        $this->display();
    }
    
    public function login(){
        session(null);

        $data['email']=I('post.email');              //获得用户名
        $data['password']=md5(I('post.password'));  //获得密码
        die();
		var_dump($data);
		
		
        $User=M('user');
        
        $list=$User->getbyCount($data['email']);    //读取用户数据

        if($list){
            if($list['password']==$data['password']){
                session('user_id',$list['id']);
                session('username',$list['username']);
                session('group',$list['group']);
                //session('point',$list['point']);

                
                // var_dump($_SESSION);
                // die();
               
            }
            else{
                $this->error('密码错误');
            }
        }
        else{
            $this->error('用户名或密码错误');
        }
    }

    public function logout(){
        session(null);
        $this->success('退出成功',__APP__.'/PlatHome');
    }
}