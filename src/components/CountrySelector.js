import { useState, useEffect } from 'react';

const CountrySelector = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [isSelectedListOpen, setIsSelectedListOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const countryOptions = data.map(country => ({
                    value: country.cca2,
                    label: country.name.common,
                    flag: country.flags.svg
                }));
                setCountries(countryOptions);
            })
            .catch(error => console.error('Error fetching countries:', error));
    }, []);

    const handleCheckboxChange = (country) => {
        if (selectedCountries.some(selected => selected.value === country.value)) {
            setSelectedCountries(selectedCountries.filter(selected => selected.value !== country.value));
        } else {
            setSelectedCountries([...selectedCountries, country]);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const clearAllSelections = () => {
        setSelectedCountries([]);
    };

    const filteredCountries = countries.filter(country =>
        country.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="country-selector">
            <div className="selected-countries">
                <button onClick={() => setIsSelectedListOpen(!isSelectedListOpen)}>
                    {`Selected Countries (${selectedCountries.length})`}
                </button>
                {isSelectedListOpen && (
                    <div className="selected-countries-list">
                        {selectedCountries.length > 0 ? (
                            selectedCountries.map(country => (
                                <div key={country.value} className="selected-country">
                                    <img src={country.flag} alt={country.label} className="flag" />
                                    {country.label}
                                </div>
                            ))
                        ) : (
                            <div>No countries selected</div>
                        )}
                    </div>
                )}
            </div>
            <div className="dropdown-container">
                <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="country-search"
                />
                <div className="country-dropdown">
                    {filteredCountries.map(country => (
                        <div key={country.value} className="country-option">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedCountries.some(selected => selected.value === country.value)}
                                    onChange={() => handleCheckboxChange(country)}
                                />
                                <img src={country.flag} alt={country.label} className="flag" />
                                {country.label}
                            </label>
                        </div>
                    ))}
                </div>
                {selectedCountries.length > 0 && (
                    <button className="clear-button" onClick={clearAllSelections}>Clear All</button>
                )}
            </div>
        </div>
    );
};

export default CountrySelector;
