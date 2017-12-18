$(document).ready(function() {
    var showChar = 50;
    $('.more').each(function() {
      var content = $(this).html();
      if(content.length > showChar) {
        var c = content.substr(0, showChar);
        var h = content.substr(showChar - 1, content.length - showChar);
        var html = c + "...";
        $(this).html(html);
      }
    });
});
