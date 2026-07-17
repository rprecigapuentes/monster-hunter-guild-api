import type { AuditLog, Prisma } from '../generated/prisma/client';
import {
  type PrismaModelDelegate,
  PrismaBaseRepository,
} from './interfaces/prisma-base-repository.abstract';

export class AuditRepository extends PrismaBaseRepository<
  AuditLog,
  Prisma.AuditLogUncheckedCreateInput,
  Prisma.AuditLogUncheckedUpdateInput,
  Prisma.AuditLogWhereInput
> {
  constructor(
    prismaModel: PrismaModelDelegate<
      AuditLog,
      Prisma.AuditLogUncheckedCreateInput,
      Prisma.AuditLogUncheckedUpdateInput,
      Prisma.AuditLogWhereInput
    >
  ) {
    super(prismaModel);
  }
}
