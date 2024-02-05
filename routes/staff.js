const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/Database.js')
const userMiddleware = require('../middleware/UserModel.js')
var md5 = require('md5')
const fileUpload = require('express-fileupload')
const _ = require('lodash')
const mime = require('mime-types')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
app.use(cors())

app.use(
  fileUpload({
    createParentPath: true,
  })
),

app.get('/getStaff', (req, res, next) => {
  db.query(
    `SELECT
    a.staff_id,
    a.first_name
    ,a.email
    ,a.status
    ,a.pass_word
    ,a.user_group_id
    ,a.team
    ,a.staff_type
    ,a.staff_rate
    ,a.position
    ,a.published
    ,a.address_town
    ,a.address_state
    ,a.address_street
    ,a.address_country
    ,a.creation_date
    ,a.modification_date
    ,gc.name AS country_title
    ,b.title AS user_group_title
    ,CONCAT_WS(' ', a.first_name, a.last_name ) AS staff_name
    FROM staff a
    LEFT JOIN user_group b ON (a.user_group_id = b.user_group_id)
    LEFT JOIN geo_country gc ON (a.address_country = gc.country_code)
    WHERE a.staff_id != ''  AND a.status="Current"`,
    (err, result) => {
      if (err) {
        console.log('error: ', err);
        return res.status(400).send({
          data: err,
          msg: 'failed',
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: 'Staff has been removed successfully',
        });
      }
    }
  );
});

app.get('/getStaffTypeFromValueList', (req, res, next) => {
  db.query(
    `SELECT 
  value
  ,valuelist_id
  FROM valuelist WHERE key_text='Staff Type'`,
    (err, result) => {
      if (err) {
        console.log('error: ', err);
        return res.status(400).send({
          data: err,
          msg: 'failed',
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: 'Success',
        });
      }
    }
  );
});

app.get('/getStaffTeamFromValueList', (req, res, next) => {
  db.query(
    `SELECT 
  value
  ,valuelist_id
  FROM valuelist WHERE key_text='Staff Team'`,
    (err, result) => {
      if (err) {
        console.log('error: ', err);
        return res.status(400).send({
          data: err,
          msg: 'failed',
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: 'Success',
        });
      }
    }
  );
});

app.post('/getStaffById', (req, res, next) => {
  db.query(
    `SELECT  
    a.staff_id
    ,a.staff_rate
    ,a.user_group_id
    ,a.position
    ,a.email
    ,a.address_street
    ,a.address_town
    ,a.address_state
    ,a.address_country
    ,a.address_po_code
    ,a.phone
    ,a.fax
    ,a.notes
    ,a.published
    ,a.creation_date
    ,a.modification_date
    ,a.protected
    ,a.user_name
    ,a.pass_word
    ,a.first_name
    ,a.last_name
    ,a.mobile
    ,a.flag
    ,a.sex
    ,a.date_of_birth
    ,a.status
    ,a.team
    ,a.developer
    ,a.staff_type
    ,gc.name AS country_title
    ,b.title AS user_group_title
    ,CONCAT_WS(' ', a.first_name, a.last_name ) AS staff_name
    FROM staff a
    LEFT JOIN user_group b ON (a.user_group_id = b.user_group_id)
    LEFT JOIN geo_country gc ON (a.address_country = gc.country_code)
    WHERE a.staff_id = ${db.escape(req.body.staff_id)}  AND a.published = 1 `,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          data: err,
          msg: 'Failed',
        });
      } else {
        return res.status(200).send({
          data: result[0],
          msg: 'Success',
        });
      }
    }
  );
});

app.get('/getUserGroup', (req, res, next) => {
  db.query(
    `SELECT user_group_id
  ,title 
  FROM user_group
  WHERE user_group_id != ''`,
    (err, result) => {
      if (err) {
        console.log('error: ', err);
        return res.status(400).send({
          data: err,
          msg: 'failed',
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: 'User group has been get successfully',
        });
      }
    }
  );
});

