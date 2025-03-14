// src/components/WrapperHeight.jsx
import { useStore } from "@nanostores/react";
import { activeComponent, heightAbout, heightActu } from "../lib/store.js";

export default function WrapperHeight() {
  const active = useStore(activeComponent);
  const aboutHeight = useStore(heightAbout);
  const actuHeight = useStore(heightActu);

  const computedHeight = active === "about" ? aboutHeight : actuHeight;

  return (
    <style>
      {`
        @media (max-width: 768px) {
          .wrapper-about-actus {
            height: ${computedHeight}px;
            transition: height 0.5s ease-in-out;
          }
        }
      `}
    </style>
  );
}
