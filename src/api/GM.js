/*eslint-disable*/

import GoogleMapsLoader from 'google-maps';
import React from 'react';
GoogleMapsLoader.KEY = 'AIzaSyB4Z3PirWkMoLS2E7Xn4USxmdVtBMXtBb8';
GoogleMapsLoader.VERSION = '3.14';
GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

export default {
    marker: '',
    markersArray: [],
    google: '',
    map: '',

    drawMap() {
        return new Promise((resolve) => {
            GoogleMapsLoader.load((google) => {
                this.google = google;
                const map = new google.maps.Map(document.getElementById('map'),
                    {
                        center: {lat: 46.482526, lng: 30.723310},
                        zoom: 8
                    });
                this.map = map;
                resolve();
            })
        });
    },

    buildMarker(lat, lng, place_id, infowindow) {
        const google = this.google;
        const map = this.map;

        const marker = new google.maps.Marker({
            position: {
                lat: lat,
                lng: lng
            },
            placeId: place_id,
            map: map
        });
        if (this.marker) {
            this.marker.setMap(null);
        }
        if (infowindow) {
            infowindow.open(map, marker);
            marker.addListener('click', ()=> {
                infowindow.open(map, marker);
            })
        }

        marker.addListener('rightclick', ()=> {
            marker.setMap(null);
        })

        this.marker = marker;
    },

    getClosestObjs(lat, lng, type) {
        const google = this.google;
        const map = this.map;

        return new Promise((resolve, reject) => {
            var request = {
                location: {
                    lat: Number(lat) ? lat : lat(),
                    lng: Number(lng) ? lng : lng()
                },
                radius: '10000',
                types: [type]
            };


            if (this.markersArray.length > 0) {
                this.markersArray.forEach(item=>{
                    item.setMap(null);
                });
                this.markersArray = [];
            }
            this.marker.setMap(null);

            const service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, (results, status) => {

                if (status == google.maps.places.PlacesServiceStatus.OK) {

                    results.forEach((item) => {
                        const marker = new google.maps.Marker({
                            map: map,
                            place: {
                                placeId: item.place_id,
                                location: item.geometry.location
                            },
                            animation: google.maps.Animation.DROP
                        });

                        this.markersArray.push(marker);

                        const infowindow = new google.maps.InfoWindow();

                        infowindow.setContent('<div><strong>' + item.name + '</strong><br>' +
                            item.vicinity + '</div>');

                        marker.addListener('click', ()=> {
                            infowindow.open(map, marker);
                        })

                        map.addListener('click', ()=> {
                            marker.setMap(null);
                        })
                        resolve()
                    })
                } else {
                    if (google.maps.places.PlacesServiceStatus) {
                        reject(google.maps.places.PlacesServiceStatus)
                    }
                }
            })

        })
    },

    getMarkerFromList(lat, lng, place_id) {
        const google = this.google;
        const map = this.map;

        const marker = new google.maps.Marker({
            position: {
                lat: Number(lat),
                lng: Number(lng)
            },
            map: map,
            placeId: place_id,
            visible: true
        });
        if (this.marker) {
            this.marker.setMap(null);
        }

        this.marker = marker;
    },

    getMarkerOnClick(){
        const map = this.map;
        return new Promise((resolve, reject) => {
            const clickL = map.addListener('click', (event) => {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();

                fetch(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`)
                    .then(res=>res.json()) //in JSON result or results? [differs]
                    .then(res=> {
                        if (res.status == 'OK') {
                            if (this.marker && this.marker.placeId == res.results[0].place_id) {
                                return Promise.resolve(res);
                            }
                            let header = res.results[0].formatted_address.split(',');
                            header = header.slice(header.length - 2, header.length).join(', ');
                            let address = res.results[0].formatted_address;

                            const infoWindowArr = [header, address];
                            const infowindow = new google.maps.InfoWindow();

                            infowindow.setContent('<div><strong>' + infoWindowArr[0] + '</strong><br>' +
                                infoWindowArr[1] + '</div>');

                            this.buildMarker(lat, lng, res.results[0].place_id, infowindow)

                            google.maps.event.removeListener(clickL);
                            resolve(res.results[0])
                            return Promise.resolve(res.results[0]);
                        } else {
                            this.buildMarker(lat, lng, null, null)

                            google.maps.event.removeListener(clickL);
                            resolve(res.results[0])
                            return Promise.resolve(res.results[0]); //this.lat this.lng
                        }
                    })
                    .catch(err=> {
                        google.maps.event.removeListener(clickL);
                        reject(err);
                    });
            })
        })
    },

    getMarkerOnAutocomplete(){
        const google = this.google;
        const input = (document.getElementById('pac-input'));
        const autocomplete = new google.maps.places.Autocomplete(input);
        const infowindow = new google.maps.InfoWindow(); //popup
        const map = this.map;

        autocomplete.bindTo('bounds', map);

        return new Promise((resolve, reject) => {
            const autocompleteL = autocomplete.addListener('place_changed', () => {
                infowindow.close();
                var place = autocomplete.getPlace();

                if (!place.geometry) {
                    reject(new Error('No place.geometry'));
                    google.maps.event.removeListener(autocompleteL);
                    return;
                }

                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);
                }
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();

                this.buildMarker(lat, lng, place.place_id, infowindow);

                const marker = this.marker;

                marker.setVisible(true);

                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                    place.formatted_address + '</div>');
                infowindow.open(map, marker);

                google.maps.event.removeListener(autocompleteL);
                resolve(place);
            });
        })
    }
}
