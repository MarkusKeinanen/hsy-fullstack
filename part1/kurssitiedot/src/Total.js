import React from 'react'
const Total = ({ parts }) => {
	let totalNum = 0
	parts.forEach((p) => (totalNum += p.exercises))
	return <p>Number of exercises {totalNum}</p>
}
export default Total
