import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export const MapComponent = ({ location, onLocationChange }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: 'AIzaSyC2QneqsSHC-F3hx9LJQJmt7Yx-Ax0y4iY',
            version: 'weekly',
        });

        loader.load().then(() => {
            const map = new google.maps.Map(mapRef.current, {
                center: { lat: location.lat, lng: location.lng },
                zoom: 15,
            });

            markerRef.current = new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: map,
                draggable: !!onLocationChange,
            });

            if (onLocationChange) {
                google.maps.event.addListener(markerRef.current, 'dragend', function() {
                    const position = markerRef.current.getPosition();
                    onLocationChange(position.lat(), position.lng());
                });

                google.maps.event.addListener(map, 'click', function(event) {
                    markerRef.current.setPosition(event.latLng);
                    onLocationChange(event.latLng.lat(), event.latLng.lng());
                });
            }
        });
    }, [location, onLocationChange]);

    return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};
