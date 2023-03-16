import { GraphqlErrorItem } from '../intefaces/graphql.response';
import { BadRequestException } from '@nestjs/common';

export class GraphError extends BadRequestException {
  constructor(errors: GraphqlErrorItem[]) {
    const message = errors.map((p) => p.message).join(', ');
    super(message);
  }
}
