const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv'); 

const SECRET = process.env.SECRET;
app.use(express.json());
dotenv.config(); 
const PORT = process.env.PORT || 3000;

//schemas for mongoDB

const adminSchema = new mongoose.Schema({
    username: String,
    password: String

});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedBooks : [{type: mongoose.Schema.Types.ObjectId, ref: 'Books'}]

});

const booksSchema = new mongoose.Schema({
    title: String,
    Description: String,
    price: {type:Number,
    required: true},
    rating: {type:Number,
        required: true},
    published: {type:Boolean,
        default: true,
        required: false}
});

// Define mongoose models
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Books = mongoose.model('Books', booksSchema);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "bookBackend" });


//authenticate JWT
const authenticateJWT = (req,res,next) => {
    var authToken = req.headers.authorization;
    if(authToken){
        var token = authToken.split(' ')[1];
        jwt.verify(token,SECRET,(err, user) => {
            if (err) {
                return res.sendStatus(403)
            }else{
                req.user = user;
                next();
            }
        })
    }else{
        res.sendStatus(401);
    }
};

// Admin authentication middleware
const isAdmin = (req, res, next) => {
    if (req.user.role === 'Admin') {
        next();
    } else {
        res.sendStatus(403);
    }
};

// User authentication middleware
const isUser = (req, res, next) => {
    if (req.user.role === 'User') {
        next();
    } else {
        res.sendStatus(403);
    }
};

//admin signup
app.post('/admin/signup',  async (req,res) => {
    var {username, password} = req.body;
    var admin = await Admin.findOne({username});
    if(admin){
        res.status(403).send('Admin already exists!!'); 
    }else{
        const adminObj = new Admin({username,password});
        await adminObj.save()
        var token = jwt.sign({username, role: 'Admin'},SECRET, {expiresIn: '1h'});
        res.json({Message: "Admin created successfully", token})
    }

})

//admin login
app.post('/admin/login', async(req,res) => {
    var {username,password} = req.body;
    var admin = await Admin.findOne({username, password});
    if(admin){
        var token = jwt.sign({username, role: 'Admin'},SECRET, {expiresIn: '1h'});
        res.json({message: "Logged in successfully", token}); 
    }else{
        res.status(403).send("User does not exist with such credentials")
    }
})

//books creation
app.post('/admin/create' , authenticateJWT, isAdmin, async(req,res) => {
    try{
        const book = new Books(req.body);
    await book.save();
    res.json({message: "Book Created Successfully", bookID: book.id})
    }catch(error){
        res.status(500).send("Something is wrong with the inputs");
    }
    
});

// List all books
app.get('/admin/books', authenticateJWT, isAdmin, async (req,res) => {
    const booksObj = await Books.find({});
    res.json({booksObj});
})
// update books
app.put('/admin/books/:bookId', authenticateJWT, isAdmin, async (req, res) => {
    const updatedBook  = await Books.findByIdAndUpdate(req.params.bookId, req.body, {new : true});
    if(updatedBook){
        res.send("Book Details Updated Successfully");
    }else{
        res.status(404).json({message: "Book not Found"})
    }
});

//delete book

app.delete('/admin/books/:bookId', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const deletedBook = await Books.findByIdAndDelete(req.params.bookId);
        if (!deletedBook) {
            return res.status(404).json({ message: "No book exists with that ID" });
        }
        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});


//user routes
//user signup

app.post('/user/signup',  async (req,res) => {
    var {username, password} = req.body;
    var user = await User.findOne({username});
    if(user){
        res.status(403).send('User already exists!!'); 
    }else{
        const userObj = new User({username,password});
        await userObj.save()
        var token = jwt.sign({username, role: 'User'},SECRET, {expiresIn: '1h'});
        res.json({Message: "Admin created successfully", token})
    }

})

//user login

app.post('/user/login', async(req,res) => {
    var {username,password} = req.body;
    var user = await User.findOne({username, password});
    if(user){
        var token = jwt.sign({username, role: 'User'},SECRET, {expiresIn: '1h'});
        res.json({message: "Logged in successfully", token}); 
    }else{
        res.status(403).send("User does not exist with such credentials")
    }
})

// List all books

app.get('/user/books', authenticateJWT, isUser, async (req,res) => {
    const booksObj = await Books.find({published: true});
    res.json({booksObj});
})

// Purchase books

app.post('/user/books/:bookId', authenticateJWT, isUser, async (req,res) => {
    const booksObj = await Books.findById(req.params.bookId);
    const user = await User.findOne({username: req.user.username})
    if(user){
        user.purchasedBooks.push(booksObj);
        await user.save();
        res.status(200).json({message: "Book Purchased Successfuly",  ID: booksObj.id})
    }else{
        res.status(404).json({message: "User not found"})
    }
    res.status(404).json({message: "Book not found"})
})

app.get('/user/purchasedBooks', authenticateJWT, isUser , async (req, res) => {
    const booksObj = await User.findOne({username: req.user.username}).populate('purchasedBooks')
    res.json({purchasedBooks: booksObj.purchasedBooks});

});


app.listen(PORT, () => { console.log('application started at 3000')})