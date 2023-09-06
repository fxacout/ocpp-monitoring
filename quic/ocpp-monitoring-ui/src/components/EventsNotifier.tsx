import Notiflix from 'notiflix';
import { useEffect } from 'react';
import { socketServiceInstance } from '../service/SocketService';

export const EventsNotifier = () => {
  useEffect(() => { 
    socketServiceInstance.addUserHandler((data) => {
      Notiflix.Notify.info(`User ${data.name} logged in`);
    });
  }, []);
  return (
    <div>
    </div>
  )
};