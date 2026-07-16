import { HunterService, HunterNotFoundError } from "../../../src/services/hunter.service";
import type { HunterRepository } from "../../../src/repositories/hunter.repository";
import type { IRankCalculator } from "../../../src/services/rank-calculator.interface";
import { EventManager } from '../../../src/events/event-manager';

describe("HunterService", () => {
  let service: HunterService;
  let mockRepository: jest.Mocked<HunterRepository>;
  let mockRankCalculator: jest.Mocked<IRankCalculator>;
  let mockEvents: jest.Mocked<EventManager>;

  const mockHunter = {
    id: "1",
    name: "Geralt",
    rank: 3,
    experiencePoints: 1000,
    guildId: "guild-1",
  };

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<HunterRepository>;

    mockRankCalculator = {
      calculate: jest.fn(),
    };

    mockEvents = {
      notify: jest.fn(),
    } as unknown as jest.Mocked<EventManager>;

    service = new HunterService(mockRepository, mockRankCalculator, mockEvents);
  });

  describe("create", () => {
    it("should create a new hunter with initial rank and experience", async () => {
      const input = {
        name: "Geralt",
        guildId: "guild-1",
      };

      mockRankCalculator.calculate.mockReturnValue(1);

      mockRepository.create.mockResolvedValue({
        ...mockHunter,
        rank: 1,
        experiencePoints: 0,
      });

      const result = await service.create(input);

      expect(mockRankCalculator.calculate).toHaveBeenCalledWith(0);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...input,
        rank: 1,
        experiencePoints: 0,
      });

      expect(result.rank).toBe(1);
      expect(result.experiencePoints).toBe(0);
    });
  });

  describe("findById", () => {
    it("should return hunter when it exists", async () => {
      mockRepository.findById.mockResolvedValue(mockHunter);

      const result = await service.findById("1");

      expect(mockRepository.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockHunter);
    });

    it("should throw HunterNotFoundError when hunter does not exist", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById("999")).rejects.toThrow(HunterNotFoundError);
    });
  });

  describe("findAll", () => {
    it("should return all hunters", async () => {
      const hunters = [
        mockHunter,
        {
          ...mockHunter,
          id: "2",
          name: "Yennefer",
        },
      ];

      mockRepository.findAll.mockResolvedValue(hunters);

      const result = await service.findAll();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(hunters);
    });
  });

  describe("update", () => {
    it("should update an existing hunter", async () => {
      const updateData = {
        name: "Cristian",
      };

      const updatedHunter = {
        ...mockHunter,
        name: "Cristian",
      };

      mockRepository.findById.mockResolvedValue(mockHunter);
      mockRepository.update.mockResolvedValue(updatedHunter);

      const result = await service.update("1", updateData);

      expect(mockRepository.findById).toHaveBeenCalledWith("1");
      expect(mockRepository.update).toHaveBeenCalledWith("1", updateData);
      expect(result).toEqual(updatedHunter);
    });

    it("should throw HunterNotFoundError when hunter does not exist", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.update("999", { name: "Cristian" })
      ).rejects.toThrow(HunterNotFoundError);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete an existing hunter", async () => {
      mockRepository.findById.mockResolvedValue(mockHunter);
      mockRepository.delete.mockResolvedValue(true);

      await service.delete("1");

      expect(mockRepository.delete).toHaveBeenCalledWith("1");
    });

    it("should throw HunterNotFoundError when hunter does not exist", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete("999")).rejects.toThrow(HunterNotFoundError);

      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("addExperience", () => {
    it("should add experience and recalculate rank", async () => {
      const hunter = {
        ...mockHunter,
        rank: 1,
        experiencePoints: 400,
      };

      const updatedHunter = {
        ...hunter,
        rank: 2,
        experiencePoints: 600,
      };

      mockRepository.findById.mockResolvedValue(hunter);
      mockRankCalculator.calculate.mockReturnValue(2);
      mockRepository.update.mockResolvedValue(updatedHunter);

      const result = await service.addExperience("1", 200);

      expect(mockRankCalculator.calculate).toHaveBeenCalledWith(600);

      expect(mockRepository.update).toHaveBeenCalledWith("1", {
        experiencePoints: 600,
        rank: 2,
      });

      expect(result).toEqual(updatedHunter);
    });

    it("should throw HunterNotFoundError when hunter does not exist", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.addExperience("999", 100)
      ).rejects.toThrow(HunterNotFoundError);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('addExperience reward events', () => {
    it('emits hunter.rewarded when experience is added', async () => {
      mockRepository.findById.mockResolvedValue(mockHunter);        
      mockRankCalculator.calculate.mockReturnValue(3);              
      mockRepository.update.mockResolvedValue({ ...mockHunter, experiencePoints: 1040 });

      await service.addExperience('1', 40);

      expect(mockEvents.notify).toHaveBeenCalledWith('hunter.rewarded', {
        operation: 'REWARDED',
        entity: 'Hunter',
        entityId: '1',
      });
    });

    it('does not emit hunter.ranked_up when the rank is unchanged', async () => {
      mockRepository.findById.mockResolvedValue(mockHunter);      
      mockRankCalculator.calculate.mockReturnValue(3);           
      mockRepository.update.mockResolvedValue(mockHunter);

      await service.addExperience('1', 10);

      expect(mockEvents.notify).not.toHaveBeenCalledWith('hunter.ranked_up', expect.anything());
    });

    it('emits hunter.ranked_up when the rank increases', async () => {
      mockRepository.findById.mockResolvedValue(mockHunter);      
      mockRankCalculator.calculate.mockReturnValue(4);         
      mockRepository.update.mockResolvedValue({ ...mockHunter, rank: 4, experiencePoints: 2000 });

      await service.addExperience('1', 1000);

      expect(mockEvents.notify).toHaveBeenCalledWith('hunter.ranked_up', {
        operation: 'RANKED_UP',
        entity: 'Hunter',
        entityId: '1',
      });
    });
  });

});