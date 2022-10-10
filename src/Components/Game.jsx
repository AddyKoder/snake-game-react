import React, {  useState, useRef } from 'react';
import Board from './Board';
import '../Styles/Game.css'

export default function Game() {
	const [score, updateScore] = useState(0);
	
	const ren = useRef(true)


	function incrementScore() {
		updateScore(score+1)
		
	}
	function resetScore() {
		updateScore(0)
	}
	

	

	return (
		<div className='gameScreen'>

			<div id="heading-and-score">
				<h1>Snakes...</h1>
				<h3>{score}</h3>
			</div>

			{ren.current && <div id="board"><Board size={15} speed={8} resetScore={resetScore} incrementScore={incrementScore} playing={true}/></div>}


		</div>
	);
}
