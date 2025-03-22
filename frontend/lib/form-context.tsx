"use client"

import { createContext, useContext, useState, type ReactNode, useMemo } from "react"

// Datos estáticos de aspectos
export const formAspectsData = [
  { id: 1, name: "Dominio del tema", active: true },
  { id: 2, name: "Cumplimiento", active: true },
  { id: 3, name: "Calidad", active: true },
  { id: 4, name: "Puntualidad", active: true },
  { id: 5, name: "Metodología y métodos en enseñanza", active: true },
  { id: 6, name: "Recursos usados para la enseñanza", active: true },
  { id: 7, name: "Proceso de evaluación", active: true },
  { id: 8, name: "Aspectos motivacionales", active: true },
  { id: 9, name: "Relaciones interpersonales", active: true },
]

export type FormAspect = {
  id: number
  name: string
  active: boolean
}

type FormContextType = {
  aspects: FormAspect[]
  toggleAspectActive: (id: number) => void
  activeAspects: FormAspect[]
  activeAspectIds: number[]
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: ReactNode }) {
  const [aspects, setAspects] = useState<FormAspect[]>(formAspectsData)

  const toggleAspectActive = (id: number) => {
    setAspects((prevAspects) =>
      prevAspects.map((aspect) => (aspect.id === id ? { ...aspect, active: !aspect.active } : aspect)),
    )
  }

  // Memoize los aspectos activos para evitar recálculos innecesarios
  const activeAspects = useMemo(() => {
    return aspects.filter((aspect) => aspect.active)
  }, [aspects])

  // Memoize los IDs de aspectos activos para comparaciones rápidas
  const activeAspectIds = useMemo(() => {
    return activeAspects.map((aspect) => aspect.id)
  }, [activeAspects])

  // Memoize el valor del contexto para evitar re-renderizados innecesarios
  const contextValue = useMemo(
    () => ({
      aspects,
      toggleAspectActive,
      activeAspects,
      activeAspectIds,
    }),
    [aspects, activeAspects, activeAspectIds],
  )

  return <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
}

export function useFormContext() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider")
  }
  return context
}

