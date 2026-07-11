import type { Hunter } from '../generated/prisma/client';
import { BaseController } from './base-controller.abstract';
import type { HunterService } from '../services/hunter.service';
import type { CreateHunterDto, UpdateHunterDto } from '../dto/hunter.dto';

export class HunterController extends BaseController<Hunter, CreateHunterDto, UpdateHunterDto> {
  constructor(service: HunterService) {
    super(service);
  }
}
