import CallToAction from "@/components/modules/Home/CallToAction";
import Hero from "@/components/modules/Home/Hero";
import HowItWorks from "@/components/modules/Home/HowItWorks";
import ServiceHighlights from "@/components/modules/Home/ServiceHighlights";
import Testimonials from "@/components/modules/Home/Testimonials";


const Homepage = () => {
    return (
        <div>
            <Hero></Hero>
            <HowItWorks></HowItWorks>
            <ServiceHighlights></ServiceHighlights>
            <Testimonials></Testimonials>
            <CallToAction></CallToAction>
        </div>
    );
};

export default Homepage;