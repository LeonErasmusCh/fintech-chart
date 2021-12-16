import React, { useEffect, useState } from 'react'
//import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip, CartesianGrid } from 'recharts';
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
    const [loading, setLoading] = useState(true)
    // Day Intervals for fetching data x7
    const days = [1, 7, 14, 21, 28]
    // Chart Data
    //const chartData = []
    const [chartData, setChartData] = useState([])
    // Set current year in variable and all years in reverse // setYearLimit function sets limit to available data from api(** stating point/date of data and api **)
    const [chartLoaded, setchartLoaded] = useState(false)
    // Year limit for API data
    let years = [];





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

    //years.unshift("Selecion") 
    //months.unshift("Select") 
    //indicators.unshift("Select") 


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


    // How many days in month
    //let getDaysInMonth = function (month, year) {
    //    return new Date(year, month, 0).getDate()
    // }
    // console.log("days in month =", getDaysInMonth(month, year))


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
    /// Chart data /// 
    const fetchData = async () => {
        let arr = []
        for (let i = 0; i < days.length; i++) {
            let response = await fetch(url + "/" + indicator + "/" + days[i] + "-" + monthString + "-" + year);
            let json = await response.json();
            if (json.serie) {
                //chartData.push(json.serie[0])
                arr.push(json.serie[0])
                //setChartData(arr);
                console.log("arr ===>", arr)
                console.log(arr)
            }
            chartDataIsLoaded();
            console.log("chartData :", chartData)
        }

        breakme: if (arr.hasOwnProperty(!undefined)) {
            console.log("arr contains undefined value")
        } else if (arr.length === days.length) {
            console.log("ARRAY FULL => NOW COPY ENTIRE ARRAY TO chartData")
            //setChartData(arr);
            setLoading(false)
            chartData.push(...arr)
        } else if (arr.length > days.length ) {
            console.log("Initiate break")
            break breakme;
        }
    }

    useEffect(() => {
        fetchData();
    }, [month])


    //Function for calling value changes on all inputs
    //function valueChange(e) {
    //selectMonth(e);
    //selectYear(e);
    // selectIndicator(e);
    //fetchData();
    //chartDataIsLoaded();
    //}

    // Check if chartData is loaded
    function chartDataIsLoaded() {
        if (chartData.length === 5 && chartData !== undefined) {
            setchartLoaded(true)
        } else {
            console.log("(error, data not loaded) chartLoaded:", chartLoaded)
        }
    }
    //console.log("chart fully loaded with data", chartLoaded)



    let testData = [
        { "fecha": '1 Junio', "valor": 100 },
        { "fecha": '7 Junio', "valor": 800 },
        { "fecha": "14 Junio", "valor": 20 },
        { "fecha": "21 Junio", "valor": 150 },
        { "fecha": "28 Junio", "valor": 45 },
        { "fecha": "31 Junio", "valor": 250 }
    ]

    chartDataIsLoaded();
    console.log("----", chartData)


    return (
        <div>
            <nav className="navbar main-navigation ">
                <div className="container-fluid m-3">
                    <div class="input-group mb-3">
                        {/* Indicator Input */}
                        <label class="input-group-text" for="inputGroupSelect01">Indicador</label>
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
                    </div>
                </div>
            </nav>
            {/*    chartData[0] !== undefined && chartData.length === 5   loading === true &&      : chartData.length > 1 && chartData[0] !== undefined ? <h3 className="m-5">Cargando ...</h3>*/}

            {loading == true ? <h3 className="m-5">Selecciona el indicicador, año y mes...</h3> :
                <ResponsiveContainer width="95%" aspect={2.6}>
                    <LineChart
                        width={500}
                        height={800}
                        data={chartData}
                        margin={{
                            top: 80,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis dataKey="valor" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="valor" stroke="#8884d8" activeDot={{ r: 10 }} />
                    </LineChart>
                </ResponsiveContainer>

            }

        </div>
    )
}
