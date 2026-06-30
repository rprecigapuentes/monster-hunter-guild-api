//clase abstracta que apunta a basic-repository.interface.ts y que implementa sus metodos, para que las clases que hereden de esta clase abstracta
//puedan usar los metodos de basic-repository.interface.ts

//investigar buenas prácticas para manejo de errores (middleware)
import type { Guild, Prisma } from '../generated/prisma/client';
import type { GuildRepository } from '../repositories/guild.repository';

export class GuildNotFoundError extends Error {
  constructor(id: string) {
    super(`Guild with id ${id} was not found`);
    this.name = 'GuildNotFoundError';
  }
}

export class GuildValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GuildValidationError';
  }
}

export class GuildService {
  constructor(private readonly guildRepository: GuildRepository) {}

  async create(data: Prisma.GuildCreateInput): Promise<Guild> {
    this.validateName(data.name);
    return await this.guildRepository.create(data);
  }

  async update(id: string, data: Prisma.GuildUpdateInput): Promise<Guild> {
    await this.ensureExists(id);
    return await this.guildRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    return await this.guildRepository.delete(id);
  }

  async findById(id: string): Promise<Guild> {
    return await this.ensureExists(id);
  }

  async findAll(): Promise<Guild[]> {
    return await this.guildRepository.findAll();
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new GuildValidationError('Guild name is required');
    }
  }

  private async ensureExists(id: string): Promise<Guild> {
    const guild = await this.guildRepository.findById(id);
    if (!guild) {
      throw new GuildNotFoundError(id);
    }
    return guild;
  }
}
