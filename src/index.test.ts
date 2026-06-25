import { greetGuild } from './index';

describe('greetGuild', () => {
    it('should return a welcome message with guild info', () => {

        const guild = {
            name: "Monster Hunter Guild",
            region: "Central Continent",
            headquarters: "Astera",
        };

    const result = greetGuild(guild);

    expect(result).toBe("Welcome to the Monster Hunter Guild, based in Astera (Central Continent)!");
    });
});