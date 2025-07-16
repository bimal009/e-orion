'use client'
import { useQueryState } from 'nuqs'
import { Input } from '@/components/ui/input'
import React from 'react'
import { SearchIcon } from 'lucide-react'

const SearchButton = () => {
    const [search, setSearch] = useQueryState('search')
  return (
    
    <div className="flex justify-center w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mx-auto mt-4 px-2">
      <div className="relative w-full">
        <Input
          type="text"
          value={search || ''}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          className="pr-10 w-full"
        />
        <SearchIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}

export default SearchButton