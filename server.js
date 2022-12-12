const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//==================================================================================
const { Client,Pool } = require('pg')
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'TMS',
  password: 'root1',
  port: 5432,
});
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'TMS',
  password: 'root1',
  port: 5432,
});
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
    console.log('req');
    try{
      let user = req.body;
      const insertQuery =`INSERT INTO "TMG"."User"(
        "Username", "Password", "E_mail", "CreateDate", "UpdateDate", "ActiveFlag")
        VALUES ( 
                '${user.Username}',
                '${user.Password}', 
                '${user.E_mail}', 
               date_trunc('SECOND', TIMESTAMP WITH TIME ZONE 'now()' AT TIME ZONE 'UTC') ,
                date_trunc('SECOND', TIMESTAMP WITH TIME ZONE 'now()' AT TIME ZONE 'UTC'),
                true);`
      const client = await pool.connect();
      client.query(insertQuery,(err,result)=>{
        if(!err){
          res.send('Insertion was successful')
        } else {
          res.send(err)
        }
      });
    }catch(ex){
      client.end
      throw ex;
    }
    res.end();
    client.end();
  }
)

app.post('/login',
  async (req, res) => {
    let user = req.body;
    const insertQuery =`SELECT "User_ID","Username" FROM "TMG"."User" 
    WHERE ("Username" = '${user.Username}' or 
          "E_mail" = '${user.E_mail}' )and 
          "Password" = '${user.Password}'; `
    const client = await pool.connect();
    client.query(insertQuery,(err,result)=>{
      if(!err){
        if(result.rowCount > 0){
          res.send(result.rows);
        }else{
          res.send('Invalid login credentials. Please check again.');
        } 
      } else {
        res.send(err)
      }
    });
    client.end
  }
)

app.post('/auth',function(req,res){
  let Username = req.body.Username;
  let Password = req.body.Password;
  let E_mail = req.body.E_mail;
  if(Username && Password) {
    client.query(`SELECT * FROM "TMG"."User" 
    WHERE "Username" = ? or 
          "E_mail" = ?  and 
          "Password" = ? ; `, [Username,Password,E_mail],function(err,result,fields){
            if(result.rowCount > 0){
            req.session.loggein = true;
            req.session.Username = Username;
            console.log
            res.redirect('/home');
          }else{
            res.send('Incorect Username/E-Mail and/or Password')
          }
          res.end();
          });
  } else {
    res.send('Plese enter Username/E-Mail and Password')
  }
});

app.get('/home',function(req,res){
  if (req.session.loggein){
    res.send('Welcome back, '+res.session.Username + '!');
  } else {
    res.send('Please login to view this page');
  }
})

//==================================================================================
//ROUTES//

// create a todo
app.post("/todos",async(req,res)=>
{
  try{
    const {description} = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1)",
      [description]  
    );
    console.log(test)
  }catch(ex){
    throw ex
  }
})
// create 
app.get('/', (req, res) => {
  res.send('Hello World')
})

const books = require('./db')
const { response } = require('express')

app.get('/books', (req, res) => {
  res.json(books)
})
app.get('/books/:id', (req, res) => {
    res.json(books.find(book => book.id === req.params.id))
})

app.post('/books', (req, res) => {
    books.push(req.body)
    res.status(201).json(req.body)
})

app.put('/books/:id', (req, res) => {
    const updateIndex = books.findIndex(book => book.id === req.params.id)
    res.json(Object.assign(books[updateIndex], req.body))
})

app.delete('/books/:id', (req, res) => {
    const deletedIndex = books.findIndex(book => book.id === req.params.id)
    books.splice(deletedIndex, 1)
    res.status(204).send()
 })

app.listen(5000, () => {
  console.log('Start server at port 5000.')
  console.log('Local: http://localhost:5000/')
})