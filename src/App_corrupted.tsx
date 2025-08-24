import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, Car            {loading ? (
              <span className="loading-text">Searching Pi...</span>
            ) : (
              <span>∞ Search Pi</span>
            )}er, CardTitle } from "@/components/ui/card"
import { PiVisualization } from '@/components/PiVisualization'
import './App.css'

interface SearchResult {
  phrase: string;
  numeric_pattern: string;
  position: number;
  snippet: string;
  found: boolean;
}

function App() {
  const [phrase, setPhrase] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState('')

  const titleRef = useRef<HTMLHeadingElement>(null)
  const spiralRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

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

    // Audio autoplay fallback
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error('Audio play error:', err));
    }
  }, [])

  const numbersToWords = (numbers: string): string => {
    const numberMap: { [key: string]: string } = {
      '01': 'A', '02': 'B', '03': 'C', '04': 'D', '05': 'E', '06': 'F', '07': 'G', '08': 'H', '09': 'I',
      '10': 'J', '11': 'K', '12': 'L', '13': 'M', '14': 'N', '15': 'O', '16': 'P', '17': 'Q',
      '18': 'R', '19': 'S', '20': 'T', '21': 'U', '22': 'V', '23': 'W', '24': 'X', '25': 'Y', '26': 'Z'
    }

    // Try to parse as pairs of digits
    let result = ''
    for (let i = 0; i < numbers.length; i += 2) {
      const pair = numbers.slice(i, i + 2)
      if (numberMap[pair]) {
        result += numberMap[pair]
      } else if (pair.length === 1) {
        // Handle single digit at the end
        const paddedPair = '0' + pair
        result += numberMap[paddedPair] || pair
      } else {
        result += pair
      }
    }
    return result
  }

  const formatSnippetWithWords = (snippet: string) => {
    const beforeMatch = snippet.split('[')[0].replace('...', '')
    const match = snippet.split('[')[1]?.split(']')[0] || ''
    const afterMatch = snippet.split(']')[1]?.replace('...', '') || ''

    return {
      before: { numbers: beforeMatch, words: numbersToWords(beforeMatch) },
      match: { numbers: match, words: numbersToWords(match) },
      after: { numbers: afterMatch, words: numbersToWords(afterMatch) }
    }
  }

  const phraseToDigits = (phrase: string): string => {
    return phrase.toUpperCase().split('').map(char => {
      if (char >= 'A' && char <= 'Z') {
        const num = char.charCodeAt(0) - 64
        return num.toString().padStart(2, '0')
      }
      return ''
    }).join('')
  }

  const searchPi = async () => {
    if (!phrase.trim()) {
      setError('Please enter a word or phrase to search')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    // Animate search button
    const button = document.querySelector('.search-btn')
    if (button) {
      gsap.to(button, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 })
    }

    try {
      const numericPattern = phraseToDigits(phrase)
      if (!numericPattern) {
        setError('Your phrase must contain at least one letter')
        return
      }

      const response = await fetch(`https://pilookup.com/api/pi/search/?no=${numericPattern}`)
      const data = await response.json()

      if (data.code === 0 && data.data) {
        const newResult = {
          phrase,
          numeric_pattern: numericPattern,
          position: data.data.pos,
          snippet: `...${data.data.before}[${data.data.match}]${data.data.after}...`,
          found: true
        }
        setResult(newResult)

        // Animate result appearance
        setTimeout(() => {
          const resultEl = document.querySelector('.result')
          if (resultEl) {
            gsap.fromTo(resultEl,
              { opacity: 0, y: 50, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
            )
          }
        }, 100)
      } else {
        setResult({
          phrase,
          numeric_pattern: numericPattern,
          position: -1,
          snippet: 'Not found in the known digits of Pi',
          found: false
        })
      }
    } catch (err) {
      setError('Failed to search Pi. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app" ref={containerRef}>
      <audio
        ref={audioRef}
        src="/can_you_hear_the_music.mp3"
         autoPlay
         loop
         hidden
      />

      <div className="cosmic-background">
        <div className="stars"></div>
        <div className="pi-spiral" ref={spiralRef}>π</div>
      </div>

      <header className="header">
        <h1 ref={titleRef} className="cosmic-title">
          <span className="pi-symbol">π</span>
          <span className="title-text">Pi Phrase Finder</span>
          <span className="pi-symbol">π</span>
        </h1>
        <p className="subtitle">Search for words and phrases hidden in the infinite digits of Pi</p>
        <p className="search-note">Searches up to 1 billion digits of Pi</p>
      </header>

      <div className="search-container">
        <div className="search-box">
          <Input
            type="text"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Enter a word or phrase..."
            className="cosmic-input"
            onKeyPress={(e) => e.key === 'Enter' && searchPi()}
          />
          <Button
            onClick={searchPi}
            disabled={loading}
            className="search-btn cosmic-btn"
          >
            {loading ? (
              <span className="loading-text">Searching Pi...</span>
            ) : (
              <span>� Search Pi</span>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="error cosmic-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {result && (
        <Card className="result cosmic-result">
          <CardHeader>
            <CardTitle className="result-title">
              {result.found ? '🎉 Found in Pi! 🎉' : '❌ Not Found'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="result-grid">
              <div className="result-item">
                <label>Your Phrase</label>
                <span className="phrase-display">{result.phrase}</span>
              </div>

              <div className="result-item">
                <label>Numeric Pattern</label>
                <span className="numeric-display">{result.numeric_pattern}</span>
              </div>

              {result.found ? (
                <>
                  <div className="result-item position-item">
                    <label>Position in Pi</label>
                    <span className="position-display">{result.position.toLocaleString()}</span>
                  </div>

                  <div className="context-section">
                    <label>Context in Pi</label>
                    <div className="context-display">
                      {(() => {
                        const formatted = formatSnippetWithWords(result.snippet)
                        return (
                          <div className="context-parts">
                            <div className="context-part before">
                              <div className="numbers">{formatted.before.numbers}</div>
                              <div className="words">{formatted.before.words}</div>
                            </div>
                            <div className="context-part match">
                              <div className="numbers highlight">[{formatted.match.numbers}]</div>
                              <div className="words highlight">[{formatted.match.words}]</div>
                            </div>
                            <div className="context-part after">
                              <div className="numbers">{formatted.after.numbers}</div>
                              <div className="words">{formatted.after.words}</div>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </>
              ) : (
                <div className="not-found">
                  <p>Your phrase wasn't found in the available digits of Pi.</p>
                  <p className="cosmic-hint">Try a shorter phrase or different words!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <PiVisualization width={500} height={500} isVisible={true} />

      <footer className="cosmic-footer">
        <p>Powered by the mathematical constant π and the pilookup.com API</p>
      </footer>
    </div>
  )
}

export default App
