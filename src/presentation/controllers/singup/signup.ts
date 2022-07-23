import {
  Controller, EmailValidator, AddAccount, HttpRequest, HttpResponse,
} from './singup-protocols';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
  ) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const missingParams = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const field of missingParams) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const {
        name, email, password, passwordConfirmation,
      } = httpRequest.body;

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const account = this.addAccount.create({ name, email, password });
      return {
        statusCode: 200,
        body: account,
      };
    } catch (error) {
      return serverError();
    }
  }
}
