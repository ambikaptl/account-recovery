import AccountRecovery from "@/components/AccountRecovery/AccountRecovery";
import {
  getAccountRecoveryDetails,
  isPreview,
} from "@/lib/contentstack";
import AccountRecoveryPreview from "@/components/AccountRecovery/AccountRecoveryPreview";
import fallbackEntry from "@/components/AccountRecovery/accountrecovery_details-bltf6b3f8e09f0a972a.json";

export default async function AccountRecoveryPage() {
  const entry = (await getAccountRecoveryDetails()) ?? fallbackEntry;

  if (isPreview) {
    return <AccountRecoveryPreview initialEntry={entry} />;
  }

  return <AccountRecovery data={entry} />;
}
