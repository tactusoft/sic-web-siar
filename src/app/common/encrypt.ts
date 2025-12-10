import { Constants } from '../common/constants';
import * as CryptoJS from 'crypto-js';


export class Encrypt {

  constructor() { }

  public encryptObject(toEncrypt: any): string{
    return CryptoJS.AES.encrypt(JSON.stringify(toEncrypt), Constants.PRIVATE_KEY).toString();
  }

  public decryptObject(toDecrypt: any): string{
    /*toDecrypt = CryptoJS.AES.decrypt(toDecrypt, Constants.PRIVATE_KEY);
    toDecrypt = toDecrypt.toString(CryptoJS.enc.Utf8);
    return toDecrypt;*/

    try {
      const bytes = CryptoJS.AES.decrypt(toDecrypt, Constants.PRIVATE_KEY);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return toDecrypt;
    } catch (e) {
      console.log(e);
    }
  }
}
