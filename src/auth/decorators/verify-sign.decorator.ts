import { SetMetadata } from '@nestjs/common';

export const IS_VERIFY_SIGN = Symbol('IS_VERIFY_SIGN');

export const VerifySign = () => SetMetadata(IS_VERIFY_SIGN, true);
