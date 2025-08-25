import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PiVisualization } from '@/components/PiVisualization'
import './App.css'

interface SearchResult {
  phrase: string;
  numeric_pattern: string;
  position: number;
  snippet: string;
  found: boolean;
  isDigitMode: boolean;
}

function App() {
  const [phrase, setPhrase] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState('')
  const [isAppLoaded, setIsAppLoaded] = useState(() => {
    // Check if user has already seen the loading screen
    return sessionStorage.getItem('piUniverseLoaded') === 'true'
  })
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showAbout, setShowAbout] = useState(false)

  // Add states for digit search mode and deep search indicator
  const [digitMode, setDigitMode] = useState(false)
  const [isDeepSearching, setIsDeepSearching] = useState(false)

  const titleRef = useRef<HTMLHeadingElement>(null)
  const spiralRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only start loading simulation if app hasn't been loaded before
    if (!isAppLoaded) {
      simulateLoading()
    }
  }, [isAppLoaded])

  useEffect(() => {
    if (isAppLoaded) {
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
    }
  }, [isAppLoaded])

  useEffect(() => {
    // Add keyboard shortcut to reset loading screen (for testing)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        sessionStorage.removeItem('piUniverseLoaded')
        setIsAppLoaded(false)
        setLoadingProgress(0)
        console.log('Loading screen reset - reload page to see loading again')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const simulateLoading = () => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 150)
  }

  const handleStartExperience = () => {
    // Mark app as loaded and save to sessionStorage
    setIsAppLoaded(true)
    sessionStorage.setItem('piUniverseLoaded', 'true')
  }

  const numbersToWords = (numbers: string): string => {
    const numberMap: { [key: string]: string } = {
      '00': 'A', '01': 'B', '02': 'C', '03': 'D', '04': 'E', '05': 'F', '06': 'G', '07': 'H', '08': 'I',
      '09': 'J', '10': 'K', '11': 'L', '12': 'M', '13': 'N', '14': 'O', '15': 'P', '16': 'Q',
      '17': 'R', '18': 'S', '19': 'T', '20': 'U', '21': 'V', '22': 'W', '23': 'X', '24': 'Y', '25': 'Z'
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

  const formatSnippetWithWords = (snippet: string, isDigitMode: boolean = false) => {
    const beforeMatch = snippet.split('[')[0].replace('...', '')
    const match = snippet.split('[')[1]?.split(']')[0] || ''
    const afterMatch = snippet.split(']')[1]?.replace('...', '') || ''

    return {
      before: {
        numbers: beforeMatch,
        words: isDigitMode ? '' : numbersToWords(beforeMatch)
      },
      match: {
        numbers: match,
        words: isDigitMode ? '' : numbersToWords(match)
      },
      after: {
        numbers: afterMatch,
        words: isDigitMode ? '' : numbersToWords(afterMatch)
      }
    }
  }

  const phraseToDigits = (phrase: string): string => {
    return phrase.toUpperCase().split('').map(char => {
      if (char >= 'A' && char <= 'Z') {
        const num = char.charCodeAt(0) - 65
        return num.toString().padStart(2, '0')
      }
      return ''
    }).join('')
  }

  const handleInputChange = (value: string) => {
    let cleanValue = value.slice(0, 20) // Always limit to 20 characters

    if (digitMode) {
      // Digits mode: only allow numeric characters (0-9)
      cleanValue = cleanValue.replace(/[^0-9]/g, '')
    } else {
      // Words mode: only allow letters (A-Z, a-z)
      cleanValue = cleanValue.replace(/[^A-Za-z]/g, '')
    }

    setPhrase(cleanValue)
  }

  const searchPi = async () => {
    if (!phrase.trim()) {
      setError(digitMode ? 'Please enter numbers only (0-9)' : 'Please enter letters only (A-Z)')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    setIsDeepSearching(false)

    // Smooth scroll to top of result area if we're continuing from a result
    if (result) {
      const resultElement = document.querySelector('.result')
      if (resultElement) {
        // Scroll slightly above the result card
        const y = resultElement.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }

    // Animate search button
    const button = document.querySelector('.search-btn')
    if (button) {
      gsap.to(button, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 })
    }

    try {
      const numericPattern = digitMode ? phrase : phraseToDigits(phrase)
      if (!numericPattern) {
        setError(digitMode ? 'Please enter numbers only (0-9)' : 'Your phrase must contain at least one letter')
        setLoading(false)
        return
      }

      // Primary API call
      const response = await fetch(`https://pilookup.com/api/pi/search/?no=${numericPattern}`)
      const data = await response.json()

      if (data.code === 0 && data.data && data.data.pos >= 0) {
        const newResult = {
          phrase,
          numeric_pattern: numericPattern,
          position: data.data.pos,
          snippet: `...${data.data.before}[${data.data.match}]${data.data.after}...`,
          found: true,
          isDigitMode: digitMode
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
        // Deep search via backup API
        setIsDeepSearching(true)
        try {
          const backupResponse = await fetch(`https://api.libraryofpi.com/search?no=${numericPattern}`)
          const backupData = await backupResponse.json()
          if (backupData.code === 0 && backupData.data && backupData.data.pos >= 0) {
            const newResult = {
              phrase,
              numeric_pattern: numericPattern,
              position: backupData.data.pos,
              snippet: `...${backupData.data.before}[${backupData.data.match}]${backupData.data.after}...`,
              found: true,
              isDigitMode: digitMode
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
              found: false,
              isDigitMode: digitMode
            })
          }
        } catch (backupErr) {
          // If backup API also fails, show not found
          setResult({
            phrase,
            numeric_pattern: numericPattern,
            position: -1,
            snippet: 'Not found in the known digits of Pi',
            found: false,
            isDigitMode: digitMode
          })
          console.error('Backup API error:', backupErr)
        } finally {
          setIsDeepSearching(false)
        }
      }
    } catch (err) {
      setError('Failed to search Pi. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const closeResult = () => {
    const resultEl = document.querySelector('.result')
    if (resultEl) {
      gsap.to(resultEl, {
        opacity: 0,
        y: -30,
        scale: 0.9,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => setResult(null)
      })
    } else {
      setResult(null)
    }
  }

  // Build automaton transitions (KMP-like)
  function buildAutomaton(pattern: string) {
    const m = pattern.length;
    const pat = pattern.split("");
    const fail = new Array(m).fill(0);

    // failure function
    let j = 0;
    for (let i = 1; i < m; i++) {
      while (j > 0 && pat[i] !== pat[j]) j = fail[j - 1];
      if (pat[i] === pat[j]) fail[i] = ++j;
    }

    // transitions: state -> next state for digit
    const trans = Array.from({ length: m }, () => new Array(10).fill(0));
    for (let state = 0; state < m; state++) {
      for (let d = 0; d < 10; d++) {
        const c = String(d);
        if (state < m && c === pat[state]) {
          trans[state][d] = state + 1;
        } else if (state > 0) {
          trans[state][d] = trans[fail[state - 1]][d];
        } else {
          trans[state][d] = 0;
        }
      }
    }
    return trans;
  }

  // Build Markov matrix (m x m) excluding absorbing state
  function buildMatrix(pattern: string) {
    const m = pattern.length;
    const trans = buildAutomaton(pattern);
    const M = Array.from({ length: m }, () => new Array(m).fill(0));

    for (let state = 0; state < m; state++) {
      for (let d = 0; d < 10; d++) {
        const next = trans[state][d];
        if (next < m) {
          M[state][next] += 0.1; // 1/10 probability per digit
        }
      }
    }
    return M;
  }

  // Matrix multiplication
  function matMul(A: number[][], B: number[][]) {
    const n = A.length;
    const res = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let k = 0; k < n; k++) {
        if (A[i][k] === 0) continue;
        for (let j = 0; j < n; j++) {
          res[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return res;
  }

  // Fast exponentiation
  function matPow(M: number[][], exp: number) {
    const n = M.length;
    // Identity matrix
    let res = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );
    let base = M;
    while (exp > 0) {
      if (exp & 1) res = matMul(res, base);
      base = matMul(base, base);
      exp = Math.floor(exp / 2);
    }
    return res;
  }

  // Main function
  function probNotFound(pattern: string, N: number) {
    const M = buildMatrix(pattern);
    const P = matPow(M, N);

    // Initial state vector [1, 0, ..., 0]
    const init = new Array(P.length).fill(0);
    init[0] = 1;

    // Final probabilities = init * P
    const final = new Array(P.length).fill(0);
    for (let j = 0; j < P.length; j++) {
      for (let k = 0; k < P.length; k++) {
        final[j] += init[k] * P[k][j];
      }
    }

    // Probability not found = sum of all safe states
    return final.reduce((a, b) => a + b, 0);
  }

  /**
   * Calculate probability that a pattern is not found in first N digits of Pi
   */
  const probabilityNotFound = (pattern: string, N: number = 1e10): number => {
    return probNotFound(pattern, N);
  }

  // Scroll result into view whenever a result is set
  useEffect(() => {
    if (result) {
      const element = document.querySelector('.result')
      if (element) {
        // Scroll slightly above the result card
        const y = element.getBoundingClientRect().top + window.scrollY - 200
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
  }, [result])

  return (
    <>
      {!isAppLoaded ? (
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-logo">
              <span className="pi-symbol-large">π</span>
            </div>
            <h1 className="loading-title">Library of Pi</h1>
            <p className="loading-subtitle">Preparing the infinite journey through Pi...</p>

            <div className="loading-bar-container">
              <div
                className="loading-bar"
                style={{ width: `${Math.min(loadingProgress, 100)}%` }}
              ></div>
            </div>
            <div className="loading-percentage">{Math.floor(loadingProgress)}%</div>

            {loadingProgress >= 100 && (
              <button
                className="start-btn cosmic-btn"
                onClick={handleStartExperience}
              >
                ◊ Begin Experience ◊
              </button>
            )}

            {loadingProgress < 100 && (
              <div className="loading-hints">
                <p>• Calculating infinite digits</p>
                <p>• Harmonizing cosmic frequencies</p>
                <p>• Preparing mathematical visualization</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="app" ref={containerRef}>
          {/* Subtle YouTube Background Music */}
          <div className="youtube-background-music">
            <iframe
              width="200"
              height="113"
              src="https://www.youtube.com/embed/4JZ-o3iAJv4?autoplay=1&loop=1&playlist=4JZ-o3iAJv4&controls=1&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&cc_load_policy=0&start=0&mute=0"
              title="Background Music"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                opacity: 0.7,
                borderRadius: '8px'
              }}
            ></iframe>
          </div>

          <div className="cosmic-background">
            <div className="stars"></div>
            <div className="pi-spiral" ref={spiralRef}>π</div>
          </div>

          <header className="header">
            <h1 ref={titleRef} className="cosmic-title">
              <span className="pi-symbol">π</span>
              <span className="title-text">Library of Pi</span>
              <span className="pi-symbol">π</span>
            </h1>
            <p className="subtitle">Search for words and phrases hidden in the infinite digits of Pi</p>
            <p className="search-note">Searches up to 10 billion digits of Pi</p>

            <div className="header-nav">
              <button
                onClick={() => setShowAbout(!showAbout)}
                className="nav-btn"
              >
                {showAbout ? '← Back to Search' : 'About'}
              </button>
            </div>
          </header>

          {showAbout ? (
            <div className="about-page">
              <Card className="about-card cosmic-result">
                <CardHeader>
                  <CardTitle className="about-title">
                    <div className="about-header">
                      <div className="about-icon">π</div>
                      <span>About Library of Pi</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="about-content">
                    <div className="about-section">
                      <h3>The Vision</h3>
                      <p>
                        I'm <strong>Caleb Sakala</strong>, and I created this site after being inspired by a scene from the movie "Person of Interest".
                        The concept that everything that can ever be said or written is contained within Pi's infinite digits
                        is so captivating to me that I had to test it out. Not to mention, the greatest website in human history, in my eyes, is <a href="https://libraryofbabel.info/" target="_blank" rel="noopener noreferrer">The Library of Babel</a> by Jonathan Basile. When I heard of the infinite nature of pi, it immediately took me back to my first experience with The Library of Babel. I created this site to wow people with the nature of pi just like The Library of Babel wowed me.
                      </p>
                    </div>

                    <div className="about-section">
                      <h3>My Social Media</h3>
                      <p>Let's connect and discuss mathematics, programming, or the infinite beauty of Pi:</p>
                      <div className="social-links">
                        <a href="https://linkedin.com/in/calebsakala"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-btn">
                          <span>💼</span> LinkedIn
                        </a>
                        <a href="https://x.com/bytecaleb"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-btn">
                          <span>🐦</span> Twitter
                        </a>
                      </div>
                    </div>

                    <div className="about-section">
                      <h3>Open Source & Free</h3>
                      <p>
                        Library of Pi is completely <strong>free and open source</strong>. You can explore the code, contribute,
                        or create your own version on GitHub. Please star the repo if you find it interesting!
                      </p>
                      <a href="https://github.com/calebsakala/libraryofpi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-btn">
                        <span>⚡</span> View on GitHub
                      </a>
                    </div>


                    <div className="about-section">
                      <h3>Technical Details</h3>
                      <p>
                        <strong>Overview:</strong>  This site searches through <strong>10 billion digits of Pi</strong> using the pilookup API for the first 1 billion digits and a lightweight Go API hosted on AWS for the remaining 9 billion.
                        The visualization shows a mathematical spirograph pattern based on Pi's ratio, creating beautiful
                        geometric art as it traces through the infinite sequence.
                      </p>
                      <p>
                        <strong>Number-letter Mapping:</strong> To map letters to numbers, I use a simple mapping system where
                        A=00, B=01, C=02... Z=25. Each letter becomes a two-digit number, so "HELLO" becomes "0805121215".
                        This numeric sequence is then searched within Pi's digits. The reverse process converts Pi's digits
                        back to letters, revealing the hidden words that exist within the mathematical constant.
                      </p>
                      <p>
                        <strong>Probability Calculation:</strong> When a sequence isn't found, we calculate the probability
                        that it would have been discovered in the first billion digits. This uses <strong>finite state automata</strong> and <strong>Markov chain analysis</strong>.
                        We build a state machine that tracks partial matches of your pattern, then use matrix exponentiation
                        to compute the probability distribution after processing N digits. The calculation assumes Pi's digits
                        are statistically random (which they appear to be), where each digit 0-9 has equal probability.
                        This gives us a scientifically grounded estimate of how "surprising" it is that your phrase wasn't found.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="main-layout">
              {/* Desktop: Visualization left, Search right */}
              <div className="visualization-section">
                <PiVisualization width={500} height={500} isVisible={true} />
              </div>

              <div className="search-section">
                {result ? (
                  // Result replaces the search area when there's a discovery
                  <Card className="result cosmic-result">
                    <CardHeader>
                      <CardTitle className="result-title">
                        <div className="title-content">
                          <div className="title-main-content">
                            {result.found ? (
                              <>
                                <div className="success-icon">π</div>
                                <span>{digitMode ? 'Digit Discovery Made!' : 'Discovery Made!'}</span>
                              </>
                            ) : (
                              <>
                                <div className="not-found-icon">∅</div>
                                <span>{digitMode ? 'Not Found (Digits)' : 'Not Found'}</span>
                              </>
                            )}
                          </div>
                          <button
                            onClick={closeResult}
                            className="close-btn"
                            aria-label="Close result"
                          >
                            ×
                          </button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.found ? (
                        <div className="result-layout-found">
                          <div className="primary-info">
                            <div className="phrase-showcase">
                              <div className="phrase-label">Your Discovery</div>
                              <div className="phrase-value">{result.phrase}</div>
                              <div className="numeric-subtitle">{result.numeric_pattern}</div>
                            </div>

                            <div className="position-showcase">
                              <div className="position-circle">
                                <div className="position-label">Found at Position</div>
                                <div className="position-value">{result.position.toLocaleString()}</div>
                              </div>
                            </div>
                          </div>

                          <div className="context-showcase">
                            <div className="context-label">Within Pi's Infinite Sequence</div>
                            <div className="context-visual">
                              {(() => {
                                const formatted = formatSnippetWithWords(result.snippet, result.isDigitMode)
                                return (
                                  <div className="sequence-display">
                                    <div className="sequence-section">
                                      <div className="sequence-header">Before Your Discovery</div>
                                      <div className="sequence-content">
                                        <div className="numbers-line">{formatted.before.numbers}</div>
                                        {!result.isDigitMode && <div className="words-line">{formatted.before.words}</div>}
                                      </div>
                                    </div>

                                    <div className="sequence-section match-section">
                                      <div className="sequence-header highlight">Your Match</div>
                                      <div className="sequence-content match-highlight">
                                        <div className="numbers-line match">{formatted.match.numbers}</div>
                                        {!result.isDigitMode && <div className="words-line match">{formatted.match.words}</div>}
                                      </div>
                                    </div>

                                    <div className="sequence-section">
                                      <div className="sequence-header">After Your Discovery</div>
                                      <div className="sequence-content">
                                        <div className="numbers-line">{formatted.after.numbers}</div>
                                        {!result.isDigitMode && <div className="words-line">{formatted.after.words}</div>}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })()}
                            </div>
                          </div>

                          {/* New search bar at the bottom of the result for continuous searching */}
                          <div className="continue-search">
                            <div className="continue-search-label">Continue Exploring Pi</div>

                            {/* Mode toggle */}
                            <div className="search-mode-toggle">
                              <button
                                onClick={() => setDigitMode(false)}
                                disabled={loading}
                                className={`mode-btn ${!digitMode ? 'active' : ''}`}
                              >
                                Words
                              </button>
                              <button
                                onClick={() => setDigitMode(true)}
                                disabled={loading}
                                className={`mode-btn ${digitMode ? 'active' : ''}`}
                              >
                                Numbers
                              </button>
                            </div>

                            <div className="search-box">
                              <Input
                                type="text"
                                value={phrase}
                                onChange={(e) => {
                                  handleInputChange(e.target.value)
                                }}
                                placeholder={digitMode ? 'Enter numbers to search...' : 'Search for another phrase...'}
                                className="cosmic-input"
                                onKeyPress={(e) => e.key === 'Enter' && searchPi()}
                                maxLength={20}
                              />
                              <Button
                                onClick={searchPi}
                                disabled={loading}
                                className="search-btn cosmic-btn"
                              >
                                {loading ? (
                                  <span className="loading-text">
                                    {isDeepSearching ? 'Searching deep...' : 'Searching Pi...'}
                                  </span>
                                ) : (
                                  <span>∞ Search Pi</span>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="result-layout-not-found">
                          <div className="not-found-content">
                            <div className="phrase-display">
                              <div className="phrase-label">Searched For</div>
                              <div className="phrase-value searched">{result.phrase}</div>
                              <div className="numeric-subtitle">{result.numeric_pattern}</div>
                            </div>

                            <div className="not-found-message">
                              <div className="infinity-symbol">∞</div>
                              <div className="message-text">
                                <p>There was a {((1 - probabilityNotFound(result.numeric_pattern)) * 100).toFixed(4)}% chance of finding "{result.phrase}" in our search space. This sequence awaits discovery beyond the limits of this program.</p>
                                <p className="suggestion">Try a shorter phrase or explore different words</p>
                              </div>
                            </div>
                          </div>

                          {/* New search bar at the bottom for not found results too */}
                          <div className="continue-search">
                            <div className="continue-search-label">Try Another Search</div>

                            {/* Mode toggle */}
                            <div className="search-mode-toggle">
                              <button
                                onClick={() => setDigitMode(false)}
                                disabled={loading}
                                className={`mode-btn ${!digitMode ? 'active' : ''}`}
                              >
                                Words
                              </button>
                              <button
                                onClick={() => setDigitMode(true)}
                                disabled={loading}
                                className={`mode-btn ${digitMode ? 'active' : ''}`}
                              >
                                Numbers
                              </button>
                            </div>

                            <div className="search-box">
                              <Input
                                type="text"
                                value={phrase}
                                onChange={(e) => {
                                  handleInputChange(e.target.value)
                                }}
                                placeholder={digitMode ? 'Enter numbers to search...' : 'Search for another phrase...'}
                                className="cosmic-input"
                                onKeyPress={(e) => e.key === 'Enter' && searchPi()}
                                maxLength={20}
                              />
                              <Button
                                onClick={searchPi}
                                disabled={loading}
                                className="search-btn cosmic-btn"
                              >
                                {loading ? (
                                  <span className="loading-text">
                                    {isDeepSearching ? 'Searching deep...' : 'Searching Pi...'}
                                  </span>
                                ) : (
                                  <span>∞ Search Pi</span>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  // Original search area when there's no result
                  <div className="initial-search">
                    <div className="search-container">
                      {/* Mode toggle */}
                      <div className="search-mode-toggle">
                        <button
                          onClick={() => setDigitMode(false)}
                          disabled={loading}
                          className={`mode-btn ${!digitMode ? 'active' : ''}`}
                        >
                          Words
                        </button>
                        <button
                          onClick={() => setDigitMode(true)}
                          disabled={loading}
                          className={`mode-btn ${digitMode ? 'active' : ''}`}
                        >
                          Numbers
                        </button>
                      </div>

                      <div className="search-box">
                        <Input
                          type="text"
                          value={phrase}
                          onChange={(e) => {
                            handleInputChange(e.target.value)
                          }}
                          placeholder={digitMode ? 'Enter numbers to search...' : 'Enter a word or phrase...'}
                          className="cosmic-input"
                          onKeyPress={(e) => e.key === 'Enter' && searchPi()}
                          maxLength={20}
                        />
                        <Button
                          onClick={searchPi}
                          disabled={loading}
                          className="search-btn cosmic-btn"
                        >
                          {loading ? (
                            <span className="loading-text">
                              {isDeepSearching ? 'Searching deep...' : 'Searching Pi...'}
                            </span>
                          ) : (
                            <span>∞ Search Pi</span>
                          )}
                        </Button>
                      </div>
                    </div>

                    {error && (
                      <div className="error cosmic-error">
                        <span className="error-icon">⚠</span>
                        {error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <footer className="cosmic-footer">
            <p>Powered by the mathematical constant π and <a href="https://pilookup.com" target='_blank'>pilookup</a>.</p>
          </footer>
        </div>
      )}
    </>
  )
}

export default App
