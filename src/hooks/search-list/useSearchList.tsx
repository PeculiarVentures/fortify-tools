import { useEffect, useMemo, useState } from "react";
import { ICertificateRequest } from "@peculiar/fortify-client-core";
import { getCertificateName } from "../../utils/certificate";
import { CertificateProps } from "../../types";

export function useSearchList(
  certificates: (CertificateProps | ICertificateRequest)[]
) {
  const [searchedText, setSearchedText] = useState(
    new URLSearchParams(window.location.search).get("search") || ""
  );

  const handleSearch = (text: string) => {
    const url = new URL(window.location.href);

    if (text?.length) {
      url.searchParams.set("search", text);
    } else {
      url.searchParams.delete("search");
    }

    window.history.pushState(null, "", url);
    setSearchedText(text);
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      setSearchedText(searchParams.get("search") || "");
    };

    window.addEventListener("popstate", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  const list = useMemo(
    () =>
      searchedText
        ? certificates.filter((certificate) =>
            getCertificateName(certificate as CertificateProps)
              ?.toLocaleLowerCase()
              .includes(searchedText.toLocaleLowerCase())
          )
        : certificates,
    [searchedText, certificates]
  );

  return {
    searchedText,
    list,
    handleSearch,
  };
}
