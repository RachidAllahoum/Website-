import express from "express";
import bodyParser from "body-parser";
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const Year = new Date().getFullYear();
app.get("/" , (req,res) => {
    res.render("index.ejs");
  });

  app.post('/', (req, res) => {
    const { name, email, message } = req.body;
    console.log({ name, email, message });
  
    // Prepare the data to write
    const fileContent = `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n\n`;
  
    // Respond to the client immediately
    res.redirect('/');
  
    // Write to the file asynchronously (won't delay response)
    (async () => {
      try {
        await writeFile('message.txt', fileContent, { flag: 'a' }); // 'a' appends instead of overwriting
        console.log('File written successfully!');
      } catch (err) {
        console.error('Failed to write file:', err);
      }
    })();
  });




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  