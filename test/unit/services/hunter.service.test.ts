import { HunterService, HunterNotFoundError } from "../../../src/services/hunter.service";
import type { HunterRepository } from "../../../src/repositories/hunter.repository";
import type { IRankCalculator } from "../../../src/services/rank-calculator.interface";

describe("HunterService", () => {
  let service: HunterService;
  let mockRepository: jest.Mocked<HunterRepository>;
  let mockRankCalculator: jest.Mocked<IRankCalculator>;

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

    service = new HunterService(mockRepository, mockRankCalculator);
  });

  describe("create", () => {
    it("should create a new hunter with initial rank and experience", async () => {
      const input = {
        name: "Geralt",
        rank: 5,
        experiencePoints: 9999,
        guild: {
          connect: {
            id: "guild-1",
          },
        },
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

    it("should ignore rank and experience sent by the client", async () => {
      mockRankCalculator.calculate.mockReturnValue(1);

      mockRepository.create.mockResolvedValue({
        ...mockHunter,
        rank: 1,
        experiencePoints: 0,
      });

      await service.create({
        name: "Geralt",
        rank: 999,
        experiencePoints: 999999,
        guild: {
          connect: {
            id: "guild-1",
          },
        },
      });

      expect(mockRepository.create).toHaveBeenCalledWith({
        name: "Geralt",
        rank: 1,
        experiencePoints: 0,
        guild: {
          connect: {
            id: "guild-1",
          },
        },
      });
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

    it("should ignore rank and experience when updating", async () => {
      mockRepository.findById.mockResolvedValue(mockHunter);
      mockRepository.update.mockResolvedValue(mockHunter);

      await service.update("1", {
        name: "Cristian",
        rank: 999,
        experiencePoints: 99999,
      });

      expect(mockRepository.update).toHaveBeenCalledWith("1", {
        name: "Cristian",
      });
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
});