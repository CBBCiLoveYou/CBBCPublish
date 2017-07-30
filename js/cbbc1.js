$(document).ready(function() {

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyAhygm50FlxfkCdku61tJb8Zf-DSx9pZ64",
      authDomain: "cbbc-722ac.firebaseapp.com",
      databaseURL: "https://cbbc-722ac.firebaseio.com",
      projectId: "cbbc-722ac",
      storageBucket: "cbbc-722ac.appspot.com",
      messagingSenderId: "547483099000"
    };
    firebase.initializeApp(config);
    var image;
    var database = firebase.database();

    function validArticle(article) {
        return article.length > 5;
    }

    function showMessage() {
        $('.message').show();
        $('#article').css('border-color', 'red');
        $('#article').css('border-width', '5px');
    }
    function hideMessage() {
        $('.message').hide();
        $('#article').css('border-color', 'gray');
        $('#article').css('border-width', '1px');
    }

    const $file = $('#file');



    function readURL(input) {
        console.log(input);
        if (input.files && input.files[0]) {
            console.log('read');
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#upload-img').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
        $('#img-loading').hide();
    }



    file.addEventListener('change', function(e) {
        $('.upload-content').show();
        $('#img-loading').show();
        setTimeout(function() {
             readURL(file);
        }, 2000);

        image = e.target.files[0];

     });


     function writePostToFirebase(article, url, image_name) {
         database.ref('unPost').push({
             'article' : article,
             'url' : url,
             'image_name' : image_name
         });
         window.location.href = '../CBBCPublish/success.html';
     }

     function uploadImageToFirebase(article) {
         var metadata = {
             'contentType' : image.type
         };
         console.log('update image to firebase');
         var storageRef = firebase.storage().ref();
         var task = storageRef.child('images/' + image.name).put(image, metadata);
         task.then(function(snapshot) {
             writePostToFirebase(article, snapshot.metadata.downloadURLs[0], image.name);
         });
     }

    $('.publish-btn').click(function() {
        var article = $('#article').val();
        if (validArticle(article)) {
            $('#loading').show();
            $(this).html('-');
            setTimeout(function() {
                uploadArticle(article);
            }, 2000);
        } else {
            showMessage();
            setTimeout(function() {
                hideMessage();
            }, 2000);
        }
    });

    function uploadArticle(article) {
        if (image) {
            uploadImageToFirebase(article);
        } else {
            if (!image) {
                writePostToFirebase(article, '', '');
            }
        }
    }
});
