export class Hunter {
  id: string;
  name: string;
  rank: number | null;
  experiencePoints: number | null;
  guildId: string;

  constructor(data: {
    id: string;
    name: string;
    rank: number | null;
    experiencePoints: number | null;
    guildId: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.rank = data.rank;
    this.experiencePoints = data.experiencePoints;
    this.guildId = data.guildId;
  }

  validate(): void {
    if (!this.name.trim()) {
      throw new Error('Hunter name is required.');
    }

    if (this.rank !== null && this.rank < 1) {
      throw new Error('Hunter rank must be >= 1.');
    }

    if (this.experiencePoints !== null && this.experiencePoints < 0) {
      throw new Error('Experience must be >= 0.');
    }
  }
}
