"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "../hooks/useTranslation";

export default function PasswordGenerator() {
  const { t } = useTranslation();

  // States
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [daysAvailable, setDaysAvailable] = useState(1);
  const [maxViews, setMaxViews] = useState(1);
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const infoMessages = [
    t("All passwords are encrypted before storage and are only available to those with the secret link."),
    t("Once expired, encrypted passwords are deleted from the database."),
    t("The system ensures maximum security through end-to-end encryption."),
    t("Your data is protected with the highest digital security standards."),
    t("Passwords are generated using secure and random algorithms."),
    t("No personal information is stored on our servers.")
  ];

  // Rotate info messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % infoMessages.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [infoMessages.length]);

  // Validation
  const validatePassword = (pwd: string) => {
    if (!pwd) setPasswordError("");
    else if (pwd.length < 4) setPasswordError(t("The password must be at least 4 characters."));
    else if (pwd.length > 128) setPasswordError(t("The password cannot be more than 128 characters."));
    else setPasswordError("");
  };

  // Generate random password
  const generatePassword = () => {
    let payload: any = {
      size: length,
      numbers: includeNumbers,
      special_char: includeSymbols,
      views_left: maxViews
    };

    if (daysAvailable > 1) {
      const now = new Date();
      const hoursToAdd = daysAvailable * 24;
      payload.expire_at = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000).toISOString();
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/share/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      const fullLink = `${window.location.origin}/view/${data.token_url}`;
      setShareLink(fullLink);
      setLinkGenerated(true);
    })
    .catch((error) => {
      console.error('Complete error:', error);
      setPasswordError(t('Error generating password. Try again.'));
    });
  };

  // Generate custom password link
  const handleGenerateLink = () => {
    if (!password.trim()) return setPasswordError(t("Please enter a password before generating the link."));
    if (password.length < 4) return setPasswordError(t("The password must be at least 4 characters."));
    if (password.length > 128) return setPasswordError(t("The password cannot be more than 128 characters."));

    setPasswordError("");

    let payload: any = { password, views_left: maxViews };
    if (daysAvailable > 1) {
      const now = new Date();
      const hoursToAdd = daysAvailable * 24 + 1; // extra hour
      payload.expire_at = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000).toISOString();
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/share/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error (custom password):', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      const fullLink = `${window.location.origin}/view/${data.token_url}`;
      setShareLink(fullLink);
      setLinkGenerated(true);
    })
    .catch((error) => {
      console.error('Complete error (custom password):', error);
      setPasswordError(t('Error generating link. Try again.'));
    });
  };

  const resetForm = () => {
    setLinkGenerated(false);
    setShareLink("");
    setPassword("");
    setCopied(false);
    setPasswordError("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render
  if (linkGenerated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t("Use this link to share the password:")}
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded text-sm font-mono text-gray-900"
              />
              <button
                onClick={copyToClipboard}
                className={`px-4 py-3 border rounded font-medium transition-colors ${
                  copied
                    ? 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                }`}
              >
                {copied ? `✓ ${t('Copied')}` : t('Copy')}
              </button>
            </div>

            {copied && (
              <div className="text-center">
                <p className="text-sm text-green-600">✓ {t('Link copied to clipboard!')}</p>
              </div>
            )}

            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">{infoMessages[currentMessageIndex]}</p>
              <button
                onClick={resetForm}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                ← {t('Create new password')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-6">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("Secure Password Share")}</h1>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Enter the password you want to share")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                placeholder="4S#q"
                className={`w-full p-3 border rounded bg-white text-gray-900 ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                {t("Characters")}: {password.length}/128
              </div>
            </div>
            {passwordError && <p className="text-sm text-red-600 mt-1">{passwordError}</p>}
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm text-blue-800 mb-2">{t("Need help generating a secure password?")}</p>
            <p className="text-xs text-blue-600 mb-3">{t("Click the \"Generate password\" button or change the options")}</p>
            <div className="flex gap-2">
              <button
                onClick={generatePassword}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white text-sm rounded transition-colors"
              >
                {t("Generate password")}
              </button>
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm rounded transition-colors"
              >
                {showOptions ? t('Hide options') : t('Options')}
              </button>
            </div>
          </div>

          {/* Options */}
          {showOptions && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{t("Size:")}</span>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 4;
                    setLength(Math.min(128, Math.max(4, value)));
                  }}
                  className="w-20 p-1 text-center border border-gray-300 rounded bg-white text-gray-900"
                  min={4}
                  max={128}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{t("Include symbols:")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{t("Include numbers:")}</span>
                </label>
              </div>
            </div>
          )}

          {/* Sliders */}
          <div className="space-y-4">
            {/* Days Available */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">{t("How many days should it be available?")}</span>
                <span className="text-sm font-medium text-blue-600">
                  {daysAvailable} {t(daysAvailable === 1 ? "day" : "days")}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={7}
                value={daysAvailable}
                onChange={(e) => setDaysAvailable(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #1f2937 0%, #1f2937 ${((daysAvailable - 1) / 6) * 100}%, #e5e7eb ${((daysAvailable - 1) / 6) * 100}%, #e5e7eb 100%)`,
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  outline: 'none'
                }}
              />
            </div>

            {/* Max Views */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">{t("What is the maximum number of views possible?")}</span>
                <span className="text-sm font-medium text-blue-600">
                  {maxViews} {t(maxViews === 1 ? "view" : "views")}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={maxViews}
                onChange={(e) => setMaxViews(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #1f2937 0%, #1f2937 ${((maxViews - 1) / 4) * 100}%, #e5e7eb ${((maxViews - 1) / 4) * 100}%, #e5e7eb 100%)`,
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className={showOptions ? '' : 'text-center'}>
            <button
              onClick={handleGenerateLink}
              disabled={password.length < 4}
              className={`py-3 font-semibold rounded-lg transition-colors ${
                showOptions ? 'w-full' : 'px-8'
              } ${password.length < 4 ? 'bg-gray-400 cursor-not-allowed text-gray-200' : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'}`}
            >
              {t("Generate link")}
            </button>
          </div>

          {/* Info */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">{t("This password will be available until the first occurs:")}</p>
            <p className="text-sm font-medium text-gray-700">
              {daysAvailable} {t(daysAvailable === 1 ? "day" : "days")} {t("or")} {maxViews} {t(maxViews === 1 ? "view" : "views")}.
            </p>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">{infoMessages[currentMessageIndex]}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
