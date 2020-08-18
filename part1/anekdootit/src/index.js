import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const anecdotes = [
	'If it hurts, do it more often',
	'Adding manpower to a late software project makes it later!',
	'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
	'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
	'Premature optimization is the root of all evil.',
	'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const anecdoteList = anecdotes.map((anecdote) => {
	return {
		text: anecdote,
		votes: 0
	}
})

const getRandomInt = (min, max) => {
	let res = Math.floor(Math.random() * (max - min) + min)
	console.log(res)
	return res
}

const getMaxVotesAnecdotes = (anecdotes) => {
	let highest = 0
	let winners = []
	anecdotes.forEach((anecdote) => {
		if (anecdote.votes > highest) {
			winners = [anecdote]
			highest = anecdote.votes
		} else if (anecdote.votes === highest) {
			winners.push(anecdote)
		}
	})
	if (highest === 0 || (winners.length === 0 && anecdotes.length > 0)) {
		winners = [anecdotes[0]]
	}
	return winners
}

const App = () => {
	const [selected, setSelected] = useState(0)
	const [anecdotes, setAnecdotes] = useState(anecdoteList)

	const voteForAnecdote = (idx) => {
		const newAnecdotes = anecdotes.map((a, i) => {
			return {
				...a,
				votes: idx === i ? a.votes + 1 : a.votes
			}
		})
		setAnecdotes(newAnecdotes)
	}

	const currentAnecdote = anecdotes[selected]
	const highestVotedAnecdotes = getMaxVotesAnecdotes(anecdotes)

	return (
		<div>
			<h1>Anecdote of the day</h1>"{currentAnecdote.text}""
			<br></br>
			This anecdote has {currentAnecdote.votes} votes
			<br></br>
			<button onClick={() => voteForAnecdote(selected)}>vote</button>
			<button onClick={() => setSelected(getRandomInt(0, anecdotes.length))}>next anecdote</button>
			<h1>Anecdotes with most votes</h1>
			{highestVotedAnecdotes.map((anecdote, i) => {
				return (
					<p key={i}>
						"{anecdote.text}" ({anecdote.votes} votes)
					</p>
				)
			})}
		</div>
	)
}

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById('root'))
