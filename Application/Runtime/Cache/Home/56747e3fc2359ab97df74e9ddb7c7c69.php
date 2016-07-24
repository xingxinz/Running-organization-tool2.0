<?php if (!defined('THINK_PATH')) exit();?><!-- We don't need full layout in this file because this page will be parsed with Ajax. It is just enough to put here .navbar and .page-->
<!-- Top Navbar-->
<div class="navbar">
  <div class="navbar-inner">
    <div class="left">
      <a href="#" class="back link">
        <i class="icon icon-back-blue"></i>
        <span>返回</span>
      </a>
    </div>
    <div class="center sliding">发起约跑</div>
    <div class="right">
      <a href="#" class="link icon-only open-panel"><i class="icon icon-bars-blue"></i></a>
    </div>
  </div>
</div>
<div class="pages">
  <div data-page="organize" class="page">
    <div class="page-content">
      <form action="/Running-organization-tool2.0/index.php/Home/API/createActivity" method="POST">
        <div class="list-block inset">
          <ul>
            <!-- Sponsor -->
            <li>
              <div class="item-content">
                <div class="item-inner">
                  <div class="item-title label">发起人</div>
                  <div class="item-input">
                    <input type="text" placeholder="Your name" id="username" disabled="">
                  </div>
                </div>
              </div>
            </li>
            <!-- Phone -->
            <li>
              <div class="item-content">
                <div class="item-inner">
                  <div class="item-title label">手机</div>
                  <div class="item-input">
                    <input type="tel" placeholder="Your phone number" id="phone" name="phone">
                  </div>
                </div>
              </div>
            </li>
            <!-- Name -->
            <li>
              <div class="item-content">
                <div class="item-inner">
                  <div class="item-title label">活动名</div>
                  <div class="item-input">
                    <input type="text" placeholder="Name" name="name">
                  </div>
                </div>
              </div>
            </li>
            <!-- Member -->
            <li>
              <div class="item-content">
                <div class="item-inner">
                  <div class="item-title label">人数</div>
                  <div class="item-input">
                    <input type="tel" placeholder="Member number" name="total">
                  </div>
                </div>
              </div>
            </li>
            <!-- Area -->
            <li>
              <div class="item-content">
                <div class="item-inner">
                  <div class="item-title label">地点</div>
                  <div class="item-input">
                    <input type="text" placeholder="Area" name="area">
                  </div>
                </div>
              </div>
            </li>
            <!-- Date time-->
            <li>
              <div class="item-content">
                <div class="item-inner">
                  <div class="item-title label">时间</div>
                  <div class="item-input">
                    <input type="datetime-local" name="time">
                  </div>
                </div>
              </div>
            </li>
            <!-- comment -->
            <li class="align-top">
              <div class="item-content">
                <div class="item-inner">
                  <div class="item-title label">备注</div>
                  <div class="item-input">
                    <textarea name="info"></textarea>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 修改左右margin值 -->
        <input type="submit" class="button button-big button-round" value="确认发起">
      </form>
    </div>
  </div>
</div>