const {environment}= require('./environment.js');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//==================================================================================
const url = environment.apiUrl;
const myBase = environment.myDataBase;
const { Client,Pool } = require('pg')
const corsOptions = {
  origin: url,
  credentials: true,
};
app.use(cors(corsOptions));
const client = new Client(myBase);
const pool = new Pool(myBase);
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/users',
  async (req, res) => {
    const query = `
      SELECT *
      FROM "TMG"."User"
      `;
    const client = await pool.connect();
    client.query(query,(err,result)=>{
      if(!err){
        res.send(result.rows)
      } else {
        res.send(err)
      }
    });
    client.end
  }
)

app.get('/users/:User_ID',
  async (req, res) => {
    const whereQuery = `
      SELECT *
      FROM "TMG"."User"
      WHERE "User_ID" = ${req.params.User_ID}
      `;
    const client = await pool.connect();
    client.query(whereQuery,(err,result)=>{
      if(!err){
        res.send(result.rows)
      } else {
        res.send(err)
      }
    });
    client.end
  }
)

app.post('/register',
  async (req, res) => {
    try{
      let user = req.body;
      const insertQuery =`
        INSERT INTO "TMG"."User"(
        "Username", "Password", "E_mail", "CreateDate", "UpdateDate", "ActiveFlag")
        SELECT  
                '${user.Username}',
                '${user.Password}', 
                '${user.E_mail}', 
               	date_trunc('SECOND', TIMESTAMP WITH TIME ZONE 'now()' AT TIME ZONE 'UTC') ,
                date_trunc('SECOND', TIMESTAMP WITH TIME ZONE 'now()' AT TIME ZONE 'UTC'),
                true
        WHERE NOT EXISTS (
        SELECT 1 FROM "TMG"."User" WHERE "Username" = '${user.Username}' and "E_mail" = '${user.E_mail}' );`
      const client = await pool.connect();
      client.query(insertQuery,(err,result)=>{
        if(!err){
          if(result.rowCount > 0){
            res.send({message: 'Insertion was successful',
                        status: 1 ,
                        pass: true   });
          } else {
            res.send({message: 'This username or email address is already in use by someone else. try a different name',
                      status: 0,
                      pass: true});
          }
          client.end();
        } else {
          res.send(err);
          client.end();
        }
      })
    }catch(ex){
      client.end
      throw ex;
    }
  }
)

app.post('/login',
  async (req, res) => {
    let user = req.body;
    const insertQuery =`SELECT "User_ID","Username" FROM "TMG"."User" 
    WHERE ("E_mail" = '${user.E_mail}' )and 
          "Password" = '${user.Password}'; `
    const client = await pool.connect();
    client.query(insertQuery,(err,result)=>{
      if(!err){
        if(result.rowCount > 0){
          res.send(result.rows);
          client.end();
        }else{
          res.send({ some: 'Invalid login credentials. Please check again.'});
          client.end();
        } 
      } else {
        res.send(err)
        client.end();
      }
    });
  }
)

//==================================================================================
//ROUTES//

app.listen(5000, () => {
  console.log('Start server at port 5000.')
  console.log('Local: http://localhost:5000/')
})