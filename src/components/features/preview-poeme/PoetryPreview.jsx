//

import { useEffect, useState } from 'react';
import '../../../assets/styles/previewPoeme.css';

const angles = [-20, -10, 0, 10, 20];
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

function createTextSpan(text) {
    const span = document.createElement('span');
    span.className = 'wavy-word';
    span.textContent = text;

    const angle = getRandom(angles);
    span.dataset.angle = angle;
    span.style.transform = `rotate(${angle}deg)`;
    span.style.transformOrigin = 'left center';

    return span;
}

function getLineBoundingBox(spans, container) {
    const containerRect = container.getBoundingClientRect();

    let minLeft = Infinity;
    let maxRight = -Infinity;
    let minTop = Infinity;
    let maxBottom = -Infinity;

    spans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const left = rect.left - containerRect.left;
        const right = rect.right - containerRect.left;
        const top = rect.top - containerRect.top;
        const bottom = rect.bottom - containerRect.top;

        minLeft = Math.min(minLeft, left);
        maxRight = Math.max(maxRight, right);
        minTop = Math.min(minTop, top);
        maxBottom = Math.max(maxBottom, bottom);
    });

    return {
        width: maxRight - minLeft,
        height: maxBottom - minTop,
        left: minLeft,
        top: minTop,
    };
}

export default function PoetryPreview({ poems = {} }) {
    const [previewWidth, setPreviewWidth] = useState(null);

    useEffect(() => {
        const handleWidthChange = (event) => {
            const { width } = event.detail;
            setPreviewWidth(`calc(100vw - ${width}px)`);
        };

        // Écouter l'événement de changement de largeur
        window.addEventListener('poetryWrapperWidthChange', handleWidthChange);

        // Déclencher un événement pour demander la largeur initiale
        const requestInitialWidth = new CustomEvent(
            'requestPoetryWrapperWidth'
        );
        window.dispatchEvent(requestInitialWidth);

        return () =>
            window.removeEventListener(
                'poetryWrapperWidthChange',
                handleWidthChange
            );
    }, []);

    useEffect(() => {
        const preview = document.querySelector('.preview');
        // if (!preview || projectTriggers.length === 0) return;

        function clearPreview() {
            preview.innerHTML = '';
        }

        function renderPoem(words) {
            clearPreview();

            const wrapper = document.createElement('div');
            wrapper.className = 'line-wrapper';

            const line = document.createElement('div');
            line.className = 'wavy-line';

            wrapper.appendChild(line);
            preview.appendChild(wrapper);

            const spans = words.map((text) => {
                const span = createTextSpan(text);
                line.appendChild(span);
                return span;
            });

            requestAnimationFrame(() => {
                let x = 0;
                let y = 0;

                spans.forEach((span) => {
                    const angle = parseFloat(span.dataset.angle);
                    const radians = (angle * Math.PI) / 180;
                    const width = span.getBoundingClientRect().width;

                    span.style.left = `${x}px`;
                    span.style.top = `${y}px`;

                    x += width * Math.cos(radians) + 10;
                    y += width * Math.sin(radians) * 0.4;
                });

                const bbox = getLineBoundingBox(spans, preview);

                line.style.transform = `translate(${-bbox.left}px, ${-bbox.top}px)`;
                wrapper.style.width = `${bbox.width}px`;
                wrapper.style.height = `${bbox.height}px`;

                const maxLeft = preview.clientWidth - bbox.width;
                const maxTop = preview.clientHeight - bbox.height;

                const safeLeft = Math.random() * Math.max(0, maxLeft);
                const safeTop = Math.random() * Math.max(0, maxTop);

                wrapper.style.left = `${safeLeft}px`; 
                wrapper.style.top = `${safeTop}px`;
                wrapper.style.opacity = '1';
                wrapper.style.visibility = 'visible';
            });
        }

        setTimeout(() => {
            const projectTriggers = document.querySelectorAll('.project');
            projectTriggers.forEach((project) => {
                const type = project.dataset.type;
                project.addEventListener('mouseenter', () => {
                    const collection = poems[type];
                    if (!collection) return;
                    const poem = getRandom(collection);
                    renderPoem(poem);
                });

                project.addEventListener('mouseleave', clearPreview);
            });


            // Nettoyage des events au démontage
            return () => {
                projectTriggers.forEach((project) => {
                    project.removeEventListener('mouseenter', clearPreview);
                    project.removeEventListener('mouseleave', clearPreview);
                });
            };
        }, 1000);
    }, [poems]);

    return (
        <div
            className='preview mix-blend-target fixed inset-0 top-[unset] right-0 bottom-0 left-[unset] z-5 h-[calc(100vh-31px)] flex-1 overflow-hidden'
            style={{ width: previewWidth || 'calc(100vw - 180px)' }}
        />
    );

}
