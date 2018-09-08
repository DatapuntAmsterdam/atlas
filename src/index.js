// For now simply import everything we need, from here
import './map/wrappers/map/MapWrapper';
import './detail/wrappers/DetailGrondexploitatieGraphTotalsWrapper';
import './detail/wrappers/DetailGrondexploitatieGraphPhasedWrapper';
import './header/wrappers/header-search/HeaderSearchWrapper';
import './homepage/wrappers/address-block/HomepageAddressBlockWrapper';

// All third party dependencies
import './vendor';

// Legacy sass
import '../modules/shared/shared.scss';
import '../modules/atlas/atlas.scss';
import '../modules/data-selection/data-selection.scss';
import '../modules/detail/detail.scss';
import '../modules/header/header.scss';
import '../modules/page/page.scss';
import '../modules/search-results/search-results.scss';
import '../modules/straatbeeld/straatbeeld.scss';

// New style sass
import './_styles.scss';

import './app/index';
