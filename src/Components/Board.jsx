
import React, {useEffect, useRef, useState} from 'react'

export default function Board({ incrementScore, resetScore, size, speed }) {
	const [snake, updateSnake] = useState([[1, 1], [1, 2], [1, 3]])
	
	const direction = useRef('r')
	const lastDirection = useRef('l')
	const lastEaten = useRef(true)
	const playing = useRef(true)
	const paused = useRef(false)

	const food = useRef([0, 0])

	const tempLoc = useRef([0,0])
	


	useEffect(() => {
 
		document.addEventListener('keyup', (e) => {
			if (e.key === ' ') resetSnake()
		})
		document.onclick = () => {
			resetSnake()
		}
		return () => {
			document.removeEventListener('keyup', (e) => {
				if (e.key === ' ') resetSnake()
			})
		}
	}, [])

	useEffect(() => {
		setTimeout(() => {
			moveSnake()
		}, 1000 / speed);
	})

	useEffect(() => {
		document.addEventListener('keydown', changeDirection)

		return () => {
			document.removeEventListener('keydown', changeDirection)

		}
	}, [])
	
	useEffect(() => {
		document.addEventListener('touchstart', startListener)
		document.addEventListener('touchmove', endListener)
	
		return () => {
			document.removeEventListener('touchstart', startListener)
		document.removeEventListener('touchmove', endListener)
		}
	}, [])
	
	function startListener(e) {
		e.preventDefault()
		tempLoc.current = [e.touches[0].clientX, e.touches[0].clientY]
	}
	function endListener(e) { 
		
		let distX = e.touches[0].clientX - tempLoc.current[0]
		let distY = e.touches[0].clientY - tempLoc.current[1]
		
		if (distX > 50) {
			changeDirection({key:'f'})
		}
		if (distX < -50) {
			changeDirection({key:'s'})
		}
		if (distY > 50) {
			changeDirection({key:'d'})
		}
		if (distY < -50) {
			changeDirection({key:'e'})
		}

	}
	

	function resetSnake() {
		if (playing.current === false) {
				
				
			setTimeout(() => {
				
				direction.current = 'r'
			lastDirection.current = 'l'
			updateSnake(snake)
			playing.current = true
			}, 1000 / speed);
			resetScore()
		}
	}

	function changeDirection(e) {
		if ((e.key === 's' || e.key === 'ArrowLeft') && lastDirection.current !== 'r' && lastDirection.current !== 'l') {
			direction.current = 'l'
		}
		else if((e.key === 'f' || e.key === 'ArrowRight') && lastDirection.current !== 'l' && lastDirection.current !== 'r') {
			direction.current = 'r'
		}

		else if((e.key === 'e' || e.key === 'ArrowUp') && lastDirection.current !== 'd' && lastDirection.current !== 'u') {
			direction.current = 'u'
		}

		else if((e.key === 'd' || e.key === 'ArrowDown') && lastDirection.current !== 'u' && lastDirection.current !== 'd') {
			direction.current = 'd'
		}

	}
	
	function moveSnake() {

		if (playing.current && !paused.current) {
			
		
			const snakeCopy = [...snake]
		
			if (!lastEaten.current) {
				snakeCopy.shift()
			}
			else {
				lastEaten.current = false
			}

			switch (direction.current) {
				case 'r':
					snakeCopy.push([snakeCopy[snakeCopy.length - 1][0], snakeCopy[snakeCopy.length - 1][1] + 1])
					lastDirection.current = 'r'
					break;
			
				case 'l':
					snakeCopy.push([snakeCopy[snakeCopy.length - 1][0], snakeCopy[snakeCopy.length - 1][1] - 1])
					lastDirection.current = 'l'
					break;
			
				case 'u':
					snakeCopy.push([snakeCopy[snakeCopy.length - 1][0] - 1, snakeCopy[snakeCopy.length - 1][1]])
					lastDirection.current = 'u'

					break;
				
				case 'd':
					snakeCopy.push([snakeCopy[snakeCopy.length - 1][0] + 1, snakeCopy[snakeCopy.length - 1][1]])
					lastDirection.current = 'd'

					break;
			
				default:
					break;
			}
			checkEaten(snakeCopy)
			checkCollision(snakeCopy)
			if (playing.current && !paused.current) {
				updateSnake(snakeCopy)
			}
		}
	}

	function plotBoard() {
		
		const row = []
		for (let i = 1; i <= size; i++){
			row.push(<div key={i} style={{width: `100%`, height: `${100/size}%`}} id={`r${i}`}></div>)
		}

		const board = []
		for (let i = 1; i <= size; i++) {
			board.push(<div key={i} style={{width: `${100/size}%`, height: `100%`}} id={`c${i}`}>
				{row}
			</div>)
		}	
		plotSnake(board)

		return board
	}

	function plotSnake() {
		const snakes = []
		for (let [x, y] of snake.slice(0,-1)) {

			snakes.push(<div className="snake" style={{borderRadius: '35%',position:'absolute', backgroundColor: '#007be0', top: `${100/size *x}%`, left: `${100/size *y}%`,width: `${100/size}%`, height: `${100/size}%`} } >  </div>)
		}
		const [x,y] = snake[snake.length - 1]
		
		snakes.push(<div key='head' className="snake" style={{borderRadius: '50%',position:'absolute', backgroundColor: 'rgb(3 73 130)', top: `${100/size *x}%`, left: `${100/size *y}%`,width: `${100/size}%`, height: `${100/size}%`} } >  </div>)
		return snakes
	} 

	function plotFood() {
		const x = food.current[0]
		const y = food.current[1]
		return <div key='food' className="snake" style={{borderRadius: '50%',position:'absolute', backgroundColor: 'red', top: `${100/size *x}%`, left: `${100/size *y}%`,width: `${100/size}%`, height: `${100/size}%`} } >  </div>
	}


	function checkEaten(snake) {

		function checkFoodOverlay(x, y) {

			for (let [xs, ys] of snake) {
				if (xs===x && ys === y) return true
			}
			return false
		}
		let x;
		let y
		
		
		if (snake[snake.length - 1][0] === food.current[0] && snake[snake.length - 1][1] === food.current[1]) {
			lastEaten.current = true;

			do {	
				x = (Math.floor(Math.random() * 100) % (size ))
				y = (Math.floor(Math.random() * 100) % (size ))
				
			} while (checkFoodOverlay(x, y))

			incrementScore()
			food.current = [x,y]
		}
	}

	function checkCollision(snake) {
		if (snake[snake.length-1][0] < 0 || snake[snake.length-1][0] >= size || snake[snake.length-1][1] < 0 || snake[snake.length-1][1] >= size) {
			playing.current = false
		}

		for (let [x, y] of snake.slice(0,-1)) {
			if (x === snake[snake.length - 1][0] && y === snake[snake.length - 1][1]) {
				playing.current = false
			}
		}
	}

	return (
		plotBoard().concat(plotSnake()).concat(plotFood())
		// plotSnake().concat(plotBoard())
	)
}


