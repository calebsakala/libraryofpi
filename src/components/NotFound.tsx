import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import '../App.css'

export default function NotFound() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const spiralRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate title on load
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: -50, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power3.out" }
      )
    }

    // Animate container
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power2.out" }
      )
    }

    // Infinite Pi spiral animation
    if (spiralRef.current) {
      gsap.to(spiralRef.current, {
        rotation: 360,
        duration: 20,
        ease: "none",
        repeat: -1
      })
    }
  }, [])

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleViewSource = () => {
    window.open('https://github.com/calebsakala/libraryofpi', '_blank')
  }

  return (
    <div className="app">
      <div className="cosmic-background">
        <div className="stars"></div>
        <div className="pi-spiral" ref={spiralRef}>π</div>
      </div>

      <div className="not-found-container" ref={containerRef}>
        <Card className="cosmic-result not-found-card">
          <CardContent>
            <div className="not-found-content">
              <div className="pi-symbol-large" style={{ fontSize: '6rem', marginBottom: '1rem' }}>π</div>
              
              <h1 ref={titleRef} className="cosmic-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                404 - Lost in the Infinite
              </h1>
              
              <p className="not-found-message">
                The page you're looking for seems to be hidden somewhere in the infinite digits of Pi.
                But don't worry - every journey through infinity eventually leads back home.
              </p>
              
              <div className="not-found-buttons">
                <Button
                  onClick={handleGoHome}
                  className="cosmic-btn"
                >
                  ◊ Return to Library of Pi ◊
                </Button>
                <Button
                  onClick={handleViewSource}
                  className="cosmic-btn"
                  variant="outline"
                >
                  ✧ View Source Code ✧
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="cosmic-footer">
        <p>Lost in the mathematical constant π</p>
      </footer>
    </div>
  )
}
