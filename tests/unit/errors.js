/* eslint-disable no-undef */
const errors = require('../../src/errors');

describe('Error classes unit test', () => {
  const message = 'error message';

  test('RuntimeError must be instance of Error', () => {
    expect(new errors.RuntimeError()).toBeInstanceOf(Error);
  });

  test('ServiceNotFoundError must be instance of Error', () => {
    expect(new errors.ServiceNotFoundError()).toBeInstanceOf(Error);
  });

  test('ConfigurationError must be instance of Error', () => {
    expect(new errors.ConfigurationError()).toBeInstanceOf(Error);
  });

  test('APIError works as expected', () => {
    const prevErr = new Error('some error');
    const err = new errors.APIError(prevErr);

    expect(err.message).toEqual('some error');
    expect(err.previousError).toEqual(prevErr);
  });

  test('APIError have http status code of 500', () => {
    expect(new errors.APIError().httpStatus).toEqual(500);
    expect(new errors.APIError(message).message).toEqual(message);
  });

  test('AuthorizationError have http status code of 401', () => {
    expect(new errors.AuthorizationError().httpStatus).toEqual(401);
    expect(new errors.AuthorizationError(message).message).toEqual(message);
  });

  test('AuthenticationError have http status code of 403', () => {
    expect(new errors.AuthenticationError().httpStatus).toEqual(403);
    expect(new errors.AuthenticationError(message).message).toEqual(message);
  });

  test('BadRequestError have http status code of 400', () => {
    expect(new errors.BadRequestError().httpStatus).toEqual(400);
    expect(new errors.BadRequestError(message).message).toEqual(message);
  });

  test('InternalServerError have http status code of 500', () => {
    expect(new errors.InternalServerError().httpStatus).toEqual(500);
    expect(new errors.InternalServerError(message).message).toEqual(message);
  });

  test('NotFoundError have http status code of 404', () => {
    expect(new errors.NotFoundError().httpStatus).toEqual(404);
    expect(new errors.NotFoundError(message).message).toEqual(message);
  });
});
