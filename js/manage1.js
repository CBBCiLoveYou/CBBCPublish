$(document).ready(function() {
    window.fbAsyncInit = function() {
      FB.init({
        appId            : '1018864898244019',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.9'
      });
      FB.AppEvents.logPageView();

      FB.getLoginStatus(function(response) {
          if (response.status === 'connected') {

            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            console.log("accessToken: " + accessToken);
          } else if (response.status === 'not_authorized') {
            // the user is logged in to Facebook,
            // but has not authenticated your app
              console.log('not_authorized');
          } else {
            // the user isn't logged in to Facebook.
              console.log('not logged in to facebook');
          }
       });
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

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
    var database = firebase.database();

    //loadAllPost();
    var postArray = [];
    var template = $('#hidden-template').html();
    function loadAllPost() {
        database.ref('unPost').on('child_added', function(snap) {
            var key = snap.key;
            var article = snap.val().article;
            var url = snap.val().url;
            var image_name = snap.val().image_name;
            if (!url) {
                console.log('not url');
                url = "http://img.kpopmap.com/wp-content/uploads_kpopmap/2017/06/GD-Announced-Name-Of-Title-Song-Bullshit_-1.jpg";
                image_name = "G-Dragon";
            }

            var postTemplate = $('#post-template').html();
            var item = {
                article : article,
                key : key,
                img_url : url,
                image_name : image_name
            }

            // need to look up the problem of \n
            $('#unPost').append(Mustache.render(postTemplate, item));
            postArray.push(key);
        });
    }

    $('#all-post').click(function() {
        postAllByKey();
    });

    function postAllByKey() {
        for (var i = 0; i < postArray.length; i++) {
            postByKey(postArray[i]);
        }
        $('#unPost').empty();
    }

    $('#logout').click(function() {
        logout();
    });

    function logout() {
        FB.logout(function(response) {
            window.location.href = "../CBBCPublish/manage.html";
        });
    }


    function login() {
        FB.login(function(response){
            if (response.authResponse) {
                showPage();
            }
        },{scope:"manage_pages,publish_pages"});
     }
     var p_accessToken;

     $('#unPost').delegate('#post', 'click', function() {
         if (!p_accessToken) return;
         var $li = $(this).closest('li');
         var key = $li.data('id');
         postByKey(key);
         // post to page of fb
         $li.fadeOut(function() {
            $li.remove();
         });
         // remove li from html
         // delete post from firebase, because the post has been post to facebook
     });


     function postByKey(key) {
         database.ref('unPost/' + key).once('value', function(snap) {
             // 因為每次改變都會trigger
             var article = snap.val().article;
             var link = snap.val().url;
             var wallPost = {
                 message : article,
                 link : link
             };
             var path = page_id[page_index] + "/feed?access_token=" + page_access_token[page_index];
             FB.api(path, "POST", wallPost , function(response) {
                if (!response || response.error) {
                  //alert('Error occured');
                   console.log(response.error);
                } else {
                   console.log('Post ID: ' + response);
                }
                deleteFirebaseByKey(snap.key);
             });

         });
     }

     function deleteFirebaseByKey(key) {
         console.log('delete....:' + key);
         var task = database.ref('unPost/' + key).update({
             article : null,
             url : null,
             image_name : null
         });
     }



     $('#unPost').delegate('#update-post', 'click', function() {
         var $li = $(this).closest('li');
         showEditTextField($li);
     });

     $('#unPost').delegate('#delete', 'click', function() {
         var $li = $(this).closest('li');
         var key = $li.data('id');
         deleteFirebaseByKey(key);
         $li.fadeOut(function() {
            $li.remove();
         });
     });

     function updateFirebaseByKey(key, article) {
         console.log('updating....');
         console.log(article);
         var task = database.ref('unPost/' + key).update({
             article : article
         });
     }

     function showEditTextField($li) {
         var state = $($li).find('#update-post').text();
         var key = $($li).data("id");
         if (state == 'OK') {
             $($li).find('#update-post').html('Update');
             $($li).find('.article').show();
             var modifyArticle = $($li).find('.article-textarea').val();
             $($li).find('.article-form').hide();
             $($li).find('.article p').text(modifyArticle);
             updateFirebaseByKey(key, modifyArticle);
         } else if (state == 'Update') {
             $($li).find('#update-post').html('OK');
             $($li).find('.article').hide();
             $($li).find('.article-form').show();
         }
     }

    //  window.setInterval(function() {
    //     console.log('5s');
    //  }, 5000);

     var page_id = [];
     var page_index;
     var page_access_token = [];
     var page_name = [];

     $('#login').click(function() {
          $(this).remove();
          $('#wrapper').remove();
          // select page
          login();
          // select page
          // show article that user post
     });

     function showPage() {
        console.log('show');
        FB.api('/me/accounts', function(response){
           p_accessToken = response.data[0].access_token;
           var p_name = response.data[0].name;
           for (var i = 0; i < response.data.length; i ++) {
               page_id.push(response.data[i].id);
               page_access_token.push(response.data[i].access_token);
               page_name.push(response.data[i].name);
               var pageTemplate = $('#page-template').html();

               var item = {
                   page_index : i,
                   page_name : response.data[i].name,
                   page_access_token : response.data[i].access_token
               }
               // need to look up the problem of \n
               $('#select-page').append(Mustache.render(pageTemplate, item));
           }
        });
     }

     $('#select-page').delegate('#select-btn', 'click', function() {
         $li = $(this).closest('li');
         page_index = $li.data("id");
         if (page_name[page_index] == "靠北北科")
         {
             loadAllPost();
             $('#unPost').fadeIn(200);
             $('#Allpost-content').fadeIn(200);
         }
         $('#logout-content').fadeIn(200);
         $('#select-page').remove();
     });

      var modal = document.getElementById('myModal');
      // Get the image and insert it inside the modal - use its "alt" text as a caption
      var img = document.getElementById('myImg');
      var modalImg = document.getElementById("img01");
      var captionText = document.getElementById("caption");
      $('body').on('click','img',function(){
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
      });
      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];
      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
          modal.style.display = "none";
      }

});
