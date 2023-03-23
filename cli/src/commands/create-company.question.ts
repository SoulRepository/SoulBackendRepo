import { Question, QuestionSet } from 'nest-commander';

@QuestionSet({ name: 'create-company' })
export class CreateCompanyQuestion {
  @Question({
    type: 'input',
    name: 'name',
    message: 'Enter name',
  })
  parseName(val: string) {
    return val;
  }

  @Question({
    type: 'input',
    name: 'description',
    message: 'Enter description',
  })
  parseDescription(val: string) {
    return val;
  }

  @Question({
    type: 'input',
    name: 'address',
    message: 'Enter address',
  })
  parseAddress(val: string) {
    return val;
  }

  @Question({
    type: 'input',
    name: 'soulId',
    message: 'Enter soulId',
  })
  parseSoulId(val: string) {
    return val;
  }
}
