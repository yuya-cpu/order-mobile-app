import { CustomerShell } from "@/components/customer/shell";
import { NotFoundScreen } from "@/components/customer/not-found-screen";

export default function NotFound() {
  return (
    <CustomerShell>
      <NotFoundScreen />
    </CustomerShell>
  );
}
