import React from 'react';
import PropTypes from 'prop-types';

import ExpandIcon from '../../../../public/images/icon-arrow-down.svg';
import ContractIcon from '../../../../public/images/icon-arrow-up.svg';

import './_select.scss';

class Select extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      label: props.label,
      value: props.value,
      expanded: props.expanded,
      options: props.options
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClickChild = this.handleClickChild.bind(this);
  }

  // @TODO have to fix default selected value and label

  handleClick() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  handleClickChild(e) {
    if (e.target.value !== this.state.value) {
      this.setState({
        label: e.currentTarget.innerText,
        value: e.currentTarget.value,
        expanded: !this.state.expanded
      });

      this.props.handleChange(e, this.state);
    }
  }

  render() {
    return (
      <section className={`select ${this.state.expanded ? 'select--expanded' : ''}`}>
        <input
          type="text"
          className="select__label"
          readOnly
          value={this.state.label}
          onClick={this.handleClick}
        />
        <input
          type="hidden"
          readOnly
          name={this.props.name}
          value={this.state.value}
        />
      <span className="select__toggle select__toggle--expand">
          <ExpandIcon />
        </span>
        <span className="select__toggle select__toggle--contract">
          <ContractIcon />
        </span>
        <ul className="select__drop-down">
          {this.props.options && this.props.options.length > 0 ? this.props.options.map(option => (
            <li
              className={`select__drop-down-item ${option.value === this.state.value ? 'select__drop-down-item--selected' : ''}`}
              key={option.value}
            >
              <button
                className="select__drop-down-button"
                value={option.value}
                onClick={this.handleClickChild}
              >
                {option.label}
              </button>
            </li>
          )) : ''}
        </ul>
      </section>
    );
  }
}

Select.defaultProps = {
  label: '',
  value: '',
  expanded: false,
  options: [],
  handleChange: () => {}
};

Select.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  handleChange: PropTypes.func
};

export default Select;
