import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const api_key = process.env.REACT_APP_WEATHER_STACK_API_KEY

const Results = ({ countries, toggleCountry }) => {
	let visibleResult = ''
	if (countries.length > 10) {
		visibleResult = 'Too many matches, specify another filter'
	} else if (countries.length > 1 && countries.length <= 10) {
		visibleResult = countries.map((country) => {
			return (
				<div key={country.name} style={{ border: '1px solid lightgray', padding: '30px', marginTop: '15px' }}>
					{country.opened ? (
						<FullCountry country={country} toggleCountry={toggleCountry} />
					) : (
						<>
							<p>{country.name}</p>
							<button onClick={() => toggleCountry(country.name)}>show</button>
						</>
					)}
				</div>
			)
		})
	} else if (countries.length === 1) {
		return <FullCountry country={countries[0]} toggleCountry={null} />
	} else {
		visibleResult = 'No results'
	}
	return visibleResult
}

const FullCountry = ({ country, toggleCountry }) => {
	const [weather, setWeather] = useState(null)

	useEffect(() => {
		axios.get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`).then((response) => {
			setWeather(response.data.current)
		})
	}, [])

	return (
		<div>
			<h2>
				<b>{country.name}</b>
			</h2>
			<p>Capital {country.capital}</p>
			<p>population {country.population}</p>
			<h3>
				<b>Languages</b>
			</h3>
			<ul>
				{country.languages.map((lang) => (
					<li key={lang.name}>{lang.name}</li>
				))}
			</ul>
			<img src={country.flag} alt='flag' style={{ height: 'auto', width: '100px', border: '1px solid lightgray' }} />
			<h3>
				<b>Weather in {country.capital}</b>
			</h3>
			{weather == null ? (
				'Loading weather...'
			) : (
				<>
					<p>temperature {weather.temperature} celsius</p>
					{weather.weather_icons.map((icon) => (
						<img key={icon} src={icon} alt='' />
					))}

					<p>
						wind {weather.wind_speed}mph in direction {weather.wind_dir}
					</p>
				</>
			)}

			{toggleCountry !== null && <button onClick={() => toggleCountry(country.name)}>hide</button>}
		</div>
	)
}

const App = () => {
	const [countries, setCountries] = useState(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [searchResults, setSearchResults] = useState([])

	useEffect(() => {
		axios.get('https://restcountries.eu/rest/v2/all').then((response) => {
			setCountries(response.data)
		})
	}, [])

	const doSearch = (term) => {
		let matching = countries.filter((country) => {
			return country.name.toLowerCase().includes(term.toLowerCase())
		})
		matching = matching.map((c) => {
			return {
				...c,
				opened: false
			}
		})
		setSearchTerm(term)
		setSearchResults(matching)
	}

	const toggleCountry = (name) => {
		let newResults = searchResults.map((country) => {
			if (country.name === name) country.opened = !country.opened
			return country
		})
		setSearchResults(newResults)
	}

	return countries === null ? (
		'Loading initial data...'
	) : (
		<div>
			find countries <input value={searchTerm} onChange={(e) => doSearch(e.currentTarget.value)} />
			<br></br>
			<Results countries={searchResults} toggleCountry={toggleCountry} />
		</div>
	)
}

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
)
