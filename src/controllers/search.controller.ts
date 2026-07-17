import type { NextFunction, Request, Response } from 'express';
import { type ISearchService } from '../services/search.service';

export class SearchController {
  constructor(private readonly searchService: ISearchService) {}

  globalSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query parameter is required' });
      }
      const result = await this.searchService.globalSearch(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
