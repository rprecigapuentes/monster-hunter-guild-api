import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';
import { SearchController } from '../../../src/controllers/search.controller';
import { type ISearchService } from '../../../src/services/search.service';
import { type ISearchResult } from '../../../src/services/interfaces/search-result.interface';

describe('SearchController (Integration with Supertest)', () => {
  let app: express.Express;
  let mockSearchService: jest.Mocked<ISearchService>;
  let searchController: SearchController;

  beforeEach(() => {
    // 1. Crear el mock del servicio de búsqueda
    mockSearchService = {
      globalSearch: jest.fn(),
    };

    // 2. Instanciar el controlador con el mock inyectado
    searchController = new SearchController(mockSearchService);

    // 3. Inicializar una app de Express exclusiva para el test
    app = express();
    app.use(express.json());

    // 4. Registrar la ruta apuntando al método del controlador
    app.get('/api/search', searchController.globalSearch);

    // 5. Middleware de error dummy para capturar el 'next(error)' y responder 500
    app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    });
  });

  describe('GET /api/search', () => {
    it('should return 200 and the search results when a valid query is provided', async () => {
      const mockResult: ISearchResult[] = [
        {
          resourceName: 'Hunters',
          result: [{ id: 'h-1', name: 'Aiden', rank: 12 }],
        },
      ];
      mockSearchService.globalSearch.mockResolvedValue(mockResult);

      // Disparar la petición usando supertest
      const response = await request(app).get('/api/search').query({ query: 'Aiden' }); // Equivale a ?query=Aiden

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(mockSearchService.globalSearch).toHaveBeenCalledWith('Aiden');
    });

    it('should return 400 Bad Request when query parameter is missing', async () => {
      const response = await request(app).get('/api/search'); // Sin parámetros de consulta

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Query parameter is required' });
      expect(mockSearchService.globalSearch).not.toHaveBeenCalled();
    });

    it('should return 400 Bad Request when query parameter is not a string (e.g., an array)', async () => {
      const response = await request(app)
        .get('/api/search')
        // Al enviar duplicado, Express lo parsea automáticamente como un Array: ['Aiden', 'Jack']
        .query('query=Aiden&query=Jack');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Query parameter is required' });
      expect(mockSearchService.globalSearch).not.toHaveBeenCalled();
    });

    it('should forward the error to next() and trigger 500 when service throws an exception', async () => {
      mockSearchService.globalSearch.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app).get('/api/search').query({ query: 'Rathalos' });

      // Verificamos que llegó al middleware de error que configuramos en el paso 5
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Internal Server Error',
        message: 'Database connection failed',
      });
    });
  });
});
