import { useEffect, useRef } from 'react'

interface PiVisualizationProps {
  width?: number
  height?: number
  isVisible?: boolean
}

export function PiVisualization({ width = 400, height = 400, isVisible = true }: PiVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isVisible) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Animation parameters
    const centerX = width / 2
    const centerY = height / 2
    const scale = Math.min(width, height) / 5
    
    let t = 0
    const dt = 0.006 // Slower than original for smoother animation
    const w = 1
    const a = Math.PI // This is the key ratio that creates the pi pattern
    
    // Arrays to store all accumulated points for the pattern
    const trailPoints: { x: number, y: number }[] = []
    let isFirstFrame = true

    const animate = () => {
      // Only clear canvas on the very first frame
      if (isFirstFrame) {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)'
        ctx.fillRect(0, 0, width, height)
        isFirstFrame = false
      }

      // Calculate positions
      const r1x = Math.cos(w * t)
      const r1y = Math.sin(w * t)
      
      const r2x = r1x + Math.cos(a * w * t)
      const r2y = r1y + Math.sin(a * w * t)

      // Convert to canvas coordinates
      const canvasR1X = centerX + r1x * scale
      const canvasR1Y = centerY + r1y * scale
      const canvasR2X = centerX + r2x * scale
      const canvasR2Y = centerY + r2y * scale

      // Add to trail (accumulate forever)
      trailPoints.push({ x: canvasR2X, y: canvasR2Y })

      // Don't store arm lines anymore - focusing on the clean pattern
      // No arm line storage

      // Draw the trail with gradient (all accumulated points)
      if (trailPoints.length > 1) {
        ctx.lineWidth = 1
        for (let i = 1; i < trailPoints.length; i++) {
          const alpha = Math.max(0.1, i / trailPoints.length) // Ensure minimum visibility
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})` // White trail with fade
          ctx.beginPath()
          ctx.moveTo(trailPoints[i - 1].x, trailPoints[i - 1].y)
          ctx.lineTo(trailPoints[i].x, trailPoints[i].y)
          ctx.stroke()
        }
      }

      // No arm lines displayed - focusing on the clean pattern

      // Draw the first circle (orbit) - very subtle
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(centerX, centerY, scale, 0, 2 * Math.PI)
      ctx.stroke()

      // Draw the current connecting line (the "arm") - very subtle or remove entirely
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)' // Much more subtle
      ctx.lineWidth = 0.5 // Thinner
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(canvasR1X, canvasR1Y)
      ctx.lineTo(canvasR2X, canvasR2Y)
      ctx.stroke()

      // Draw points
      // Center point - smaller and more subtle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.beginPath()
      ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI)
      ctx.fill()

      // Final point (tracing the pattern) - main focus
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)' // White point
      ctx.beginPath()
      ctx.arc(canvasR2X, canvasR2Y, 3, 0, 2 * Math.PI)
      ctx.fill()

      // Increment time
      t += dt

      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [width, height, isVisible])

  if (!isVisible) return null

  return (
    <canvas
      ref={canvasRef}
      className="pi-canvas-seamless"
      style={{
        background: 'transparent'
      }}
    />
  )
}
