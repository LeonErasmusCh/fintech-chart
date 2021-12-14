import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



export default function SearchBar() {

    const url = "https://mindicador.cl/api";

    // Set current year in variable and all years in reverse to 1977(** stating point/date of data and api **)
    let thisYear = new Date().getFullYear()
    let years = [];
    for (let i = thisYear; i > 1976; i--) {
        years.push(i);
    }
    // Initial Indicators values set with Fetch from api
    const [indicators, setIndicators] = useState([])
    // Indicator selected
    const [indicator, setIndicator] = useState([])
    // Initial Month for select field
    const [months, setMonths] = useState(["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"])
    // Month Selected
    const [month, setMonth] = useState("")
    // Year Selected
    const [year, setYear] = useState("")
    // Array of objects Month data for Indicator
    const [monthIndicator, setMonthIndicator] = useState([])
    // Filtered data for Chart
    const [chart, setChart] = useState([])
    // Loader
    const [loading, setLoading] = useState("Cargando...")
    // Day Intervals for fetching data x7
    let days = [7, 14, 21, 28]
    // Chart Data
    const [data, setData] = useState([])


    // onChange to select single MONTH
    function selectMonth(e) {
        setMonth(e.target.value);
        console.log("********** month selected ***********", month)
    }
    // onChange to select YEAR
    function selectYear(e) {
        setYear(e.target.value);
        console.log("********** Year selected ***********", year)
    }
    // onChange to select INDICATOR
    function selectIndicator(e) {
        setIndicator(e.target.value);
        console.log("********** Indicator selected ***********", indicator)
    }

    //Fetch for all indicators
    useEffect(() => {
        //Fetch for all indicators
        fetch(url).then(function (response) {
            return response.json();
        }).then(function (dailyIndicators) {
            setIndicators(Object.keys(dailyIndicators));
        }).catch(function (error) {
            console.log('Requestfailed', error);
        });
    }, []);


    //days in Month Numeric then to string
    let monthNumber = 0;
    for (let i = 1; i < months.length; i++) {
        if (months[i] === month) {
            monthNumber += i + 1
        }
    }
    let monthString = monthNumber.toString()
    console.log("monthNumber", monthNumber)
    console.log("monthString", monthString)


    //Fetch for indicator at given MONTH
    // Date format dd-mm-yyyy
    // Load DATA for chart
    useEffect(() => {
        //Fetch for indicator at given MONTH
        for (let i = 0; i < days.length; i++) {
            fetch(url + "/" + indicator + "/" + days[i] + "-" + monthString + "-" + year).then(function (response) {
                return response.json();
            }).then(function (data) {
                //console.log("Checking fetch data loop", data)
                //console.log("fetch string", url + "/" + indicator + "/" + days[i] + "-" + monthString + "-" + year)
                setMonthIndicator(data)
                console.log("monthIndicator", monthIndicator)
                if (days[i] !== undefined) {
                    setData({ date : days[i] + '/' + monthNumber + '/' + year, price : monthIndicator.serie[0].valor})
                }

            }).catch(function (error) {
                console.log('Requestfailed', error);
            });
        }

    }, [month]);


    /// Chart data ///

    // How many days in month
    let getDaysInMonth = function (month, year) {
        return new Date(year, month, 0).getDate()
    }
    console.log("days in month =", getDaysInMonth(month, year))



    console.log("data", data)
    //console.log("monthIndicator", monthIndicator.serie[0].valor)


    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid m-3">
                    <div class="input-group mb-3">
                        {/* Indicator Input */}
                        <label class="input-group-text" for="inputGroupSelect01">Indicador</label>
                        <select class="form-select" id="inputGroupSelect01" onChange={selectIndicator}>
                            {indicators.filter((item) => { return item !== 'version' && item !== 'autor' && item !== 'fecha' }).map((item, key) => {
                                return (
                                    <>
                                        <option value={item} key={{ key }}>{item}</option>
                                    </>
                                )
                            })}
                        </select>

                        {/* Año Input */}
                        <label class="input-group-text" for="inputGroupSelect01">Año</label>
                        <select class="form-select" id="inputGroupSelect01" onChange={selectYear}>
                            {years.map((year, key) => {
                                return (
                                    <>
                                        <option value={year} key={{ key }}>{year}</option>
                                    </>
                                )
                            })}
                        </select>

                        {/* Mes Input */}
                        <label class="input-group-text" for="inputGroupSelect01">Mes</label>
                        <select class="form-select" id="inputGroupSelect01" onChange={selectMonth}>
                            {months.map((month, key) => {
                                return (
                                    <>
                                        <option value={month} key={{ key }}>{month}</option>
                                    </>
                                )
                            })}
                        </select>
                    </div>
                </div>
            </nav>

            {monthIndicator && monthString && indicator && days ? 
                <ResponsiveContainer width="100%" aspect={3}>
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="months" />
                    <YAxis dataKey="price" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={indicator} strokeWidth={2} stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
            
           : "Please select indicator" }

            
        </div>
    )
}
