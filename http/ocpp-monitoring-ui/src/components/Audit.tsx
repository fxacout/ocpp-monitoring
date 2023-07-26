import React, { useState } from "react";
import { AuditElement } from "./AuditElement";
import { socketServiceInstance } from "@/service/SocketService";
import { Container, Row } from 'react-bootstrap';

export function Audit() {
  const [usersAuditInfo, setUsersAuditInfo] = useState<{time: string, name: string}[]>([])

  socketServiceInstance.addUserHandler((user) => {
    console.dir(user)
    setUsersAuditInfo((oldValue) => {
      const date = new Date()
      const newValue = {
        name: user.name || user.email || 'Test',
        time: `${date.getHours()}:${date.getMinutes()}`
      }
      if (oldValue.find((elem) => elem.name === newValue.name && elem.time === newValue.time)) {
        return oldValue
      }
      oldValue.unshift(newValue)
      return oldValue.slice(0, 10)
    })
  })

  return (
    <Container>
      <Row>
        <h3>Audit Table</h3>
      </Row>
      <Row>
      <div className="table-wrapper-scroll-y my-custom-scrollbar">

  <table className="table table-bordered table-striped mb-0">
    <thead className='thead-dark'>
      <tr>
        <th scope="col">Date</th>
        <th scope="col">Username</th>
        <th scope="col">Device</th>
      </tr>
    </thead>
    <tbody>
    {...usersAuditInfo.map((elem, index) => (
          <tr key={elem.time}>
            <th scope="row">{elem.time}</th>
            <td><a href={`/user/${elem.name}`}>{elem.name}</a></td>
            <td>Device</td>
          </tr>
        ))}
    </tbody>
  </table>

</div>  
      </Row>
    </Container>
  )


  return (
    <div className="overflow-y-auto h-screen">
      {/*<!-- Component: Colored Activity feed --> */}
      <ul
        aria-label="Colored activity feed"
        role="feed"
        className="relative flex flex-col gap-12 py-12 pl-6 before:absolute before:top-0 before:left-6 before:h-full before:-translate-x-1/2 before:border before:border-dashed before:border-slate-200 after:absolute after:top-6 after:left-6 after:bottom-6 after:-translate-x-1/2 after:border after:border-slate-200 "
      >
        {...usersAuditInfo.map((elem, index) => (
          <AuditElement text={`User: ${elem.name} logged in`} time={elem.time} key={index}></AuditElement>
        ))}
      </ul>
      {/*<!-- End Colored Activity feed --> */}
    </div>
  );
}
