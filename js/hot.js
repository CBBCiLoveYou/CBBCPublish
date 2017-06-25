$(document).ready(function() {
    var count_index = 1;
    synProperty();
    // $('#up-img').click(function() {
    //     var body = $("html, body");
    //     body.stop().animate({scrollTop:0}, 500, 'swing');
    // });



    $('#main').click(function() {
        window.location.href = "../CBBCPublish/index.html";
    });

    function synProperty()
    {
        if (count_index >= 10) {
            $('.right-arrow').css('opacity', '0.5');
        } else {
            $('.right-arrow').css('opacity', '1');
        }
        if (count_index <= 1) {
            $('.left-arrow').css('opacity', '0.5');
        } else {
            $('.left-arrow').css('opacity', '1');
        }
        $('#top-title').text('Top-' + count_index);
    }

    $('.right-arrow').click(function() {
        if (count_index >= 10) return;
        $('#hot li:nth-child('+count_index+')').hide();
        count_index++;
        $('#hot li:nth-child('+count_index+')').fadeIn(200);
        synProperty();
    });

    $('.left-arrow').click(function() {
        if (count_index <= 1) return;
        $('#hot li:nth-child('+count_index+')').hide();
        count_index--;
        $('#hot li:nth-child('+count_index+')').fadeIn(200);
        synProperty();
    });
});
