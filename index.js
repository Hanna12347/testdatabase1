require('dotenv').config({ debug: true });
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Pool } = require("pg");
const app =express();
const PORT = 3001;

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"resturant",
    password:process.env.DB_PASSWORD,
    port:5432
});
app.use(bodyParser.urlencoded({extended:true}));
app.set(express.static(path.join(__dirname,"public")));
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs");

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

app.get("/",async(req,res)=>{
    try {
    const result = await pool.query('SELECT * FROM public.resturants ORDER BY id ASC ');
    console.log(result)
    res.render('index', { restaurants: result });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  }
})

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/restaurants', async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    console.log("error:",err)
  }

  try {
    await pool.query(
      'INSERT INTO public.restaurants (name) VALUES ($1)',
      [name]
    );
    res.redirect('/');
  } catch (error) {
    console.error('Error adding restaurant:', error);
    
  }
});


app.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM public.restaurants WHERE id = $1', [id]);
  res.redirect('/');
});
app.get("/custumers",async(req,res)=>{
    try {
    const custumer = await pool.query('SELECT * FROM public.customers ORDER BY id ASC ');
    console.log(custumer)
    res.render('index', { custumers: custumer });
  } catch (error) {
    console.error('custumers', error);
  }
})

app.listen(PORT,()=>{
    console.log("server started")
})