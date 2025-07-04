"use client";



export default function Header({ n, setN, m, setM, status, onReset, borderColor, bgColor }) {
  return (
    <header
      className="sticky top-0 left-0 w-full z-50 flex flex-col items-center gap-4 p-4"
      style={{
        background: bgColor,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `3px solid ${borderColor}`,
        boxShadow: `0 4px 24px 0 ${borderColor}33`,
        borderRadius: 0,
        transition: 'border-color 0.3s, box-shadow 0.3s',
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        width: '100vw',
        left: 0,
        right: 0,
      }}
    >
      <div className="w-full flex flex-col items-center gap-4">
        <form
          className="flex gap-4 items-center flex-wrap justify-center"
          onSubmit={e => e.preventDefault()}
        >
          <label className="font-semibold">
            Board size (N):
            <input
              type="number"
              min={3}
              max={15}
              value={n === "" ? "" : n}
              onChange={e => {
                const value = e.target.value;
                if (value === "") {
                  setN("");
                } else {
                  const num = Number(value);
                  if (!isNaN(num)) {
                    setN(Math.max(3, Math.min(15, num)));
                  }
                }
              }}
              className="ml-2 border rounded px-2 py-1 w-16 text-center"
            />
          </label>
          <label className="font-semibold">
            Marks to win (M):
            <input
              type="number"
              min={3}
              max={n}
              value={m === "" ? "" : m}
              onChange={e => {
                const value = e.target.value;
                if (value === "") {
                  setM("");
                } else {
                  const num = Number(value);
                  if (!isNaN(num)) {
                    setM(Math.max(3, Math.min(n, num)));
                  }
                }
              }}
              className="ml-2 border rounded px-2 py-1 w-16 text-center"
            />
          </label>
        </form>
        {/* Game status and Reset button */}
        <div className="flex gap-4 items-center flex-wrap justify-center w-full">
          <span className="font-bold text-lg" style={{ minWidth: 100, textAlign: 'center', color: borderColor }}>{status}</span>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded font-semibold hover:bg-gray-200 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </header>
  );
} 