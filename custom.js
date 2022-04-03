jQuery(function($){
    var text_title ="Overlay text";
    let canvas_x = 0;
    let canvas_y = 0;
    var pagination = "";
    var back = "";
    var next = "";
    var file = [];
    var timer = null;
    var filesAmount = 0;
    var page = 1;

    $('#imageLoader').on('change', function(e) { 
        $(".canvas-list").remove();  
        $(".images-list .image-name").each(function(){
            $(this).remove();
        }); 
        page = 1;
        current_file = e.target.files;
        file = Array.from(file).concat(Array.from(current_file));
        imagesPreview(file);
    });

    var imagesPreview = function(file) {
        var img = "";
        var src = "";
        var x = 0;
        var y = 0;        
        var j = 0;
        if (file) {
            //for(let x in file){

                paginationList(file);

                for (i = 0; i < filesAmount; i++) {

                    if(file[i] === undefined) {
                        continue;
                    }

                    filename = file[i].name;
                    $(".images-list").append('<div data-image-id="'+ i +'" class="image-name">'+ filename +' <button id="delete-canvas">Delete</button></div>');

                    var reader = new FileReader();

                    reader.onload = function(event) {
                       $('.gallery-wrapper').removeClass("hidden");
                        
                        img = new Image();
                        img.src = event.target.result;
                        src = event.target.result;
                        
                        img.onload = function(e) {
                            var current_img = e.currentTarget;

                            if(j == 0){
                                $('#gallery-wrapper').append('<div class="canvas-list selected" id="image-'+j+'"><canvas id="gallery-canvas-' + j +'" class="gallery-canvas"></canvas><p>'+file[j].name.replace(/\.[^/.]+$/, "")+'</p></div>');
                            }else{
                                $('#gallery-wrapper').append('<div class="canvas-list" id="image-'+j+'"><canvas id="gallery-canvas-' + j +'" class="gallery-canvas"></canvas><p>'+file[j].name.replace(/\.[^/.]+$/, "")+'</p></div>');
                            }

                            var canvas = document.getElementById("gallery-canvas-" + j);
                            var ctx = canvas.getContext("2d");

                            canvas.width = current_img.width;
                            canvas.height = current_img.height;
                            ctx.drawImage(current_img,x,y);
                            j++;

                        }

                    }
                    reader.readAsDataURL(file[i]);
                }
            //}
        }

    };

    function DynamicText(x, y) {         
        var id = $(".canvas-list.selected").find('.gallery-canvas').attr('id');
        var canvas = document.getElementById(id);
        var ctx = canvas.getContext("2d");
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.textBaseline = 'middle';
        ctx.font = "20px 'Montserrat'";
        text_title = document.getElementById("name").value;           
        ctx.fillText(text_title, x, y);
    }

    $('body').on('click', '#gallery-wrapper .canvas-list canvas', function (e) {
        $("#name").val("");
        $(".canvas-list").removeClass("selected");
        $(this).parent('.canvas-list').addClass("selected");

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

        $("#name").focus();
        $( "#name" ).keyup(function() {
            clearTimeout(timer); 
            timer = setTimeout(hideTextBox, 1000);
            DynamicText(canvas_x, canvas_y);
        });
    });

    $('body').on('click', '.pagination-list #next-btn', function () {
        var current_img = $(".canvas-list.selected").attr("id");
        $(".canvas-list").removeClass("selected");
        $(".canvas-list#" + current_img).next().addClass("selected");
        page++;
        $(".pagination-list").empty();

        filesAmount = file.length;
        if(filesAmount > 1){
            back = '<span id="back-btn">Back</span>';                              
        }
        next = '<span id="next-btn">Next</span>';  
        if(page == (filesAmount)){
            next = '';  
        }

        pagination = back + page + ' of ' + filesAmount + next;
        $(".pagination-list").append(pagination);
    });

    $('body').on('click', '.pagination-list #back-btn', function () {
        var current_img = $(".canvas-list.selected").attr("id");
        $(".canvas-list").removeClass("selected");
        $(".canvas-list#" + current_img).prev().addClass("selected");
        page--;
        $(".pagination-list").empty();

        filesAmount = file.length;
        if(filesAmount > 1){
            next = '<span id="next-btn">Next</span>';                                      
        }
        back = '<span id="back-btn">Back</span>';      
        if(page == 1){
            back = '';  
        }

        pagination = back + page + ' of ' + filesAmount + next;
        $(".pagination-list").append(pagination);
    });

    function hideTextBox(){
        $("#input-text-wrapper").addClass("hidden");
    }

    $('body').on('click', '.image-name #delete-canvas', function () {
        var canvas_id = $(this).parent('.image-name').attr('data-image-id');
        $(this).parent('.image-name').remove();
        $(".canvas-list#image-" + canvas_id).remove();

        file.splice(canvas_id, 1);
        paginationList(file);
        if(file.length == 1){
            $(".canvas-list").addClass("selected");
        }
        if(file.length == 0){
            $(".pagination-list").empty();
        }

    });

    $(".delete-all").click(function(){
        resetCanvas();
        clearAlltag();
        $(".pagination-list").empty();
        file.splice(0);
    });

    function paginationList(file){
        filesAmount = file.length;

        $(".pagination-list").empty();

        next = '';
        back = '';
        if(filesAmount > 1){
            next = '<span id="next-btn">Next</span>';                    
        }

        pagination = back + '1 of ' + filesAmount + next;
        $(".pagination-list").append(pagination);
        $(".canvas-list").removeClass("selected");
        $(".canvas-list:first-child").addClass("selected");
    }

    function resetCanvas(){
        $( ".canvas-list" ).each(function() {
            var canvas =  document.getElementById($(this).find(".gallery-canvas").attr('id'));
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            $(this).remove();
        });        
    }

    function clearAlltag(){
        $(".images-list .image-name").each(function(){
            $(this).remove();
        });
    }

    $(".clear-all-tag").click(function(){
        resetCanvas();
        clearAlltag();
        imagesPreview(file);
    });

    function handleImage(e) {
    	var filePath = $('#imageLoader').val();
    	var reader = new FileReader();
        reader.onload = function (event) {
            img = new Image();	

			img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img,0,0);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    	
    }
	

});
