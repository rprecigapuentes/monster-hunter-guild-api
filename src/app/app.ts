import express from 'express';
import 'dotenv/config';
import guildRoutes from '../routes/guild.routes';
import monsterRoutes from '../routes/monster.routes';
import hunterRoutes from '../routes/hunter.routes';
import questRoutes from '../routes/quest.routes';

const app = express();
app.use(express.json());
app.use('/guilds', guildRoutes);
app.use('/monsters', monsterRoutes);
app.use('/hunters', hunterRoutes);
app.use('/quests', questRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

export default app;
