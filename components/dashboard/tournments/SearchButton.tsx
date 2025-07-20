'use client'
import { useQueryState } from 'nuqs'
import { Input } from '@/components/ui/input'
import React, { useState, useEffect } from 'react'
import { SearchIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/lib/hooks/useDebounce'

const SearchButton = () => {
  const [search, setSearch] = useQueryState('search')
  const [inputValue, setInputValue] = useState(search || '')
  const debouncedInputValue = useDebounce(inputValue, 500) // 500ms delay

  // Update URL query when debounced value changes
  useEffect(() => {
    if (debouncedInputValue !== search) {
      setSearch(debouncedInputValue || null)
    }
  }, [debouncedInputValue, setSearch, search])

  // Update input value when URL query changes (for external updates)
  useEffect(() => {
    setInputValue(search || '')
  }, [search])

  const handleClear = () => {
    setInputValue('')
    setSearch(null)
  }

  return (
    <div className="flex justify-center w-full max-w-2xl mx-auto px-2">
      <div className="relative w-full group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300"></div>
        <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 group-focus-within:border-primary/50 rounded-2xl transition-all duration-300">
          <Input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Search tournaments..."
            className="pl-12 pr-12 py-4 bg-transparent border-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
          />
          <SearchIcon className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
          {inputValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-primary/10 rounded-xl"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchButton