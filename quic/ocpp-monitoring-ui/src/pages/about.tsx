import { PageSkeleton } from '../components/PageSkeleton';

const About = () => {
  return (
    <PageSkeleton>
      <div className="container mt-4">
      <h1>About OCPP Monitoring</h1>
      <p>
        OCPP Monitoring is an application designed to monitor the network with Charge Points and Central systems.
        This app is created as part of a TFG (Trabajo Fin de Grado) by Fernando Astorga, a student at the UMA (Universidad de Málaga).
      </p>
      <p>
        The goal of this application is to provide a user-friendly interface for monitoring and managing the charging infrastructure,
        helping to track the status and performance of Charge Points and Central systems in real-time.
      </p>
      <p>
        If you have any questions or feedback, please contact Fernando Astorga at fernando.astorga@example.com.
      </p>
    </div>
    </PageSkeleton>
  );
};

export default About;