"use client";

export default function GearLoader({
  size = "w-32 h-32",
  className = "",
}: {
  size?: string;
  className?: string;
}) {
  // SVG Path เฟืองมาตรฐาน
  const gearPath =
    "M40 23.6c0-1.7.3-3.4.8-5l-4.2-2.5c-.7 1.3-1.6 2.5-2.6 3.6l-4.5-1.8c-.2-1.5-.7-2.9-1.3-4.2L31 11.2c-1.3-.9-2.8-1.5-4.3-1.9l-.9-4.8c-1.5-.1-3-.1-4.5.2l-1.5 4.6c-1.5.6-2.9 1.4-4.2 2.4l-4-3c-1.2.9-2.3 2-3.1 3.2l2.6 4.3c-.8 1.4-1.4 2.9-1.8 4.5l-4.7 1.2c-.2 1.5-.1 3.1.2 4.6l4.5 1.7c.5 1.5 1.2 2.9 2.2 4.1l-3.1 3.9c.8 1.3 1.8 2.4 2.9 3.4l4.1-2.8c1.3 1 2.8 1.7 4.3 2.1l1.5 4.6c1.5.3 3 .3 4.5 0l1.2-4.7c1.5-.5 2.9-1.2 4.1-2.2l4.2 2.8c1.2-.8 2.3-1.8 3.2-2.9l-2.7-4.2c.9-1.3 1.6-2.8 2.1-4.3l4.7-1.3c.2-1.5.2-3.1-.1-4.6l-4.6-1.6z M24 32c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z";

  // ระยะห่างมาตรฐาน (ทุกเฟืองเท่ากัน)
  const RADIUS = 38;

  return (
    <div className={`relative flex items-center justify-center ${size} ${className}`}>
      {/* Animation local */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          to { transform: rotate(-360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .motion-safe-only { animation: none !important; }
        }
      `}</style>

      {/* เฟืองบน – หมุนตามเข็ม */}
      <div
        className="absolute motion-safe-only"
        style={{
          transform: `translateY(-${RADIUS}px)`,
          animation: "spin 4s linear infinite",
        }}
      >
        <svg viewBox="0 0 48 48" className="w-12 h-12 fill-red-600">
          <path d={gearPath} />
        </svg>
      </div>

      {/* เฟืองล่าง – หมุนตามเข็ม */}
      <div
        className="absolute motion-safe-only"
        style={{
          transform: `translateY(${RADIUS}px)`,
          animation: "spin 4s linear infinite",
        }}
      >
        <svg viewBox="0 0 48 48" className="w-12 h-12 fill-yellow-500">
          <path d={gearPath} />
        </svg>
      </div>

      {/* เฟืองซ้าย – หมุนทวนเข็ม */}
      <div
        className="absolute motion-safe-only"
        style={{
          transform: `translateX(-${RADIUS}px)`,
          animation: "spinReverse 4s linear infinite",
        }}
      >
        <svg viewBox="0 0 48 48" className="w-12 h-12 fill-blue-700">
          <path d={gearPath} />
        </svg>
      </div>

      {/* เฟืองขวา – หมุนทวนเข็ม */}
      <div
        className="absolute motion-safe-only"
        style={{
          transform: `translateX(${RADIUS}px)`,
          animation: "spinReverse 4s linear infinite",
        }}
      >
        <svg viewBox="0 0 48 48" className="w-12 h-12 fill-slate-400">
          <path d={gearPath} />
        </svg>
      </div>

      {/* ศูนย์กลาง – จุดรวมพลัง */}
      <div className="absolute w-4 h-4 rounded-full bg-white shadow-md z-10" />
    </div>
  );
}
