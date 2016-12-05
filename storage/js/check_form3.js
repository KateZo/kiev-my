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
                        } else if($(this).hasClass('sur-field')) {
                            var pmc = $(this);
                            if ( (pmc.val().indexOf("_") != -1) || pmc.val() == '' ) {
                                pmc.addClass('empty_field');
                            } else {
                                pmc.removeClass('empty_field');
                            }
                        }
                        else if($(this).hasClass('log-field')) {
                            var pmc = $(this);

                            if ( (pmc.val().indexOf("_") != -1) || pmc.val() == '' ) {
                                pmc.addClass('empty_field');
                            } else {
                                pmc.removeClass('empty_field');
                            }
                        }
                        else if($(this).hasClass('pas-field')) {
                            var pmc = $(this);
                            if ( (pmc.val().indexOf("_") != -1) || pmc.val() == '' ) {
                                pmc.addClass('empty_field');
                            } else {
                                pmc.removeClass('empty_field');
                            }
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
        $(".red").on('click', function(){
            console.log("Red!");
            $('.form_check').removeClass('hide');
            $('#log_in1').addClass('hide');
            $('#pas1').addClass('hide');

            $('#pas').val('doesnt matter');

            var but = $(this);
            var tr = but.parents('.tr_t');
            //console.log(tr);
            var tds = tr.find("td");
            var name = tds[0].innerText;
            var sur = tds[1].innerText;
            var log = tds[2].innerText;
            var pos = tds[3].innerText;
            //console.log(name);
            //console.log(pos);
            switch (pos){
                case "admin":$("#radio1").prop('checked', true); break;
                case "moderator": $("#radio2").prop('checked', true);break;
                case "user": $("#radio3").prop('checked', true);break;
            }
            $("#name").val(name);
            $("#surname").val(sur);
            $("#add_red").val("red");
            $("#log_in").val(log);

        });
        $(".red").on('click', function(){
            console.log("Red!");
            $('.form_check').removeClass('hide');
            $('#log_in1').addClass('hide');
            $('#pas1').addClass('hide');

            $('#pas').val('doesnt matter');

            var but = $(this);
            var tr = but.parents('.tr_t');
            //console.log(tr);
            var tds = tr.find("td");
            var name = tds[0].innerText;
            var sur = tds[1].innerText;
            var log = tds[2].innerText;
            var pos = tds[3].innerText;
            //console.log(name);
            //console.log(pos);
            switch (pos){
                case "admin":$("#radio1").prop('checked', true); break;
                case "moderator": $("#radio2").prop('checked', true);break;
                case "user": $("#radio3").prop('checked', true);break;
            }
            $("#name").val(name);
            $("#surname").val(sur);
            $("#add_red").val("red");
            $("#log_in").val(log);

        });
        $(".del").on('click', function(){
            console.log("Del!");
            $('.form_check').removeClass('hide');
            $('#h4').removeClass('hide');
            $('#log_in1').addClass('hide');
            $('#pas1').addClass('hide');

            $('#pas').val('doesnt matter');

            var but = $(this);
            var tr = but.parents('.tr_t');
            //console.log(tr);
            var tds = tr.find("td");
            var name = tds[0].innerText;
            var sur = tds[1].innerText;
            var log = tds[2].innerText;
            var pos = tds[3].innerText;
            //console.log(name);
            //console.log(pos);
            switch (pos){
                case "admin":$("#radio1").prop('checked', true); break;
                case "moderator": $("#radio2").prop('checked', true);break;
                case "user": $("#radio3").prop('checked', true);break;
            }
            $("#name").val(name);
            $("#surname").val(sur);
            $("#add_red").val("del");
            $("#log_in").val(log);
            $('.btn-success').val("Удалить");

        });
        document.getElementById("add").onclick = function() {
			$("#add_red").val("add");
            $("#radio2").prop('checked', true);
            $('#log_in1').removeClass('hide');
            $('#pas').val("");

            $('#pas1').removeClass('hide');
            $("#name").val("");
            $("#surname").val("");
            $("#log_in").val("");
            //console.log("I'm add now");
            $('.form_check').removeClass('hide');
        };


    });

})( jQuery );/**
 * Created by Екатерина on 03.01.2016.
 */
