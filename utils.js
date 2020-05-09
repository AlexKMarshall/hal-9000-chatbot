const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const currentTime = () => moment().format("LT");
