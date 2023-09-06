import Image from "next/image";
import styles from "@styles/components/Intro.module.scss";
import { sign } from 'crypto';
import { signIn } from 'next-auth/react';

export default function Hero() {
  return (
    <div className="px-4 py-5 my-5 text-center">
    <Image className="d-block mx-auto mb-4" src="/favicon.ico" alt="" width="72" height="72"/>
    <h1 className="display-5 fw-bold">OCPP Monitoring</h1>
    <div className="col-lg-6 mx-auto">
      <p className="lead mb-4">Enables the user to monitor any ChargePoint connected to the network in real-time. The user can view the status of the ChargePoint, it&apos;s location and the users that view them.</p>
      <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <button type="button" className="btn btn-primary btn-lg px-4 gap-3" onClick={() => signIn(undefined, { callbackUrl: '/chargepoints'})}>Sign In</button>
      </div>
    </div>
  </div>
  )
  return (
    <section aria-labelledby="section1-title" className={styles.main}>
    <Image
      width={720}
      height={534}
      src="/illustration-intro.png"
      alt=""
      objectFit="contain"
      priority
    />
    <h1 id="section1-title">
      Monitor any ChargePoint connected to the network in real-time!
    </h1>
    <p>
      OCPP Monitoring enables the user to monitor any ChargePoint connected to the network in real-time. The user can view the status of the ChargePoint, it&apos;s location and the users that view them.
    </p>
    <button type="button" onClick={() => signIn(undefined, { callbackUrl: '/chargepoints'})}>Log In</button>
  </section>
  )
}