'use client';

import { HiMagnifyingGlass } from "react-icons/hi2";

/*type SearchProps = {
    value: string;
    onChange: (newValue: string) => void;
}
 { value, onChange }: SearchProps */
  /* onChange={(e) => onChange(e.target.value)} */
const SearchBar = () => {

    return <div className="relative m-4">
        <input 
            className="p-2.5 bg-ca-grey rounded-[50%] w-11"
            type="search" 
            name="search" 
            id="search" 
            placeholder=" "
            maxLength={30}
            
        />
        <label 
            className="absolute top-0 left-0 p-3 bg-ca-orange text-white rounded-[50%] text-xl" 
            htmlFor="search">
                <HiMagnifyingGlass />
        </label>
    </div>
}

export default SearchBar;