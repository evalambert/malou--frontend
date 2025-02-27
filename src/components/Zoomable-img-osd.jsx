import { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';

export default function ZoomableImg({ url, disabled }) {
    const viewerRef = useRef(null);
    const viewerInstanceRef = useRef(null);
    const initialBoundsRef = useRef(null);

    useEffect(() => {
        if (viewerRef.current && !viewerInstanceRef.current) {
            viewerInstanceRef.current = new OpenSeadragon({
                element: viewerRef.current,
                tileSources: {
                    type: 'image',
                    url: url,
                    crossOriginPolicy: 'Anonymous',
                    ajaxWithCredentials: false,
                    loadTilesWithAjax: true,
                    ajaxHeaders: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    rendererSettings: {
                        preserveImageSizeOnResize: true,
                        willReadFrequently: true
                    }
                },
                debugMode: false,
                showNavigator: true,
                showZoomControl: false,
                showHomeControl: false,
                showFullPageControl: false,
                defaultZoomLevel: 1,
                minZoomLevel: 1,
                maxZoomLevel: 2,
                preserveImageSizeOnResize: true,
                constrainDuringPan: true,
                visibilityRatio: 1,
                homeFillsViewer: true,
                gestureSettingsTouch: {
                    clickToZoom: false
                },
                gestureSettingsMouse: {
                    clickToZoom: false
                }
            });

            // Attendre que l'image soit chargée pour stocker les coordonnées initiales
            viewerInstanceRef.current.addHandler('open', function() {
                initialBoundsRef.current = viewerInstanceRef.current.viewport.getBounds();
                console.log('Coordonnées initiales stockées:', initialBoundsRef.current);
            });

            return () => {
                if (viewerInstanceRef.current) {
                    viewerInstanceRef.current.destroy();
                    viewerInstanceRef.current = null;
                }
            };
        }
    }, [url]);

    useEffect(() => {
        if (viewerInstanceRef.current && initialBoundsRef.current) {
            const zoomToCenter = (viewer, zoomLevel) => {
                const centerPoint = new OpenSeadragon.Point(
                    initialBoundsRef.current.x + (initialBoundsRef.current.width / 2),
                    initialBoundsRef.current.y + (initialBoundsRef.current.height / 2)
                );
                viewer.viewport.zoomTo(zoomLevel, centerPoint, false);
            };

            const centerView = (viewer) => {
                // Utiliser les coordonnées initiales pour le centrage
                const centerPoint = new OpenSeadragon.Point(
                    initialBoundsRef.current.x + (initialBoundsRef.current.width / 2),
                    initialBoundsRef.current.y + (initialBoundsRef.current.height / 2)
                );
                viewer.viewport.panTo(centerPoint, false);
            };

            if (disabled) {
                zoomToCenter(viewerInstanceRef.current, 2);
            } else {
                centerView(viewerInstanceRef.current);
                setTimeout(() => {
                    zoomToCenter(viewerInstanceRef.current, 1);
                }, 100);
            }
        }
    }, [disabled]);

    return (
        <div>
            <div 
                ref={viewerRef} 
                id="openseadragon-viewer" 
                style={{
                    width: '100vw',
                    height: '100vh',
                    border: '1px solid #99b333'
                }}
            ></div>
        </div>
    );
}