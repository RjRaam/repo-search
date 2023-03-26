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
  const [error, setError] = useState(false)
  const [lastpage, setLastpage] = useState(0)

  const fetchData = async (input: string) => {
    try {
      const queryWords = `q=` + encodeURIComponent(input);
      let pageItem = 10
      //If request triggered for last page load only remaining items on the page
      console.log(page)
      console.log(lastpage)
      if(page == lastpage){
        console.log("here")
        pageItem = data.total_count % 10
      }
      const queryPerPage = `&per_page=${pageItem}`;
      const queryPage = `&page=${page}`;
      const query = queryWords + queryPage + queryPerPage;
      let url = `https://api.github.com/search/repositories?${query}`;
      fetch(url)
        .then((response) => response.json())
        .then((data: Data) => {
          setData({
            total_count: data.total_count,
            items: data.items,
          });
          setLastpage(Math.ceil(data.total_count / 10))
        })
        .catch((error) => {
          setError(true)
        });
    } catch (err) {
      setError(true)
    }
  }

  const resetSearch = () => {
    setData({ total_count: 0, items: null })
    setPage(1)
    setLastpage(0)
  }
  const onSearch = (input: string) => {
    if (input) {
      setPage(1)
      fetchData(`/search/${input}`)
    } else {
      resetSearch()
    }
  }

  const reloadPage = (page : number) => {
    setPage(page)
    fetchData(`/search/${input}`)
  }

  const handlePagination = (action: string) => {
    //Move to first page if current page is not first page
    if (action == "first" && page > 1) {
      reloadPage(1)
    }
    //Move to previous page if current page is not first page
    if (action === "prev" && page >= 2) {
      reloadPage(page - 1)
    }
    //Move to next page if current page is not last page
    if (action === "next" && page > 0 && page < lastpage ){
      reloadPage(page + 1)
    }
    //Move to last page
    if (action === "last" && page < lastpage) {
      reloadPage(lastpage)
    }
  }

  useEffect(() => {
    if (input)
      fetchData(input)
    else
      resetSearch()
  }, [input]);

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
            <MdFirstPage onClick={() => handlePagination("first")} />
            <LeftIcon onClick={() => handlePagination("prev")} />
            Previous
          </div>
          {page}
          <div className="icon" style={{ paddingLeft: 50 }}>
            Next <RightIcon onClick={() => handlePagination("next")} />
            <MdLastPage onClick={() => handlePagination("last")} />
          </div>
        </>
      ) : (error ? (
        <div className='error'>
          Oops! Something went Wrong!!!
        </div>
      ) : (<></>))}
    </>
  );
}

export default App;
