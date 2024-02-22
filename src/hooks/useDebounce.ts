const useDebounce = (func: any, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function (...args: []) {
    clearInterval(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default useDebounce;
