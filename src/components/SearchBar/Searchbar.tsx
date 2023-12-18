import React, { ForwardedRef, Ref, RefObject, forwardRef, memo } from "react";
import "./Searchbar.scss";

export const Searchbar = memo(({ searchInput, setSearchInput }: any) => {
    const handle = (e: any) => {
        console.log(e);
        setSearchInput(e.target.value);
    };
    return (
        <div className="search-box">
            <input
                value={searchInput}
                onChange={(e) => handle(e)}
                type="text"
                className="input-search"
                placeholder="Type to Search..."
            />
        </div>
    );
});
