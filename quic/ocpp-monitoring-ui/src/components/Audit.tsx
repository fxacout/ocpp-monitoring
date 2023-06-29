import React, { useState } from "react";
import { AuditElement } from "./AuditElement";
import { socketServiceInstance } from "@/service/SocketService";

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
