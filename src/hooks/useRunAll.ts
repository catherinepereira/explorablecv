import { useEffect } from 'react'
import { ARCHITECTURES } from '../architectures/data'
import { useAppStore } from '../stores/appStore'
import { runInference } from '../utils/inference'

export function useRunAll() {
  const tensor = useAppStore((s) => s.imageTensor)
  const setArchState = useAppStore((s) => s.setArchState)

  useEffect(() => {
    if (!tensor) return
    let cancelled = false

    for (const arch of ARCHITECTURES) {
      setArchState(arch.id, { status: 'loading' })
      runInference(arch.onnxFile, tensor)
        .then((result) => {
          if (!cancelled) setArchState(arch.id, { status: 'ready', result })
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            const msg = err instanceof Error ? err.message : 'inference failed'
            setArchState(arch.id, { status: 'error', error: msg })
          }
        })
    }

    return () => {
      cancelled = true
    }
  }, [tensor, setArchState])
}
