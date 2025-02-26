import { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';

export default function ZoomableImg({ url, disabled }) {
    const viewerRef = useRef(null);
    const viewerInstanceRef = useRef(null);

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
                debugMode: true,
                showNavigator: false,
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

            return () => {
                if (viewerInstanceRef.current) {
                    viewerInstanceRef.current.destroy();
                    viewerInstanceRef.current = null;
                }
            };
        }
    }, [url]);

    useEffect(() => {
        if (viewerInstanceRef.current) {
            console.log('isZoomableImgDisabled', disabled);
            
            const zoomToCenter = (viewer, zoomLevel) => {
                const centerPoint = new OpenSeadragon.Point(0.5, 0.5);
                viewer.viewport.zoomTo(zoomLevel, centerPoint, false);
            };

            const centerView = (viewer) => {
                viewer.viewport.panTo(new OpenSeadragon.Point(0.5, 0.5), false);
            };

            if (disabled) {
                zoomToCenter(viewerInstanceRef.current, 2);
            } else {
                centerView(viewerInstanceRef.current);
                const center = viewerInstanceRef.current.viewport.getCenter();
                console.log('Coordonnées OpenSeadragon:', {
                    x: center.x,
                    y: center.y
                });
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