import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistics = (props) => {
	const { good, neutral, bad, setGood, setNeutral, setBad } = props
	const total = good + neutral + bad

	return (
		<>
			<h1>Give feedback</h1>
			<Button value={good} setValue={setGood} text='Good' />
			<Button value={neutral} setValue={setNeutral} text='Neutral' />
			<Button value={bad} setValue={setBad} text='Bad' />
			<h1>Statistics</h1>
			{total > 0 ? (
				<table>
					<tbody>
						<StatisticLine text='Good' value={good} />
						<StatisticLine text='Neutral' value={neutral} />
						<StatisticLine text='Bad' value={bad} />
						<StatisticLine text='Average' value={total / 3} />
						<StatisticLine text='Positive' value={good / total + ' %'} />
					</tbody>
				</table>
			) : (
				'No feedback given'
			)}
		</>
	)
}

const Button = ({ value, setValue, text }) => {
	return <button onClick={() => setValue(value + 1)}>{text}</button>
}

const StatisticLine = ({ text, value }) => {
	return (
		<tr>
			<td>{text}</td>
			<td>{value}</td>
		</tr>
	)
}

const App = () => {
	// tallenna napit omaan tilaansa
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	const statProps = {
		good,
		neutral,
		bad,
		setGood,
		setNeutral,
		setBad
	}

	return (
		<div>
			<Statistics {...statProps} />
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('root'))
