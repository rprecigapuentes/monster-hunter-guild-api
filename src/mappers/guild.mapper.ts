import type { Guild as PrismaGuild } from "../generated/prisma/client";
import { Guild } from "../entities/Guild";

export function toGuildEntity(data: PrismaGuild): Guild {
  return new Guild({
    id: data.id,
    name: data.name,
    region: data.region,
    headquarters: data.headquarters,
  });
}