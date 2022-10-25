import * as bcrypt from 'bcrypt';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SHA256 = require('sha256');

const SALT_ROUND = 10;
export class Hasher {
  static async generateHash(text: string): Promise<string> {
    return bcrypt.hash(text, SALT_ROUND);
  }
  static async compare(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }

  static getPasswordStringOldPortal = function(password) {
    if (typeof password === 'string') {
      password = SHA256(password);
    } else {
      // 'password' is an object
      if (password.algorithm !== 'sha-256') {
        throw new Error(
          'Invalid password hash algorithm. ' + "Only 'sha-256' is allowed.",
        );
      }
      password = password.digest;
    }
    return password;
  };

  static comparePasswordOldPortal(text: string, hash: string) {
    const formattedPassword = this.getPasswordStringOldPortal(text);
    return bcrypt.compare(formattedPassword, hash);
  }
}
