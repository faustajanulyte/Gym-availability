import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, } from 'recharts';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import en from 'date-fns/locale/en-GB';
import './App.css';
registerLocale('en-GB', en)

function App() {

  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await axios.get(`https://65h5ql32ll.execute-api.eu-west-1.amazonaws.com/dev/capacity`);
    const data = response.data;
    data.sort(function (a, b) {
      return a.time - b.time;
    });
    let options = { hour: 'numeric', minute: 'numeric' }
    data.forEach(element => {
      element.time = new Date(+element.time).toLocaleDateString("en-US", options)
    });
    setData(data);
    setGraphData(data);
  };

  const setDay = (date) => {
    date.setHours(0, 0, 0, 0);
    let dateEpoch = date.getTime();

    let filteredData = data.filter(record => {
      let recordDate = new Date(record.time).getTime();
      if (recordDate >= dateEpoch && recordDate <= (dateEpoch + 86400000)) {
        return true;
      }
    })

    setStartDate(date);
    setGraphData(filteredData);
  };

  const averageCapacity = () => {
    let count = 0;
    graphData.forEach(element => {
      count += parseInt(element.capacity);
    });
    console.log(count);
    let average = count / graphData.length;
    return (
      <>
        {average.toFixed(2)}
      </>
    )
  }

  const ExampleCustomInput = ({ value, onClick }) => (
    <button className="example-custom-input" onClick={onClick}>
      {value}
    </button>
  );

  return (
    <div>
      <h1 className="title">Village Gym Bristol capacity</h1>
      <div className="app-react-datepicker-wrapper">
        <DatePicker
          dateFormat="dd/MM/yyyy"
          locale="en-GB"
          selected={startDate}
          onChange={date => setDay(date)}
          customInput={<ExampleCustomInput />}
        />
      </div>
      <div className="area-chart-wrapper">
        <AreaChart
          width={1000}
          height={400}
          data={graphData}
          margin={{
            top: 0, right: 0, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time"
            textAnchor="middle"
            height="50"
            />
          <YAxis type="number" domain={[0, 100]} />
          <Tooltip />
          <Area type="monotone" dataKey="capacity" stroke="#97D700" fill="#97D700" activeDot={{ r: 8 }} />
        </AreaChart>
      </div>
      <p className="average">Average capacity in the gym was {averageCapacity()}</p>
    </div>
  );
}

export default App;