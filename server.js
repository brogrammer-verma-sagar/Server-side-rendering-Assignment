const express = require('express');
const session = require('express-session');
const fs = require("fs")

const app = express();
app.use(express.static("public"))
app.use(express.static("views"))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine","ejs")


const port = 3000;

const data = JSON.parse(fs.readFileSync(`${__dirname}/data.json`))



app.use(session({
  secret: 'i_dont_know', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true
}));




// Route for rendering the login page
app.get('/login', (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect('/dashboard')
  }


  else {
    res.render("login",{message:""});
  }
});

// Route for processing the login form
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)

  data.map((ele) => {
    if (ele.username == username && ele.password == password) {
      req.session.isLoggedIn = true;
    }
  })




  if (req.session.isLoggedIn) {
    req.session.username = username;
    res.redirect("dashboard")
  }

  else{

    x=[{name:"hello"},{ name:"hello1"}]
    
    res.render("login",{message: "wrong username or password",items:x})
  }


})

  // Route for logging out
  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/login'); // Redirect to the login page after logout
    });
  });


  app.get('/register', (req, res) => {
    if (req.session.isLoggedIn) {
      res.redirect('/dashboard')
    }

    else {
      res.render("register",{message:""})
    }

  })


app.post('/register',(req,res)=>{
  console.log("hello")
  const {username,password}=req.body
  f=false
  data.map((ele) => {
    if (ele.username == username) {
      f=true
    }
  })

  

  if(f!=true){
    data.push({"username":username,
  "password":password})

  fs.writeFileSync(`${__dirname}/data.json`,JSON.stringify(data))

  res.redirect("login")

  }

  else{
    res.render("register",{message:"user already exist"})
  }
 

})


  function requireLogin(req, res, next) {
    if (req.session.isLoggedIn) {
      next();
    } else {
      res.redirect('/login');
    }
  }

  // Protected route (Dashboard or Home Page)
  app.get('/dashboard', requireLogin, (req, res) => {
    res.send(`Welcome, ${req.session.username}! This is your dashboard.`);
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });







  