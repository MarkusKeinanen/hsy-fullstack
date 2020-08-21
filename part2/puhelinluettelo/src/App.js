import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './Notification'

const FormFilter = ({ filter, setFilter }) => {
	return (
		<>
			filter shown with
			<input value={filter} onChange={(e) => setFilter(e.currentTarget.value)} />
		</>
	)
}

const PersonForm = ({ newName, setNewName, newNumber, setNewNumber, addPerson }) => {
	return (
		<form onSubmit={addPerson}>
			<div>
				name:
				<input value={newName} onChange={(e) => setNewName(e.currentTarget.value)} />
				<br></br>
				number:
				<input value={newNumber} onChange={(e) => setNewNumber(e.currentTarget.value)} />
			</div>
			<div>
				<button type='submit'>add</button>
			</div>
		</form>
	)
}

const PersonsList = ({ persons, filter, deletePerson }) => {
	return persons
		.filter((p) => {
			let filterLower = filter.toLowerCase()
			return p.name.toLowerCase().includes(filterLower) || p.number.toLowerCase().includes(filterLower)
		})
		.map((person) => {
			return (
				<div key={person.name}>
					<p style={{ display: 'inline-block' }}>
						{person.name} {person.number}
					</p>
					<button onClick={() => deletePerson(person)}>delete</button>
				</div>
			)
		})
}

const App = () => {
	const [persons, setPersons] = useState(null)
	const [filter, setFilter] = useState('')
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [notification, setNotification] = useState({ visible: false, message: '', classString: 'success' })

	useEffect(() => {
		personService.getAll().then((persons) => {
			setPersons(persons)
		})
	}, [])

	const notify = (notification) => {
		setNotification({ ...notification, visible: true })
		setTimeout(() => {
			setNotification({ visible: false })
		}, 5000)
	}

	const addPerson = (e) => {
		e.preventDefault()
		let existing = persons.find((p) => p.name.toLowerCase() === newName.toLowerCase())
		if (existing !== undefined) {
			if (!window.confirm(`${newName} is already added to phonebook, do you want to replace the old number with a new one?`)) return
		}
		let newPerson = {
			name: newName,
			number: newNumber
		}
		if (existing) {
			personService
				.update(existing.id, newPerson)
				.then((returnedPerson) => {
					setPersons(persons.map((p) => (p.id !== existing.id ? p : returnedPerson)))
					notify({
						message: `Number updated: ${returnedPerson.name} ${returnedPerson.number}`,
						classString: 'success'
					})
				})
				.catch((err) => {
					notify({
						message: `Failed to update - ${newPerson.name} was not found on server`,
						classString: 'error'
					})
				})
		} else {
			personService.create(newPerson).then((returnedPerson) => {
				setPersons(persons.concat(returnedPerson))
				notify({
					message: `Person added: ${returnedPerson.name} ${returnedPerson.number}`,
					classString: 'success'
				})
			})
		}
	}

	const deletePerson = (target) => {
		if (!window.confirm(`Are you sure you want to delete person ${target.name} ${target.number}?`)) return
		personService
			.delete(target.id)
			.then(() => {
				let newPersons = persons.filter((p) => p.id !== target.id)
				setPersons(newPersons)
				notify({
					message: `Person ${target.name} was deleted.`,
					classString: 'success'
				})
			})
			.catch((err) => {
				notify({
					message: `Failed to delete - ${target.name} was not found on server`,
					classString: 'error'
				})
			})
	}

	if (persons === null) return 'Loading data...'

	return (
		<div>
			<h2>Phonebook</h2>
			{notification.visible && <Notification {...notification} />}
			<FormFilter filter={filter} setFilter={setFilter} />

			<h2>Add a new number</h2>

			<PersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />

			<h2>Numbers</h2>
			<PersonsList persons={persons} filter={filter} deletePerson={deletePerson} />
		</div>
	)
}

export default App
