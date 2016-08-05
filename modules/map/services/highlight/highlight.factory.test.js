describe('The highlight factory', function () {
    var L,
        crsService,
        highlight,
        mockedLeafletMap,
        mockedItems = {
            item_multipolygon: {
                id: 'item_multipolygon',
                geometry: {
                    type: 'MultiPolygon',
                    coordinates: [
                        [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
                        [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
                        [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
                    ]
                }
            },
            item_marker: {
                id: 'item_marker',
                geometry: {
                    type: 'Point',
                    coordinates: [100.0, 0.0]
                }
            },
            item_rotated_marker: {
                id: 'item_rotated_marker',
                geometry: {
                    type: 'Point',
                    coordinates: [100.0, 0.0]
                }
            }
        },
        mockedLayer = {
            getBounds: function () {}
        },
        projGeoJsonArguments;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                angleConversion: {
                    radiansToDegrees: function () {
                        return 180;
                    }
                }
            },
            function ($provide) {
                $provide.constant('ICON_CONFIG', {
                    item_multipolygon: {
                        foo: 'a'
                    },
                    item_polygon: {
                        foo: 'b'
                    },
                    item_marker: {
                        foo: 'c'
                    },
                    item_rotated_marker: {
                        foo: 'd',
                        orientation: Math.PI
                    }
                });
            }
        );

        angular.mock.inject(function (_L_, _crsService_, _highlight_) {
            L = _L_;
            crsService = _crsService_;
            highlight = _highlight_;
        });

        mockedLeafletMap = {
            addLayer: function () {},
            removeLayer: function () {},
            getBoundsZoom: function () {}
        };

        spyOn(mockedLeafletMap, 'addLayer');
        spyOn(mockedLeafletMap, 'removeLayer');

        L.Proj.geoJson = function () {
            projGeoJsonArguments = arguments;

            return mockedLayer;
        };

        spyOn(L.Proj, 'geoJson').and.callThrough();
        spyOn(L, 'icon').and.returnValue('FAKE_ICON');
        spyOn(L, 'marker');

        spyOn(crsService, 'getRdObject').and.returnValue('FAKE_RD_OBJECT');
    });

    afterEach(function () {
        projGeoJsonArguments = undefined;
    });

    it('has an initialize function to set the Leaflet image path for icons to \'assets\'', function () {
        highlight.initialize();

        expect(L.Icon.Default.imagePath).toBe('assets');
    });

    it('can add a MultiPolygons to the map', function () {
        var item = {
            id: 'item_multipolygon',
            geometry: {
                type: 'MultiPolygon',
                coordinates: [
                    [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
                    [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
                    [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
                ]
            }
        };

        highlight.add(mockedLeafletMap, item);

        expect(L.Proj.geoJson).toHaveBeenCalledWith(jasmine.objectContaining(item.geometry), jasmine.any(Object));
        expect(mockedLeafletMap.addLayer).toHaveBeenCalledWith(mockedLayer);
    });

    it('has custom styling for MultiPolygons', function () {
        highlight.add(mockedLeafletMap, mockedItems.item_multipolygon);

        //In the real world Leaflet calls the style function
        expect(projGeoJsonArguments[1].style()).toEqual({
            color: 'red',
            fillColor: 'red',
            weight: 2,
            opacity: 1.6,
            fillOpacity: 0.2
        });
    });

    it('can add markers with custom icons to the map', function () {
        var item = {
            id: 'item_marker',
            geometry: {
                type: 'Point',
                coordinates: [100.0, 0.0]
            }
        };

        highlight.add(mockedLeafletMap, mockedItems.item_marker);

        expect(L.Proj.geoJson).toHaveBeenCalledWith(jasmine.objectContaining(item.geometry), jasmine.any(Object));
        projGeoJsonArguments[1].pointToLayer(null, 'FAKE_LATLNG'); //In the real world Leaflet calls this function

        expect(L.icon).toHaveBeenCalledWith({
            foo: 'c'
        });

        expect(L.marker).toHaveBeenCalledWith('FAKE_LATLNG', jasmine.objectContaining({
            icon: 'FAKE_ICON'
        }));

        expect(mockedLeafletMap.addLayer).toHaveBeenCalledWith(mockedLayer);
    });

    it('can add rotated markers to the map', function () {
        highlight.add(mockedLeafletMap, mockedItems.item_rotated_marker);
        projGeoJsonArguments[1].pointToLayer(null, 'FAKE_LATLNG'); //In the real world Leaflet calls this function

        expect(L.marker).toHaveBeenCalledWith('FAKE_LATLNG', {
            icon: 'FAKE_ICON',
            rotationAngle: 180
        });
    });

    it('sets the CRS to RD', function () {
        ['item_multipolygon', 'item_marker', 'item_rotated_marker'].forEach(function (item) {
            highlight.add(mockedLeafletMap, mockedItems[item]);

            expect(L.Proj.geoJson).toHaveBeenCalledWith(
                angular.merge(
                    mockedItems[item].geometry,
                    {
                        crs: 'FAKE_RD_OBJECT'
                    }
                ),
                jasmine.any(Object)
            );
        });
    });

    it('can remove highlighted things from the map', function () {
        ['item_multipolygon', 'item_marker', 'item_rotated_marker'].forEach(function (item) {
            highlight.add(mockedLeafletMap, mockedItems[item]);
            highlight.remove(mockedLeafletMap, mockedItems[item]);

            expect(mockedLeafletMap.removeLayer).toHaveBeenCalledWith(mockedLayer);
        });
    });
});