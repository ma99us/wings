import {MikeSecurityService} from "./mike-security.service";

describe('mike-security service', () => {
  const service = new MikeSecurityService();

  it('dummy dummyDigest test', () => {
    const pass = 'some secure password';
    const digest = service.dummyDigest(pass);
    expect(typeof digest === 'string').toBeTruthy();
    expect(digest.length === 16).toBeTruthy();
  });
});
