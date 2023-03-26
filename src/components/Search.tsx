import React from "react"
import { useState, useEffect } from "react"

export interface Props {
  value: string;
  placeholder?: string;
  onSearch(val: string): void;
}
export interface query {
  input: string;
}


export default function Search({ value = "", placeholder, onSearch }: Props) {

  const [input, setInput] = useState(value)

  function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  useEffect(() => {
    let isCancelled = false;

    const handleChange = async () => {
      //const data = await getdata()
      await timeout(1000);

      if (!isCancelled) {
        // alert(`A name was changed: ${input}`);
        onSearch(input)
      }
    };

    handleChange();
    //Cleanup function is called when useEffect is called again or on unmount
    return () => {
      isCancelled = true;
    };
  }, [input]);

  return <>
    <input type="text"
      value={input || ""}
      placeholder={placeholder}
      // onKeyDown={handleKey}
      onChange={handleInput}
      size={50}
      className="search-box"
    />
  </>
}