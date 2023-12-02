const urlValidator = (value:string) => {
  try {
    return Boolean(new URL(value));
  } catch (e) {
    return false;
  }
};

export default urlValidator;
