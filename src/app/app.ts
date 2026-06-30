import express from 'express';
import 'dotenv/config';
import guildRoutes from '../routes/guild.routes';

const app = express();
app.use(express.json());
app.use('/guilds', guildRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

export default app;
