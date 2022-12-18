import React from "react";
import { ChargePointLatency } from "../models/ChargePoint";
import { AvailableProtocols, SocketListener } from "../models/SocketListener";
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';

interface DataTableProps {
    socketListener: SocketListener
}

interface DataTableState {
    data: any[]
}


export class DataTable extends React.Component<DataTableProps, DataTableState>{
    state: Readonly<DataTableState> = {
        data: []
    }

    componentDidMount(): void {
        this.props.socketListener.addHandler(AvailableProtocols.CpHeartbeat, (cpHeartbeat: ChargePointLatency) => {
            this.setState((oldState) => {
                if (oldState.data.find((elem) => elem.id === cpHeartbeat.id)) {
                    oldState.data[oldState.data.indexOf(oldState.data.find((elem) => elem.id === cpHeartbeat.id))] = {
                        id: cpHeartbeat.id,
                        latency: cpHeartbeat.latency
                    }
                }
                else {
                    oldState.data.push({
                        id: cpHeartbeat.id,
                        latency: cpHeartbeat.latency
                    })
                }
                return oldState
            })
        })
    }


    render(): React.ReactNode {
        return (
            <MDBTable scrollY>
                <MDBTableHead columns={[
                    {
                        label: 'ChargePoint Id',
                        field: 'id',
                        sort: 'asc'
                    },
                    {
                        label: 'Latency',
                        field: 'latency',
                        sort: 'asc'
                    }
                ]} />
                <MDBTableBody rows={this.state.data} />
            </MDBTable>
        )
    }
}