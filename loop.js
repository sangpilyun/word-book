const second = 1000;
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const loop = async () => {
  while (true) {
    console.log('loop...');
    await sleep(10 * second);
  }
};

loop();
