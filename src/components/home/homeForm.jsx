// this component is a simple API call without the need of state management

// perform API call to get holidays
// structure:
//  { }
    // implement table that contains checks for each holiday
import axios from 'axios';
import { useEffect, useState } from 'react';

import { Table } from 'react-bootstrap';
 
const Home = () => {

    const [data, setData] = useState(null)
    const [dates, setDates] = useState([])
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

        // const testYear = 2024;
        // const testMonth = 6;
        // const testDate = 1;
        // console.log(`There are ${getDaysInMonth(testYear, testMonth)} days in ${testMonth}`)
        // console.log(`${testDate}/${testMonth}/${testYear} is a ${zellersCongruence(testDate, testMonth, testYear)}`);
    }, [])

    useEffect(() => {
        if (data) {
            console.log("Data updated: ", data);

            console.log("Adding dates")

            const holidays = data['holidays']
            const holidaysLength = Object.keys(holidays).length
            var tempDates = []

            // it'd be cool to be able to vectorize this operation
            for (let i = 0; i < holidaysLength; i++) {
                tempDates.push(holidays[i]['date'])
            }

            setDates(tempDates)
        }
    }, [data]);

    // perform binary search for date
    // returns the last searched index if the date is not found (which is the closest upcoming holiday)
    const findClosestHoliday = (date) => {
        var left = 0
        console.log("dates test: ", dates)
        var right = dates.length - 1

        console.log("right: ", right)
        var mid = Math.floor((left + right)/2)
        var mid = ~~((left + right) / 2)
        console.log("Mid: ", mid)

        while (left <= right) {
            // mid = Math.floor((left + right)/2)
            mid = ~~((left + right) / 2)
            if (date === dates[mid]) {
                return dates[mid]
            } else if (date > dates[mid]) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }

        console.log("Returning this index: ", mid+1)
        return dates[mid + 1]

    }
    // after dates are updated, perform binary search to find the closest date
    // if a date is found, that means today is a holiday
    // if a date is not found, then the next holiday is the upcoming holiday
        // edge case where date is not found and it is at the end of the array
    useEffect(() => {
        if (dates) {
            // get today's date
            let currentDate = new Date()
            console.log(`Current date: ${currentDate.toISOString().split('T')[0]}`)

            // perform binary search on date
            const holiday = findClosestHoliday(currentDate)
            console.log("The date for the holiday is: ", holiday)
        }
    }, [dates])

    // functions for populating calendar 

    // check for leap year
    const isLeapYear = (year) => {
        if ((year % 4 === 0 && year % 100 != 0) || (year % 400 === 0)) {
            return True
        }
        return False
    }

    // get the number of days in the month
    const getDaysInMonth = (year, month) => {
        
        // february case
        if (month === 2){
            return isLeapYear(year) ? 29 : 28
        }

        // months with 30 days
        const smallMonths = [4, 6, 9, 11]
        if (smallMonths.includes(month)) {
            return 30
        }

        // default case is month with 31 days
        return 31
    }

    // use zeller's congruence to find which day the 1st belongs to
    const zellersCongruence = (day, month, year) => {

        if (month == 1)
        {
            month = 13;
            year--;
        }
        if (month == 2)
        {
            month = 14;
            year--;
        }
        let q = day;
        let m = month;
        let k = year % 100;
        let j = parseInt(year / 100, 10);
        let h = q + parseInt(13 * (m + 1) / 5, 10) + k + parseInt(k / 4, 10) + parseInt(j / 4, 10) + 5 * j;
        h = h % 7;
        switch (h)
        {
            case 0 : 
              return ('saturday')
            //   break;
                       
            case 1 : 
                return ('sunday')
                // document.write("Sunday");
                // break;
                       
            case 2 : 
                return ('monday')
                // document.write("Monday");
                // break;
                       
            case 3 : 
                return ('tuesday')
                // document.write("Tuesday");
                // break;
                       
            case 4 : 
                return ('wednesday')
                // document.write("Wednesday");
                // break;
                       
            case 5 : 
                return ('thursday')
                // document.write("Thursday");
                // break;
                       
            case 6 : 
                return ('friday')
                // document.write("Friday");
                // break;
        }
    }
    return (
        <>
        </>
    )
}

export default Home;

    // return (
    //     <Table striped bordered hover>
    //       <thead>
    //         <tr>
    //           <th>Sunday</th>
    //           <th>Monday</th>
    //           <th>Tuesday</th>
    //           <th>Wednesday</th>
    //           <th>Thursday</th>
    //           <th>Friday</th>
    //           <th>Saturday</th>
    //         </tr>
    //       </thead>

    //       <tbody>
    //         {/* <tr>
    //           <td>1</td>
    //           <td>Mark</td>
    //           <td>Otto</td>
    //           <td>@mdo</td>
    //         </tr>
    //         <tr>
    //           <td>2</td>
    //           <td>Jacob</td>
    //           <td>Thornton</td>
    //           <td>@fat</td>
    //         </tr>
    //         <tr>
    //           <td>3</td>
    //           <td colSpan={2}>Larry the Bird</td>
    //           <td>@twitter</td>
    //         </tr> */}
    //       </tbody>

    //     </Table>
    //   );