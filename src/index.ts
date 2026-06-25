interface Guild {
    name: string;
    region: string;
    headquarters: string;
}

function greetGuild(guild: Guild): string {
    return `Welcome to the ${guild.name}, based in ${guild.headquarters} (${guild.region})!`;
}

const exampleGuild: Guild = {
    name: "Monster Hunter Guild",
    region: "Central Continent",
    headquarters: "Astera",
};

console.log("Hello World!");
console.log(greetGuild(exampleGuild));