import { SetMetadata } from '@nestjs/common';

export const IS_ONLY_FOR_ADMIN = Symbol('IS_ONLY_FOR_ADMIN');

export const OnlyForAdmin = () => SetMetadata(IS_ONLY_FOR_ADMIN, true);
