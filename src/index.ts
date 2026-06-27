import express from 'express';
import 'dotenv/config';

const port = process.env.APP_PORT || 3000;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!'
  })
})

app.listen(port, () => {
  console.log(`Express app running on port ${port}`)
});