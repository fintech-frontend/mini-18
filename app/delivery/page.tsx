import { deliveryData } from "@/data/delivery"; // O'zingiz saqlagan ma'lumotlar fayli
import { styles } from "@/styles/index.styles";
import DeliverySidebar from "./DeliverySidebar";
import DeliveryGallery from "./DeliveryGallery";
import DeliveryDataMap from "./DeliveryDataMap";

export default function DeliveryPage() {
  return (
    <section
      className={`${styles.container} py-6 md:py-8`}
    >
      {/* Navigatsiya (Breadcrumb) */}
      <nav className="mb-4 md:mb-6 text-xs md:text-sm text-gray-400">
        <a href="/" className="hover:text-blue-600 transition-colors">
          Стройоптторг
        </a>{" "}
        / <span className="text-gray-800">Доставка</span>
      </nav>

      {/* Sarlavha */}
      <h1 className="mb-6 md:mb-8 text-[28px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#2C333D] leading-tight">
        {deliveryData.header.title}
      </h1>

      {/* Asosiy Layout: Ma'lumotlar + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_330px] gap-8 items-start">
        {/* Chap taraf: Matnli ma'lumotlar */}

        <DeliveryDataMap/>

        <DeliverySidebar/>
      </div>

      <DeliveryGallery/>
    </section>
  );
}
