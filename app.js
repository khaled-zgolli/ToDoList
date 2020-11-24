const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const date=require(__dirname + '/date.js');

const app=express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://admin:khaled123@cluster0.eimgb.mongodb.net/toDoListDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema={
    name:String
};

const Item=mongoose.model('Item',itemsSchema);

const item1= new Item({
    name : 'welcome to your todolist!'
});
const item2=new Item({
    name : 'hit the + button to add a new item'
});
const item3=new Item({
    name : '<-- hit this to delete an item'
});

const defaultItems=[item1,item2,item3];

app.get('/',function(req,res){

    const day=date.getDate();
//    const day=date.getDay();

    Item.find({},function(err,foundItems){
        if(foundItems.length == 0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log('add success');
                }
            });
            res.redirect('/');
            
              }
        else{
            res.render('list',{listTitle : day, items : foundItems});
        }
    });

    
});



app.post('/delete',function(req,res){
    const checkedItemId=req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId,function(err){
        if(!err){
            console.log('item deleted');
            res.redirect('/');
        }
    },);
});



app.post('/',function(req,res){

    const itemName = req.body.newItem;

    item=new Item({
        name: itemName

    });
    item.save();

    res.redirect('/');
   
});











app.listen(3000,function(){
    console.log("server started on port 3000");
})