import React, { PureComponent } from 'react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,} from 'recharts';
import axios from 'axios';

export default class Example extends PureComponent {
  state = {
    data: []
  }

  componentDidMount() {
    axios.get(`https://65h5ql32ll.execute-api.eu-west-1.amazonaws.com/dev/capacity`)
      .then(res => {
        const data = res.data;
        data.sort(function(a, b) {
          return a.time - b.time;
        });
        let options = { hour: 'numeric', minute: 'numeric'}
        data.forEach(element => {
          element.time = new Date(+element.time).toLocaleDateString("en-US", options)
        });
        this.setState({ data });
        console.log(data)
      })
  }
    render() {
      return (
        <AreaChart
          width={1000}
          height={400}
          data={this.state.data}
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" angle={-45} textAnchor="end" height="120"/>
          <YAxis type="number" domain={[0, 100]}/>
          <Tooltip />
          <Area type="monotone" dataKey="capacity" stroke="#8884d8" fill="#8884d8" activeDot={{ r: 8 }}/>
        </AreaChart>
      );
    }
  }