import { useRef, useState, ChangeEvent, useEffect } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import "./App.css";

function App() {
  const [text, setText] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleDownload = async () => {
    if (qrRef.current) {
      const canvas = await html2canvas(qrRef.current, {
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imgData;
      link.download = "qr-code-with-logo.png";
      link.click();
    }
  };

  const handleShare = async () => {
    if (qrRef.current) {
      const canvas = await html2canvas(qrRef.current, {
        useCORS: true,
      });

      if (navigator.clipboard && window.ClipboardItem) {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          try {
            await navigator.clipboard.write([
              new window.ClipboardItem({ "image/png": blob as Blob }),
            ]);
            alert("QR code image copied to clipboard!");
          } catch (err) {
            console.error("Failed to copy image to clipboard:", err);
            alert("Failed to copy image to clipboard.");
          }
        });
      } else {
        alert("Clipboard image copy not supported in this browser.");
      }

      if (navigator.canShare && navigator.canShare({ files: [] })) {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], "qr-code-with-logo.png", { type: "image/png" });
          try {
            await navigator.share({
              title: "QR Code",
              text: "Here is my QR code!",
              files: [file],
            });
          } catch (err) {
            console.error("Web Share API failed or was canceled:", err);
          }
        });
      }
    } else {
      alert("QR code not available.");
    }
  };

  return (
    <div className="container">
      <h1>QR Code Generator</h1>
      <input
        type="text"
        placeholder="Enter text or URL"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="logo-upload">
        <label htmlFor="logo-input">Upload Logo (Optional):</label>
        <input
          id="logo-input"
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
        />
        {logoPreview && (
          <img src={logoPreview} alt="Logo Preview" className="logo-preview" />
        )}
      </div>

      {text && (
        <div>
          <div className="qr-box" ref={qrRef}>
            <QRCode
              value={text}
              size={256}
              level="H"
            />
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo"
                className="qr-logo"
              />
            )}
          </div>

          <button onClick={handleDownload}>Download QR Code</button>
          <button onClick={handleShare}>Share QR Code</button>
        </div>
      )}
    </div>
  );
}

export default App;
