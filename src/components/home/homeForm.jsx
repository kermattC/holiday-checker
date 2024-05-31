// this component is a simple API call without the need of a redux store
// make an api call, get the data, save the data and do something with it

// This component makes an API call to get a list of holidays in Canada
// If today is a holiday, today's holiday today will be returned
    // otherwise, return the next closest holiday (searches via binary search)

import axios from 'axios';
import { useEffect, useState } from 'react';
import '../../styles/styles.css'
import '../../styles/flag-styles.scss'
import goosePic from './goose.png';
import { Button } from 'react-bootstrap';

const Home = () => {

    const [data, setData] = useState(null)
    const [holidayDate, setHolidayDate] = useState('')
    const [holidayMonth, setHolidayMonth] = useState('')
    const [holidayNames, setHolidayNames] = useState([])
    const [provinceNames, setProvinceNames] = useState([])
    const [todayHoliday, setTodayHoliday] = useState(false)

    const monthDict = {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'Decmber',
    }

    const URL_HOLIDAYS = 'https://canada-holidays.ca/api/v1/holidays/'

    async function fetchData() {
        try {
            let holidaysRequest = {
                method: 'GET',
                url: URL_HOLIDAYS
            }

            const response = await axios.request(holidaysRequest)
            setData(response.data)

            console.log("Axios fetch success")        
        } catch (error) {
            console.error("Error retrieving data: ", error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // perform binary search for date
    // returns the date of the holiday if found
    // if date is not found, returns the next upcoming holiday
    const findClosestHoliday = (targetDate, dates) => {
        var left = 0
        var right = dates.length - 1
        var mid = 0

        while (left <= right) {
            // mid = Math.floor((left + right)/2)
            mid = ~~((left + right) / 2)

            if (targetDate === dates[mid]) {
                setTodayHoliday(true)
                return dates[mid]
            } else if (targetDate > dates[mid]) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }

        // if reached end of the year, return 'none'
        if ((mid + 1) < dates.length) {
            console.log("No holiday today. Returning date for next closest holiday: ", mid+1)
            return dates[mid + 1]
        } else {
            console.log("Reached end of the year. No more holidays!")
            return 'none'
        }
    }

    useEffect(() => {
        if (data) {
            console.log("Data updated: ", data);

            const holidays = data['holidays']
            const holidaysLength = Object.keys(holidays).length
            var dates = []

            // it'd be cool to be able to vectorize this operation
            for (let i = 0; i < holidaysLength; i++) {
                dates.push(holidays[i]['date'])
            }

            // the dates should already be sorted, but good to sort it just in case to ensure binary search will work
            dates.sort();

            // console.log("dates after setting dates: ", dates)

            var holiday = ''
            if (dates.length > 0) {
                let currentDate = new Date().toISOString().split('T')[0];

                console.log("Current date: ", currentDate)  
                // holiday = findClosestHoliday('2024-06-24', dates);
                // holiday = findClosestHoliday('2024-07-01', dates);
                // holiday = findClosestHoliday('2024-02-01', dates);
                holiday = findClosestHoliday(currentDate, dates);
                console.log("holiday check: ", holiday)


                const holidayStr = holiday.split('-')
                const holidayDate = holidayStr[2]
                const holidayMonth = holidayStr[1]

                setHolidayDate(holidayDate)
                setHolidayMonth(holidayMonth)

                // console.log("Date check: ", holidayDate, " month check: ", monthDict[holidayMonth])
                // holiday = findClosestHoliday(currentDate, dates);


                if (holiday !== 'none') {
                    const foundHolidays = holidays.filter(h => h.date === holiday);
                    console.log("Next closest holiday: ", holiday)

                    var mapStartTime = performance.now()

                    const tempHolidayNames = []
                    const tempProvinceNames = []
                    var provinceNamesCounter = 0

                    // map holiday names to div
                    foundHolidays.forEach((holiday, index) => {
                        tempHolidayNames.push(
                            <div key={index} className='div-holidayName'>
                                <h2 className='holidayName'>{holiday.nameEn}</h2>
                            </div>
                        );

                        // map province names to div
                        tempProvinceNames.push(
                            <div className='provinceName' key={`provinceNames${+provinceNamesCounter}`}>
                                <ul key={`province-list`}>
                                    {holiday.provinces.map((province, provinceIndex) => {
                                        console.log("Mapping provinces: ", province.nameEn)
                                        return (
                                            <li id={provinceIndex} key={`province+${provinceIndex}`} className={`province-${province.id}`}>
                                                <h3>
                                                    {province.nameEn}
                                                </h3>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )
                        provinceNamesCounter += 1

                    })

                    setHolidayNames(tempHolidayNames)
                    setProvinceNames(tempProvinceNames)

                    var mapEndTime = performance.now()
                    console.log(`Map time: ${mapEndTime - mapStartTime} milliseconds`)

                    // just a comprison to a for loop for fun
                    // var forStartTime = performance.now()
                    // for (let i = 0; i < foundHolidays.length; i++) {
                    //     console.log(`Holiday name: ${foundHolidays[i]['nameEn']}`)
                    //     const provinces = foundHolidays[i]['provinces']


                    //     for (let p = 0; p < provinces.length; p++) {
                    //         console.log(`Province(s): ${provinces[p]['nameEn']}`)
                    //     }                        
                    // }
                    // var forEndTime = performance.now()

                    // console.log(`For loop time: ${forEndTime - forStartTime} milliseconds`)

                } else {
                    console.log("Unfortunately there are no holidays left :(")
                }
            }
        }

    }, [data]);

    const [animationEnabled, setAnimationEnabled] = useState(true);
    const toggleAnimation = () => {
        console.log("Goose no longer flying")
        setAnimationEnabled(!animationEnabled);
    }

    const [gooseAlive, setGooseAlive] = useState(true);
    const toggleGoose = () => {
        setGooseAlive(false)
    }
    return (
        <div className='mainText'>
            {
                gooseAlive ? 
                    <div className={`${animationEnabled ? 'goose-fly' : 'goose'}`}>
                        <img src={goosePic} alt='Honk honk'/>
                    </div>
                :
                    null
            }
            {
                holidayNames ? (
                    <div className='mainText'>
                        { 
                            // multipleHolidays ? <h4>The upcoming holidays are </h4> :  <h4>The upcoming holiday is </h4>                
                            <h1 className='dateText'>Next holiday: {monthDict[holidayMonth]} {holidayDate}</h1>
                        }

                        {
                        holidayNames.map((holiday, index) => (                            
                            <div key={index} className='mainText'>
                                <div> {holiday} </div>
                                <h4>Happening in:</h4>
                                <div> {provinceNames[index]} </div>
                            </div>
                        ))
                    } 
                    </div>
                ) : (
                    <div>There is no holiday</div>
                )
            }

            <br/>

            <div className='buttonGroup'>
                <Button className='gooseBtn' disabled={gooseAlive ? false : true} onClick={toggleAnimation}>{animationEnabled ? 'Stop the goose': 'Activate the goose'}</Button>
                <Button classNAme='gooseBtn' variant='danger' disabled={gooseAlive ? false : true} onClick={toggleGoose}>{gooseAlive ? 'Kill the goose': 'Goose dead'}</Button>
            </div>

            <br/>
            <br/>

            <div className='mainText'>
                <div>Data retrieved from https://canada-holidays.ca/api</div>
                <div>Images:
                    {'\t'} 
                    <a href='https://pngimg.com/image/20526'>Goose</a>
                    {', \t'}
                    <a href='https://www.animationsoftware7.com/gif/leaf-fall/maple-red/'>Background</a>
                    {', \t'}
                    <a>Flags from wiki</a>
                </div>
            </div>
            


            {/*
                TODO or never gonna touch this again - do something special if today is the holiday   
            */}
            {/* {
                todayHoliday ? 
                    <div className='mainText'>Special effects because it's the holiday</div>
                :
                    <div className='mainText'>No special effects</div>
            } */}
        </div>
    );
}

export default Home;
