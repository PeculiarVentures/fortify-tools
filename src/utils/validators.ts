export const validateEmail = (email: string) => {
  // eslint-disable-next-line no-useless-escape
  const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  return reg.test(email);
};
