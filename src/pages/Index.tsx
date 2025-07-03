
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Features from "../components/Features";
import NewestDesigns from "../components/NewestDesigns";
import CallToAction from "../components/CallToAction";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <NewestDesigns />
      <CallToAction />
    </div>
  );
};

export default Index;
