/**
 * Created by Екатерина on 06.01.2016.
 */
(function( $ ) {
    console.log("I'm chekaing");
    //// ---> Check issue element
    jQuery.fn.exists = function () {
        return jQuery(this).length;
    };

    $(function () {
        if ($('.good_im').height>$('.good_im').width){
            console.log("height win");
        } else if($('.good_im').height<$('.good_im').height){
            console.log("width win");
        }else{
            console.log("hzhz");
        }
    });
});