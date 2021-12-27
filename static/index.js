var canvas, ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        realX = 0,
        realY = 0,
        imagedata = null,
        lines = [],
        disabled = false;
        dot_flag = false;

    var x = "black",
        y = 15;

        
            

    function init() {
        canvas = document.getElementById('can');
        ctx = canvas.getContext("2d");
        w = canvas.width;
        h = canvas.height;

        canvas.addEventListener("mousemove", function (e) {
            findxy('move', e);
        }, false);
        canvas.addEventListener("mousedown", function (e) {
            findxy('down', e);
        }, false);
        canvas.addEventListener("mouseup", function (e) {
            findxy('up', e);
        }, false);
        canvas.addEventListener("mouseout", function (e) {
            findxy('out', e);
        }, false);
    }

    function color(obj) {
        x = obj.id;
        if (x == "white"){
             y = 2;
        }else {
            ctx.globalCompositeOperation="source-over";
            y = 15;
        }

    }

    function draw(xx,yy) {
        ctx.beginPath();
        ctx.moveTo(xx, yy);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = x;
        ctx.lineWidth = y;
        ctx.stroke();
        ctx.closePath();
    }

    function erase() {
        var m = confirm("Are you sure you want to clear the canvas?");
        if (m) {
            location.reload();
        }
    }


    function dedupe(a) {
        var seen = {};
        var out = [];
        var len = a.length;
        var j = 0;
        for(var i = 0; i < len; i++) {
             var item = a[i];
             if(seen[item] !== 1) {
                   seen[item] = 1;
                   out[j++] = item;
             }
        }
        return out;
    }

    function arrayRemove(arr, value) { 
    
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }
    

    function findxy(res, e) {
        if (res == 'down') {
            if(x == "white"){
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;
                prevX = currX;
                prevY = currY;
                return;
            }
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            realX = currX;
            realY = currY;
            imagedata = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            flag = true;
            dot_flag = true;
            if (dot_flag) {
                //ctx.beginPath();
               // ctx.fillStyle = x;
                //ctx.fillRect(currX, currY, 2, 2);
               // ctx.closePath();
                dot_flag = false;
            }
        }
        if (res == 'up' || res == "out") {
            wasFlag = flag;
            flag = false;
            if(x == "white"){
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;
                prevX = currX;
                prevY = currY;
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i];
                        startX = line[0];
                        startY = line[1];
                        endX = line[2];
                        endY = line[3];
                        angle = AngleBtw2Points([startX, startY], [endX, endY])
                        ax = startX + Math.cos(Math.PI * (angle+90) / 180) * 7.5;
                        ay = startY + Math.sin(Math.PI * (angle+90) / 180) * 7.5;
                        bx = startX + Math.cos(Math.PI * (angle-90) / 180) * 7.5;
                        by = startY + Math.sin(Math.PI * (angle-90) / 180) * 7.5;
                        cx = endX + Math.cos(Math.PI * (angle-90) / 180) * 7.5;
                        cy = endY + Math.sin(Math.PI * (angle-90) / 180) * 7.5;
                        dx = endX + Math.cos(Math.PI * (angle+90) / 180) * 7.5;
                        dy = endY + Math.sin(Math.PI * (angle+90) / 180) * 7.5;
                        console.log(angle);
                        console.log(currX + " " + currY);
                        if(isPointInRect(currX,currY,ax,ay,bx,by,cx,cy,dx,dy)){
                            console.log("in");
                            ctx.globalCompositeOperation="destination-out";
                            currX = endX;
                            currY = endY;
                            y = 16;
                            draw(line[0], line[1]);
                            ctx.globalCompositeOperation="source-over";
                            lines = arrayRemove(lines, line);
                            console.log(lines);
                        }

                }
                    return;
            }
                
            if (imagedata != null)
                ctx.putImageData(imagedata, 0, 0);
            draw(realX, realY);
            if(wasFlag){
                lines.push([realX, realY, currX, currY]);
                lines = dedupe(lines);
                console.log(lines);
            }

        }
        if (res == 'move') {
            if (flag && x != "white") {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;
                draw(prevX,prevY);
            }
        }
    

    }
    function generatePython(){

        if(disabled){
            return;
        }
        if($(".python").css("display") == "none"){
            disabled = true;
            $(".python").css("display", "block");
            $(".paint").css("display", "none");
            $(".diameter").css("display", "none");
            $(".track").css("display", "none");
            $("body").css("background-color", "#3D3D3D");
            $(".python").css("background-color", "#2D2D2D");
            $(".pythonBtn").css("position", "absolute");
            $(".pythonBtn").css("margin-left", "5%");
            $(".pythonBtn").css("margin-top", "2%");
            //center the ".python" div
            var w = $(".python").width();
            $(".python").css("left", (window.innerWidth/2)-(w/2));
            request = $.ajax({
                url: "/generatePython",
                type: "POST",
                data: JSON.stringify(lines),
            });
            console.log(JSON.stringify(lines));
            // Callback handler that will be called on success
            request.done(function (response, textStatus, jqXHR){
                // Log a message to the console
                $("#pythonCode").html(response);
            });
    
            // Callback handler that will be called on failure
            request.fail(function (jqXHR, textStatus, errorThrown){
                // Log the error to the console
                console.error(
                    "The following error occurred: "+
                    textStatus, errorThrown
                );
                $("#pythonCode").html("# Error generating code, please try again.");
            });
            request.always(function () {
                disabled = false;
                Prism.highlightAll();
            });
           
        }else {
            $(".python").css("display", "none");
            $(".paint").css("display", "block");
            $("body").css("background-color", "#FFFFFF");
            $(".pythonBtn").css("position", "fixed");
            $(".diameter").css("display", "inline-block");
            $(".track").css("display", "inline-block");
            $(".pythonBtn").css("margin-left", "20%");
            $(".pythonBtn").css("margin-top", "0%");
        }
    }