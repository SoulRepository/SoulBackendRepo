export class GraphqlErrorItem {
  message: string;
}

export class GraphqlResponse<T> {
  data?: T;
  errors?: GraphqlErrorItem[];
}
