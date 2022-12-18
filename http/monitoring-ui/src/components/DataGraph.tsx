import { PlotData } from "plotly.js";
import React from "react";
import Plot, { PlotParams } from 'react-plotly.js';
import { ChargePointLatency } from "../models/ChargePoint";
import { AvailableProtocols, SocketListener } from "../models/SocketListener";

export interface DataGraphProps {
  socketListener: SocketListener
}

export interface DataGraphState {
  data: Partial<PlotData>[]
}


export class DataGraph extends React.Component<DataGraphProps, DataGraphState> {

  private socketListener: SocketListener

  private currentMinute:number = new Date().getMinutes();
  private latenciesInMinute: number[] = []

  state: Readonly<DataGraphState> = {
    data: [
      {
        x: [],
        y: [],
        type: 'scatter',
        mode: 'lines+markers',
        marker: {color: 'red'},
      }
    ]
  }

  constructor(props: DataGraphProps) {
    super(props);
    this.socketListener = props.socketListener;
  }

  componentDidMount(): void {
    this.socketListener.addHandler(AvailableProtocols.CpHeartbeat, (cpHeartbeat: ChargePointLatency) => {
      let currentMin = new Date().getMinutes();
      if (this.currentMinute !== currentMin) {
        this.currentMinute = currentMin;
        let updatedData = (this.latenciesInMinute.reduce((accum, current) => accum + current, 0) / this.latenciesInMinute.length) * 1_000_0
        console.log(`Datos actuales: ${updatedData}`)
        this.latenciesInMinute = []
        this.setState((prevState) => {
          (prevState.data[0].x as any[]) = [...(prevState.data[0].x as any[]), currentMin];
          (prevState.data[0].y as any[]) = [...(prevState.data[0].y as any[]), updatedData];
          console.dir(prevState.data[0])
          return prevState
        })
      }else {
        this.latenciesInMinute.push(Number(cpHeartbeat.latency))
      }
    })
  }

  render() {
      return (
        <Plot
          data={this.state.data}
          layout={{width: 320, height: 320, xaxis: { title: 'Time'}, yaxis: { title: 'Mean latency'}}}
        />
      );
    }
}