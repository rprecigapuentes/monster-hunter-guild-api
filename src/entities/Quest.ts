export class Quest {
  id: string;
  title: string;
  location: string | null;
  reward: number | null;
  status: string | null;
  monsterId: string;

  constructor(data: {
    id: string;
    title: string;
    location: string | null;
    reward: number | null;
    status: string | null;
    monsterId: string;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.location = data.location;
    this.reward = data.reward;
    this.status = data.status;
    this.monsterId = data.monsterId;
  }

  validate(): void {
    if (!this.title.trim()) {
      throw new Error("Quest title is required.");
    }

    if (this.reward !== null && this.reward < 0) {
      throw new Error("Reward must be >= 0.");
    }
  }
}