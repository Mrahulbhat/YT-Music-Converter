import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = async () => {
    if (!url.trim()) {
      setError("Please paste a YouTube link!");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (!filename.trim()) {
      setError("Please enter a filename!");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:3001/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, filename }),
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename.endsWith('.mp3') ? filename : filename + '.mp3';
      link.click();
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong! Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleConvert();
    }
  };

  const styles = {
    body:{
      padding:"0",
      margin:"0",
    },
    container: {
      height: "100vh",
      backgroundColor: "#18181b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    },
    wrapper: {
      width: "100%",
      maxWidth: "500px",
      margin: "0 auto"
    },
    header: {
      textAlign: "center",
      marginBottom: "40px"
    },
    title: {
      fontSize: "32px",
      fontWeight: "600",
      color: "#f4f4f5",
      margin: "0 0 10px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px"
    },
    subtitle: {
      fontSize: "16px",
      color: "#a1a1aa",
      margin: 0
    },
    card: {
      backgroundColor: "#23232a",
      border: "1px solid #27272a",
      borderRadius: "8px",
      padding: "40px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)"
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "#e4e4e7",
      marginBottom: "8px"
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #3f3f46",
      borderRadius: "6px",
      fontSize: "16px",
      outline: "none",
      backgroundColor: "#18181b",
      color: "#f4f4f5",
      transition: "border-color 0.2s, box-shadow 0.2s",
      marginBottom: "24px",
      boxSizing: "border-box"
    },
    inputFocus: {
      borderColor: "#818cf8",
      boxShadow: "0 0 0 2px rgba(129, 140, 248, 0.2)"
    },
    inputDisabled: {
      backgroundColor: "#27272a",
      color: "#71717a",
      cursor: "not-allowed"
    },
    button: {
      width: "100%",
      padding: "12px 16px",
      backgroundColor: "#2563eb", // vibrant blue
      color: "#f4f4f5",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    },
    buttonHover: {
      backgroundColor: "#1d4ed8" // darker blue
    },
    buttonDisabled: {
      backgroundColor: "#3f3f46",
      color: "#71717a",
      cursor: "not-allowed"
    },
    message: {
      marginTop: "16px",
      padding: "12px 16px",
      borderRadius: "6px",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    errorMessage: {
      backgroundColor: "#3f1d1d",
      border: "1px solid #7f1d1d",
      color: "#fca5a5"
    },
    successMessage: {
      backgroundColor: "#1a2e22",
      border: "1px solid #22c55e",
      color: "#bbf7d0"
    },
    features: {
      marginTop: "24px",
      textAlign: "center"
    },
    featureList: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "24px",
      fontSize: "14px",
      color: "#a1a1aa",
      margin: 0
    },
    icon: {
      width: "32px",
      height: "32px",
      fill: "#ef4444"
    },
    spinner: {
      width: "16px",
      height: "16px",
      border: "2px solid transparent",
      borderTop: "2px solid #818cf8",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            <svg style={styles.icon} viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube to MP3
          </h1>
          <p style={styles.subtitle}>Convert YouTube videos to audio files</p>
        </div>

        {/* Main form */}
        <div style={styles.card}>
          {/* URL Input */}
          <div>
            <label htmlFor="url" style={styles.label}>
              YouTube URL
            </label>
            <input
              id="url"
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{
                ...styles.input,
                ...(loading ? styles.inputDisabled : {})
              }}
            />
          </div>
          {/* Filename Input */}
          <div>
            <label htmlFor="filename" style={styles.label}>
              Save as (filename)
            </label>
            <input
              id="filename"
              type="text"
              placeholder="my-audio.mp3"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              disabled={loading}
              style={{
                ...styles.input,
                ...(loading ? styles.inputDisabled : {})
              }}
            />
          </div>

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={loading || !url.trim()}
            style={{
              ...styles.button,
              ...(loading || !url.trim() ? styles.buttonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!loading && url.trim()) {
                e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && url.trim()) {
                e.target.style.backgroundColor = styles.button.backgroundColor;
              }
            }}
          >
            {loading ? (
              <>
                <div style={styles.spinner}></div>
                Converting...
              </>
            ) : (
              <>
                ⬇ Convert & Download
              </>
            )}
          </button>

          {/* Status Messages */}
          {error && (
            <div style={{...styles.message, ...styles.errorMessage}}>
              ⚠ {error}
            </div>
          )}

          {success && (
            <div style={{...styles.message, ...styles.successMessage}}>
              ✓ Download started successfully!
            </div>
          )}
        </div>

        {/* Features */}
        <div style={styles.features}>
          <div style={styles.featureList}>
            <span>• High Quality Audio</span>
            <span>• Fast Processing</span>
            <span>• No Registration</span>
          </div>
        </div>
        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '32px', color: '#a1a1aa', fontSize: '14px' }}>
          Made by Rahul Bhat
        </div>
      </div>
    </div>
  );
}

export default App;