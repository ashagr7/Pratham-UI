$(function(){
    var pageHeight = $(window).height();
    var leftPanelHeight = pageHeight - (81);
    $(".leftPanel").css("max-height",leftPanelHeight+"px");
    $(".leftPanel").css("overflow-y","auto");
})