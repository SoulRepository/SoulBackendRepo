import { GraphqlErrorItem } from '../intefaces/graphql.response';

export class GraphError extends Error {
  constructor(errors: GraphqlErrorItem[]) {
    const message = errors.map((p) => p.message).join(', ');
    super(message);
  }
}
