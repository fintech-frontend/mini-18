import AboutHero from "@/components/ocompany/AboutHero";
import WhyUs from "@/components/ocompany/WhyUs";
import CompanyHistory from "@/components/ocompany/CompanyHistory";
import LatestNewsGrid from "@/components/news/LatestNewsGrid";

export default function OCompny() {
  return (
    <div className="w-full">
      <div className="w-full">
        <AboutHero />

        <WhyUs />

        <CompanyHistory />

        {/* Yangiliklar API'dan (/api/news/) */}
        <section className="py-12 sm:py-16 lg:py-20">
          <LatestNewsGrid variant="large" />
        </section>
      </div>
    </div>
  );
}
