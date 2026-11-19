import { useState } from 'react'
import { Input, Button, Spinner } from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { api } from '../../services/api'
import type { SearchResponse } from '../../types/dashboard'

interface SearchBarProps {
  onSearch?: (query: string, results: SearchResponse) => void
  placeholder?: string
  /** When true, reduces top margin for use in hero section */
  inHero?: boolean
}

export const SearchBar = ({ 
  onSearch, 
  placeholder,
  inHero = false 
}: SearchBarProps) => {
  const { t } = useTranslation()
  const defaultPlaceholder = placeholder || t('dashboard.searchPlaceholder')
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const results = await api.searchAddress(query.trim())
      onSearch?.(query.trim(), results)
    } catch (error) {
      console.error('Search failed:', error)
      onSearch?.(query.trim(), { results: [] })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`w-full ${inHero ? 'mt-0' : 'mt-8'}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 px-1.5 pt-1 pb-1 bg-gray-50 dark:bg-zinc-900 border border-[#E9ECF0] dark:border-zinc-700 rounded-lg shadow-[0_4px_14.2px_0_#3C465424]">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={defaultPlaceholder}
            variant="flat"
            radius="lg"
            size="md"
            classNames={{
              input: "!text-triany-400 dark:!text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-normal text-sm md:text-base",
              inputWrapper: "border-0 shadow-none bg-transparent h-10 min-h-10 md:h-9 min-h-9 py-0 hover:!bg-transparent dark:hover:!bg-transparent data-[hover=true]:!bg-transparent focus-within:!bg-transparent dark:focus-within:!bg-transparent",
              base: "flex-1 min-w-0 mb-0"
            }}
          />
          <Button
            isIconOnly
            type="submit"
            isDisabled={isLoading || !query.trim()}
            radius="sm"
            className="w-10 h-10 min-h-10 md:w-9 md:h-9 md:min-h-9 shrink-0 !p-0 bg-transparent hover:bg-transparent data-[hover=true]:bg-transparent"
          >
            {isLoading ? (
              <Spinner size="sm" color="white" />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M17.5005 17.5L13.8838 13.8833"
                  stroke="#7B8593"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
                  stroke="#7B8593"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
