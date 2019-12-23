import React from 'react';
import { buildURI, toCSV } from '../core';
import {
  defaultProps as commonDefaultProps,
  propTypes as commonPropTypes
} from '../metaProps';

/**
 *
 * @example ../../sample-site/csvlink.example.md
 */
class CSVLink extends React.Component {
  static defaultProps = commonDefaultProps;
  static propTypes = commonPropTypes;

  constructor(props) {
    super(props);
    this.buildURI = this.buildURI.bind(this);
    this.state = { href: '' };
  }

  componentDidMount() {
    const {data, headers, separator, uFEFF, enclosingCharacter} = this.props;
    this.setState({ href: this.buildURI(data, uFEFF, headers, separator, enclosingCharacter) });
  }

  componentWillReceiveProps(nextProps) {
    const { data, headers, separator, uFEFF, enclosingCharacter } = nextProps;
    this.setState({ href: this.buildURI(data, uFEFF, headers, separator, enclosingCharacter) });
  }

  buildURI() {
    return buildURI(...arguments);
  }

  /**
   * In IE11 this method will trigger the file download
   */
  handleLegacy(event) {
    // If this browser is IE 11, it does not support the `download` attribute
    if (window.navigator.msSaveOrOpenBlob) {
      // Stop the click propagation
      event.preventDefault();

      const {
        data,
        headers,
        separator,
        filename,
        enclosingCharacter,
        uFEFF
      } = this.props;

      let blob = new Blob([uFEFF ? '\uFEFF' : '', toCSV(data, headers, separator, enclosingCharacter)]);
      window.navigator.msSaveBlob(blob, filename);

      return false;
    }
  }

  handleAsyncClick(event) {
    const done = proceed => {
      if (proceed === false) {
        event.preventDefault();
        return;
      }
      this.handleLegacy(event);
    };

    this.props.onClick(event, done);
  }

  handleSyncClick(event) {
    const stopEvent = this.props.onClick(event) === false;
    if (stopEvent) {
      event.preventDefault();
      return;
    }
    this.handleLegacy(event);
  }

  handleClick() {
    return event => {
      if (typeof this.props.onClick === 'function') {
        return this.props.asyncOnClick
          ? this.handleAsyncClick(event)
          : this.handleSyncClick(event);
      }
      this.handleLegacy(event);
    };
  }

  render() {
    const {
      data,
      headers,
      separator,
      filename,
      uFEFF,
      children,
      onClick,
      asyncOnClick,
      enclosingCharacter,
      ...rest
    } = this.props;

    return (
      <a
        download={filename}
        {...rest}
        ref={link => (this.link = link)}
        target="_self"
        href={this.state.href}
        onClick={this.handleClick()}
      >
        {children}
      </a>
    );
  }
}

export default CSVLink;
