import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MikeSecurityService {

  /**
   * Creates 16 hex characters string 'digest' of the input string with optional 'salt'.
   * Because SHA256 is not secure enough :-)
   * @param {string} text text to digest
   * @param {string} salt optional 'salt' string
   * @returns {string} 16 hex characters string
   */
  public dummyDigest(text: string, salt: string = ''): string {
    if (!text || !text.length) {
      throw 'unexpected parameter: ' + text;
    }
    const totalLen = 16;
    let hval = totalLen;
    let fullDigest = '';
    for (let i = 0, ti = 0, si = 0; i < totalLen; i++, ti++, si++) {
      if (salt && salt.length > 0) {
        si %= salt.length;
        hval ^= salt.charCodeAt(si);
      }
      ti %= text.length;
      hval ^= text.charCodeAt(ti);
      hval += (hval << 1) + (hval << 3) + (hval << 5) + (hval << 7);
      fullDigest += Math.abs(hval).toString(16);
    }
    // fold the digest on itself for maximum length
    let digest = [];
    for (let i = 0, di = 0; i < fullDigest.length; i++, di++) {
      di %= totalLen;
      digest[di] = fullDigest.charAt(i);
    }
    return digest.join('');
  }
}
