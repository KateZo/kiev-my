(function( $ ){

    //// ---> Check issue element
    jQuery.fn.exists = function() {
        return jQuery(this).length;
    }

    $(function() {

        if( $('.form_check').exists()){

            $('.form_check').each(function(){

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
                        } else if($(this).hasClass('text-field')) {
                            var pmc = $(this);
                            if ( (pmc.val().indexOf("_") != -1) || pmc.val() == '' ) {
                                pmc.addClass('empty_field');
                            } else {
                                pmc.removeClass('empty_field');
                            }
                        } else if($(this).hasClass('date-field')) {
                            var pr = $(this);
                            var pattern = /^[1-2][0-9]{3}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])$/i;
                            if (pattern.test(pr.val())){
                                pr.removeClass('empty_field');
                            }else{
                                pr.addClass('empty_field');
                            }
                        } else if($(this).hasClass('aut-field')) {
                            var pmc = $(this);
                            if ( (pmc.val().indexOf("_") != -1) || pmc.val() == '' ) {
                                pmc.addClass('empty_field');
                            } else {
                                pmc.removeClass('empty_field');
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
