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

    useEffect(() => {
        if (data) {
            console.log("Data updated: ", data);
        }
    }, [data]);
    
    return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sunday</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
            </tr>
          </thead>

          <tbody>
            {/* <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan={2}>Larry the Bird</td>
              <td>@twitter</td>
            </tr> */}
          </tbody>

        </Table>
      );
}

export default Home;