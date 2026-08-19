"use client";

import BlurText from "@/components/BlurText";
import Reveal from "@/components/Reveal";
import MediaLayer from "@/components/MediaLayer";

/** The emotional peak — big centered statement over the terrace bed. */
export default function Residence() {
  return (
    <>
      <section id="residence" className="relative py-[20vh]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <BlurText
            as="h2"
            className="display max-w-4xl"
            brightness={3}
            blur={16}
            children={"Your residence should be the finest expression of your standards. Nothing less."}
          />
          <div className="mt-12 md:ml-auto md:max-w-md md:pl-12">
            <Reveal>
              <p className="text-[15px] leading-relaxed text-ink-dim">
                The finest homes are defined by the conviction behind every
                decision. At Alpago, every residence begins with a single
                question — what becomes possible when nothing is compromised?
                The answer is more than a home. It is an enduring asset, a
                lasting expression of personal identity, and a benchmark for
                exceptional living.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="relative h-screen w-full overflow-hidden">
        <MediaLayer video="lounge2" overlay={0.2} parallax={22} />
      </div>
    </>
  );
}
