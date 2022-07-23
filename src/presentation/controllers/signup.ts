import {
  Controller, EmailValidator, HttpRequest, HttpResponse,
} from '../protocols';
import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
  ) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const missingParams = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const field of missingParams) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return serverError();
    }
  }
}
