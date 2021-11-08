import { getCurrent } from '../index';

test('get current sshkey name', () => {
  expect(getCurrent()).toBeTruthy();
})
