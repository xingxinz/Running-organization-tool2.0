// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Framework7.$;

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

// Now we need to run the code that will be executed only for About page.
// For this case we need to add event listener for "pageInit" event

// 分页：创建约跑，个人信息，详细情况
// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="organize"]', function (e) {
  // Following code will be executed for page with data-page attribute equal to "organize"
  myApp.alert('Here comes About page');
})
$$(document).on('pageInit', '.page[data-page="information"]', function (e) {
  // Following code will be executed for page with data-page attribute equal to "information"
  myApp.alert('Here comes About page');
})
$$(document).on('pageInit', '.page[data-page="detail"]', function (e) {
  // Following code will be executed for page with data-page attribute equal to "detail"
  myApp.alert('Here comes About page');
})

// search bar
var mySearchbar = myApp.searchbar('.searchbar', {
    searchList: '.list-block-search',
    searchIn: '.item-title'
});  