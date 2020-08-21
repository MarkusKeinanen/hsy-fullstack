import React from 'react'

const Notification = ({ message, classString }) => {
	if (message === null) {
		return null
	}
	return <div className={`notification ${classString}`}>{message}</div>
}

export default Notification
