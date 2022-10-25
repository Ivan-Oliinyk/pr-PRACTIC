const CODE_DUPLICATE_ERROR = '11000';
export const isDuplicateMongoError = (code: string) =>
  code == CODE_DUPLICATE_ERROR;
