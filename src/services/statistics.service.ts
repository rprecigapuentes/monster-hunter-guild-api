import type { QuestService } from './quest.service';

export class StatisticsService {
  constructor(private readonly questService: QuestService) {}
}
