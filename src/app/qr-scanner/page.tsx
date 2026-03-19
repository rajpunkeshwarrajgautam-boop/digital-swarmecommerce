"use client";

import { useState, useRef, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { ArrowRight, QrCode, ShieldAlert, Cpu } from "lucide-react";

export default function QRScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResult = (result: any, error: any) => {
    if (!!result) {
      setScanResult(result?.text);
      setIsScanning(false);
    }
    if (!!error) {
      // Ignore routine errors like no code found in frame
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-[80vh] relative z-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-16 border-b-8 border-black pb-8">
          <div>
            <h1 className="text-5xl md:text-7xl text-white font-black italic tracking-tighter uppercase mb-6 drop-shadow-[4px_4px_0_#CCFF00]">System_Scan</h1>
            <p className="font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2 bg-white text-black border-2 border-black inline-flex px-4 py-2 shadow-[4px_4px_0_#000]">
              <QrCode className="w-5 h-5 text-red-500 shrink-0" />
              <span className="truncate">Digital Payload Decryption Interface</span>
            </p>
          </div>
          <div className="bg-[#CCFF00] border-4 border-black px-8 py-6 rounded-none text-center min-w-[200px] shadow-[8px_8px_0_#000] rotate-[-2deg]">
            <p className="text-xs uppercase tracking-widest text-black/60 font-black mb-1 italic">Camera_Status</p>
            <p className="text-4xl font-black tracking-tighter text-black">{isScanning ? "ACTIVE" : "IDLE"}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Scanner Section */}
          <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0_#000] relative group">
            <div className={`absolute top-0 right-8 -translate-y-1/2 px-4 py-2 border-2 border-black text-[10px] font-black italic uppercase tracking-widest text-white shadow-[4px_4px_0_#000] ${isScanning ? "bg-red-500" : "bg-black"}`}>
              {isScanning ? "LIVE_FEED" : "OFFLINE"}
            </div>

            <div className="mb-6 flex items-center gap-4 border-b-4 border-black pb-4">
               <Cpu className="w-8 h-8 text-black" />
               <h3 className="text-2xl font-black italic uppercase tracking-tighter text-black">Optic_Sensors</h3>
            </div>

            <div className="border-4 border-black bg-black relative aspect-square shadow-[inbox_0_0_20px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center mb-6">
                {!isScanning ? (
                    <div className="text-center p-8">
                       <QrCode className="w-16 h-16 text-white/20 mx-auto mb-4" />
                       <p className="font-black uppercase tracking-widest text-xs text-white/40 italic">Awaiting Input Stream</p>
                    </div>
                ) : (
                    <div className="w-full h-full">
                       <QrReader
                          onResult={handleResult}
                          constraints={{ facingMode: 'environment' }}
                          videoStyle={{ objectFit: 'cover' }}
                          containerStyle={{ width: '100%', height: '100%' }}
                       />
                       {/* Scanner Overlay */}
                       <div className="absolute inset-0 pointer-events-none border-4 border-[#CCFF00] opacity-50 z-10">
                           <div className="w-full h-1 bg-[#CCFF00] absolute top-1/2 animate-pulse shadow-[0_0_15px_#CCFF00]" />
                       </div>
                    </div>
                )}
            </div>

            <button 
              onClick={() => {
                setIsScanning(!isScanning);
                setScanResult(null);
                setError(null);
              }}
              className="w-full h-16 flex items-center justify-center gap-3 border-4 border-black bg-[#CCFF00] text-black hover:bg-black hover:text-[#CCFF00] font-black uppercase tracking-widest shadow-[6px_6px_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm italic"
            >
              {isScanning ? "ABORT_STREAM" : "INITIALIZE_SCANNER"}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-[#ffc737] border-4 border-black p-8 shadow-[12px_12px_0_#000] flex flex-col justify-between relative">
             <div className="absolute top-4 right-[-24px] px-8 py-2 border-y-4 border-black text-xs font-black italic uppercase tracking-widest w-48 text-center rotate-[15deg] bg-white text-black">
                 PAYLOAD_DATA
             </div>

             <div className="space-y-6">
                <div>
                   <h3 className="text-3xl font-black italic uppercase tracking-tighter text-black">Decrypted_Hash</h3>
                   <p className="text-xs uppercase tracking-widest text-black/50 font-black italic mt-1">Output Console</p>
                </div>

                <div className="border-4 border-black bg-white min-h-[200px] p-6 shadow-[inset_4px_4px_0_rgba(0,0,0,0.1)]">
                   {scanResult ? (
                       <p className="font-black text-black break-all">{scanResult}</p>
                   ) : error ? (
                       <div className="flex items-center gap-3 text-red-500 font-black uppercase italic text-sm">
                           <ShieldAlert className="w-6 h-6" /> {error}
                       </div>
                   ) : (
                       <p className="font-black uppercase tracking-widest text-xs text-black/30 italic">No_Data_Detected</p>
                   )}
                </div>
             </div>

             <div className="mt-8">
                 <button 
                   disabled={!scanResult}
                   onClick={() => scanResult && window.open(scanResult, "_blank")}
                   className="w-full h-16 flex items-center justify-center gap-3 border-4 border-black bg-black text-white hover:bg-white hover:text-black font-black uppercase tracking-widest shadow-[6px_6px_0_#fff] disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0_#fff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm italic"
                 >
                    Process_Hash_Link <ArrowRight className="w-5 h-5" />
                 </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
