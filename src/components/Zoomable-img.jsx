import { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';


export default function ZoomableImg({ url}) {

    const viewerRef = useRef(null);

    useEffect(() => {
        if (viewerRef.current) {
            const viewer = new OpenSeadragon({
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
                    success: function(event) {
                        console.log("Image loaded successfully");
                    },
                    error: function(event) {
                        console.error("Error loading image:", event);
                    },
                    rendererSettings: {
                        preserveImageSizeOnResize: true,
                        willReadFrequently: true
                    }
                },
                debugMode: false,
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
            });

            return () => {
                viewer.destroy();
            };
        }
    }, [url]);


    return (
        <div>
            <div ref={viewerRef} id="openseadragon-viewer" className='w-[80vw] h-[80vh] border border-amber-600'></div>
        </div>
    );
}