export class Monster {
  id: string;
  name: string;
  species: string | null;
  dangerLevel: number | null;
  rewardValue: number | null;

  constructor(data: {
    id: string;
    name: string;
    species: string | null;
    dangerLevel: number | null;
    rewardValue: number | null;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.species = data.species;
    this.dangerLevel = data.dangerLevel;
    this.rewardValue = data.rewardValue;
  }

  validate(): void {
    if (!this.name.trim()) {
      throw new Error('Monster name is required.');
    }

    if (this.dangerLevel !== null && (this.dangerLevel < 1 || this.dangerLevel > 10)) {
      throw new Error('Danger level must be between 1 and 10.');
    }

    if (this.rewardValue !== null && this.rewardValue < 0) {
      throw new Error('Reward value must be >= 0.');
    }
  }
}
