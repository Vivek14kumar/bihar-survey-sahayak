export default function SurveyorCompass() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 600" style={{ width: "100px", height: "300px" }}>
      {/* Main North-South Axis */}
      <line x1="100" y1="80" x2="100" y2="540" stroke="#6a0d0d" fill="none" strokeWidth="2.5" />

      {/* North Arrow Head */}
      <polygon points="100,60 92,80 108,80" fill="#000066" />

      {/* N Underline */}
      <line x1="85" y1="52" x2="115" y2="52" stroke="#000066" fill="none" strokeWidth="2.5" />

      {/* Directional Typography */}
      <text x="100" y="42" fill="#000066" textAnchor="middle" style={{ fontFamily: "'Times New Roman', serif", fontSize: "40px", fontStyle: "italic", fontWeight: "bold" }}>N</text>
      <text x="100" y="580" fill="#6a0d0d" textAnchor="middle" style={{ fontFamily: "'Times New Roman', serif", fontSize: "44px", fontStyle: "italic", fontWeight: "bold" }}>S</text>
      <text x="50" y="275" fill="#000066" textAnchor="middle" style={{ fontFamily: "'Times New Roman', serif", fontSize: "36px", fontStyle: "italic", fontWeight: "bold" }}>W</text>
      <text x="160" y="275" fill="#000066" textAnchor="middle" style={{ fontFamily: "'Times New Roman', serif", fontSize: "36px", fontStyle: "italic", fontWeight: "bold" }}>E</text>

      {/* Hyphen near W */}
      <line x1="72" y1="265" x2="85" y2="265" stroke="#000066" fill="none" strokeWidth="2" />

      {/* East-side Decorative Fins */}
      <path d="M 100,120 Q 105,170 135,210 Q 110,225 100,245 Z" fill="#fdfaf4" stroke="#6a0d0d" strokeWidth="2" />
      <path d="M 100,245 Q 115,258 128,250 Q 128,270 128,290 Q 115,285 100,295 Z" fill="#fdfaf4" stroke="#6a0d0d" strokeWidth="2" />
      <path d="M 100,295 Q 110,315 135,335 Q 105,380 100,430 Z" fill="#fdfaf4" stroke="#6a0d0d" strokeWidth="2" />

      {/* Vector Stippling / Texture */}
      <g stroke="#6a0d0d" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <circle cx="106" cy="150" r="0.5" fill="#6a0d0d" />
        <path d="M 109,170 l 2,3" />
        <circle cx="115" cy="185" r="0.5" fill="#6a0d0d" />
        <path d="M 110,195 l -1,3" />
        <circle cx="120" cy="200" r="1" fill="#6a0d0d" />
        <circle cx="106" cy="210" r="0.5" fill="#6a0d0d" />
        <path d="M 115,215 l 2,1" />
        <circle cx="108" cy="230" r="0.5" fill="#6a0d0d" />

        <circle cx="106" cy="255" r="0.5" fill="#6a0d0d" />
        <path d="M 112,260 l 1,2" />
        <circle cx="118" cy="268" r="0.5" fill="#6a0d0d" />
        <path d="M 108,275 l -1,2" />
        <circle cx="112" cy="285" r="0.5" fill="#6a0d0d" />
        <circle cx="105" cy="290" r="0.5" fill="#6a0d0d" />

        <circle cx="106" cy="310" r="0.5" fill="#6a0d0d" />
        <path d="M 112,320 l 2,-1" />
        <circle cx="122" cy="330" r="1" fill="#6a0d0d" />
        <path d="M 108,340 l -1,3" />
        <circle cx="115" cy="350" r="0.5" fill="#6a0d0d" />
        <circle cx="108" cy="365" r="0.5" fill="#6a0d0d" />
        <path d="M 110,380 l 1,2" />
        <circle cx="105" cy="395" r="0.5" fill="#6a0d0d" />
        <circle cx="103" cy="410" r="0.5" fill="#6a0d0d" />
      </g>
    </svg>
  );
}