app.post('/editStaff', (req, res, next) => {
  db.query(
    `UPDATE staff
  SET first_name=${db.escape(req.body.first_name)}
  ,staff_rate=${db.escape(req.body.staff_rate)}
  ,user_group_id=${db.escape(req.body.user_group_id)}
  ,position=${db.escape(req.body.position)}
  ,email=${db.escape(req.body.email)}
  ,address_street=${db.escape(req.body.address_street)}
  ,address_town=${db.escape(req.body.address_town)}
  ,address_state=${db.escape(req.body.address_state)}
  ,address_country=${db.escape(req.body.address_country)}
  ,address_po_code=${db.escape(req.body.address_po_code)}
  ,phone=${db.escape(req.body.phone)}
  ,fax=${db.escape(req.body.fax)}
  ,notes=${db.escape(req.body.notes)}
  ,published= ${db.escape(req.body.published)}
  ,creation_date=${db.escape(req.body.creation_date)}
  ,modification_date=${db.escape(
   req.body.modification_date
  )}
   ,protected=${db.escape(req.body.protected)}
    ,user_name=${db.escape(req.body.user_name)}
  ,pass_word=${db.escape(req.body.pass_word)}
  ,last_name=${db.escape(req.body.last_name)}
   ,mobile=${db.escape(req.body.mobile)}
  ,flag=${db.escape(req.body.flag)}
  
    ,sex=${db.escape(req.body.sex)}
  ,date_of_birth=${db.escape(req.body.date_of_birth)}
   ,status=${db.escape(req.body.status)}
   ,team=${db.escape(req.body.team)}
   ,developer=${db.escape(req.body.developer)}
  ,staff_type=${db.escape(req.body.staff_type)}
    WHERE staff_id = ${db.escape(req.body.staff_id)}`,
    (err, result) => {
      if (err) {
        console.log('error: ', err);
        return res.status(400).send({
          data: err,
          msg: 'failed',
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: 'Success',
        });
      }
    }
  );
});

app.post('/editUserGroup', (req, res, next) => {
  db.query(
    `UPDATE user_group
  title=${db.escape(req.body.user_group_title)}
  WHERE user_group_id = ${db.escape(req.body.user_group_id)}`,
    (err, result) => {
      if (err) {
        console.log('error: ', err);
        return res.status(400).send({
          data: err,
          msg: 'failed',
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: 'Tender has been removed successfully',
        });
      }
    }
  );
});

app.post('/insertUserGroup', (req, res, next) => {
  let data = {
    title: req.body.user_group_title,
  };
  let sql = 'INSERT INTO user_group SET ?';
  let query = db.query(sql, data, (err, result) => {
    if (err) {
      console.log('error: ', err);
      return res.status(400).send({
        data: err,
        msg: 'failed',
      });
    } else {
      return res.status(200).send({
        data: result,
        msg: 'New User Group has been created successfully',
      });
    }
  });
});



app.post('/insertStaff', (req, res, next) => {
  let data = {
    staff_id: req.body.staff_id,
    staff_rate: req.body.staff_rate,
    user_group_id: req.body.user_group_id,
    position: req.body.position,
    email: req.body.email,
    address_street: req.body.address_street,
    address_town: req.body.address_town,
    address_state: req.body.address_state,
    address_country: req.body.address_country,
    address_po_code: req.body.address_po_code,
    phone: req.body.phone,
    fax: req.body.fax,
    notes: req.body.notes,
     published: 0,
    creation_date: req.body.creation_date,
    modification_date: null,
    protected: req.body.protected,
    user_name: req.body.user_name,
    pass_word: req.body.pass_word,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    mobile: req.body.mobile,
    flag: req.body.flag,
    sex: req.body.sex,
    date_of_birth: req.body.date_of_birth,
    status: req.body.status,
    team: req.body.team,
    developer: req.body.developer,
    staff_type: req.body.staff_type,
   };
  let sql = 'INSERT INTO staff SET ?';
  let query = db.query(sql, data, (err, result) => {
    if (err) {
      console.log('error: ', err);
      return res.status(400).send({
        data: err,
        msg: 'failed',
      });
    } else {
      return res.status(200).send({
        data: result,
        msg: 'New Tender has been created successfully',
      });
    }
  });
});

app.post('/deleteStaff', (req, res, next) => {
  let data = { staff_id: req.body.staff_id }
  let sql = 'DELETE FROM staff WHERE ?'
  let query = db.query(sql, data, (err, result) => {
    if (err) {
      console.log('error: ', err)
      return res.status(400).send({
        data: err,
        msg: 'failed',
      })
    } else {
      return res.status(200).send({
        data: result,
        msg: 'Tender has been removed successfully',
      })
    }
  })
})

app.get('/getStaffGrp', (req, res, next) => {
  db.query(
    `SELECT s.staff_group_id
,s.title
,s.creation_date
,s.modification_date
,s.sort_order FROM staff_group s
WHERE s.staff_group_id!='';`,
    (err, result) => {
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
        })
      }
    },
  )
})

