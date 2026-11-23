"use client";

import ContentstackLivePreview from "@contentstack/live-preview-utils";
import { useCallback, useEffect, useState } from "react";
import AccountRecovery from "./AccountRecovery";
import {
  getAccountRecoveryDetails,
  initLivePreview,
} from "@/lib/contentstack";

export default function AccountRecoveryPreview({
  initialEntry,
}: {
  initialEntry?: Record<string, unknown>;
}) {
  const [entry, setEntry] = useState(initialEntry);

  const refreshEntry = useCallback(async () => {
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW !== "true") {
      return;
    }

    const updatedEntry = await getAccountRecoveryDetails();
    if (updatedEntry) {
      setEntry(updatedEntry);
    }
  }, []);

  useEffect(() => {
    initLivePreview();
    const uid = ContentstackLivePreview.onEntryChange(refreshEntry, {
      skipInitialRender: true,
    });

    return () => {
      ContentstackLivePreview.unsubscribeOnEntryChange(uid);
    };
  }, [refreshEntry]);

  return <AccountRecovery data={entry} />;
}
