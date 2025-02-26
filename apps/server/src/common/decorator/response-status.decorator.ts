import { SetMetadata } from '@nestjs/common';

export const RESPONSE_STATUS = 'response_status';
export const ResponseStatus = (status: number) => SetMetadata(RESPONSE_STATUS, status);
