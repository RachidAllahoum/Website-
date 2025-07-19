import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';
import 'dotenv/config'; 
const app = express();
const port = 3000;

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static('public'));


const Year = new Date().getFullYear();
app.get("/" , (req,res) => {
    res.render("index.ejs");
  });

app.post('/contact', async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    console.error('No form data received. Headers:', req.headers);
    return res.status(400).json({ error: 'Form data is required' });
  }

  const { name, company, email, phone, country, message } = req.body;


  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      `INSERT INTO contacts 
       (name, company, email, phone, country, message) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id`,
      [name, company, email, phone, country, message]
    );
    
    console.log('Message saved with ID:', result.rows[0].id);
    return res.redirect('/#contact?success=true');
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ 
      error: 'Erreur du serveur. Veuillez réessayer plus tard.' 
    });
  } finally {
    if (client) client.release();
  }
  res.redirect("/");
});

  





app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  