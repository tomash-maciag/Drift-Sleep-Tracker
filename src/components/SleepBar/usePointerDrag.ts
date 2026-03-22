import { useRef, useCallback } from 'react'

type DragState = 'idle' | 'swiping' | 'dragging'

interface UsePointerDragOptions {
  barRef: React.RefObject<HTMLDivElement | null>
  rangeStartMin: number  // e.g. 22*60 = 1320
  rangeTotalMin: number  // e.g. 12*60 = 720
  snapMinutes: number    // 15
  onSwipe: (startPct: number, endPct: number) => void
  onDrag: (handleId: string, pct: number) => void
  onDragEnd: () => void
}

interface DragInfo {
  state: DragState
  handleId: string | null
  startX: number
  pointerId: number | null
}

const HANDLE_HIT_ZONE_PX = 24

export function usePointerDrag(options: UsePointerDragOptions) {
  const { barRef, rangeTotalMin, snapMinutes, onSwipe, onDrag, onDragEnd } = options

  const dragRef = useRef<DragInfo>({
    state: 'idle',
    handleId: null,
    startX: 0,
    pointerId: null,
  })

  const pxToPct = useCallback((clientX: number): number => {
    const bar = barRef.current
    if (!bar) return 0
    const rect = bar.getBoundingClientRect()
    const raw = (clientX - rect.left) / rect.width
    return Math.max(0, Math.min(1, raw))
  }, [barRef])

  const snapPct = useCallback((pct: number): number => {
    const totalMinutes = rangeTotalMin
    const minutes = pct * totalMinutes
    const snapped = Math.round(minutes / snapMinutes) * snapMinutes
    return Math.max(0, Math.min(1, snapped / totalMinutes))
  }, [rangeTotalMin, snapMinutes])

  const findNearestHandle = useCallback((clientX: number): string | null => {
    const bar = barRef.current
    if (!bar) return null
    const handles = bar.querySelectorAll<HTMLElement>('[data-handle-id]')
    let closest: string | null = null
    let closestDist = HANDLE_HIT_ZONE_PX

    handles.forEach((el) => {
      const handleRect = el.getBoundingClientRect()
      const handleCenter = handleRect.left + handleRect.width / 2
      const dist = Math.abs(clientX - handleCenter)
      if (dist < closestDist) {
        closestDist = dist
        closest = el.getAttribute('data-handle-id')
      }
    })

    return closest
  }, [barRef])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const bar = barRef.current
    if (!bar) return

    const handleId = findNearestHandle(e.clientX)

    if (handleId) {
      dragRef.current = {
        state: 'dragging',
        handleId,
        startX: e.clientX,
        pointerId: e.pointerId,
      }
    } else {
      dragRef.current = {
        state: 'swiping',
        handleId: null,
        startX: e.clientX,
        pointerId: e.pointerId,
      }
    }

    bar.setPointerCapture(e.pointerId)
    e.preventDefault()
  }, [barRef, findNearestHandle])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const info = dragRef.current
    if (info.state === 'idle') return

    if (info.state === 'dragging' && info.handleId) {
      const pct = snapPct(pxToPct(e.clientX))
      onDrag(info.handleId, pct)
    }
    // For swiping, we just track position — final result on pointerUp
  }, [snapPct, pxToPct, onDrag])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const info = dragRef.current
    if (info.state === 'idle') return

    if (info.state === 'swiping') {
      const startPct = snapPct(pxToPct(info.startX))
      const endPct = snapPct(pxToPct(e.clientX))
      if (Math.abs(endPct - startPct) > 0.01) {
        onSwipe(Math.min(startPct, endPct), Math.max(startPct, endPct))
      }
    } else if (info.state === 'dragging') {
      onDragEnd()
    }

    const bar = barRef.current
    if (bar && info.pointerId !== null) {
      bar.releasePointerCapture(info.pointerId)
    }

    dragRef.current = { state: 'idle', handleId: null, startX: 0, pointerId: null }
  }, [barRef, snapPct, pxToPct, onSwipe, onDragEnd])

  return { onPointerDown, onPointerMove, onPointerUp }
}
