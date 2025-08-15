"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useTranslation } from "../../../hooks/useTranslation";

interface ViewPasswordPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewPasswordPage({ params }: ViewPasswordPageProps) {
  const { t, locale } = useTranslation();
  const resolvedParams = use(params);

  // States
  const [showPassword, setShowPassword] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [passwordData, setPasswordData] = useState<any>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const token = decodeURIComponent(resolvedParams.id);

  // Fetch password
  useEffect(() => {
    if (hasRequested) return;
    setHasRequested(true);
    setIsLoading(true);

    console.log("Making request for token:", token);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/share/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (response) => {
        console.log("Response status:", response.status);

        if (!response.ok) {
          const translatedError = t("Password Unavailable");
          setError(translatedError);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        if (data && data.password) {
          setPasswordData(data);
        } else {
          setError(t("Password Unavailable"));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Connection error:", err);
        setError(t("Password Unavailable"));
        setIsLoading(false);
      });
  }, [token]);

  // Info messages
  const infoMessages = useMemo(
    () => [
      t("All passwords are encrypted before storage and are only available to those with the secret link."),
      t("Once expired, encrypted passwords are deleted from the database."),
      t("The system ensures maximum security through end-to-end encryption."),
      t("Your data is protected with the highest digital security standards."),
      t("Passwords are generated using secure and random algorithms."),
      t("No personal information is stored on our servers."),
    ],
    [locale]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % infoMessages.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [infoMessages.length]);

  // Copy password
  const copyToClipboard = async () => {
    if (passwordData?.password) {
      try {
        await navigator.clipboard.writeText(passwordData.password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Error copying:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t("This is the password that was shared with you")}
              </h2>
              <p className="text-sm text-gray-600">
                {t("Click on the password to view it or on the button to copy")}
              </p>
            </div>

            {/* Password Display */}
            {error ? (
              <div className="text-center text-red-600 font-semibold py-6">
                {t("Password Unavailable")}
              </div>
            ) : passwordData ? (
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 p-4 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.password}
                    readOnly
                    className="w-full font-mono text-lg text-center cursor-pointer focus:outline-none bg-transparent text-gray-900"
                    placeholder="••••••••••••••••"
                  />
                </div>
                <button
                  onClick={copyToClipboard}
                  disabled={copied}
                  className="px-4 py-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 border border-gray-300"
                >
                  {copied ? "✓" : t("Copy")}
                </button>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">{t("Loading...")}</div>
            )}

            {/* Expiration Info */}
            {passwordData && (
              <div className="text-center space-y-2">
                <p className="text-orange-600 font-medium">
                  {t("This password will be available until")}{" "}
                  {new Date(passwordData.expire_at).toLocaleString(locale === "en" ? "en-US" : locale, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  {t("or for")} {passwordData.views_left} {t("more views.")}
                </p>
                <p className="text-sm text-gray-600">
                  {t("Created on:")}{" "}
                  {new Date(passwordData.created_at).toLocaleString(locale === "en" ? "en-US" : locale, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <div className="pt-2">
                  <p className="text-sm text-gray-600">
                    {t("If you want to revoke access to this password, click")}{" "}
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                      {t("Revoke")}
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Info Messages */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">{infoMessages[currentMessageIndex]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
