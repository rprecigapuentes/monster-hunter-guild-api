import express from 'express';
import 'dotenv/config';
import guildRoutes from '../routes/guild.routes';
import monsterRoutes from '../routes/monster.routes';
import hunterRoutes from '../routes/hunter.routes';
import questRoutes from '../routes/quest.routes';
import questAssignmentRoutes from '../routes/quest-assignment.routes';
import auditRoutes from '../routes/audit.routes';
import { errorHandler } from '../middlewares/error-handler.middleware';
import { notFound } from '../middlewares/not-found.middleware';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.use('/guilds', guildRoutes);
app.use('/monsters', monsterRoutes);
app.use('/hunters', hunterRoutes);
app.use('/quests', questRoutes);
app.use('/quest-assignments', questAssignmentRoutes);
app.use('/audits', auditRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
