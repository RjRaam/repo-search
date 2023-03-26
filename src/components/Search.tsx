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
    //event trigger based on this value
    let isTyping = false;

    //To pause event trigger till user stops typing
    const handleChange = async () => {
      //Default delay before onSearch trigger
      await timeout(1000);

      //Extend wait time for every keystroke
      if (!isTyping) {
        onSearch(input)
      }
    };

    handleChange();
    //Function to cleanup when useEffect is called again/on unmount
    return () => {
      isTyping = true;
    };
  }, [input]);

  return <>
    <input type="text"
      value={input || ""}
      placeholder={placeholder}
      onChange={handleInput}
      size={50}
      className="search-box"
    />
  </>
}