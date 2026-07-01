import express from 'express';
import 'dotenv/config';
import guildRoutes from '../routes/guild.routes';
import hunterRoutes from '../routes/hunter.routes';

const app = express();
app.use(express.json());
app.use('/guilds', guildRoutes);
app.use('/hunters', hunterRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

export default app;
