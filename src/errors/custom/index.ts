export interface ErrorBody extends Error {
  code: string;
}

export const errorMessages = {
  global: {
    internalError: {
      message: 'something went wrong',
      code: '70000',
    },
  },
};
