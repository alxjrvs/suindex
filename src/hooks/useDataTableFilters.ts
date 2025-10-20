import { useReducer } from 'react'

export interface DataTableFilterState {
  searchTerm: string
  filters: Record<string, string>
  techLevelFilters: Set<string>
  sortField: string
  sortDirection: 'asc' | 'desc'
}

export type DataTableFilterAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_FILTER'; payload: { field: string; value: string } }
  | { type: 'CLEAR_FILTER'; payload: string }
  | { type: 'SET_TECH_LEVEL_FILTERS'; payload: Set<string> }
  | { type: 'TOGGLE_TECH_LEVEL'; payload: string }
  | { type: 'SET_SORT'; payload: { field: string; direction: 'asc' | 'desc' } }
  | { type: 'RESET' }

const initialState: DataTableFilterState = {
  searchTerm: '',
  filters: {},
  techLevelFilters: new Set(),
  sortField: 'name',
  sortDirection: 'asc',
}

/**
 * Reducer function for managing data table filter state
 * Consolidates multiple useState calls into a single useReducer
 */
function filterReducer(
  state: DataTableFilterState,
  action: DataTableFilterAction
): DataTableFilterState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload }

    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.payload.field]: action.payload.value },
      }

    case 'CLEAR_FILTER':
      return {
        ...state,
        filters: Object.fromEntries(
          Object.entries(state.filters).filter(([key]) => key !== action.payload)
        ),
      }

    case 'SET_TECH_LEVEL_FILTERS':
      return { ...state, techLevelFilters: action.payload }

    case 'TOGGLE_TECH_LEVEL': {
      const newFilters = new Set(state.techLevelFilters)
      if (newFilters.has(action.payload)) {
        newFilters.delete(action.payload)
      } else {
        newFilters.add(action.payload)
      }
      return { ...state, techLevelFilters: newFilters }
    }

    case 'SET_SORT':
      return {
        ...state,
        sortField: action.payload.field,
        sortDirection: action.payload.direction,
      }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

/**
 * Custom hook for managing data table filter state
 * Replaces multiple useState calls with a single useReducer
 * @returns State and dispatch function for filter actions
 * @example
 * const [state, dispatch] = useDataTableFilters();
 * dispatch({ type: "SET_SEARCH", payload: "search term" });
 */
export function useDataTableFilters() {
  return useReducer(filterReducer, initialState)
}
