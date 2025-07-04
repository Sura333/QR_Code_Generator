import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const qrRef = useRef(null);

  // Download QR as Image
  const handleDownload = async () => {
    if (qrRef.current) {
      const canvas = await html2canvas(qrRef.current);
      const imgData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imgData;
      link.download = "qr-code.png";
      link.click();
    }
  };

  // Share via Web Share API (if supported) and copy to clipboard
  const handleShare = async () => {
    if (qrRef.current) {
      const canvas = await html2canvas(qrRef.current);
      // Copy image to clipboard
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
      // Optionally, keep the Web Share API functionality
      if (navigator.canShare && navigator.canShare({ files: [] })) {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], "qr-code.png", { type: "image/png" });
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

      {text && (
        <div>
          <div className="qr-box" ref={qrRef}>
            <QRCode value={text} />
          </div>

          <button onClick={handleDownload}>Download</button>
          <button onClick={handleShare}>Share</button>
        </div>
      )}
    </div>
  );
}

export default App;
