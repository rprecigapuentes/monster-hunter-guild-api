export class Guild {
  id: string;
  name: string;
  region: string | null;
  headquarters: string | null;

  constructor(data: {
    id: string;
    name: string;
    region: string | null;
    headquarters: string | null;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.region = data.region;
    this.headquarters = data.headquarters;
  }

  validate(): void {
    if (!this.name?.trim()) {
      throw new Error('Guild name is required.');
    }
  }
}
