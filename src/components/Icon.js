import React, { Component } from 'react';


class Icon extends Component {
  constructor(props) {
    super(props);
    
    this.mergeStyles = this.mergeStyles.bind(this);
    this.renderGraphic = this.renderGraphic.bind(this);
  }

  mergeStyles(...args) {
    // This is the m function from "CSS in JS" and can be extracted to a mixin
    return Object.assign({}, ...args);
  }

  renderGraphic() {
    switch (this.props.icon) {
      case 'swap':
        return (
          <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>
        );
      case 'undo':
        return (
           <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
        );
      case 'stop':
        return (
           <path d="M6 6h12v12H6z"/>
        );
      case 'remove':
        return (
            <path d="M19 13H5v-2h14v2z"/>
        );
      default:
        return (<g></g>);
    }
  }

  render() {
    let styles = {
      fill: "currentcolor",
      verticalAlign: "middle",
      width: this.props.size, // CSS instead of the width attr to support non-pixel units
      height: this.props.size // Prevents scaling issue in IE
    };
    return (
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style={this.mergeStyles(
          styles,
          this.props.style // This lets the parent pass custom styles
        )}>
          {this.renderGraphic()}
      </svg>
    );
  }
}

Icon.propTypes = {
  icon: React.PropTypes.string.isRequired,
  size: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  style: React.PropTypes.object
}
Icon.defaultProps = {
  size: 24
}

export default Icon;