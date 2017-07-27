describe('The dp-active-overlays component', function () {
    let $compile,
        $rootScope,
        store,
        ACTIONS,
        allOverlays,
        user,
        activeOverlays;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: function () {}
                },
                overlays: {
                    SOURCES: {
                        overlay_a: {
                            minZoom: 8,
                            maxZoom: 16
                        },
                        overlay_b: {
                            minZoom: 10,
                            maxZoom: 14
                        }
                    }
                },
                user: {
                    getAuthorizationLevel: angular.noop
                },
                activeOverlays: {
                    setOverlays: angular.noop
                }
            },
            function ($provide) {
                $provide.factory('dpActiveOverlaysItemDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _store_, _ACTIONS_, _overlays_, _user_, _activeOverlays_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
            allOverlays = _overlays_;
            user = _user_;
            activeOverlays = _activeOverlays_;
        });

        spyOn(store, 'dispatch');
        spyOn(activeOverlays, 'setOverlays');
    });

    function getComponent (overlays, zoom, showActiveOverlays) {
        const element = document.createElement('dp-active-overlays');
        element.setAttribute('overlays', 'overlays');
        element.setAttribute('zoom', 'zoom');
        element.setAttribute('show-active-overlays', 'showActiveOverlays');

        const scope = $rootScope.$new();
        scope.overlays = overlays;
        scope.zoom = zoom;
        scope.showActiveOverlays = showActiveOverlays;

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('doesn\'t show anything if there are no active overlays', function () {
        let component,
            scope;

        // Without any overlays
        component = getComponent([], 8, true);
        scope = component.isolateScope();
        expect(component.find('.c-active-overlays').length).toBe(0);
        expect(activeOverlays.setOverlays).toHaveBeenCalledWith(scope.vm.validOverlays);

        // With overlays
        component = getComponent([{id: 'overlay_a', isVisible: true}], 8, true);
        scope = component.isolateScope();
        expect(component.find('.c-active-overlays').length).toBe(1);
        expect(activeOverlays.setOverlays).toHaveBeenCalledWith(scope.vm.validOverlays);
    });

    it('re-computes the overlays when the user authorization level changes', function () {
        spyOn(user, 'getAuthorizationLevel').and.returnValue(1);

        const component = getComponent([{id: 'overlay_a', isVisible: true}], 8, true);
        const scope = component.isolateScope();

        expect(scope.vm.validOverlays.length).toBe(1);

        user.getAuthorizationLevel.and.returnValue(2);
        allOverlays.SOURCES = {};
        $rootScope.$digest();

        expect(scope.vm.validOverlays.length).toBe(0);
    });

    it('loads the dp-active-overlays-item components in reversed order', function () {
        var component;

        component = getComponent(
            [{id: 'overlay_a', isVisible: true}, {id: 'overlay_b', isVisible: true}],
            10,
            true
        );

        expect(component.find('dp-active-overlays-item').eq(0).attr('overlay')).toBe('overlay_b');
        expect(component.find('dp-active-overlays-item').eq(1).attr('overlay')).toBe('overlay_a');
    });

    describe('there is a close icon in the active overlays panel', function () {
        var component;

        beforeEach(function () {
            component = getComponent(
                [{id: 'overlay_a', isVisible: true}, {id: 'overlay_b', isVisible: true}],
                10,
                true
            );
        });

        it('triggers HIDE_MAP_ACTIVE_OVERLAYS when clicked', function () {
            component.find('.c-active-overlays__close').click();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.HIDE_MAP_ACTIVE_OVERLAYS
            });
        });

        it('has a title attribute and screen reader text fallback', function () {
            expect(component.find('.c-active-overlays__close').attr('title')).toBe('Sluiten');
            expect(component.find('.c-active-overlays__close .u-sr-only').text()).toContain('Sluiten');
        });
    });
});
