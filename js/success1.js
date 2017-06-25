$(document).ready(function() {
    var seconds = 5;

    setTimeout(function() {
        console.log('time up');
        window.location.href = "../CBBC/index.html"
    }, 5000);


    var interval = setInterval(function() {
        seconds--;
        if (seconds <= 0) clearInterval(interval);
        $('#count-down').text('Redirect ' + seconds + 's');
    }, 1000);

});
