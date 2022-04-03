jQuery(function($){
    var text_title ="Overlay text";
    let canvas_x = 0;
    let canvas_y = 0;
    $('#imageLoader').on('change', function() {        
        imagesPreview(this);
    });

    var imagesPreview = function(input) {
        var j = 1;
        var img = "";
        var src = "";
        var x = 0;
        var y = 0;
        if (input.files) {
            var filesAmount = input.files.length;
            for (i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = function(event) {
                   $('.gallery-wrapper').removeClass("hidden");
                    
                    img = new Image();
                    img.src = event.target.result;
                    src = event.target.result;
                    
                    img.onload = function(e) {
                        var current_img = e.currentTarget;

                        $('#gallery-wrapper').append('<div class="canvas-list"><canvas id="gallery-canvas-' + j +'" class="gallery-canvas"></canvas><button id="delete-canvas">Delete</button></div>');

                        var canvas = document.getElementById("gallery-canvas-" + j);
                        var ctx = canvas.getContext("2d");

                        canvas.width = current_img.width;
                        canvas.height = current_img.height;
                        ctx.drawImage(current_img,x,y);
                        j++;

                    }

                }
                reader.readAsDataURL(input.files[i]);
            }
        }

    };

    function DynamicText(x, y) {
        //$( "#name" ).keyup(function() {            
            var id = $(".canvas-list.selected").find('.gallery-canvas').attr('id');
            var canvas = document.getElementById(id);
            var ctx = canvas.getContext("2d");
            //ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.textBaseline = 'middle';
            ctx.font = "20px 'Montserrat'";
            text_title = document.getElementById("name").value;           
            ctx.fillText(text_title, x, y);

        //});
    }

    $('body').on('click', '#gallery-wrapper .canvas-list', function (e) {
        $("#name").val("");
        $(".canvas-list").removeClass("selected");
        $(this).addClass("selected");

        var offset = $(this).offset();
        canvas_x = e.pageX - offset.left;
        canvas_y = e.pageY - offset.top;

        $("#input-text-wrapper").removeClass("hidden");
        var x = e.pageX;
        var y = e.pageY;
        var el = $("#input-text-wrapper");
        el.css('position', 'absolute');
        el.css("left", x);
        el.css("top", y);

        $( "#name" ).keyup(function() {

            DynamicText(canvas_x, canvas_y);

        });

        console.log("done");
        //DynamicText(x, y);
    });

    $('body').on('click', '#gallery-wrapper #delete-canvas', function () {
        $(this).parents('.canvas-list').remove();
    });

    $(".delete-btn").click(function(){
        $( ".canvas-list" ).each(function() {
            var canvas =  document.getElementById($(this).find(".gallery-canvas").attr('id'));
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            $(this).remove();
        });
        imagesPreview(document.getElementById("imageLoader"));
    });

    function handleImage(e) {
    	var filePath = $('#imageLoader').val();
    	var reader = new FileReader();
        reader.onload = function (event) {
            img = new Image();
            console.log(img);		

			img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img,0,0);
            }
			//ctx.drawImage(img, 10, 10);
        };
        reader.readAsDataURL(e.target.files[0]);
    	
    }
	

});
