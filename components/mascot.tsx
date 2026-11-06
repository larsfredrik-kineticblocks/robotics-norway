type MascotProps = {
  className?: string;
  title?: string;
};

export function Mascot({
  className,
  title = "Robotics Norway mascot, a white robot wearing a Viking helmet",
}: MascotProps) {
  return (
    <svg
      viewBox="0 0 220 250"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <g
        fill="none"
        stroke="#00205B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M48 214c-18 6-28 20-24 34" />
        <circle cx="22" cy="248" r="7" fill="#fff" />
        <path d="M172 210c16-14 30-16 36-30" />
        <circle cx="210" cy="176" r="7" fill="#fff" />
        <path d="M78 198h64v12H78z" fill="#fff" />
        <rect x="46" y="206" width="128" height="40" rx="16" fill="#fff" />
        <rect x="54" y="112" width="112" height="90" rx="40" fill="#fff" />
        <circle cx="92" cy="154" r="7" fill="#00205B" stroke="none" />
        <circle cx="128" cy="154" r="7" fill="#00205B" stroke="none" />
        <circle cx="94.5" cy="151.5" r="2" fill="#fff" stroke="none" />
        <circle cx="130.5" cy="151.5" r="2" fill="#fff" stroke="none" />
        <path d="M96 172c8 8 20 8 28 0" />
        <path d="M48 124c0-46 26-74 62-78 36 4 62 32 62 78v6H48v-6z" fill="#fff" />
        <path d="M62 108h96" stroke="#BA0C2F" strokeWidth="5" />
        <path d="M110 46v58" />
        <path d="M110 124v16" />
        <path d="M58 92c-16-6-26-22-22-36" strokeWidth="6" />
        <path d="M36 58c1-7 6-10 9-7" stroke="#BA0C2F" strokeWidth="6" />
        <path d="M162 92c16-6 26-22 22-36" strokeWidth="6" />
        <path d="M184 58c-1-7-6-10-9-7" stroke="#BA0C2F" strokeWidth="6" />
      </g>
      <g transform="translate(101 216)" aria-hidden="true">
        <rect width="18" height="14" fill="#BA0C2F" />
        <rect x="5" width="4" height="14" fill="#fff" />
        <rect y="5" width="18" height="4" fill="#fff" />
        <rect x="6.2" width="1.8" height="14" fill="#00205B" />
        <rect y="6.2" width="18" height="1.8" fill="#00205B" />
      </g>
    </svg>
  );
}
