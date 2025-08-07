"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useGetResults } from "@/components/dashboard/api/useResults";

export const ThemeProviders = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) => {
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);

  // Move the hook to the top level of the component
  const { data: resultsData, isLoading, error } = useGetResults(id);

  useEffect(() => {
    const fetchThemeData = async () => {
      try {
        // Use the data from the hook instead of calling the hook inside useEffect
        // resultsData is an array, so we need to get the first result's tournament
        const themeData = resultsData?.[0]?.match?.tournament?.selectedTheme;

        if (currentTheme) {
          const existingLink = document.getElementById("dynamic-theme");
          if (existingLink) {
            existingLink.remove();
          }
        }

        if (themeData) {
          const link = document.createElement("link");
          link.id = "dynamic-theme";
          link.rel = "stylesheet";
          link.href = `/themes/${themeData}.css`;
          document.head.appendChild(link);

          setCurrentTheme(themeData);
        } else {
          loadDefaultTheme();
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
        loadDefaultTheme();
      }
    };

    // Only run when resultsData is available and not loading
    if (!isLoading && resultsData) {
      fetchThemeData();
    }
  }, [resultsData, isLoading, currentTheme]);

  const loadDefaultTheme = () => {
    const link = document.createElement("link");
    link.id = "dynamic-theme";
    link.rel = "stylesheet";
    link.href = "/themes/default.css";
    document.head.appendChild(link);
  };

  return (
    <>
      <Head>
        <title>Dynamic Theme App</title>
      </Head>
      <div className="app-container">{children}</div>
    </>
  );
};
