describe('The dpSuggestionHighlight filter', () => {
    var suggestionHighlight;

    beforeEach(() => {
        angular.mock.module('dpHeader');

        angular.mock.inject(_suggestionHighlightFilter_ => {
            suggestionHighlight = _suggestionHighlightFilter_;
        });
    });

    it('highlights the query in each suggestion', () => {
        var output = suggestionHighlight('Linnaeusstraat', 'Linnaeu');

        expect(output).toBe('<strong>Linnaeu</strong>sstraat');
    });

    it('matches are case-insenstive but it preserves the casing in the output', () => {
        var output = suggestionHighlight('Linnaeusstraat', 'liNNaEU');

        expect(output).toBe('<strong>Linnaeu</strong>sstraat');
    });

    it('matches all text, not just prefixes', () => {
        var output = suggestionHighlight('Linnaeusstraat', 'aeus');

        expect(output).toBe('Linn<strong>aeus</strong>straat');
    });
});
