import { CustomerHeader } from "@/components/customer/header";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CustomerHeader />
      {children}
    </>
  );
}