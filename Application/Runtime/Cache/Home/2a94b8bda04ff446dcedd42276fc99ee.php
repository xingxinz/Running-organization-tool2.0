<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>

<head>
  <!-- Required meta tags-->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <!-- Your app title -->
  <title>持健约跑</title>
  <!-- Path to Framework7 Library CSS, iOS Theme -->
  <link rel="stylesheet" href="/joyball_f7/Public/asset_2/css/framework7.ios.min.css">
  <!-- Path to Framework7 color related styles, iOS Theme -->
  <link rel="stylesheet" href="/joyball_f7/Public/asset_2/css/framework7.ios.colors.min.css">
  <!-- Path to your custom app styles-->
  <link rel="stylesheet" href="/joyball_f7/Public/asset_2/css/my-app.css">

</head>

<body>
  <!-- Status bar overlay for full screen mode (PhoneGap) -->
  <div class="statusbar-overlay"></div>
  <!-- Views -->
  <div class="views">
    <!-- Your main view, should have "view-main" class -->
    <div class="view view-main">
      <!-- Top Navbar-->
      <div class="navbar">
        <div class="navbar-inner">
          <!-- We need cool sliding animation on title element, so we have additional "sliding" class -->
          <div class="center sliding">附近的约跑</div>
        </div>
      </div>
      <!-- Pages container, because we use fixed-through navbar and toolbar, it has additional appropriate classes-->
      <div class="pages navbar-through toolbar-through">
        <!-- Page, "data-page" contains page name -->
        <div data-page="index" class="page">
          <!-- Scrollable page content -->
          <!-- Search bar -->
          <form class="searchbar">
            <div class="searchbar-input">
              <input type="search" placeholder="Search">
              <a href="#" class="searchbar-clear"></a>
            </div>
            <a href="#" class="searchbar-cancel">Cancel</a>
          </form>
          <!-- Search bar overlay-->
          <div class="searchbar-overlay"></div>
          <!-- Page content -->
          <div class="page-content">
            <div class="content-block searchbar-not-found">
              好像还没有这个活动哦~
            </div>
            <div class="list-block media-list">
              
            </div>
          </div>
        </div>
      </div>
      <!-- Bottom Toolbar-->
      <div class="toolbar">
        <div class="toolbar-inner">
          <!-- Toolbar links -->
          <a href="/joyball_f7/index.php/Home/Index/organize.html" class="link">发起约跑</a>
          <a href="/joyball_f7/index.php/Home/Index/information.html" class="link">个人信息</a>
        </div>
      </div>
    </div>
  </div>
  <script type="text/javascript" src="/joyball_f7/Public/asset_2/js/run.js"></script>
  <!-- Path to Framework7 Library JS-->
  <script type="text/javascript" src="/joyball_f7/Public/asset_2/js/framework7.min.js"></script>
  <!-- Path to your app js-->
  <script type="text/javascript" src="/joyball_f7/Public/asset_2/js/my-app.js"></script>

</body>

</html>