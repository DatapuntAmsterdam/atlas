import React from 'react';
import PropTypes from 'prop-types';
import PageContainer from '../containers/PageContainer';
import Footer from '../components/Footer/Footer';

const Home = ({ columnSizes }) => (
  <div
    style={{ display: (columnSizes.right) ? 'block' : 'none' }}
    className={`c-dashboard__column c-dashboard__content u-col-sm--${columnSizes.right} qa-dashboard__column--right`}
  >
    <div className="c-dashboard__page o-max-width">
      <div className="c-dashboard__page-inner o-max-width__inner u-gutter">
        <div className="qa-page">
          <PageContainer name="home" />
        </div>
      </div>
      <Footer />
    </div>
  </div>
);

Home.defaultProps = {
  columnSizes: { // determineColumnSizes in dashboard-columns
    right: 12,
    middle: 12
  }
};

Home.propTypes = {
  columnSizes: PropTypes.shape({
    right: PropTypes.number,
    middle: PropTypes.number
  })
};

export default Home;
