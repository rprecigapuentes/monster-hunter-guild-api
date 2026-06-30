import app from './app/app';

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
  console.log(`Express app running on port ${port}`);
});
