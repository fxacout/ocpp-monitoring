import Hero from '../components/Hero';
import { NavBar } from '../components/NavBar';
import { PageSkeleton } from '../components/PageSkeleton';


const Intro = () => (
  <div>
    <PageSkeleton>
    <Hero></Hero>
    </PageSkeleton>
  </div>
);

export default Intro;
