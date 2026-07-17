import { type ISearchResult } from '../../../src/services/interfaces/search-result.interface';
import { type ISearchableService } from '../../../src/services/interfaces/searchable-service.interface';
import { SearchService } from '../../../src/services/search.service';

describe('SearchService', () => {
  let service: SearchService;
  let mockGuildService: jest.Mocked<ISearchableService>;
  let mockHunterService: jest.Mocked<ISearchableService>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockGuildService = {
      search: jest.fn(),
    };
    mockHunterService = {
      search: jest.fn(),
    };

    service = new SearchService([mockGuildService, mockHunterService]);

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('globalSearch', () => {
    it('should trim the query before passing it to searchable services', async () => {
      mockGuildService.search.mockResolvedValue({ resourceName: 'Guilds', result: [] });
      mockHunterService.search.mockResolvedValue({ resourceName: 'Hunters', result: [] });

      const queryWithSpaces = '   Silver   ';
      await service.globalSearch(queryWithSpaces);

      expect(mockGuildService.search).toHaveBeenCalledWith('Silver');
      expect(mockHunterService.search).toHaveBeenCalledWith('Silver');
    });

    it('should filter out results that have an empty result array', async () => {
      const mockGuildResult: ISearchResult = {
        resourceName: 'Guilds',
        result: [{ id: 'g1', name: 'Silver Wing Alliance' }],
      };

      const mockHunterResult: ISearchResult = {
        resourceName: 'Hunters',
        result: [],
      };

      mockGuildService.search.mockResolvedValue(mockGuildResult);
      mockHunterService.search.mockResolvedValue(mockHunterResult);

      const results = await service.globalSearch('Silver');

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(mockGuildResult);
    });

    it('should handle service failures gracefully using .catch and return other successful results', async () => {
      const mockHunterResult: ISearchResult = {
        resourceName: 'Hunters',
        result: [{ id: 'h1', name: 'Aiden' }],
      };

      mockGuildService.search.mockRejectedValue(new Error('Database timeout'));
      mockHunterService.search.mockResolvedValue(mockHunterResult);

      const results = await service.globalSearch('Aiden');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error buscando en un servicio',
        expect.any(Error)
      );

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(mockHunterResult);
    });
  });
});
