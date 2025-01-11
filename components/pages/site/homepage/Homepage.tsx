import dynamic from "next/dynamic";

const Loading = () => <div>Loading...</div>;

const Hero = dynamic(() => import("./components/hero/Hero"), { loading: () => <Loading /> });
const PopularClinics = dynamic(() => import("./components/ClientTestiminial"), { loading: () => <Loading /> });
const Treatment = dynamic(() => import("./components/hero/Treatment"), { loading: () => <Loading /> });
const Treatments = dynamic(() => import("./components/Treatments"), { loading: () => <Loading /> });
const Banner = dynamic(() => import("./components/banner/Banner"), { loading: () => <Loading /> });
const Services = dynamic(() => import("./components/Services"), { loading: () => <Loading /> });
const Testiminials = dynamic(() => import("./components/Testimonials"), { loading: () => <Loading /> });
const BlogSection = dynamic(() => import("./components/OurBlog"), { loading: () => <Loading /> });
const MissionSection = dynamic(() => import("./components/Mission"), { loading: () => <Loading /> });

const Homepage = () => {
  return (
    <div>
      <Hero />
      <PopularClinics />
      <Services />
      <Treatments />
      <Banner />
      <Testiminials />
      <BlogSection />
      <MissionSection />
    </div>
  );
};

export default Homepage;
