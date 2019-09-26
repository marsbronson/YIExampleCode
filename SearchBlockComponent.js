import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';

import CompactTableViewSwitch from '../../../components/CompactTableViewSwitch/CompactTableViewSwitch';
import Icon from '../../../components/Icon';
import RemoveFiltersIcon from '../../../components/Icon/RemoveFiltersIcon';

import { keyMap } from '../../../utils/hotKeys';
import {
  defaultFunc,
  emptyObject,
  SEARCH_MODAL_HANDLER_PRE_ID as searchModalInputPreId,
} from '../../../constants';
import {
  clearSearchFilters,
  setSearchComponentCompactTableView,
  setSearchSortField,
} from '../actions';
import { makeSelectModalComponent } from '../../ModalRoot/selectors';
import { makeSelectSearchComponentCompactTableView } from '../selectors';

import '../Search.scss';

export const labelsMap = {
  'common.search.customers': 'common.search.customers.label',
  'common.search.item': 'common.search.item.label',
};

export class SearchBlockComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchInputFocus: true,
    };
  }

  componentDidMount() {
    this.setState({ searchInputFocus: false });
  }

  componentWillUnmount() {
    this.onBlurSearch();
  }

  setSearchComponentCompactTableView = () => {
    const { setSearchComponentCompactTableView, isCompact } = this.props;
    this.clearFilters();
    setSearchComponentCompactTableView(!isCompact);
  };

  toggleSearchComponent = () => this.props.toggleSearchComponent();

  clearFilters = () => this.props.clearFilters();

  clearSortField = () => this.props.setSortField('');

  onSearch = event => {
    const { modalComponent, onSearch } = this.props;
    const searchLine = event.target.value;
    event.preventDefault();
    event.stopPropagation();
    this.clearSortField();
    onSearch(searchLine);
    searchLine && !modalComponent && this.toggleSearchComponent();
  };

  onFocusSearch = event => {
    const { modalComponent } = this.props;
    document.addEventListener('keydown', this.focusModalRow);
    if (modalComponent && event.target.select) {
      event.target.select();
    }
  };

  onBlurSearch = () => {
    document.removeEventListener('keydown', this.focusModalRow);
  };

  focusModalRow = event => {
    const { modalComponent } = this.props;
    const isEnterPressed = event.keyCode === keyMap['enter'];
    const firstSearchModalRow = document.getElementById(
      `${searchModalInputPreId}0`,
    );
    isEnterPressed &&
      (modalComponent
        ? firstSearchModalRow && firstSearchModalRow.focus()
        : this.onSearch(event));
  };

  handleSearchLineChange = searchLine => {
    const { onSearch, modalComponent } = this.props;
    onSearch(searchLine);
    if (!modalComponent) this.toggleSearchComponent();
  };

  clearSearchData = () => {
    this.handleSearchLineChange('');
    this.clearSortField();
  };

  render() {
    const { searchInputFocus } = this.state;
    const {
      inputId,
      id,
      searchData,
      isCompact,
      isInModal = false,
      modalComponent,
      toggleSearchComponent,
      searchBlockExtention,
    } = this.props;
    const searchLine = searchData.searchLine || '';
    const hasSearchLine = !!searchLine;
    return (
      <div className={`search__input-container ${isInModal ? 'in-modal' : ''}`}>
        <label className="search__label" htmlFor={inputId}>
          <FormattedMessage id={labelsMap[id] || ''} />
        </label>
        <input
          className="search__input search__line_input"
          onChange={this.onSearch}
          onFocus={this.onFocusSearch}
          onBlur={this.onBlurSearch}
          type="text"
          id={inputId}
          value={searchLine}
          autoFocus={isInModal ? false : searchInputFocus}
          data-testid="searchOrderItemInput"
        />

        {hasSearchLine && (
          <RemoveFiltersIcon
            onClick={this.clearSearchData}
            className="search__icon"
          />
        )}

        {isInModal && (
          <React.Fragment>
            <span className="search__icon" title="ALT + C">
              <CompactTableViewSwitch
                isCompact={isCompact}
                switchCompactView={this.setSearchComponentCompactTableView}
              />
            </span>
            {searchBlockExtention && (
              <span className="search__icon flex">{searchBlockExtention}</span>
            )}
          </React.Fragment>
        )}

        {!isInModal && (
          <Icon
            icon="eye"
            onClick={toggleSearchComponent}
            className="search__icon"
            clickable
            active={!!modalComponent}
          />
        )}
      </div>
    );
  }
}

SearchBlockComponent.propTypes = {
  searchData: PropTypes.object,
  onSearch: PropTypes.func,
  inputId: PropTypes.string,
  id: PropTypes.string,
  clearFilters: PropTypes.func,
  setSearchComponentCompactTableView: PropTypes.func,
  toggleSearchComponent: PropTypes.func,
  setSortField: PropTypes.func,
  isCompact: PropTypes.bool,
  isInModal: PropTypes.bool,
  modalType: PropTypes.string,
  modalComponent: PropTypes.object,
  searchBlockExtention: PropTypes.node,
};

SearchBlockComponent.defaultProps = {
  searchData: emptyObject,
  onSearch: defaultFunc,
};

export const mapStateToProps = createStructuredSelector({
  isCompact: makeSelectSearchComponentCompactTableView(),
  modalComponent: (state, ownProps) => {
    const { id } = ownProps;
    return makeSelectModalComponent(state, id)(state);
  },
});

export function mapDispatchToProps(dispatch) {
  return {
    clearFilters: () => dispatch(clearSearchFilters()),
    setSearchComponentCompactTableView: isCompact =>
      dispatch(setSearchComponentCompactTableView(isCompact)),
    setSortField: fieldName => dispatch(setSearchSortField(fieldName)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(SearchBlockComponent);
