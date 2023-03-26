import React from "react"
import { Data } from "../App"

export interface Props {
    data: Data;
}

function SearchResult({ data }: Props) {
    return (
        <div className="search-result">
            {data?.items ? data.items.map(item => {
                return <div key={item.id} className="result-row">
                    <a href="pathname: `/repository/${id}`">{item.full_name}</a>
                    <div> {item.description} </div>
                    <label>Language: {item.language} </label><br />
                    <label> Last updated at {new Date(item.updated_at).toDateString()}</label>
                </div>
            }) : <div></div>}
        </div>
    )
}

export default SearchResult;