(function( $ ){
    console.log("I'm chekaing");
    //// ---> Check issue element
    jQuery.fn.exists = function() {
        return jQuery(this).length;
    };

    $(function() {
        console.log("I'm chekaing");
        if( $('.form_check').exists()){

            $('.form_check').each(function(){
                console.log("I'm chekaing");
                var form = $(this),
                    btn = form.find('.btn');

                form.find('.form-control').addClass('empty_field').parents('.form-group');
                btn.addClass('disabled');

                // Функция проверки полей формы
                function checkInput(){

                    form.find('.form-control').each(function(){

                        if($(this).hasClass('name-field')){
                            var pmc = $(this);
                            if ( (pmc.val().indexOf("_") != -1) || pmc.val() == '' ) {
                                pmc.addClass('empty_field');
                            } else {
                                pmc.removeClass('empty_field');
                            }
                        } else if($(this).hasClass('sur-field')) {
                            var pmc = $(this);
                            if ( (pmc.val().indexOf("_") != -1) || pmc.val() == '' ) {
                                pmc.addClass('empty_field');
                            } else {
                                pmc.removeClass('empty_field');
                            }
                        } else if($(this).hasClass('log-field')) {
                            var pmc = $(this);
                            if ( (pmc.val().indexOf("_") != -1) || pmc.val() == '' ) {
                                pmc.addClass('empty_field');
                            } else {
                                pmc.removeClass('empty_field');
                            }
                        } else if($(this).hasClass('pas-field')) {
                            var pmc = $(this);
                            if ( (pmc.val().indexOf("_") != -1) || pmc.val() == '' ) {
                                pmc.addClass('empty_field');
                            } else {
                                pmc.removeClass('empty_field');
                            }
                        } else if($(this).hasClass('pas2-field')) {
                            var pr = $(this);
                            //console.log($('.pas-field').val());
                            if (pr.val() == $('.pas-field').val()){
                                pr.removeClass('empty_field');
                            }else{
                                pr.addClass('empty_field');
                            }
                        } else if($(this).hasClass('phone-field')) {
                            var pr = $(this);
                            var pattern = /^\+38[0-9]{10}$/i;
                            if (pattern.test(pr.val())){
                                pr.removeClass('empty_field');
                            }else{
                                pr.addClass('empty_field');
                            }
                        } else if($(this).hasClass('email-field')) {
                            var pr = $(this);
                            var pattern = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i;
                            if (pattern.test(pr.val())){
                                pr.removeClass('empty_field');
                            }else{
                                pr.addClass('empty_field');
                            }
                        } else {
                            $(this).addClass('empty_field');
                        }

                    });
                }

                // Функция подсветки незаполненных полей
                function lightEmpty(){
                    form.find('.empty_field').addClass('rf_error');
                    form.find('.empty_field').parents('.form-group').find('.rfield_error').css({'visibility':'visible'});
                    setTimeout(function(){
                        form.find('.empty_field').removeClass('rf_error');
                        form.find('.empty_field').parents('.form-group').find('.rfield_error').css({'visibility':'hidden'});
                    },2000);
                }

                //  Полсекундная проверка
                setInterval(function(){
                    checkInput();
                    var sizeEmpty = form.find('.empty_field').length;
                    //console.log(sizeEmpty);
                    if(sizeEmpty > 0){
                        if(btn.hasClass('disabled')){
                            return false
                        } else {
                            btn.addClass('disabled')
                        }
                    } else {
                        btn.removeClass('disabled')
                    }
                },500);

                //  Клик по кнопке
                btn.click(function(){
                    if($(this).hasClass('disabled')){
                        lightEmpty();
                        return false
                    } else {
                        form.submit();
                    }
                });

            });

        }


    });

})( jQuery );/**
 * Created by Екатерина on 03.01.2016.
 */
