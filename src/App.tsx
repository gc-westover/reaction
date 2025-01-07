import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'

type GameState = 'waiting' | 'ready' | 'playing' | 'finished'
type Direction = 'left' | 'right' | 'up' | 'down'

function App() {
  const [gameState, setGameState] = useState<GameState>('waiting')
  const [direction, setDirection] = useState<Direction>('left')
  const [startTime, setStartTime] = useState<number>(0)
  const [reactionTime, setReactionTime] = useState<number>(0)
  const [error, setError] = useState<boolean>(false)
  const [scores, setScores] = useState<number[]>([])
  const playAgainRef = useRef<HTMLButtonElement>(null)

  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
    : 0

  const startGame = () => {
    setGameState('ready')
    setError(false)
    // Random delay between 1-3 seconds
    setTimeout(() => {
      setGameState('playing')
      const directions: Direction[] = ['left', 'right', 'up', 'down']
      setDirection(directions[Math.floor(Math.random() * directions.length)])
      setStartTime(Date.now())
    }, Math.random() * 2000 + 1000)
  }

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState !== 'playing') return

    const keyPressed = event.key
    const isCorrect = 
      (direction === 'left' && keyPressed === 'ArrowLeft') ||
      (direction === 'right' && keyPressed === 'ArrowRight') ||
      (direction === 'up' && keyPressed === 'ArrowUp') ||
      (direction === 'down' && keyPressed === 'ArrowDown')

    if (isCorrect) {
      const endTime = Date.now()
      const newReactionTime = endTime - startTime
      setReactionTime(newReactionTime)
      setScores(prev => [...prev, newReactionTime])
      setGameState('finished')
    } else {
      setError(true)
      setGameState('finished')
    }
  }, [gameState, direction, startTime])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  useEffect(() => {
    if (gameState === 'finished' && playAgainRef.current) {
      playAgainRef.current.focus()
    }
  }, [gameState])

  return (
    <div className="game-container">
      {scores.length > 0 && (
        <div className="stats">
          <p>Average: {averageScore}ms</p>
          <p>Attempts: {scores.length}</p>
        </div>
      )}

      {gameState === 'waiting' && (
        <div>
          <h1>Reaction Speed Test</h1>
          <p>Press the correct arrow key when you see the direction</p>
          <button onClick={startGame}>Start Game</button>
        </div>
      )}

      {gameState === 'ready' && (
        <div>
          <h2>Get Ready...</h2>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="direction">
          <h1>{direction.toUpperCase()}!</h1>
        </div>
      )}

      {gameState === 'finished' && (
        <div>
          {error ? (
            <h2>Wrong key! Try again.</h2>
          ) : (
            <h2>Your reaction time: {reactionTime}ms</h2>
          )}
          <button ref={playAgainRef} onClick={startGame}>Play Again</button>
        </div>
      )}
    </div>
  )
}

export default App
