import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import AboutTheme from "@/components/sections/about/AboutTheme";
import TheAlpagoV2Background from "@/components/sections/about/TheAlpagoV2Background";
import TheAlpagoV2Hero from "@/components/sections/about/TheAlpagoV2Hero";
import TheAlpagoV2Story from "@/components/sections/about/TheAlpagoV2Story";
import TheAlpagoV2Performance from "@/components/sections/about/TheAlpagoV2Performance";
import TheAlpagoV2ManifestoPeople from "@/components/sections/about/TheAlpagoV2ManifestoPeople";
import TheAlpagoV2Principles from "@/components/sections/about/TheAlpagoV2Principles";
import ActEvents from "@/components/sections/about/ActEvents";
import TheAlpagoV2Awards from "@/components/sections/about/TheAlpagoV2Awards";
import TheAlpagoV2Closing from "@/components/sections/about/TheAlpagoV2Closing";
import SiteFooter from "@/components/sections/SiteFooter";

export default function TheAlpagoV2() {
  return (
    <>
      <Preloader />
      <Nav />
      <AboutTheme />
      <main className="relative min-h-screen">
        <TheAlpagoV2Background />
        <div className="relative -mt-[100vh]">
          <TheAlpagoV2Hero />
          <TheAlpagoV2Story />
          <TheAlpagoV2Performance />
          <TheAlpagoV2ManifestoPeople />
          <TheAlpagoV2Principles />
          <ActEvents compactEnding transparentBackground fadeIn />
          <TheAlpagoV2Awards />
          <TheAlpagoV2Closing />
          <div className="relative z-20">
            <SiteFooter />
          </div>
        </div>
      </main>
    </>
  );
}