app.post('/editStaffGrp', (req, res, next) => {
  db.query(
    `UPDATE staff_group
   SET title=${db.escape(req.body.title)}
   ,creation_date=${db.escape(req.body.creation_date)}
   ,modification_date=${db.escape(req.body.modification_date)}
   ,sort_order=${db.escape(req.body.sort_order)}
   ,published=${db.escape(req.body.published)}
    WHERE staff_group_id = ${db.escape(req.body.staff_group_id)}`,
    (err, result) => {
      if (err) {
        console.log('error: ', err)
        return res.status(400).send({
          data: err,
          msg: 'failed',
        })
      } else {
        return res.status(200).send({
          data: result,
          msg: 'Tender has been removed successfully',
        })
      }
    },
  )
})

app.post('/insertStaffGroup', (req, res, next) => {
  let data = {
    title: req.body.title,
    creation_date: req.body.creation_date,
    modification_date: req.body.modification_date,
    sort_order: req.body.sort_order,
  }
  let sql = 'INSERT INTO staff_group SET ?'
  let query = db.query(sql, data, (err, result) => {
    if (err) {
      console.log('error: ', err)
      return res.status(400).send({
        data: err,
        msg: 'failed',
      })
    } else {
      return res.status(200).send({
        data: result,
        msg: 'New Tender has been created successfully',
      })
    }
  })
})

app.delete('/deleteStaffGroup', (req, res, next) => {
  let data = { sort_order: req.body.sort_order }
  let sql = 'DELETE FROM staff_group WHERE ?'
  let query = db.query(sql, data, (err, result) => {
    if (err) {
      console.log('error: ', err)
      return res.status(400).send({
        data: err,
        msg: 'failed',
      })
    } else {
      return res.status(200).send({
        data: result,
        msg: 'Tender has been removed successfully',
      })
    }
  })
})

app.get('/getStaffGrpHist', (req, res, next) => {
  db.query(
    `SELECT 
                s.staff_id
                ,s.staff_group_id
                ,s.creation_date
                ,s.modification_date FROM staff_group_history s
                WHERE s.staff_group_history_id!='';`,
    (err, result) => {
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
        })
      }
    },
  )
})
app.get('/getCountry', (req, res, next) => {
  db.query(`SELECT * from geo_country`, (err, result) => {
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
      })
    }
  })
})
app.post('/editStaffGrpHist', (req, res, next) => {
  db.query(
    `UPDATE staff_group_history
                          SET staff_id=${db.escape(req.body.staff_id)}
                          ,staff_group_id=${db.escape(req.body.staff_group_id)}
                          ,creation_date=${db.escape(req.body.creation_date)}
                          ,modification_date=${db.escape(
                            req.body.modification_date,
                          )}
                           WHERE staff_group_history_id = ${db.escape(
                             req.body.staff_group_id,
                           )}`,
    (err, result) => {
      if (err) {
        console.log('error: ', err)
        return res.status(400).send({
          data: err,
          msg: 'failed',
        })
      } else {
        return res.status(200).send({
          data: result,
          msg: 'Tender has been removed successfully',
        })
      }
    },
  )
})

app.post('/insertStaffGroupHist', (req, res, next) => {
  let data = {
    staff_id: req.body.staff_id,
    staff_group_id: req.body.staff_group_id,
    creation_date: req.body.creation_date,
    modification_date: req.body.modification_date,
  }
  let sql = 'INSERT INTO staff_group_history SET ?'
  let query = db.query(sql, data, (err, result) => {
    if (err) {
      console.log('error: ', err)
      return res.status(400).send({
        data: err,
        msg: 'failed',
      })
    } else {
      return res.status(200).send({
        data: result,
        msg: 'New Tender has been created successfully',
      })
    }
  })
})

app.delete('/deleteStaffGroupHist', (req, res, next) => {
  let data = { staff_id: req.body.staff_id }
  let sql = 'DELETE FROM staff_group_history WHERE ?'
  let query = db.query(sql, data, (err, result) => {
    if (err) {
      console.log('error: ', err)
      return res.status(400).send({
        data: err,
        msg: 'failed',
      })
    } else {
      return res.status(200).send({
        data: result,
        msg: 'Tender has been removed successfully',
      })
    }
  })
})

app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData)
  res.send('This is the secret content. Only logged in users can see that!')
})

module.exports = app
