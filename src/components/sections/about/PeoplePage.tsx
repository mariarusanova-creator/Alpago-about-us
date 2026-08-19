import PeopleVisionariesCards from "./PeopleVisionariesCards";
import PeopleAssetsStatement from "./PeopleAssetsStatement";
import PeopleHero from "./PeopleHero";
import PeopleGalleryMosaicSlider from "./PeopleGalleryMosaicSlider";

export default function PeoplePage() {
  return (
    <div className="section-bg relative w-full" style={{ overflowX: "clip" }}>
      <main className="relative z-10 mx-auto w-full max-w-[1320px] px-6 md:px-14">
        <PeopleHero />

        <PeopleAssetsStatement />

        <PeopleVisionariesCards />

        <PeopleAssetsStatement
          id="guardians"
          lines={["The People Behind Alpago Are", "the Guardians of Its Standards"]}
          body="The standards that define Alpago are not upheld by processes alone. They are upheld by people."
          preserveContentOnExit
        />
      </main>

      <PeopleGalleryMosaicSlider />
    </div>
  );
}
