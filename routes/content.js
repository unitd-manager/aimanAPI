const express = require("express");
const db = require("../config/Database.js");
const fileUpload = require("express-fileupload");
const _ = require("lodash");
var cors = require("cors");
var app = express();
app.use(cors());

app.use(
  fileUpload({
    createParentPath: true,
  })
);


app.get("/getAllPhotoGallery", (req, res, next) => {
  db.query(
    `select c.title, c.description ,m.file_name,m.display_title
from content c 
LEFT Join media m ON m.record_id=c.content_id
WHERE c.content_type= "All Image"`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get("/getAboutUs", (req, res, next) => {
  db.query(
    `select c.title, c.description ,m.file_name,m.display_title
    from content c 
    LEFT Join media m ON m.record_id=c.content_id
    WHERE c.content_type= "Web AboutUs"`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.post('/getDetailContent', (req, res, next) => {
  let query = `SELECT c.title, c.description, ca.category_title, s.section_title, sc.sub_category_title
    FROM content c 
    LEFT JOIN category ca ON c.category_id = ca.category_id
    LEFT JOIN section s ON c.section_id = s.section_id
    LEFT JOIN sub_category sc ON c.sub_category_id = sc.sub_category_id
    WHERE c.section_id = ${db.escape(req.body.section_id)}
      AND c.category_id = ${db.escape(req.body.category_id)}`;

  if (req.body.sub_category_id) {
    query += ` AND c.sub_category_id = ${db.escape(req.body.sub_category_id)}`;
  }

  query += ' GROUP BY c.content_id';

  db.query(query, (err, result) => {
    if (err) {
      console.log("error: ", err);
      res.status(500).send({
        msg: 'Internal Server Error'
      });
      return;
    }

    if (result.length === 0) {
      res.status(400).send({
        msg: 'No result found'
      });
    } else {
      res.status(200).send({
        data: result,
        msg: 'Success'
      });
    }
  });
});


app.get("/getBanners", (req, res, next) => {
  db.query(
    `select c.title, c.description ,m.file_name,m.display_title
    from content c 
    LEFT Join media m ON m.record_id=c.content_id
    WHERE c.content_type= "Banner Image" 
    ORDER BY c.content_id DESC`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get("/getContentTypeCount", (req, res, next) => {
  db.query(
    `SELECT 
    SUM(CASE WHEN content_type = 'Events' THEN 1 ELSE 0 END) AS events_count,
    SUM(CASE WHEN content_type = 'News' THEN 1 ELSE 0 END) AS news_count,
    SUM(CASE WHEN content_type = 'Article' THEN 1 ELSE 0 END) AS article_count,
    SUM(CASE WHEN content_type = 'Resources' THEN 1 ELSE 0 END) AS resource_count
FROM
    content`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return;
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
   }
 );
});

app.get("/getAimanTeam", (req, res, next) => {
  db.query(
    `select c.title, c.description ,m.file_name,m.display_title
    from content c 
    LEFT Join media m ON m.record_id=c.content_id
    WHERE c.content_type= "Aiman Team"`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get("/getAimanHomeServices", (req, res, next) => {
  db.query(
    `select c.title, c.description ,m.file_name,m.display_title
    from content c 
    LEFT Join media m ON m.record_id=c.content_id
    WHERE c.content_type= "Home Services"`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get("/getAimanHomeResources", (req, res, next) => {
  db.query(
    `select c.content_id, c.title, c.description ,m.file_name,m.display_title
    from content c 
    LEFT Join media m ON m.record_id=c.content_id
    WHERE c.latest = 1`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get("/getEmail", (req, res, next) => {
  db.query(
    `select c.title, c.description 
from content c 
WHERE c.content_type= "Email"`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});
app.get("/getPastOfficeBearers", (req, res, next) => {
  db.query(
    `select c.title, c.description
    from content c 
    WHERE c.content_type= "Past Office Bearers"`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
   }
);
});
app.get("/getPhotoGallery", (req, res, next) => {
  db.query(
    `select c.title, c.description ,m.file_name,m.display_title,m.media_id,c.content_id
from content c 
LEFT Join media m ON m.record_id=c.content_id
WHERE c.content_type= "All Image" 
OR c.content_type= "Events Image" 
OR c.content_type= "Baithulmal Image" 
OR c.content_type= "General Image"`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});


app.get("/getEventPhotoGallery", (req, res, next) => {
  db.query(
    `select c.title, c.description ,m.file_name,m.display_title
from content c 
LEFT Join media m ON m.record_id=c.content_id
WHERE c.content_type= "Events Image"`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});


app.get("/getBaithulPhotoGallery", (req, res, next) => {
  db.query(
    `select c.title, c.description ,m.file_name,m.display_title
from content c 
LEFT Join media m ON m.record_id=c.content_id
WHERE c.content_type= "Baithulmal Image"`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});
app.get("/getGeneralPhotoGallery", (req, res, next) => {
  db.query(
    `select c.title, c.description ,m.file_name,m.display_title
from content c 
LEFT Join media m ON m.record_id=c.content_id
WHERE c.content_type= "General Image"`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.post("/getReligionService", (req, res, next) => {
        var formated = db.escape(req.body.title).replace('-',' ')

  db.query(
    `select c.title, c.description ,m.file_name
from content c 
LEFT Join media m ON m.record_id=c.content_id
    LEFT JOIN (category ca)    ON (c.category_id      = ca.category_id)
WHERE c.content_type= "Service Religious"
AND c.section_id  = 66
    AND lower(ca.category_title)=${db.escape(req.body.title)}`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get("/getAudioGallery", (req, res, next) => {
       
  db.query(
    `select c.title, c.description ,m.file_name,m.sort_order,m.display_title
from content c 
LEFT Join media m ON m.record_id=c.content_id
WHERE c.content_type= "Audio Gallery" AND m.file_name!=''
ORDER BY m.sort_order ASC`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get("/getAudioGalleryDes", (req, res, next) => {
       
  db.query(
    `select c.title, c.description 
from content c 
WHERE c.content_type= "Audio Gallery"`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get("/getContent", (req, res, next) => {
  db.query(
    `Select c.title
  , c.content_id
  ,s.section_id
  ,c.category_id
  ,c.sort_order
  ,c.sub_category_id
  ,c.content_type
  ,c.show_title
  ,c.published
  ,c.content_date 
  ,c.description
  ,c.creation_date
  ,c.modification_date 
  ,c.tag
  ,c.author_name
  ,c.published_date
  ,c.date
  ,c.created_by
  ,c.modified_by
  ,s.section_title
  ,ca.category_title
  ,sc.sub_category_title
  FROM content c
  LEFT JOIN section s ON s.section_id=c.section_id 
  LEFT JOIN category ca ON ca.category_id=c.category_id 
  LEFT JOIN sub_category sc ON sc.sub_category_id=c.sub_category_id 
  WHERE c.content_id !='' ORDER BY c.sort_order ASC`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});


app.get("/getArticles", (req, res, next) => {
  db.query(
    `select c.title, 
    c.description ,
    m.file_name,
    c.content_date,
    c.creation_date,
    c.created_by,
    c.modification_date,
    c.modified_by
    from content c LEFT Join media m ON m.record_id=c.content_id WHERE c.content_type= "Article" and m.room_name="ContentAttachment" AND c.published=1`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.post("/getSubCategoryTitle", (req, res, next) => {
  db.query(
    `SELECT 
    category_id
    ,sub_category_title
    ,sub_category_id
     FROM sub_category 
     where category_id = ${db.escape(req.body.category_id)}`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});


app.post("/getSubContent", (req, res, next) => {
  db.query(
    `SELECT 
     c.category_id
     ,c.content_id
     ,c.title
     ,c.description
    ,su.sub_category_title
    ,su.sub_category_id
     FROM content c
     LEFT JOIN category ca ON c.category_id = ca.category_id
     LEFT JOIN section s ON ca.section_id=s.section_id
     LEFT JOIN sub_category su ON ca.category_id=su.category_id
     where s.section_id= ${db.escape(req.body.section_id)}`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});



app.post("/getArticlepage", (req, res, next) => {
  db.query(
    `select c.title, 
    c.description ,
    m.file_name,
    c.content_date,
    c.creation_date,
    c.created_by,
    c.modification_date,
    c.modified_by,
    c.content_type
    from content c LEFT Join media m ON m.record_id=c.content_id WHERE 
    c.content_id=${db.escape(req.body.content_id)} AND c.content_type IN ('Article') AND 
    m.room_name="ContentAttachment" AND c.published=1`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});


app.post("/getNewsandEvents", (req, res, next) => {
  var formated = db.escape(req.body.title1).replace('-', ' ');
  // Use formated directly without replacing
  db.query(
    `SELECT c.title, 
    c.description,
    m.file_name,
    c.content_date,
    c.creation_date,
    c.created_by,
    c.modification_date,
    c.modified_by,
    c.content_type
    FROM content c
    LEFT JOIN media m ON m.record_id=c.content_id
    WHERE c.title=${formated} AND c.content_type IN ('News', 'Events', 'Article') AND c.published=1`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get('/getAboutUs', (req, res, next) => {
  db.query(
    `SELECT c.content_id,c.section_id,c.category_id
               ,c.sub_category_id
               ,c.author_id
               ,c.show_title
               ,c.type
               ,c.sort_order
               ,c.published
               ,c.member_only
               ,c.latest
               ,c.favourite
               ,c.creation_date
               ,c.modification_date
               ,c.content_date
               ,c.chi_title
               ,c.chi_description
               ,c.content_type
               ,c.external_link
               ,c.meta_title
               ,c.meta_keyword
               ,c.meta_description
               ,c.flag
               ,c.internal_link
               ,c.two_in_row
               ,c.three_in_row
                ,c.title AS title
                ,c.description_short AS description_short
                ,c.description AS description
                ,c.title1 AS title1
                ,c.description1 AS description1
                ,c.title2 AS title2
                ,c.description2 AS description2
                ,c.title3 AS title3
                ,c.description3 AS description3
              ,s.section_title
              ,s.section_type
              ,ca.category_title
              ,ca.category_type
              ,sc.sub_category_title
              ,sc.sub_category_type
        FROM content c
        LEFT JOIN (section s)      ON (c.section_id       = s.section_id)
        LEFT JOIN (category ca)    ON (c.category_id      = ca.category_id)
        LEFT JOIN (sub_category sc)ON (c.sub_category_id  = sc.sub_category_id)
         WHERE c.published = 1
 AND c.content_type = 'Record'
 AND c.section_id  = 23
 AND (c.sub_category_id IS NULL OR c.sub_category_id ='')
 ORDER BY c.sort_order ASC LIMIT 0, 50`,
    (err, result) => {
       
      if (result.length === 0) {
        return res.status(400).send({
          msg: 'No result found'
        });
      } else {
            return res.status(200).send({
          data: result,
          msg:'Success'
        });

        }
 
    }
  );
});

app.get("/getPastOfficeBearers", (req, res, next) => {
  db.query(
    `select c.title, c.description
    from content c 
    WHERE c.content_type= "Past Office Bearers"`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});


app.get('/getShipping', (req, res, next) => {
  db.query(
    `SELECT c.content_id,c.section_id,c.category_id
               ,c.sub_category_id
               ,c.author_id
               ,c.show_title
               ,c.type
               ,c.sort_order
               ,c.published
               ,c.member_only
               ,c.latest
               ,c.favourite
               ,c.creation_date
               ,c.modification_date
               ,c.content_date
               ,c.chi_title
               ,c.chi_description
               ,c.content_type
               ,c.external_link
               ,c.meta_title
               ,c.meta_keyword
               ,c.meta_description
               ,c.flag
               ,c.internal_link
               ,c.two_in_row
               ,c.three_in_row
                ,c.title AS title
                ,c.description_short AS description_short
                ,c.description AS description
                ,c.title1 AS title1
                ,c.description1 AS description1
                ,c.title2 AS title2
                ,c.description2 AS description2
                ,c.title3 AS title3
                ,c.description3 AS description3
              ,s.section_title
              ,s.section_type
              ,ca.category_title
              ,ca.category_type
              ,sc.sub_category_title
            FROM content c
        LEFT JOIN (section s)      ON (c.section_id       = s.section_id)
        LEFT JOIN (category ca)    ON (c.category_id      = ca.category_id)
        LEFT JOIN (sub_category sc)ON (c.sub_category_id  = sc.sub_category_id)
        WHERE c.published = 1
 AND c.content_type = 'Shipping' 
 ORDER BY c.sort_order ASC LIMIT 0, 50`,
    (err, result) => {
       
      if (result.length === 0) {
        return res.status(400).send({
          msg: 'No result found'
        });
      } else {
            return res.status(200).send({
          data: result,
          msg:'Success'
        });

        }
 
    }
  );
});

app.get('/getAboutUsCompany', (req, res, next) => {
  db.query(
    `SELECT c.content_id,c.section_id,c.category_id
               ,c.sub_category_id
               ,c.author_id
               ,c.show_title
               ,c.type
               ,c.sort_order
               ,c.published
               ,c.member_only
               ,c.latest
               ,c.favourite
               ,c.creation_date
               ,c.modification_date
               ,c.content_date
               ,c.chi_title
               ,c.chi_description
               ,c.content_type
               ,c.external_link
               ,c.meta_title
               ,c.meta_keyword
               ,c.meta_description
               ,c.flag
               ,c.internal_link
               ,c.two_in_row
               ,c.three_in_row
                ,c.title AS title
                ,c.description_short AS description_short
                ,c.description AS description
                ,c.title1 AS title1
                ,c.description1 AS description1
                ,c.title2 AS title2
                ,c.description2 AS description2
                ,c.title3 AS title3
                ,c.description3 AS description3
              ,s.section_title
              ,s.section_type
              ,ca.category_title
              ,ca.category_type
              ,sc.sub_category_title
              ,sc.sub_category_type
        FROM content c
        LEFT JOIN (section s)      ON (c.section_id       = s.section_id)
        LEFT JOIN (category ca)    ON (c.category_id      = ca.category_id)
        LEFT JOIN (sub_category sc)ON (c.sub_category_id  = sc.sub_category_id)
         WHERE c.published = 1
 AND c.content_type = 'Record'
 AND c.section_id  = 25
 AND (c.sub_category_id IS NULL OR c.sub_category_id ='')
 ORDER BY c.sort_order ASC LIMIT 0, 50`,
    (err, result) => {
       
      if (result.length === 0) {
        return res.status(400).send({
          msg: 'No result found'
        });
      } else {
            return res.status(200).send({
          data: result,
          msg:'Success'
        });

        }
 
    }
  );
});

app.get("/getValueList", (req, res, next) => {
  db.query(
    `SELECT 
       value,valuelist_id
       FROM valuelist WHERE key_text="Content Type"`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          data: err
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});


app.get("/getFaqPage", (req, res, next) => {
  db.query(
    `SELECT 
       title,description,content_id
       FROM content WHERE content_type="FAQ Page"`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          data: err
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get("/getStoreLocatorPage", (req, res, next) => {
  db.query(
    `SELECT 
       title,description,content_id
       FROM content WHERE content_type="StoreLocator"`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          data: err
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get("/getSupportPage", (req, res, next) => {
  db.query(
    `SELECT 
       title,description,content_id
       FROM content WHERE content_type="Support Policy"`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          data: err
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get("/getReturnsPage", (req, res, next) => {
  db.query(
    `SELECT 
       title,description,content_id
       FROM content WHERE content_type="Returns Policy"`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          data: err
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get("/getReturnsDescriptionPage", (req, res, next) => {
  db.query(
    `SELECT 
       description,content_id
       FROM content WHERE content_type="Returns Policy Description"`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          data: err
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});


app.get("/getBaithulmaal", (req, res, next) => {
  db.query(
    `Select c.*
     ,m.file_name
     ,m.record_type
     ,m.room_name
  FROM content c
 LEFT Join media m ON m.record_id=c.content_id 
  WHERE c.content_id !='' AND c.content_type="Aimaan Baithulmaal" AND m.room_name="ContentPic"`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
}
);
});



app.post("/getContentById", (req, res, next) => {
  db.query(
    `Select c.title
  , c.content_id
  ,s.section_id
  ,c.category_id
  ,c.sort_order
  ,c.sub_category_id
  ,c.content_type
  ,c.show_title
  ,c.published 
  ,c.content_date 
  ,c.description
  ,c.creation_date
  ,c.modification_date 
  ,c.tag
  ,c.author_name
  ,c.published_date
  ,c.date
  ,c.created_by
  ,c.modified_by
  ,s.section_title
  ,ca.category_title
  ,sc.sub_category_title
  FROM content c
  LEFT JOIN section s ON s.section_id=c.section_id 
  LEFT JOIN category ca ON ca.category_id=c.category_id 
  LEFT JOIN sub_category sc ON sc.sub_category_id=sc.sub_category_id 
  WHERE c.content_id = ${db.escape(req.body.content_id)} `,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result[0],
          msg: "Success",
        });
      }
    }
  );
});

app.post("/getContentBySectionId", (req, res, next) => {
  db.query(
    `SELECT c.content_id,
c.title,
c.section_id,
c.category_id,
c.description,
c.published,
m.file_name
from content c
LEFT JOIN category ca on c.category_id=ca.category_id
LEFT JOIN section s on c.section_id=s.section_id
LEFT JOIN media m on m.record_id=c.content_id
where c.section_id= ${db.escape(req.body.section_id)}
GROUP BY c.content_id `,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get("/getSortOrderbyId", (req, res, next) => {
  db.query(
    `Select sort_order
   FROM content 
   WHERE content_id !=''`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.post("/editSortOrder", (req, res, next) => {
  db.query(
    `UPDATE content
            SET sort_order=${db.escape(req.body.sort_order)}
            WHERE content_id = ${db.escape(req.body.content_id)}`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.post("/editContent", (req, res, next) => {
  db.query(
    `UPDATE content
            SET title=${db.escape(req.body.title)}
            ,section_id=${db.escape(req.body.section_id)}
            ,content_type=${db.escape(req.body.content_type)}
            ,category_id=${db.escape(req.body.category_id)}
            ,sub_category_id=${db.escape(req.body.sub_category_id)}
            ,show_title=${db.escape(req.body.show_title)}
            ,published=${db.escape(req.body.published)}
            ,content_date=${db.escape(req.body.content_date)}
            ,description=${db.escape(req.body.description)}
            ,modification_date=${db.escape(req.body.modification_date)}
            ,tag=${db.escape(req.body.tag)}
            ,author_name=${db.escape(req.body.author_name)}
            ,published_date=${db.escape(req.body.published_date)}
            ,date=${db.escape(req.body.date)}
            ,created_by=${db.escape(req.body.created_by)}
            ,modified_by=${db.escape(req.body.modified_by)}
            ,content_type=${db.escape(req.body.content_type)}
            WHERE content_id = ${db.escape(req.body.content_id)}`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.post("/updateSortOrder", (req, res, next) => {
  db.query(
    `UPDATE content SET sort_order=${db.escape(
      req.body.sort_order
    )} WHERE content_id = ${db.escape(req.body.content_id)}`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get("/getValueFromValueList", (req, res, next) => {
  db.query(
    `SELECT 
  value
  ,valuelist_id
  FROM valuelist WHERE key_text="Content Type"`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});
app.post("/insertContent", (req, res, next) => {
  let data = {
    section_id: req.body.section_id,
    category_id: req.body.category_id,
    sub_category_id: req.body.sub_category_id,
    author_id: req.body.author_id,
    title: req.body.title,
    show_title: 1,
    type: req.body.type,
    description_short: req.body.description_short,
    description: req.body.description,
    sort_order: 0,
    published: 1,
    member_only: req.body.member_only,
    latest: req.body.latest,
    favourite: req.body.favourite,
    creation_date: req.body.creation_date,
    modification_date: req.body.modification_date,
    tag: req.body.tag,
    author_name: req.body.author_name,
    published_date: req.body.published_date,
    date: req.body.date,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
    content_date: req.body.content_date,
    chi_title: req.body.chi_title,
    chi_description: req.body.chi_description,
    content_type: req.body.content_type,
    external_link: req.body.external_link,
    meta_title: req.body.meta_title,
    meta_keyword: req.body.meta_keyword,
    meta_description: req.body.meta_description,
    flag: req.body.flag,
    internal_link: req.body.internal_link,
  };
  let sql = "INSERT INTO content SET ?";
  let query = db.query(sql, data, (err, result) => {
    if (err) {
      console.log("error: ", err);
      return res.status(400).send({
        data: err,
        msg: "failed",
      });
    } else {
      return res.status(200).send({
        data: result,
        msg: "Success",
      });
    }
  });
});




app.post("/insertAudioDataInMedia", (req, res, next) => {
  let data = {
    content_id: req.body.content_id,
    tag: req.body.tag,
    author_name: req.body.author_name,
    published_date: req.body.published_date,
    date: req.body.date,
    comments: req.body.comments,
    creation_date: req.body.creation_date,
    modification_date: req.body.modification_date,
    created_by:req.body.created_by,
    modified_by:req.body.modified_by
  };
  let sql = "INSERT INTO media SET ?";
  let query = db.query(sql, data, (err, result) => {
    if (err) {
      console.log("error: ", err);
      return res.status(400).send({
        data: err,
        msg: "failed",
      });
    } else {
      return res.status(200).send({
        data: result,
        msg: "Success",
      });
    }
  });
});

app.post("/editPhotoData", (req, res, next) => {
  db.query(
    `UPDATE media
            SET 
            tag=${db.escape(req.body.tag)}
            ,author_name=${db.escape(req.body.author_name)}
            ,published_date=${db.escape(req.body.published_date)}
            ,display_title=${db.escape(req.body.display_title)}
            ,date=${db.escape(req.body.date)}
            ,content_id=${db.escape(req.body.content_id)}
            ,modification_date=${db.escape(req.body.modification_date)}
            ,sort_order=${db.escape(req.body.sort_order)}
            ,description=${db.escape(req.body.description)}
            ,modified_by=${db.escape(req.body.modified_by)}
            ,comments=${db.escape(req.body.comments)}
            WHERE media_id = ${db.escape(req.body.media_id)}`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.post("/editAudioData", (req, res, next) => {
  db.query(
    `UPDATE media
            SET 
            tag=${db.escape(req.body.tag)}
            ,author_name=${db.escape(req.body.author_name)}
            ,published_date=${db.escape(req.body.published_date)}
            ,date=${db.escape(req.body.date)}
            ,content_id=${db.escape(req.body.content_id)}
            ,modification_date=${db.escape(req.body.modification_date)}
            ,sort_order=${db.escape(req.body.sort_order)}
            ,description=${db.escape(req.body.description)}
            ,modified_by=${db.escape(req.body.modified_by)}
            ,comments=${db.escape(req.body.comments)}
            WHERE media_id = ${db.escape(req.body.media_id)}`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.post("/getAudioDataById", (req, res, next) => {
  db.query(
 `SELECT
  tag
 ,author_name
 ,published_date
 ,date
 ,content_id
 ,comments
 ,sort_order
 FROM media
WHERE media_id = ${db.escape(req.body.media_id)} 
ORDER BY sort_order ASC`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result[0],
          msg: "Success",
        });
      }
    }
  );
});


app.post("/getImageDataById", (req, res, next) => {
  db.query(
 `SELECT
  tag
 ,author_name
 ,published_date
 ,date
 ,display_title
 ,content_id
 ,comments
 ,sort_order
 FROM media
WHERE media_id = ${db.escape(req.body.media_id)} 
ORDER BY sort_order ASC`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result[0],
          msg: "Success",
        });
      }
    }
  );
});

app.post('/insertContentVideo', (req, res, next) => {

  let data = {content_video_id	: req.body.content_video_id	
    , content_id: req.body.content_id
    ,embed_code:req.body.embed_code
    , video_link: req.body.video_link
    , created_by	: req.body.created_by
    , modified_by	: req.body.modified_by
    , created_date: req.body.created_date
    , modified_date: req.body.modified_date
      
 };
  let sql = "INSERT INTO content_video SET ?";
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
        msg: 'Success',
})
}
  }
);
});


app.post('/getvideoByItemId', (req, res, next) => {
  db.query(`select cv.content_video_id
  ,cv.embed_code
  ,cv.video_link
  ,cv.content_id
  ,cv.created_by
  ,cv.modified_by
  ,cv.created_date
   from content_video cv
   
   WHERE cv.content_id = ${db.escape(req.body.content_id)} `,
    (err, result) => {

      if (err) {
        return res.status(400).send({
              data: err,
              msg:'failed'
            });
      } else {
            return res.status(200).send({
              data: result,
              msg:'Success'
            });

      }

    }
  );
});

app.post('/deleteVideoItem', (req, res, next) => {
let data = { content_video_id: req.body.content_video_id }
let sql = 'DELETE FROM content_video WHERE ?'
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
msg: 'Success',
})
}
})
})

app.post("/deleteContent", (req, res, next) => {
  let data = { content_id: req.body.content_id };
  let sql = "DELETE FROM content  WHERE ?";
  let query = db.query(sql, data, (err, result) => {
    if (err) {
      console.log("error: ", err);
      return res.status(400).send({
        data: err,
        msg: "failed",
      });
    } else {
      return res.status(200).send({
        data: result,
        msg: "Success",
      });
    }
  });
});

app.get("/getSection", (req, res, next) => {
  db.query(
    `SELECT section_id,section_title
  FROM section`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.get('/getCategory', (req, res, next) => {
  db.query(`SELECT
  category_title,category_id
   From category 
   WHERE category_id != ''`,
    (err, result) => {
       
      if (err) {
        console.log('error: ', err);
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

 }
 );
});


app.post("/getCategoryTitle", (req, res, next) => {
  db.query(
    `SELECT 
    s.section_id
    ,s.section_title
    ,c.category_id
    ,c.category_title
     FROM category c
     LEFT JOIN section s ON c.section_id=s.section_id
     where s.section_id = ${db.escape(req.body.section_id)}`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});


app.post("/getSubCategoryTitle", (req, res, next) => {
  db.query(
    `SELECT 
    sc.sub_sc.category_id
    ,sc.sc.sub_category_title
    ,sc.c.category_id
    ,c.category_title
     FROM sub_category sc
 LEFT JOIN category c ON sc.category_id=c.category_idsc
     Left Join category c on c.category_id = sc.category_id
     where c.c.category_id = ${db.escape(req.body.category_id)}`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.post("/getSubContent", (req, res, next) => {
  var formated1 = db.escape(req.body.title).replace('-',' ')
  db.query(
    `SELECT 
     c.category_id
     ,c.content_id
     ,c.title
     ,c.description
    ,su.sub_category_title
    ,su.sub_category_id
     FROM content c
     LEFT JOIN category ca ON c.category_id = ca.category_id
     LEFT JOIN section s ON ca.section_id=s.section_id
     LEFT JOIN sub_category su ON ca.category_id=su.category_id
     where su.sub_category_title= ${db.escape(req.body.title)}`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.post("/getSubCategoryContent", (req, res, next) => {
  db.query(
    `SELECT 
    c.content_id
   ,c.section_id
   ,c.category_id
   ,c.sub_category_id
   ,c.description 
   ,s.section_title 
   ,s.section_type
   ,ca.category_title
   ,ca.category_type
   ,sc.sub_category_title
   ,sc.sub_category_type
   FROM content c
   LEFT JOIN (section s)      ON (c.section_id       = s.section_id)
   LEFT JOIN (category ca)    ON (c.category_id      = ca.category_id)
   LEFT JOIN (sub_category sc)ON (c.sub_category_id  = sc.sub_category_id)
   WHERE c.content_type= "Subcategory Content"
   AND (c.category_id) != '' 
    AND lower(sc.sub_category_title)= ${db.escape(req.body.title)}`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});

app.post("/getSubCategoryContent", (req, res, next) => {
  db.query(
    `SELECT 
c.content_id
,c.title
,c.description
    ,sc.sub_category_id
    ,sc.sub_category_title
    ,ca.category_id
    ,ca.category_title
    ,m.file_name
     FROM content c
     LEFT JOIN section s ON c.section_id=s.section_id
 LEFT JOIN category ca ON s.section_id=ca.section_id
 LEFT JOIN sub_category sc ON ca.category_id=sc.category_id
 LEFT JOIN media m ON m.record_id=c.content_id
     where sc.sub_category_id= ${db.escape(req.body.sub_category_id)}
     GROUP BY c.content_id `,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});
app.get("/getSubCategory", (req, res, next) => {
  db.query(
    `SELECT sub_category_id, sub_category_title
  FROM sub_category`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return res.status(400).send({
          data: err,
          msg: "failed",
        })
      } else {
        return res.status(200).send({
          data: result,
          msg: "Success",
        });
      }
    }
  );
});
module.exports=app;