import { useState } from "react";

const useCounter = () => {
  const [counter, setCounter] = useState(0);
  function incrementCount() {
    setCounter(counter + 1);
  }
  function decrementCount() {
    setCounter(counter - 1);
  }
  return { incrementCount, decrementCount, counter };
};

export default useCounter;
