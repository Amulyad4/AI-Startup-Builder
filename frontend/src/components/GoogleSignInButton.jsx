import React, { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { AlertCircle, ExternalLink, Key, Check } from "lucide-react";

export const GoogleGLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

// Inner button using official Google OAuth hook
function LiveGoogleButton({ onAuthSuccess, onError, disabled }) {
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch Google profile");
        const profile = await res.json();
        await onAuthSuccess({
          email: profile.email,
          name: profile.name || profile.email.split("@")[0],
          avatar: profile.picture,
          provider: "google",
        });
      } catch (err) {
        console.error("Google userinfo fetch error:", err);
        onError?.(err.message || "Failed to retrieve Google profile.");
      } finally {
        setLoading(false);
      }
    },
    onError: (err) => {
      console.error("Google OAuth error:", err);
      onError?.("Google sign-in was closed or cancelled.");
      setLoading(false);
    },
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-border bg-surface hover:bg-surfaceAlt text-text text-xs font-semibold outline-none cursor-pointer shadow-xs hover:border-cyan-500/40 transition-all disabled:opacity-60 group"
    >
      <GoogleGLogo size={18} />
      <span className="font-medium">
        {loading ? "Opening Google..." : "Continue with Google"}
      </span>
    </button>
  );
}

export default function GoogleSignInButton({
  onAuthSuccess,
  onError,
  disabled,
}) {
  const [clientId, setClientId] = useState(() => {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem("temp_google_client_id") || "";
  });
  const [showSetupNotice, setShowSetupNotice] = useState(false);
  const [pastedId, setPastedId] = useState("");

  const hasValidClientId = clientId && clientId.trim().length > 10;

  if (hasValidClientId) {
    return (
      <GoogleOAuthProvider clientId={clientId.trim()}>
        <LiveGoogleButton
          onAuthSuccess={onAuthSuccess}
          onError={onError}
          disabled={disabled}
        />
      </GoogleOAuthProvider>
    );
  }

  // When no Client ID is provided yet, show the button and explain how to get the 2nd image
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setShowSetupNotice(true)}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-border bg-surface hover:bg-surfaceAlt text-text text-xs font-semibold outline-none cursor-pointer shadow-xs hover:border-cyan-500/40 transition-all disabled:opacity-60 group"
      >
        <GoogleGLogo size={18} />
        <span className="font-medium">Continue with Google</span>
      </button>

      {showSetupNotice && (
        <div className="p-4 rounded-2xl bg-surfaceAlt border border-cyan-500/30 text-left space-y-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={18} className="text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-text">
                To open the real Google popup (Image 2):
              </h4>
              <p className="text-[11px] text-textMuted leading-relaxed">
                Google requires a free <strong>OAuth Client ID</strong> from Google Cloud Console before it allows opening <code className="text-cyan-400 font-mono">accounts.google.com</code> with your personal accounts.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text flex items-center gap-1.5">
              <Key size={12} className="text-cyan-400" /> Paste your Google Client ID:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pastedId}
                onChange={(e) => setPastedId(e.target.value)}
                placeholder="123456789-xxxx.apps.googleusercontent.com"
                className="flex-1 px-3 py-1.5 text-[11px] font-mono rounded-lg border border-border bg-bg text-text outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => {
                  if (pastedId.trim().length > 10) {
                    localStorage.setItem("temp_google_client_id", pastedId.trim());
                    setClientId(pastedId.trim());
                    setShowSetupNotice(false);
                  }
                }}
                disabled={pastedId.trim().length <= 10}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold border-none cursor-pointer disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>

          <div className="pt-1 text-[10px] text-textMuted flex items-center justify-between border-t border-border/50">
            <span>Or add to <code className="text-cyan-400 font-mono">frontend/.env</code>: <code className="text-text font-mono">VITE_GOOGLE_CLIENT_ID=...</code></span>
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              Get from Google Cloud <ExternalLink size={10} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
