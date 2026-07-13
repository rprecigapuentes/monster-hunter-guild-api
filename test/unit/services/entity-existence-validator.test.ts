import { RelatedEntityValidationError } from "../../../src/errors/related-entity-validation.error";
import { EntityExistenceValidator } from "../../../src/services/entity-existence-validator";
import { IExistenceChecker } from "../../../src/services/interfaces/existence-checker.interface";

describe ('EntityExistenceValidator', () => {
    let existenceValidator: EntityExistenceValidator;
    let mockChecker: jest.Mocked<IExistenceChecker>;

    beforeEach(() => {
        mockChecker = {
            exists: jest.fn()
        } as jest.Mocked<IExistenceChecker>

        existenceValidator = new EntityExistenceValidator(mockChecker, "King");
    })

    describe('ensure', () => {
        it('Should not throw when the entity exists', async () => {
            mockChecker.exists.mockResolvedValue(true)

            await expect(existenceValidator.ensure('k1')).resolves.toBeUndefined();
            expect(mockChecker.exists).toHaveBeenCalledWith('k1');
        })

        it('Should throw RelatedEntityValidationError when the entity does not exist', async () => {
            mockChecker.exists.mockResolvedValue(false)

            await expect(existenceValidator.ensure('k1')).rejects.toThrow(RelatedEntityValidationError);
            await expect(existenceValidator.ensure('k1')).rejects.toThrow('King with id k1 does not exist');
            expect(mockChecker.exists).toHaveBeenCalledWith('k1');
        })
    })
});