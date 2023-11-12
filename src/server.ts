import express from 'express';
import bodyParser from 'body-parser';

const app = express();

// This will make our form data much more useful
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello world');
    })
    
// Future Code Goes Here

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running... on port ${port}`));
