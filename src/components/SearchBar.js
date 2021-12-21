import React, { useEffect, useState } from 'react'
import Error from './Error';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';



export default function SearchBar() {

    const url = "https://mindicador.cl/api";


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
    // Loader
    const [loading, setLoading] = useState(false)
    // Day Intervals for fetching data x7
    const days = [1, 7, 14, 21, 28]
    // Chart Data
    //const chartData = []
    const [chartData, setChartData] = useState([])
    // Set current year in variable and all years in reverse // setYearLimit function sets limit to available data from api(** stating point/date of data and api **)
    const [chartLoaded, setchartLoaded] = useState(false)
    // Year limit for API data
    let years = [];
    //Undefined in chartData
    const [undefined, setUndefined] = useState(false)
    // ERROR
    const [error, setError] = useState(false)


    let thisYear = new Date().getFullYear()
    let limit = 1977
    function setYearLimit() {
        for (let i = thisYear; i >= limit; i--) {
            if (indicator === "uf") {
                limit = 1977
            } else if (indicator === "ivp") {
                limit = 1990
            } else if (indicator === "dolar") {
                limit = 1984
            } else if (indicator === "dolar_intercambio") {
                limit = 1988
            } else if (indicator === "euro") {
                limit = 1999
            } else if (indicator === "ipc") {
                limit = 1928
            } else if (indicator === "utm") {
                limit = 1990
            } else if (indicator === "imacec") {
                limit = 1990
            } else if (indicator === "tpm") {
                limit = 1977
            } else if (indicator === "libra_cobre") {
                limit = 2012
            } else if (indicator === "tasa_desempleo") {
                limit = 2009
            } else if (indicator === "bitcoin") {
                limit = 2009
            }
            years.push(i)
        }

    }
    setYearLimit();


    /******************  WORKING ***********************/
    // onChange to select YEAR
    const yearString = []

    function selectYear(e) {
        setYear(e.target.value);
    }

    function setYearToString() {
        for (let i = 1; i < years.length; i++) {
            if (years[i] == year && !null) {
                yearString.push(year)
                console.log(yearString)
            }
        }
    }

    useEffect(() => {
        setYearToString();
    }, [indicator, month, year])


    // *************** WORKING *******************/

    // onChange to select single MONTH
    function selectMonth(e) {
        setMonth(e.target.value);
        console.log("monthNumber", monthNumber)

    }

    const monthString = []

    let monthNumber = 0;
    function setMonthArray() {
        for (let i = 0; i < months.length; i++) {
            if (months[i] === month && !null) {
                monthNumber += i + 1
                monthString.push(monthNumber.toString())
            }
        }
        console.log(monthString)
    }

    useEffect(() => {
        setMonthArray();
    }, [indicator, month, year])

    /***************  WORKING  *******************/

    // onChange to select INDICATOR
    const indicatorString = []

    function selectIndicator(e) {
        setIndicator(e.target.value);
    }

    function setIndicatorString() {
        indicatorString.push(indicator)
    }

    useEffect(() => {
        setIndicatorString();
    }, [indicator, month, year])


    /**************** FETCH => CHECK URL FOR FULL DATE =>  *****************/

    // set DATE for fetch parameter
    let fetchDate = []
    function urlCreateDate() {
        if (monthString !== null || yearString !== null) {
            for (let i = 0; i < days.length; i++) {
                fetchDate.push(days[i] + "-" + monthString[0] + "-" + yearString[0])
                console.log("fetchDate array: ", fetchDate)
            }
        }
    }

    useEffect(() => {
        urlCreateDate();

    }, [month, year, indicator])

    // *********************** Fetch urlArray ******************************/
    let data = []
    let urlArray = []

    function createUrls() {
        for (let i = 0; i < fetchDate.length; i++) {
            console.log('i', url + "/" + indicatorString + "/" + fetchDate[i])
            urlArray.push(url + "/" + indicatorString + "/" + fetchDate[i])
            console.log("urlArray", urlArray)
        }

    }
    useEffect(() => {
        createUrls();
    }, [month, year, indicator])


    /// Do fetch at date
    async function fetchAll() {
        setLoading(true)
        setchartLoaded(false)
        let requests = await urlArray.map(url => fetch(url));
        Promise.all(requests)
        .then(responses => {
            // all responses are resolved successfully
            for (let response of responses) {
                console.log(`${response.url}: ${response.status}`); // shows 200 for every url
                
            }
            
            return responses;
        })
        // map array of responses into an array of response.json() to read their content
        .then(responses => Promise.all(responses.map(r => r.json())))
        // all JSON answers are parsed
        .then(endpoint => endpoint.forEach((response, index, array) => {
                if (response.error > 200) {
                    console.log("error", error)
                    
                } else {
                    data.filter(n => n)
                    console.log("array", array[index].serie);
                    data.unshift(array[index].serie)
                    
                    let data2 = data.flat()
                    console.log(data2, "<========== DATA FLATTENED")
                    chartData.unshift(...data2)
                    chartData.splice(5)
                    setchartLoaded(true)
                    setLoading(false)
                }
                 console.log("chartdata :", chartData)
            }
            ));
        
    }

    useEffect(() => {
        chartDataIsLoaded();
        fetchAll();
    }, [month, year, indicator])



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

    ///////////// How many days in month
    //let getDaysInMonth = function (month, year) {
    //    return new Date(year, month, 0).getDate()
    // }
    // console.log("days in month =", getDaysInMonth(month, year))


    function chartDataIsLoaded() {
        // Check if chartData is loaded 
        if (chartData.length === days.length) {
            //setchartLoaded(false)
            //setLoading(false)
        } else if (!chartLoaded) {
            //setLoading(false)
        } else {
            console.log("Status chartLoaded:", chartLoaded)
        }
    }

    console.log("chart fully loaded with data", chartLoaded)
    console.log("Chatrdata: ", chartData)


    return (
        <div>
            <nav className="navbar main-navigation ">
                <div className="container-fluid m-3">

                    
                    <div class="input-group mb-3">
                        {/* Indicator Input */}
                        <label class="input-group-text " for="inputGroupSelect01">Indicador</label>
                        <select class="form-select" id="inputGroupSelect01" onChange={selectIndicator}>
                            <option selected="true" disabled="disabled">-- Selecciona --</option>
                            {indicators.filter((item) => { return item !== 'version' && item !== 'autor' && item !== 'fecha' }).map((item, key) => {
                                return (
                                    <>
                                        <option value={item} key={{ key }}>{item}</option>
                                    </>
                                )
                            })}
                        </select>

                        {/* Mes Input */}
                        <label class="input-group-text" for="inputGroupSelect01">Mes</label>
                        <select class="form-select" id="inputGroupSelect01" onChange={selectMonth}>
                            <option selected="true" disabled="disabled">-- Selecciona --</option>
                            {months.map((month, key) => {
                                return (
                                    <>
                                        <option value={month} key={{ key }}>{month}</option>
                                    </>
                                )
                            })}
                        </select>

                        {/* Año Input */}
                        <label class="input-group-text" for="inputGroupSelect01">Año</label>
                        <select class="form-select" id="inputGroupSelect01" onChange={selectYear}>
                            <option selected="true" disabled="disabled">-- Selecciona --</option>
                            {years.map((year, key) => {
                                return (
                                    <>
                                        <option value={year} key={{ key }}>{year}</option>
                                    </>
                                )
                            })}
                        </select>
                    </div>
                </div>
            </nav>

            {!chartLoaded && (<h3 className="m-5 text-white">Selecciona el indicicador, año y mes...</h3>)}
            {loading ? (<p className="m-3 text-secondary">Cargando...</p>) : ""}
            {error && (<Error />)}
            {/* */}
            {chartLoaded && (
                <ResponsiveContainer width="90%" aspect={2.6}>
                    <LineChart
                        width={500}
                        height={800}
                        data={chartData}
                        margin={{
                            top: 80,
                            right: 50,
                            left: 50,
                            bottom: 5,
                        }}

                    >
                        <CartesianGrid strokeDasharray="5 5" opacity={0.8} vertical={false} />
                        <XAxis
                            dataKey="fecha"
                            tickFormatter={(date) => date.substr(0, 10)}
                        />
                        <YAxis
                            dataKey="valor"
                            tickFormatter={(number) => `$${number.toFixed(2)}`}
                            domain={[1000]}
                        />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="valor" stroke="#8884d8" strokeWidth={5} activeDot={{ r: 10 }} />
                    </LineChart>
                </ResponsiveContainer>
            )}


        </div>
    )
}
