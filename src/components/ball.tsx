/** La pelota de básquet de Dunk Code. Toma el tamaño de su contenedor. */
export function Ball({ stroke = 5, className = "" }: { stroke?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={`block size-full overflow-hidden rounded-full ${className}`}>
      <circle cx="50" cy="50" r="50" fill="#FF4D1C" />
      <g fill="none" stroke="#121212" strokeWidth={stroke}>
        <path d="M50 0V100" />
        <path d="M0 50H100" />
        <path d="M20 6C40 30 40 70 20 94" />
        <path d="M80 6C60 30 60 70 80 94" />
      </g>
    </svg>
  );
}
