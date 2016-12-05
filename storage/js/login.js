/**
 * Created by Екатерина on 04.01.2016.
 */
$(function(){

    document.getElementById("log").onclick = function(){
        console.log("hi");
        return $.ajax({
            type:"get",
            url:"/login"

        });
    };

});