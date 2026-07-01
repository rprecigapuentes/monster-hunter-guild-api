import type { Request, Response } from 'express';
import type { QuestService } from '../services/quest.service';
import { QuestNotFoundError } from '../services/quest.service';

export class QuestController {
  constructor(private readonly questService: QuestService) {}

  findById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const quest = await this.questService.findById(req.params.id);
      res.status(200).json(quest);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  findAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const quests = await this.questService.findAll();
      res.status(200).json(quests);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    if (error instanceof QuestNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
