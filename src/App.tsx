import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  // Fix 1: Remove logoFile if it's never used.
  // The error message 'logoFile' is declared but its value is never read.
  // This line: const [logoFile, setLogoFile] = useState<File | null>(null);
  // is not strictly necessary if you only care about the preview URL.
  // However, it's good practice to keep the File object if you might use it directly.
  // Let's keep it but ensure its type is correct.

  // Fix 3: Adjust the type for logoPreview. It's initialized to null, but then can be a string (URL).
  // The error: Argument of type 'string' is not assignable to parameter of type 'SetStateAction<null>'.
  // occurs because you're trying to set a string to something typed as 'null'.
  const [logoFile, setLogoFile] = useState<File | null>(null); // Explicitly type as File or null
  const [logoPreview, setLogoPreview] = useState<string | null>(null); // Allow string or null

  const qrRef = useRef<HTMLDivElement>(null); // Explicitly type the ref for a div element

  // Fix 2: Explicitly type the 'event' parameter for handleLogoChange.
  // The error: Parameter 'event' implicitly has an 'any' type.
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Use optional chaining in case files is null/undefined
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoFile(null);
      setLogoPreview(null);
    }
  };

  const handleDownload = async () => {
    // Check if qrRef.current exists before passing it to html2canvas
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
    // Check if qrRef.current exists before passing it to html2canvas
    if (qrRef.current) {
      const canvas = await html2canvas(qrRef.current, {
        useCORS: true,
      });
      if (navigator.clipboard && window.ClipboardItem) {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          try {
            await navigator.clipboard.write([
              new window.ClipboardItem({ "image/png": blob }),
            ]);
            alert("QR code image copied to clipboard!");
          } catch (err) {
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
            // Sharing failed or canceled
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
          onChange={handleLogoChange} // This is where the fixed handleLogoChange is used
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
