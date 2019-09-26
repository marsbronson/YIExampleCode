import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import Button, { BUTTON_VARIANTS } from '../../../components/Button';
import SearchBlockComponent from './SearchBlockComponent';

import { SEARCH_MODAL_TYPE as searchModalType } from '../../../constants';
import { makeSelectModalComponent } from '../../ModalRoot/selectors';
import { setSearchSortField } from '../actions';
import Icon from '../../../components/Icon';

const buttonClass = 'flex__item';
const { small } = BUTTON_VARIANTS;

export const handlerMap = {
  // eslint-disable-next-line react/display-name
  [searchModalType.IS_SEARCH]: props => <SearchBlockComponent {...props} />,
  // eslint-disable-next-line react/display-name
  [searchModalType.IS_FULL_BUTTON]: props => <SearchFullButton {...props} />,
  // eslint-disable-next-line react/display-name
  [searchModalType.IS_ICON_BUTTON]: props => <SearchIconButton {...props} />,
  default: () => null,
};

export class SearchFullButton extends React.PureComponent {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    const { id, toggleSearchComponent, disabled } = this.props;
    return (
      <Button
        className={buttonClass}
        variant={small}
        onClick={toggleSearchComponent}
        disabled={disabled}
      >
        <Icon icon="list" />
        <FormattedMessage id={id} />
      </Button>
    );
  }
}

SearchFullButton.propTypes = {
  id: PropTypes.string,
  toggleSearchComponent: PropTypes.func,
  disabled: PropTypes.bool,
};

export class SearchIconButton extends React.PureComponent {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    const { toggleSearchComponent, iconClass } = this.props;
    return (
      <div className="grid-cell align-center" onClick={toggleSearchComponent}>
        <Icon icon={iconClass} clickable />
      </div>
    );
  }
}

SearchIconButton.defaultProps = {
  iconClass: 'k-i-list-bulleted',
};

SearchIconButton.propTypes = {
  toggleSearchComponent: PropTypes.func,
  iconClass: PropTypes.string,
};

export class ModalHandlerComponent extends React.PureComponent {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    const { modalType } = this.props;
    return (handlerMap[modalType] || handlerMap['default'])(this.props);
  }
}

ModalHandlerComponent.propTypes = {
  id: PropTypes.string.isRequired,
  toggleSearchComponent: PropTypes.func.isRequired,
  iconClass: PropTypes.string,
  modalType: PropTypes.string,
  searchData: PropTypes.object,
  modalComponent: PropTypes.object,
};

export const mapStateToProps = createStructuredSelector({
  modalComponent: (state, ownProps) => {
    const { id } = ownProps;
    return makeSelectModalComponent(state, id)(state);
  },
});

export function mapDispatchToProps(dispatch) {
  return {
    setSortField: fieldName => dispatch(setSearchSortField(fieldName)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ModalHandlerComponent);
