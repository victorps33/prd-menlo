'use client';

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { Section, PrdAction } from '@/lib/types';

interface PrdState {
  sections: Section[];
}

const PrdContext = createContext<PrdState>({ sections: [] });
const PrdDispatchContext = createContext<Dispatch<PrdAction>>(() => {});

function prdReducer(state: PrdState, action: PrdAction): PrdState {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, sections: action.payload };

    case 'ADD_FEATURE': {
      const { section_id, feature } = action.payload;
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === section_id
            ? { ...s, features: [...s.features, feature] }
            : s
        ),
      };
    }

    case 'UPDATE_FEATURE': {
      const updated = action.payload;
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === updated.section_id
            ? {
                ...s,
                features: s.features.map((f) =>
                  f.id === updated.id ? updated : f
                ),
              }
            : s
        ),
      };
    }

    case 'DELETE_FEATURE': {
      const { id, section_id } = action.payload;
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === section_id
            ? { ...s, features: s.features.filter((f) => f.id !== id) }
            : s
        ),
      };
    }

    case 'UPDATE_IMAGE': {
      const { feature_id, image_key } = action.payload;
      return {
        ...state,
        sections: state.sections.map((s) => ({
          ...s,
          features: s.features.map((f) =>
            f.id === feature_id ? { ...f, image_key } : f
          ),
        })),
      };
    }

    default:
      return state;
  }
}

export function PrdProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: Section[];
}) {
  const [state, dispatch] = useReducer(prdReducer, { sections: initialData });

  return (
    <PrdContext.Provider value={state}>
      <PrdDispatchContext.Provider value={dispatch}>
        {children}
      </PrdDispatchContext.Provider>
    </PrdContext.Provider>
  );
}

export function usePrd() {
  return useContext(PrdContext);
}

export function usePrdDispatch() {
  return useContext(PrdDispatchContext);
}
