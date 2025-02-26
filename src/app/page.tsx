import cityImg from "public/city.jpg";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <Hero
      imgData={cityImg}
      imgAlt="cityscape"
      title="Welcome to the City Builder"
    />
  );
}
