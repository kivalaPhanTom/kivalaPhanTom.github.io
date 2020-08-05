
module.exports = function Cart(oldCart){
    this.customerId = oldCart.customerId || 0;
    this.items = oldCart.items || {};
    this.totalQuatity = oldCart.totalQuatity || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.add = function(item, id, cusId){
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price : 0};
        }
        storedItem.qty++;
        if(storedItem.item.promotion_price == ""){
            storedItem.price = MakeInterger(storedItem.item.price) * storedItem.qty;
            storedItem.price = MakeDecimal(storedItem.price)
            this.customerId = cusId;
            this.totalQuatity++;
            this.totalPrice += MakeInterger(storedItem.item.price);
        }
        else{
            storedItem.price = MakeInterger(storedItem.item.promotion_price) * storedItem.qty;
            storedItem.price = MakeDecimal(storedItem.price)
            this.customerId = cusId;
            this.totalQuatity++;
            this.totalPrice += MakeInterger(storedItem.item.price);
        }
    }
    this.reduceByOne = function(id){
        this.items[id].qty--;
        this.items[id].price = MakeInterger(this.items[id].price) - MakeInterger(this.items[id].item.price);
        this.items[id].price = MakeDecimal(this.items[id].price)
        this.totalQuatity--;
        this.totalPrice -= MakeInterger(this.items[id].item.price);
        if(this.items[id].qty <= 0){
            delete this.items[id]
        }
    };
    this.addByOne = function(id){
        this.items[id].qty++;
        this.items[id].price = MakeInterger(this.items[id].price) + MakeInterger(this.items[id].item.price);
        this.items[id].price = MakeDecimal(this.items[id].price)
        this.totalQuatity++;
        this.totalPrice += MakeInterger(this.items[id].item.price);
        
    };
    this.removeItem = function(id){
        this.totalQuatity -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id]
    }
    this.generateArray = function(){
        var arr = [];
        for (var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
    function MakeDecimal(Number) {
        Number = Number + "" // Convert Number to string if not
        Number = Number.split('').reverse().join(''); //Reverse string
        var Result = "";
        for (i = 0; i <= Number.length; i += 3) {
            Result = Result + Number.substring(i, i + 3) + ".";
        }
        Result = Result.split('').reverse().join(''); //Reverse again
        if (!isFinite(Result.substring(0, 1))) Result = Result.substring(1, Result.length); // Remove first dot, if have.
        if (!isFinite(Result.substring(0, 1))) Result = Result.substring(1, Result.length); // Remove first dot, if have.
        return Result;
    }
    function MakeInterger(Number)
    {
        var string = Number.toString();
        var newStr = string.split('.').join('')
        return(parseInt(newStr))
    }

} 