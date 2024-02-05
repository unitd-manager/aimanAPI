const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/Database.js');
const userMiddleware = require('../middleware/UserModel.js');
var md5 = require('md5');
const fileUpload = require('express-fileupload');
const _ = require('lodash');
const mime = require('mime-types')
var bodyParser = require('body-parser');
var cors = require('cors');
var nodemailer = require('nodemailer');
var randtoken = require('rand-token');
var app = express();
app.use(cors());

app.use(fileUpload({
    createParentPath: true
}));

//send email
function sendEmail(email, token) {
 
  var email = email;
  var token = token;

  var mail = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: '', // Your email id
          pass: '' // Your password
      }
  });

  var mailOptions = {
      from: 'unitdecom@gmail.com',
      to: email,
      subject: 'Reset Password Link - unitdecom.com',
      html: '<p>You requested for reset password, kindly use this <a href="http://localhost:4000/reset-password?token=' + token + '">link</a> to reset your password</p>'

  };

  mail.sendMail(mailOptions, function(error, info) {
      if (error) {
          console.log(1)
      } else {
          console.log(0)
      }
  });
}

app.post('/signup', (req, res, next) => {
 
  let data = {
    email: req.body.email
    , phone: req.body.phone
    , creation_date: req.body.creation_date
    , modification_date: req.body.modification_date
    , pass_word: req.body.pass_word
    , first_name	: req.body.first_name
    , last_name	: req.body.last_name
    
   };
   let sql = "INSERT INTO contact SET ?";
   let query = db.query(sql, data,(err, result) => {
     if (err) {
       console.log('error: ', err)
       return res.status(400).send({
         data: err,
         msg: 'failed',
       })
     } else {
       return res.status(200).send({
         data: result,
         msg: 'Success',
           });
     }
   });
});


app.post('/login', (req, res, next) => {
  db.query(`SELECT * FROM staff WHERE email=${db.escape(req.body.email)} AND pass_word=${db.escape(req.body.password)}`,
    (err, result) => {
       
      if (result.length == 0) {
          
        return res.status(200).send({
          msg: 'No result found',
          status:'200'
        });
      } else {
          var token = jwt.sign({ id: result[0].staff_id }, 'smartcon', {
              expiresIn: 86400 // expires in 24 hours
            });
            return res.status(200).send({
              data: result[0],
              msg:'Success',
              token:token
            });

        }
 
    }
  );
});


app.post('/reset-password-email', function(req, res, next) {
 
  var email = req.body.email;

  //console.log(sendEmail(email, fullUrl));

  db.query('SELECT * FROM users WHERE email ="' + email + '"', function(err, result) {
      if (err) throw err;
       
      var type = ''
      var msg = ''
 
      console.log(result[0]);
   
      if (result[0].email.length > 0) {

         var token = randtoken.generate(20);

         var sent = sendEmail(email, token);

           if (sent != '0') {

              var data = {
                  token: token
              }

              connection.query('UPDATE users SET ? WHERE email ="' + email + '"', data, function(err, result) {
                  if(err) throw err
       
              })

              type = 'success';
              msg = 'The reset password link has been sent to your email address';

          } else {
              type = 'error';
              msg = 'Something goes to wrong. Please try again';
          }

      } else {
          console.log('2');
          type = 'error';
          msg = 'The Email is not registered with us';

      }
  
      req.flash(type, msg);
      res.redirect('/');
  });
})

/* update password to database */
app.post('/update-password', function(req, res, next) {
 
    var token = req.body.token;
    var password = req.body.password;
 
   db.query('SELECT * FROM users WHERE token ="' + token + '"', function(err, result) {
        if (err) throw err;
 
        var type
        var msg
 
        if (result.length > 0) {
                
              var saltRounds = 10;
 
             // var hash = bcrypt.hash(password, saltRounds);
 
            bcrypt.genSalt(saltRounds, function(err, salt) {
                  bcrypt.hash(password, salt, function(err, hash) {
 
                   var data = {
                        password: hash
                    }
 
                    db.query('UPDATE users SET ? WHERE email ="' + result[0].email + '"', data, function(err, result) {
                        if(err) throw err
                   
                    });
 
                  });
              });
 
            type = 'success';
            msg = 'Your password has been updated successfully';
              
        } else {
 
            console.log('2');
            type = 'success';
            msg = 'Invalid link; please try again';
 
            }
 
        req.flash(type, msg);
        res.redirect('/');
    });
  })

app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;