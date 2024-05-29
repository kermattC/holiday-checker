// this component is a simple API call without the need of a redux store
// make an api call, get the data, save the data and do something with it
// this gets a list of holidays in canada. Then finds the closest holiday
// If today is a holiday, the holiday today will be returned
    // otherwise, return the next closest holiday (searches via binary search)

import axios from 'axios';
import { useEffect, useState } from 'react';
 
const Home = () => {

    const [data, setData] = useState(null)
    const [holidayNames, setHolidayNames] = useState([])
    const [provinceNames, setProvinceNames] = useState([])

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
                // holiday = findClosestHoliday('2024-06-25', dates);
                holiday = findClosestHoliday(currentDate, dates);


                if (holiday !== 'none') {
                    const foundHolidays = holidays.filter(h => h.date === holiday);
                    console.log("Next closest holiday: ", holiday)

                    var mapStartTime = performance.now()

                    // map holiday names to div
                    const holidayNames = foundHolidays.map((holiday, index) => {

                        // map province names to div (using the previous map since the provinces are nested within each object)
                        const tempProvinceNames = holiday.provinces.map((province, provinceIndex) => {
                            console.log("Mapping provinces: ", province.nameEn)

                            return (
                                <div key={provinceIndex} className='provinceName'>
                                    {province.nameEn}
                                </div>
                            )
                        })

                        console.log("temp province names: ", tempProvinceNames)

                        return ([
                            <div key={index} className='holidayName'>
                                <h2>{holiday.nameEn}</h2>
                            </div>      
                            ,
                            tempProvinceNames                      
                        ])
                    })

                    console.log("holiday names before setting: ", holidayNames[0])
                    setHolidayNames(holidayNames[0])
                    setProvinceNames(holidayNames[1])


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

    return (
        <>
            {holidayNames ? holidayNames : <div>No holidays found</div>}
            {provinceNames ? provinceNames : <div>No provinces found</div>}

        </>
    );
}

export default Home;
