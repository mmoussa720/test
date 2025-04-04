import * as bcrypt from 'bcrypt';
export class HashingHelper {
  static async hashPassword(data: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(data, salt);
  }
  static async comparePassword(data: string, hashedData: string) {
    const isMatch = await bcrypt.compare(data, hashedData);
    return isMatch;
  }
}
