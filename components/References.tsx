import type { Dictionary } from "@/content/copy";
import type { Counter, ReferenceVideo } from "@/content/data";
import { SectionHead } from "@/components/ui/SectionHead";
import { Rail } from "@/components/ui/Rail";
import { Stats } from "@/components/Stats";
import { ReelCard } from "@/components/ReelCard";
import styles from "./References.module.css";

type Props = { dict: Dictionary; videos: ReferenceVideo[]; counters: Counter[] };

export function References({ dict, videos, counters }: Props) {
  return (
    <section id="referenciak" className={styles.section} aria-labelledby="references-title">
      <div className="container">
        <SectionHead label={dict.references.label} title={dict.references.title} id="references-title" />
        <Stats counters={counters} labels={dict.references.counters} />
      </div>

      <Rail
        label={dict.references.title.replace(/\u00ad/g, "")}
        prevLabel={dict.references.prev}
        nextLabel={dict.references.next}
        singleVideo
      >
        {videos.map((v, i) => (
          <li key={v.id} className={styles.item} data-reveal style={{ "--i": Math.min(i, 4) } as React.CSSProperties}>
            <ReelCard video={v} playLabel={dict.references.play} />
          </li>
        ))}
      </Rail>
    </section>
  );
}
