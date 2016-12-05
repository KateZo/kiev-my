/**
 * Created by Екатерина on 04.01.2016.
 */
function Visitor(){
    this.name = "";
    this.surname = "";
    this.phone = 0;
    this.login = "";
    this.rights = "";
    this.cart = [];
    this.get_cart = function(){
        return this.cart;
    }
    this.get_name = function(){
        return this.name;
    }
    this.get_surname = function(){
        return this.surname;
    }
    this.get_phone = function(){
        return this.phone;
    }
    this.get_login = function(){
        return this.login;
    }
    this.clean_cart = function(){
        this.cart = [];
    }
}
Visitor.prototype.sett = function(name,surname,rights,login){
    this.name = name;
    this.surname = surname;
    this.rights = rights;
    this.login = login;
    this.cart = [];
}
Visitor.prototype.add_to_cart = function(name,amount,price,id){
    this.cart.push({
        name:name,
        amount:amount,
        price:price,
        id:id
    });
}

Visitor.prototype.set_amount = function(new_amount,item_id){

    for (var i=0;i<this.cart.length;i++){
        if (this.cart[i].id == item_id)
            this.cart[i].amount = this.cart[i].amount+Number(new_amount);
    };
}
Visitor.prototype.cart_sum = function() {
    var rez = 0;
    for (var i=0;i<this.cart.length;i++){
        rez = rez+ this.cart[i].price*this.cart[i].amount;
    }
    return rez;
}
exports.visitor = new Visitor();