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

  // Share via Web Share API (if supported)
  const handleShare = async () => {
    if (navigator.canShare() && qrRef.current) {
      const canvas = await html2canvas(qrRef.current);
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
          alert("Sharing failed or canceled.");
        }
      });
    } else {
      alert("Web Share API is not supported on this browser.");
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
