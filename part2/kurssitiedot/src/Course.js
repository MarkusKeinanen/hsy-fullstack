import React from 'react'

const Course = ({ course }) => {
	return (
		<div key={course.id}>
			<Header name={course.name} />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
			<br></br>
		</div>
	)
}

const Header = ({ name }) => <h3>{name}</h3>

const Part = ({ part }) => {
	return (
		<p>
			{part.name} {part.exercises}
		</p>
	)
}

const Total = ({ parts }) => {
	const total = parts.reduce((acc, curr) => acc + curr.exercises, 0)
	return (
		<p>
			<b>total of {total} exercises</b>
		</p>
	)
}

const Content = ({ parts }) => {
	return parts.map((part, i) => <Part key={i} part={part} />)
}

export default Course
