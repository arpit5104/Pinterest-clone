var express = require('express');
var router = express.Router();
var userModel = require('./users');
var postModel = require('./posts');
const passport = require('passport');
const upload = require('./multer');
const fileupload = require('./profilemulter');

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/login', function (req, res) {
  res.render('login', {error : req.flash('error') });
});

router.get('/feed', function (req, res) {
  res.render('feed');
});

router.get('/profile',isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("post");
  res.render("profile", {user});
});

router.get('/upload', (req,res)=>{
  res.render("post");
})

router.post('/upload', isLoggedIn ,upload.single("file"), async (req,res,next)=>{
  if(!req.file){
    res.status(404).send("No file uploaded");
  }
  const user = await userModel.findOne({username: req.session.passport.user});
  const post= await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    userId: user._id
  });

  user.post.push([post._id]);
   await user.save();
  res.redirect('/profile');
})

router.get('/register', function (req, res) {
  res.render("index");
});

router.post('/register', async (req, res) => {
  const userData = new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
  });
  userModel.register(userData, req.body.password)
  .then(()=>{
    passport.authenticate("local")(req,res,()=>{
      res.redirect("/profile");
    })
  })

})

router.post('/fileupload', isLoggedIn , fileupload.single("image"), function(req,res,next){
 res.send("uploaded");
})

router.post('/login',passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true,
}),(req,res)=>{
  
})

router.get('/logout',(req,res)=>{
  req.logout((err)=>{
    if(err){ return next(err);}
    res.redirect('/');
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
