import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import SearchModalComponent from './SearchModalComponent';

import { keyMap } from '../../../utils/hotKeys';
import {
  defaultFunc,
  iterablePropTypes,
  emptyArray,
  emptyObject,
  IS_SEARCH,
} from '../../../constants';
import { handleModal, hideModal } from '../../ModalRoot/actions';
import { makeSelectModalComponent } from '../../ModalRoot/selectors';
import { clearSearchFilters, setSearchSortField } from '../actions';

import '../Search.scss';

export class ModalWrapperComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchInputFocus: true,
    };
  }

  componentDidMount() {
    const { searchData, onSearch, modalType, modalComponent } = this.props;
    if (modalType === IS_SEARCH) {
      const { searchLine } = searchData;
      this.handleSearchLineChange(searchLine);
    } else {
      onSearch();
    }
    if (modalComponent) {
      document.addEventListener('keydown', this.modalKeyPressListener);
    } else {
      document.removeEventListener('keydown', this.modalKeyPressListener);
    }
    this.setState({ searchInputFocus: false });
  }

  componentDidUpdate(prev) {
    const { searchData, onSearch, modalType, modalComponent } = this.props;
    if (modalComponent) {
      document.addEventListener('keydown', this.modalKeyPressListener);
    } else {
      document.removeEventListener('keydown', this.modalKeyPressListener);
    }

    if (modalType !== IS_SEARCH && searchData !== prev.searchData) {
      onSearch();
    }
  }

  componentWillUnmount() {
    this.clearSearchComponent();
    document.removeEventListener('keydown', this.modalKeyPressListener);
  }

  modalKeyPressListener = event => {
    const { modalComponent } = this.props;
    const isEscPressed = event.keyCode === keyMap['escape'];
    const isItLastModal = modalComponent.isLast;
    modalComponent &&
      isItLastModal &&
      isEscPressed &&
      this.hideSearchComponent();
  };

  clearFilters = () => this.props.clearFilters();

  showModal = () => {
    const { id, searchData, handleModal } = this.props;
    handleModal({ id, data: searchData });
  };

  clearSortField = () => this.props.setSortField('');

  onSearch = event => {
    const { modalComponent } = this.props;
    event.preventDefault();
    event.stopPropagation();
    const value = event.target.value;
    this.clearSortField();
    this.handleSearchLineChange(value);
    !modalComponent && value && this.showModal();
  };

  handleSearchLineChange = searchLine => {
    const { onSearch, modalComponent } = this.props;
    onSearch(searchLine);
    if (!modalComponent) this.showModal();
  };

  showSearchComponent = () => {
    const { searchData } = this.props;
    const { searchLine } = searchData;
    searchLine ? this.handleSearchLineChange(searchLine) : this.showModal();
  };

  hideSearchComponent = () => {
    const { id, hideModal } = this.props;
    hideModal(id);
    this.clearFilters();
    this.clearSortField();
  };

  clearSearchComponent = () => {
    const { clearSearchResults } = this.props;
    clearSearchResults();
  };

  toggleSearchComponent = () => {
    const { modalComponent } = this.props;
    if (modalComponent) {
      this.hideSearchComponent();
    } else {
      this.showSearchComponent();
    }
  };

  render() {
    const {
      className,
      modalComponent,
      id,
      inputId,
      modalType,
      searchData,
      searchResults,
      onSearch,
      onRowClick,
      renderHandler,
      rowClickParam,
      displayFields,
      serviceExtension,
      keyUniqueFields,
      searchBlockExtention,
    } = this.props;
    return (
      <React.Fragment>
        {modalComponent && (
          <div className="search">
            <SearchModalComponent
              searchResults={searchResults}
              searchData={searchData}
              onSearch={onSearch}
              onRowClick={onRowClick}
              renderHandler={renderHandler}
              rowClickParam={rowClickParam}
              inputId={inputId}
              id={id}
              displayFields={displayFields}
              className={className}
              serviceExtension={serviceExtension}
              keyUniqueFields={keyUniqueFields}
              modalType={modalType}
              toggleSearchComponent={this.toggleSearchComponent}
              modalComponent={modalComponent}
              searchBlockExtention={searchBlockExtention}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

ModalWrapperComponent.propTypes = {
  searchResults: iterablePropTypes,
  clearSearchResults: PropTypes.func,
  searchData: PropTypes.object,
  onSearch: PropTypes.func,
  onRowClick: PropTypes.func,
  renderHandler: PropTypes.func,
  rowClickParam: PropTypes.any,
  inputId: PropTypes.string,
  id: PropTypes.string,
  displayFields: PropTypes.array,
  clearFilters: PropTypes.func,
  handleModal: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  setSortField: PropTypes.func,
  modalComponent: PropTypes.object,
  className: PropTypes.string,
  serviceExtension: PropTypes.node,
  keyUniqueFields: PropTypes.array,
  modalType: PropTypes.string,
  iconClass: PropTypes.string,
  searchBlockExtention: PropTypes.node,
};

ModalWrapperComponent.defaultProps = {
  searchResults: emptyArray,
  searchData: emptyObject,
  onRowClick: null,
  renderHandler: null,
  rowClickParam: null,
  clearSearchResults: defaultFunc,
  onSearch: defaultFunc,
  searchBlockExtention: null,
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
    clearFilters: () => dispatch(clearSearchFilters()),
    handleModal: payload => dispatch(handleModal(payload)),
    hideModal: payload => dispatch(hideModal(payload)),
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ModalWrapperComponent);
