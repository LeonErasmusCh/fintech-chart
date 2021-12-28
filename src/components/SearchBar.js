import React, { useEffect, useState } from 'react'
import Error from './Error';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';



export default function SearchBar() {

    const url = "https://mindicador.cl/api";

    const [fetchByYear, setFetchByYear] = useState([])

    // Initial Indicators values set with Fetch from api
    const [indicators, setIndicators] = useState([])
    // Indicator selected
    const [indicator, setIndicator] = useState([])
    const [indicatorBool, setIndicatorBool] = useState(false)
    // Initial Month for select field
    const [months, setMonths] = useState(["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"])
    // Month Selected
    const [month, setMonth] = useState("")
    const [monthBool, setMonthBool] = useState(false)
    // Year Selected
    const [year, setYear] = useState("")
    const [yearBool, setYearBool] = useState(false)
    // Loader
    const [loading, setLoading] = useState(false)
    // Day Intervals for fetching data x7
    const days = [1, 7, 14, 21, 28]
    // Chart Data
    const [chartData, setChartData] = useState([])
    // Set current year in variable and all years in reverse // setYearLimit function sets limit to available data from api(** stating point/date of data and api **)
    const [chartLoaded, setchartLoaded] = useState(false)
    // Year limit for API data
    let years = [];
    // ERROR
    const [error, setError] = useState(false)

    // set urlArrayBool to true : signifies that urlArray is ready fetch
    const [urlArrayReady, setUrlArrayReady] = useState(false)


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
            }
        }
        setYearBool(true)
    }

    useEffect(() => {
        setYearToString();
    }, [indicator, month, year])


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
                if (monthNumber < 10) {
                    monthString.push("0" + monthNumber.toString())
                    setMonthBool(true)
                } else {
                    monthString.push(monthNumber.toString())
                    setMonthBool(true)
                }
            }
        }
        console.log("MonthString :", monthString)
    }

    useEffect(() => {
        setMonthArray();

    }, [indicator, month, year])




    // onChange to select INDICATOR
    const indicatorString = []

    function selectIndicator(e) {
        setIndicator(e.target.value);
    }

    function setIndicatorString() {
        indicatorString.push(indicator)
        setIndicatorBool(true)
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
                //console.log("fetchDate array: ", fetchDate)
                //setUrlArrayReady(true)
            }
        }
    }

    useEffect(() => {
        urlCreateDate();

    })

    // *********************** Fetch urlArray ******************************/
    let data = []
    let urlArray = []

    function createUrls() {
        for (let i = 0; i < fetchDate.length; i++) {
            console.log('i', url + "/" + indicatorString + "/" + fetchDate[i])
            urlArray.push(url + "/" + indicatorString + "/" + fetchDate[i])
            console.log("urlArray", urlArray)
            setUrlArrayReady(true)
        }
    }

    useEffect(() => {
        createUrls();
    }, [month, year, indicator])


    function fetchTest() {
        if (yearBool === true && monthBool === true && indicatorBool === true) {
            fetch(url + '/' + indicatorString + '/' + yearString)
                .then(function (response) {
                    //console.log(response);
                    return response.json();
                }).then(function (yearData) {
                    console.log(yearData)
                    data.push(yearData)
                    setFetchByYear([yearData])

                    compare();

                }).catch(function (error) {
                    console.log('Requestfailed', error);
                });
        }
    }


    ///// working Perfectly --- Note : data is not available for all days (weekends etc)

    let data2 = []
    function compare() {
        //if (data[0].serie) {
        for (let i = 0; i < data[0].serie.length; i++) {
            if (data[0].serie[i].fecha.substring(5, 7) == monthString[0]) {

                let match = data[0].serie[i]
                data2.push(match)

            }
        }
        chartData.splice(0, chartData.length, ...data2);
        chartData.reverse();
        setchartLoaded(true)
    }


    function compareToFetchByYear() {
        let chartDataReset = []

        if (fetchByYear) {

            if (fetchByYear.length > 0) {

                for (let i = 0; i < fetchByYear[0].serie.length; i++) {

                    if (fetchByYear[0].serie[i].fecha.substring(5, 7) == monthString[0]) {
                        chartDataReset.push(fetchByYear[0].serie[i])

                    }

                }

            }
        }
        chartData.splice(0, chartData.length, ...chartDataReset);
        chartData.reverse();
        console.log("Chartdata", chartData)
        console.log("chartDataReset", chartDataReset)
    }



    useEffect(() => {
        //chartDataIsLoaded();
        //fetchAll();
        fetchTest();
        compareToFetchByYear()
    }, [month, year, indicator])



    function chartLoader() {
        if (typeof chartData === undefined) {
            setchartLoaded(false);
        } else if (typeof chartData !== undefined) {
            setchartLoaded(true)
            console.log("contains data")

        }
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

        //setLoading(true)
        //setchartLoaded(false)
    }, []);

    console.log("fetchByYear =>", fetchByYear)


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

            {!chartLoaded && (<h3 className="m-5 text-secondary">Selecciona el indicicador, año y mes...</h3>)}
            {loading ? (<p className="m-3 text-secondary">Cargando...</p>) : ""}
            {error && (<Error />)}
            {/* */}
            {chartLoaded && (
                <>
                <div>
                    <h5 className='m-3'><span className=' text-muted m-3'>Indicador: {indicator}</span><span className='text-muted m-3'>Mes: {month}</span> <span className='text-muted m-3'> Año: {year}</span>  </h5>
                </div>
                <ResponsiveContainer width="90%" aspect={2.6}>
                    <LineChart
                        width={600}
                        height={1000}
                        data={chartData}
                        //data={chartData[0][0]}
                        margin={{
                            top: 50,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}

                    >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.8} vertical={true} />
                        <XAxis
                            dataKey="fecha"
                            //domain = {['auto', 'auto']}
                            tickFormatter={(fecha) => fecha.substring(8, 10) + "-" + month}
                            
                        />
                        <YAxis
                            dataKey="valor"
                            domain={['datamin', 'datamax']}
                        //tickFormatter={(number) => `$${number.toFixed(2)}`}


                        />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="valor" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 10 }}  />
                    </LineChart>
                </ResponsiveContainer>
                </>
            )}


        </div>
    )
}
