import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import SearchModalHeader from '../components/SearchModalHeader';
import SearchModalSettings from '../components/SearchModalSettings';
import SearchTableHead from '../components/SearchTableHead';
import SearchTableBody from '../components/SearchTableBody';
import SearchBlockComponent from './SearchBlockComponent';

import {
  defaultFunc,
  iterablePropTypes,
  emptyObject,
  SEARCH_MODAL_TYPE as searchModalType,
} from '../../../constants';
import { makeSelectSearchModalWidth } from '../selectors';

export class SearchModalComponent extends React.PureComponent {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  onRowClick = data => {
    const { onRowClick, toggleSearchComponent } = this.props;
    onRowClick && onRowClick(data);
    toggleSearchComponent();
  };

  getRowClickHandler = () => (this.props.onRowClick ? this.onRowClick : null);

  renderTable = () => {
    const {
      displayFields,
      renderHandler,
      rowClickParam,
      searchData,
      searchResults,
      serviceExtension,
      keyUniqueFields,
    } = this.props;

    return (
      <table className="table">
        {
          <SearchTableHead
            displayFields={displayFields}
            onRowClick={this.getRowClickHandler()}
            renderHandler={renderHandler}
            serviceExtension={serviceExtension}
          />
        }
        {
          <SearchTableBody
            displayFields={displayFields}
            onRowClick={this.getRowClickHandler()}
            renderHandler={renderHandler}
            rowClickParam={rowClickParam}
            searchResults={searchResults}
            searchData={searchData}
            keyUniqueFields={keyUniqueFields}
          />
        }
      </table>
    );
  };

  render() {
    const {
      className,
      width,
      id,
      inputId,
      modalType,
      searchData,
      onSearch,
      toggleSearchComponent,
      modalComponent,
      searchBlockExtention,
    } = this.props;
    const modalStyle = modalComponent.index
      ? {
          width: `calc(${width}vw - ${modalComponent.index * 10}px)`,
          top: `${modalComponent.index * 50}px`,
        }
      : { width: `${width}vw` };

    return (
      <div
        className={classnames(
          'search__overlay',
          className && `${className}__overlay`,
        )}
      >
        <div
          className={classnames(
            'search__overlay__content',
            className && `${className}__overlay__content`,
          )}
          style={modalStyle}
          data-testid="searchModal"
        >
          <SearchModalHeader id={id} onClose={toggleSearchComponent} />
          {modalType === searchModalType.IS_SEARCH && (
            <SearchBlockComponent
              inputId={inputId}
              id={id}
              searchData={searchData}
              onSearch={onSearch}
              toggleSearchComponent={toggleSearchComponent}
              isInModal
              searchBlockExtention={searchBlockExtention}
            />
          )}
          <SearchModalSettings />
          <div
            className={classnames(
              'search__rows',
              className && `${className}__rows`,
            )}
          >
            {this.renderTable()}
          </div>
        </div>
      </div>
    );
  }
}

SearchModalComponent.propTypes = {
  searchResults: iterablePropTypes,
  searchData: PropTypes.object,
  onSearch: PropTypes.func,
  onRowClick: PropTypes.func,
  renderHandler: PropTypes.func,
  toggleSearchComponent: PropTypes.func,
  rowClickParam: PropTypes.any,
  inputId: PropTypes.string,
  id: PropTypes.string,
  displayFields: PropTypes.array,
  className: PropTypes.string,
  serviceExtension: PropTypes.node,
  width: PropTypes.number,
  keyUniqueFields: PropTypes.array,
  modalType: PropTypes.string,
  modalComponent: PropTypes.object,
  searchBlockExtention: PropTypes.node,
};

SearchModalComponent.defaultProps = {
  width: 0,
  searchResults: iterablePropTypes,
  searchData: emptyObject,
  onRowClick: null,
  renderHandler: null,
  rowClickParam: null,
  onSearch: defaultFunc,
};

export const mapStateToProps = createStructuredSelector({
  width: makeSelectSearchModalWidth(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(SearchModalComponent);
