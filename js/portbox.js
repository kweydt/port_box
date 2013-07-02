$.fn.portbox = function() {
    var images = [];
    var large_shown = false;
    var times_called = 0;
    var cur_img = 0;
    var base_element = this;

    $(document).ready(function(){
      base_element.append('<div id="portbox-container" class="container"><div class="nav"><img id="logo" src="img/portbox-268x49.png"/></div></div><div id="portbox-intro"><img id="logo" src="img/portbox-268x49.png"/><div id="launch-db"><img id="db-logo" src="img/db-logo-33x29.png"/><span>Select some images</span></div></div>');
      $('#portbox-container').append('<ul></ul><div class="portbox-large"><div class="portbox-large-wrapper"><div class="left-arrow"><</div><div class="right-arrow">></div><div class="close-btn">X</div></div><img/></div>');
      $('.portbox-large').hide();

      bindEvents();
    });

    var bindEvents = function(){
      $('.portbox-large img').click(function(){
        hideImage();
      });

      $('.left-arrow').click(function(){
        prevImage();
      });

      $('.right-arrow').click(function(){
        nextImage();
      });

      $('.close-btn').click(function(){
        hideImage();
      });
    
      $('#launch-db').on('click', function(){
        var options = {
          linkType: "direct",
          multiselect: true,
          success: function(files) {
            loadImages(files);
          },
          cancel: function() {
            console.log("You cancelled!")
          }
        }
        Dropbox.choose(options);
      });
    }


    var loadImages = function(imgs){
      times_called++;

      for (var i = 0; i < imgs.length; i++) {
        if(isImage(imgs[i].link)){
          images.push(imgs[i].link);
          $('#portbox-container ul').append('<li class="loaded' + times_called + '"></li>');
          $('#portbox-container ul li:last-child').css("background-image", "url('" + imgs[i].link + "')");
        }
      };

      $('#portbox-container ul li.loaded' + times_called).on("click", function(){
        cur_img = $(this).index("li");
        showImage(cur_img);
        large_shown = true;
      });

      $('#portbox-intro').hide();
      $('#portbox-container').show();
    }


    var isImage = function(img_link){
      switch(img_link.substring(img_link.lastIndexOf('.') + 1).toLowerCase()){
        case 'gif': case 'jpg': case 'png':
            return true;
            break;
        default:
            return false;
            break;
      }
    }


    var showImage = function(ind){
      $('#portbox-container .portbox-large').show();
      var img_src = $('#portbox-container ul li').eq(ind).css("background-image");
      img_src = img_src.substring(4).replace(')','');
      // var toRemove = ')';
      // var img_src = img_src.replace(toRemove,'');
      console.log(img_src);
      $('.portbox-large img').attr("src", img_src);
      $('#portbox-container .portbox-large img').fadeIn();
    }


    var hideImage = function(){
      $(".portbox-large").fadeOut();
    }


    var nextImage = function(){
      cur_img += 1;
      if (cur_img == ($('#portbox-container ul li').size())) {
        cur_img = 0;
      }
      showImage(cur_img);
    }


    var prevImage = function(){
      cur_img -= 1;
      if (cur_img < 0) {
        cur_img = ($('#portbox-container ul li').size()) - 1;
      }
      showImage(cur_img);
    }


    $(document).keydown(function(e){
      if (large_shown == true) {
        if (e.keyCode == 37) {
          //left key 
          prevImage();
          return false;
        } else if (e.keyCode == 39) {
          // right key
          nextImage();
        } else if (e.keyCode == 27) {
          // esc key
          hideImage();
          large_shown = false;
        }
      }
    });
}