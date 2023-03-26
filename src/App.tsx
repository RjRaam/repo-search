import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  MdFirstPage,
  MdLastPage,
  MdSearch as SearchIcon,
  MdArrowLeft as LeftIcon,
  MdArrowRight as RightIcon,
} from "react-icons/md";

import Search from './components/Search'
import SearchResult from "./components/SearchResult"

export interface Item {
  id: string;
  full_name: string;
  description: string;
  language: string;
  updated_at: Date;
}

export interface Data {
  items: Item[] | null;
  total_count: number;
}

function App() {
  const [page, setPage] = useState(1);
  const [input] = useState("")
  const [data, setData] = useState({} as Data)
  // const [error, setError] = useState(false)

const fetchData = async (input: string) => {
  try{
    const queryWords = `q=` + encodeURIComponent(input);
    const queryPerPage = '&per_page=10';
    const queryPage = `&page=${page}`;
    const query = queryWords + queryPage + queryPerPage;
    let url = `https://api.github.com/search/repositories?${query}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: Data) => {
        //add any option as default for dropdown
        setData({
          total_count: data.total_count,
          items: data.items,
        });
      })
      .catch((error) => {
        console.log(error)
      });
  }catch(Err){

  }
}

  const onSearch = (input: string) => {
    if(input){
      setPage(1)
      fetchData(`/search/${input}`)
    } else{
        setData({total_count: 0 , items: null})
    }
    
  }

  const handlePagination = (action: string) => {
    let offset = page * 10;
    //Move to first page if current page is not first page
    if (action == "first" && page!=1){
      setPage(1);
      fetchData(`/search/${input}`)
    }
    //Move to previous page if current page is not first page
    if (action === "prev" && page >= 2) {
      setPage(page - 1);
      fetchData(`/search/${input}`)
    }
    //Move to next page if current page is not last page
    if (action === "next" && page > 0 && offset < data.total_count) {
      setPage(page + 1);
      fetchData(`/search/${input}`)
    }
  }

  useEffect(() => {
    if (input)
      fetchData(input)
    else
      setData({total_count: 0 , items: null})

  }, [input, page]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/search"
          />
        </Routes>
      </BrowserRouter>
      <div className='title'><SearchIcon /> Search Repo</div><br />
      <Search placeholder="What do you want to Search?" value={input} onSearch={onSearch} />
      {data.total_count > 0 ? (
        <>
          <SearchResult data={data} />
          <div className="icon" style={{ paddingRight: 50 }}>
            <MdFirstPage onClick={() => handlePagination("first")}/>
            <LeftIcon onClick={() => handlePagination("prev")}/>
            Previous
          </div>
          {page}
          <div className="icon" style={{ paddingLeft: 50 }}>
            Next <RightIcon onClick={() => handlePagination("next")}/>
            <MdLastPage onClick={() => handlePagination("last")}/>
          </div>
        </>
      ) : ""}
    </>
  );
}

export default App;
