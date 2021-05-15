const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
class User{
    constructor(username,email,cart,id){
        this.name = username;
        this.email = email;
        this.cart = cart; //{items: []}
        this._id = id;
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this);
    }
    //every user has one cart , 1-1
    addToCart(product){

        const cartProductIndex = this.cart.items.findIndex(cp =>{
            // return cp.productId == product._id ;
            return cp.productId.toString() === product._id.toString(); // if not -1 , it exists in the cart
        }); 
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
       if(cartProductIndex >= 0){ //exists
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
       }else{ //does not exist
        updatedCartItems.push({
            productId: new ObjectId(product._id),
             quantity: newQuantity
            });
       }
const updatedCart = {
    items:updatedCartItems
};
const db = getDb();
return db
.collection('users')
.updateOne(
    { _id: new ObjectId(this._id) },
    { $set: {cart: updatedCart} }
    );
    }

    getCart(){
        const db = getDb();
        //mapping an arr of items(js obj) into an arr of str(productId);
      const productsIds = this.cart.items.map(i =>{
          return i.productId;
      })
        return db
        .collection('products')
        .find({_id:{$in: productsIds}})
        .toArray()
        .then(products =>{
            return products.map(p =>{
                return {...p,quantity:this.cart.items.find(i=>{
                    return i.productId.toString() === p._id.toString();
                }).quantity
            };
            });
        });
    }

    deleteCart(productId){
      const updatedItem = this.cart.items.filter(item => {
          return item.productId.toString() !== productId.toString(); //return false to remove item
      });
      const db = getDb();
        return db
        .collection('users')
        .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: {cart: {items: updatedItem } }}
            );
    }

    static findById(userId){
        const db = getDb();
        return db
        .collection('users')
        .find({ _id : new ObjectId(userId)})
        .next()
        .then(user=>{
            console.log(user);
            return user;
        })
        .catch(err=>{
            console.log(err);
        });
    }
}

module.exports = User;
