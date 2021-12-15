import React, { useEffect, useState } from 'react'
//import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip, CartesianGrid } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



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
    let days = [1, 7, 14, 21, 28, 31]
    // Chart Data
    const [chartData, setChartData] = useState([])
    // chart data
    let data = []
    // Set current year in variable and all years in reverse // setYearLimit function sets limit to available data from api(** stating point/date of data and api **)
    let years = [];
    
    let thisYear = new Date().getFullYear()
    
    //for (let i = thisYear; i > 1976; i--) {
    //    years.push(i);
    //}

    let limit = 1977
    function setYearLimit() {
        for (let i = thisYear; i >= limit; i--) {
            if (indicator ==="uf") {
                 limit = 1977
            } else if (indicator === "ivp") {
                limit = 1990
            } else if (indicator === "dolar"){
                limit = 1984
            } else if (indicator === "dolar_intercambio"){
                limit = 1988
            } else if (indicator === "euro"){
                limit = 1999
            } else if (indicator === "ipc"){
                limit = 1928
            } else if (indicator === "utm"){
                limit = 1990
            } else if (indicator === "imacec"){
                limit = 1990
            } else if (indicator === "tpm"){
                limit = 1977
            } else if (indicator === "libra_cobre"){
                limit = 2012
            } else if (indicator === "tasa_desempleo"){
                limit = 2009
            } else if (indicator === "bitcoin"){
                limit = 2009
            }
            years.push(i)
        }

    }
    setYearLimit();







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
    // Date format dd-mm-yyyy
    // Load DATA for chart

    /// Chart data /// 

    useEffect(() => {
        const fetchData = async () => {
            for (let i = 0; i < days.length; i++) {
                let response = await fetch(url + "/" + indicator + "/" + days[i] + "-" + monthString + "-" + year);
                let json = await response.json();
                //console.log(response)
                //console.log(json)
                setChartData([...chartData, json.serie])
                //setChartData(json.serie)
                if (json.serie) {
                    data.push(json.serie)
                }
                if(data.length === 5 ){
                    setLoading(false)
                }

                console.log("data :", data)
            }
        }
        fetchData();
    }, [month])



    console.log("chartData array", chartData)


    let testData = [
        { "fecha": "1 Junio", "valor": 100 },
        { "fecha": "7 Junio", "valor": 200 },
        { "fecha": "14 Junio", "valor": 20 },
        { "fecha": "21 Junio", "valor": 150 },
        { "fecha": "28 Junio", "valor": 45 },
        { "fecha": "31 Junio", "valor": 250 }
    ]

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
            {/* !monthIndicator && !monthString && !indicator && !days  */}
            {loading == true || data[0] !== undefined ? <h3 className="m-5">Selecciona el indicicador, año y mes...</h3> :
                <ResponsiveContainer width="100%" aspect={3}>
                    <LineChart
                        width={500}
                        height={800}
                        data={testData}
                        margin={{
                            top: 15,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis data="valor" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="valor" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            }




        </div>
    )
}
