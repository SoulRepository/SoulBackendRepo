import { Question, QuestionSet } from 'nest-commander';

@QuestionSet({ name: 'password' })
export class AuthPasswordQuestion {
  @Question({
    type: 'password',
    name: 'password',
    message: 'Enter password',
  })
  parsePassword(val: string) {
    return val;
  }
}
