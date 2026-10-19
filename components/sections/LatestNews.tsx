import { styles } from "@/styles/index.styles";
import LatestNewsGrid from "@/components/news/LatestNewsGrid";

export const LatestNews = () => {
  return (
    <section className="py-6 sm:py-8">
      <div className={styles.container}>
        <LatestNewsGrid variant="compact" />
      </div>
    </section>
  );
};
