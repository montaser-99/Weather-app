import React, { useState, useEffect, useRef } from 'react';

function Weather() {
    const [weatherData, setWeatherData] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false); // 🌗 Theme state
    const inputRef = useRef();

    const search = async (location = 'london') => {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7f97e74ef23b418c97a155211230503&q=${location}&days=5`);
            const data = await response.json();

            if (data.error) {
                alert(`Error: ${data.error.message}`);
                setWeatherData(null);
            } else {
                setWeatherData(data);
            }
        } catch (e) {
            console.log("Error:", e);
            setWeatherData(null);
        }
    };

    useEffect(() => {
        search();
    }, []);

    const clearSearch = () => {
        inputRef.current.value = '';
        setWeatherData(null);
    };

    const toggleTheme = () => setIsDarkMode(!isDarkMode); // 🌓 Toggle handler

    return (
        <div className={` section d-flex justify-content-center align-items-center min-vh-100  ${isDarkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
            <div className="container text-center">

                {/* 🌗 Theme Toggle Switch */}
                <div className='d-flex justify-content-end mb-3'>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="themeSwitch"
                            checked={isDarkMode}
                            onChange={toggleTheme}
                        />
                        <label className="form-check-label" htmlFor="themeSwitch">
                            {isDarkMode ? '🌙 Dark Mode' : '🌞 Light Mode'}
                        </label>
                    </div>
                </div>

                {/* 🔍 Search Bar */}
                <div className="mb-4 d-flex justify-content-center">
                    <div className={`d-flex align-items-center px-3 rounded shadow ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}>
                        <input
                            ref={inputRef}
                            className={`form-control border-0 ${isDarkMode ? 'bg-secondary text-white' : 'bg-light'}`}
                            type="search"
                            placeholder="Enter a city (e.g., Cairo)"
                            aria-label="Search"
                            style={{ outline: "none", boxShadow: "none" }}
                            onChange={(e) => e.target.value.trim() === '' && clearSearch()}
                        />
                        <i
                            className="fa-solid fa-magnifying-glass search-icon ms-2"
                            onClick={() => {
                                const location = inputRef.current.value.trim();
                                location ? search(location) : alert("Please enter a city name");
                            }}
                            style={{ cursor: 'pointer' }}
                        ></i>

                        <i
                            className="fa-solid fa-xmark ms-3"
                            onClick={clearSearch}
                            style={{ cursor: 'pointer', color: 'red' }}
                            title="Clear Search"
                        ></i>
                    </div>
                </div>

                {/* 🌤️ Weather Data */}
                {weatherData?.forecast?.forecastday ? (
                    <div className="row justify-content-center g-3">
                        {weatherData.forecast.forecastday.map((day) => (
                            <div key={day.date} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
                                <div className={`p-3 rounded shadow text-center w-100 ${isDarkMode ? 'bg-secondary text-white' : 'bg-light text-dark'}`}>
                                    <h5>{day.date}</h5>
                                    <img src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} className="img-fluid" />
                                    <p>{day.day.condition.text}</p>
                                    <p>🌡️ {day.day.avgtemp_c}°C</p>
                                    <p>💧 {day.day.avghumidity}% Humidity</p>
                                    <p>💨 {day.day.maxwind_kph} kph Wind</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>{inputRef.current?.value ? "No data found." : "Search for a location"}</p>
                )}
            </div>
        </div>
    );
}

export default Weather;
