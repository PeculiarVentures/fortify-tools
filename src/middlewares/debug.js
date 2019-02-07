export default store => next => (payload) => {
  console.log('==============================');
  console.log(payload);
  console.log('==============================');
  next(payload);
};
