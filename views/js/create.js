$(document).ready(function() {
    $('.hidden-word').hide();
});

$(function(){
    $('.show-word').click(function() {
        $('.hidden-word').show();
    });
});