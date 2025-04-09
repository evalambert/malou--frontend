/* // src/components/WrapperHeight.jsx
import { useStore } from '@nanostores/react';
import {
    activeComponent,
    heightAbout,
    heightActu,
} from '../../assets/scripts/lib/store.js';

export default function WrapperHeight() {
    const active = useStore(activeComponent);
    const aboutHeight = useStore(heightAbout);
    const actuHeight = useStore(heightActu);

    const computedHeight = active === 'about' ? aboutHeight : actuHeight;

    return (
        <style>
            {`
        @media (max-width: 768px) {
          .wrapper-about-actus {
            height: ${computedHeight}px;
            transition: all 0.5s ease-in-out;
          }
        }
      `}
        </style>
    );
}
 */

import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import {
    activeComponent,
    heightAbout,
    heightActu,
} from '../../assets/scripts/lib/store.js';

export default function WrapperHeight() {
    const [isClient, setIsClient] = useState(false);
    const active = useStore(activeComponent);
    const aboutHeight = useStore(heightAbout);
    const actuHeight = useStore(heightActu);

    const computedHeight = active === 'about' ? aboutHeight : actuHeight;

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <style>
            {`
        @media (max-width: 768px) {
          .wrapper-about-actus {
            height: ${computedHeight}px;
            transition: all 0.5s ease-in-out;
          }
        }
      `}
        </style>
    );
}
