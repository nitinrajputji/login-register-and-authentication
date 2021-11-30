require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
require("./db/conn");
const Register = require("./models/schema");
const auth = require("./middleware/auth");

const port = process.env.PORT || 8000;
const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../template/views");
const partialPath = path.join(__dirname, "../template/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticPath));
app.use(cookieParser());
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialPath);

// console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/secret", auth, (req, res) => {
  // console.log(`the secret code ${req.cookies.jwt}`)
  res.render("secret");
});
app.get("/logout", auth, async (req, res) => {
  try {
    //logout from all device
    req.user.tokens = [];

    res.clearCookie("jwt");

    console.log("logout successfully");
    await res.user.save();
    res.render("login");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  try {
    const passward = req.body.passward;
    const cpassward = req.body.cpassward;
    console.log("REQ", req.body);

    if (passward == cpassward) {
      const registerEmploy = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        passward: passward,
        cpassward: cpassward,
      });

      //    midleware

      const token = await registerEmploy.genreatetoken();

      //   res.cookie("jwt", token, {
      //     expires: new Date(Date.now() + 100000),
      //     httponly: true,
      //     //  secure:true
      //   });

      const registered = await registerEmploy.save();
      res.status(201).render("index");
    } else {
      res.send("passward are not matching");
    }
  } catch (error) {
    console.log("ERR:", error);
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const passward = req.body.passward;
    const email = req.body.email;

    const useremail = await Register.findOne({ email: email });
    const isMatch = await bcrypt.compare(passward, useremail.passward);
    console.log(isMatch);
    console.log(passward);
    console.log(useremail.passward);
    const token = await useremail.genreatetoken();
    console.log("the token is" + token);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 1000000),
      httponly: true,
      //secure:true
    });

    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.send("inviled email aaaaaa");
    }
  } catch (error) {
    res.status(400).send("inviled email");
  }
});

app.listen(port, () => {
  console.log(`port is listening and the port is ${port}`);
});
