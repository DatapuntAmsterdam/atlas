describe('The dp-link component', () => {
    let $compile,
        $rootScope,
        store,
        mockedReducer,
        mockedActions,
        mockedPayload,
        mockedState,
        mockedStateUrlConverter,
        mockedTargetState,
        mockedCurrentPath,
        mockedTargetPath;

    beforeEach(() => {
        mockedActions = {
            ACTION_WITH_LINK: {
                id: 'ACTION_WITH_LINK',
                isButton: false
            },
            ACTION_WITH_BUTTON: {
                id: 'ACTION_WITH_BUTTON',
                isButton: true
            },
            ACTION_WITHOUT_BUTTON_CONFIG: {
                id: 'ACTION_WITHOUT_BUTTON_CONFIG'
            }
        };

        angular.mock.module(
            'dpShared',
            {
                $location: {
                    url: function () {
                        return mockedCurrentPath;
                    }
                },
                store: {
                    dispatch: angular.noop
                },
                applicationState: {
                    getReducer: () => {
                        return mockedReducer;
                    },
                    getStateUrlConverter: () => {
                        return mockedStateUrlConverter;
                    },
                    getStore: () => {
                        return {
                            getState: () => {
                                return mockedState;
                            }
                        };
                    }
                }
            },
            $provide => {
                $provide.constant('ACTIONS', mockedActions);
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _$location_, _store_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
        });

        mockedPayload = {
            lalalala: true,
            numberOfLas: 4
        };

        mockedReducer = jasmine.createSpy('reducer');

        mockedStateUrlConverter = {
            state2params: angular.noop,
            params2state: angular.noop,
            state2url: () => {
                return mockedTargetPath;
            }
        };

        mockedCurrentPath = 'this=that'; // Angular's $location.url() returns everything after the hash
        mockedTargetPath = '#this=something-else';

        spyOn(store, 'dispatch');

        spyOn(mockedStateUrlConverter, 'state2url').and.returnValue(mockedTargetPath);
    });

    function getComponent (className, hoverText, type, payload) {
        const element = document.createElement('dp-link');
        element.setAttribute('type', type);

        const scope = $rootScope.$new();

        if (angular.isDefined(payload)) {
            element.setAttribute('payload', 'payload');
            scope.payload = payload;
        }

        if (angular.isString(className)) {
            element.setAttribute('class-name', className);
        }

        if (angular.isString(hoverText)) {
            element.setAttribute('hover-text', hoverText);
        }

        element.innerText = 'Transcluded text';

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('depending on the specified type (ACTION) a button or link is shown', () => {
        let component;

        // When using ACTION_WITH_LINK
        component = getComponent(null, null, 'ACTION_WITH_LINK', mockedPayload);
        expect(component.find('a').length).toBe(1);
        expect(component.find('button').length).toBe(0);

        // When using ACTION_WITH_BUTTON
        component = getComponent(null, null, 'ACTION_WITH_BUTTON', mockedPayload);
        expect(component.find('button').length).toBe(1);
        expect(component.find('a').length).toBe(0);
    });

    it('shows a button when there is no isButton variabele present for this ACTION', () => {
        // When using ACTION_WITH_LINK
        const component = getComponent(null, null, 'ACTION_WITHOUT_BUTTON_CONFIG', mockedPayload);
        expect(component.find('a').length).toBe(1);
        expect(component.find('button').length).toBe(0);
    });

    it('can have a custom className', () => {
        let component;

        // A link with a custom class
        component = getComponent('my-special-class', null, 'ACTION_WITH_LINK', mockedPayload);
        expect(component.find('a').attr('class')).toContain('my-special-class');

        // A button with a custom class
        component = getComponent('my-special-class', null, 'ACTION_WITH_BUTTON', mockedPayload);
        expect(component.find('button').attr('class')).toContain('my-special-class');
    });

    it('has a default fallback class if no className is specified', () => {
        let component;

        // A link with the default class
        component = getComponent(null, null, 'ACTION_WITH_LINK', mockedPayload);
        expect(component.find('a').attr('class')).toContain('o-btn o-btn--link');

        // A button with the default class
        component = getComponent(null, null, 'ACTION_WITH_BUTTON', mockedPayload);
        expect(component.find('button').attr('class')).toContain('o-btn o-btn--link');
    });

    it('has an optional hover text (title attribute)', () => {
        let component;

        // A link with hover text
        component = getComponent(null, 'Look at me!', 'ACTION_WITH_LINK', mockedPayload);
        expect(component.find('a').attr('title')).toContain('Look at me!');

        // A button with hover text
        component = getComponent(null, 'Woohoo!', 'ACTION_WITH_BUTTON', mockedPayload);
        expect(component.find('button').attr('title')).toContain('Woohoo!');
    });

    it('clicking the button will trigger a call to store.dispatch', () => {
        let component;

        // A dispatch with a payload
        component = getComponent(null, null, 'ACTION_WITH_BUTTON', mockedPayload);
        component.find('button').click();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: mockedActions.ACTION_WITH_BUTTON,
            payload: mockedPayload
        });

        // A dispatch without a payload
        store.dispatch.calls.reset();
        component = getComponent(null, null, 'ACTION_WITH_BUTTON');
        component.find('button').click();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: mockedActions.ACTION_WITH_BUTTON
        });
    });

    it('sets the href attribute for actions with a link', () => {
        const component = getComponent(null, null, 'ACTION_WITH_LINK', mockedPayload);

        expect(component.find('a').attr('href')).toBe(mockedTargetPath);

        // The value for the href attribute is composed by several injected dependencies, making sure these are used
        expect(mockedReducer).toHaveBeenCalledWith(
            mockedState,
            {
                type: mockedActions.ACTION_WITH_LINK,
                payload: mockedPayload
            }
        );
        expect(mockedStateUrlConverter.state2url).toHaveBeenCalledWith(mockedTargetState);
    });

    it('left clicking the link will NOT follow the href, it will trigger a regular store.dispatch', () => {
        const mockedClickEvent = jasmine.createSpyObj('e', ['preventDefault']);

        const component = getComponent(null, null, 'ACTION_WITH_LINK', mockedPayload);

        // Testing $event.preventDefault
        component.isolateScope().vm.followLink(mockedClickEvent);
        expect(mockedClickEvent.preventDefault).toHaveBeenCalled();

        // Testing the dispatch
        component.find('a').click();
        $rootScope.$apply();

        expect(mockedClickEvent.preventDefault).toHaveBeenCalled();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: mockedActions.ACTION_WITH_LINK,
            payload: mockedPayload
        });
    });

    it('transcludes content without adding whitespace', () => {
        let component;

        // A link with transcluded content
        component = getComponent(null, null, 'ACTION_WITH_LINK', mockedPayload);
        expect(component.find('a').text()).toBe('Transcluded text');

        // A button with transcluded content
        component = getComponent(null, null, 'ACTION_WITH_BUTTON', mockedPayload);
        expect(component.find('button').text()).toBe('Transcluded text');
    });
});
