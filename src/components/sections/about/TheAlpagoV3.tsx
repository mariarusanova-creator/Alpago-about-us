import Preloader from "@/components/Preloader";
import StandaloneNav from "@/components/StandaloneNav";
import AboutTheme from "@/components/sections/about/AboutTheme";
import TheAlpagoV2Background from "@/components/sections/about/TheAlpagoV2Background";
import TheAlpagoV3Hero from "@/components/sections/about/TheAlpagoV3Hero";
import TheAlpagoV2Story from "@/components/sections/about/TheAlpagoV2Story";
import TheAlpagoV3Performance from "@/components/sections/about/TheAlpagoV3Performance";
import TheAlpagoV2ManifestoPeople from "@/components/sections/about/TheAlpagoV2ManifestoPeople";
import TheAlpagoV2Principles from "@/components/sections/about/TheAlpagoV2Principles";
import ActEvents from "@/components/sections/about/ActEvents";
import TheAlpagoV2Awards from "@/components/sections/about/TheAlpagoV2Awards";
import TheAlpagoV2Closing from "@/components/sections/about/TheAlpagoV2Closing";
import StandaloneFooter from "@/components/StandaloneFooter";

export default function TheAlpagoV3() {
  return (
    <>
      <Preloader />
      <StandaloneNav />
      <AboutTheme />
      <main className="relative min-h-screen">
        <TheAlpagoV2Background />
        <div className="relative -mt-[100vh]">
          <TheAlpagoV3Hero />
          <TheAlpagoV2Story />
          <TheAlpagoV3Performance />
          <TheAlpagoV2ManifestoPeople />
          <TheAlpagoV2Principles />
          <ActEvents compactEnding transparentBackground fadeIn />
          <TheAlpagoV2Awards />
          <TheAlpagoV2Closing />
          <div className="relative z-20">
            <StandaloneFooter />
          </div>
        </div>
      </main>
    </>
  );
}
