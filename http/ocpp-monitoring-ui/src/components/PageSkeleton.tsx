import { ReactNode } from 'react'
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { EventsNotifier } from './EventsNotifier';

export const PageSkeleton = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <NavBar></NavBar>
      <EventsNotifier></EventsNotifier>
      {children}
      <Footer></Footer>
    </div>
  );
}