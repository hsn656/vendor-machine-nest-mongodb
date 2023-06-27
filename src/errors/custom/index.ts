export interface ErrorBody extends Error {
  code: string;
}

export const errorMessages = {
  auth: {
    wronCredentials: {
      message: 'wrong data provided',
      code: '60001',
    },
    userAlreadyExist: {
      message: 'user already exist',
      code: '60002',
    },
    expiredToken: {
      message: 'token expired',
      code: '60003',
    },
    invlidToken: {
      message: 'invlid token',
      code: '60004',
    },
    notAllowed: {
      message: 'not allowed',
      code: '60005',
    },
  },
  global: {
    internalError: {
      message: 'something went wrong',
      code: '70000',
    },
  },
};
