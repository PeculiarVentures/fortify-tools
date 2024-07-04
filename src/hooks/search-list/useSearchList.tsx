import { useEffect, useState } from "react";
import { CertificateProps } from "../../types";

export function useSearchList(certificates: CertificateProps[]) {
  const searchParams = new URLSearchParams(window.location.search);

  const [searchedText, setSearchedText] = useState(
    searchParams.get("search") || ""
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

  return {
    searchedText,
    list: searchedText
      ? certificates.filter(({ label }) =>
          label?.toLocaleLowerCase().includes(searchedText.toLocaleLowerCase())
        )
      : certificates,
    handleSearch,
  };
}
