import { Hero } from "@/components/marketplace/hero";
import { FeeNoticeModal } from "@/components/marketplace/fee-notice-modal";
import { HomeSections } from "@/components/marketplace/home-sections";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <HomeSections />
      <FeeNoticeModal />
      <MobileTabBar />
    </>
  );
}
