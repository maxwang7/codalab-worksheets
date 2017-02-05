/**
 * worksheet_help_button.jsx
 * -------------------------
 * The help button user interface.
 **/

var HELP_STATES = {
  'INITIAL': 1,
  'OPEN': 2,
  'SENDING': 3,
  'FAILED': 4,
  'SUCCESS': 5
};

var HelpButton = React.createClass({
    getInitialState: function() {
        return {
           state: HELP_STATES.INITIAL,
           messageText: ''
        };
    },

    clickTransition: function() {
        switch (this.state.state) {
            case HELP_STATES.INITIAL:
                return HELP_STATES.OPEN;
            case HELP_STATES.OPEN:
                return HELP_STATES.SENDING;
            default:
                return state;
        }
    },

    timerTransition: function() {
        switch (this.state.state) {
            case HELP_STATES.FAILED:
                return HELP_STATES.OPEN;
            case HELP_STATES.SUCCESS:
                return HELP_STATES.INITIAL;
            default:
                return state;
        }
    },

    helpButtonIcon: function() {
        switch (this.state.state) {
            case HELP_STATES.INITIAL:
                return '?';
            case HELP_STATES.OPEN:
                return '>';
            case HELP_STATES.SENDING:
                return '...';
            case HELP_STATES.FAILURE:
                return 'X';
            case HELP_STATES.SUCCESS:
                return '\u2713';
            default:
                console.log("Error: Invalid state", state);
                return HELP_STATE.INITIAL;
        }
    },

    render: function() {
      var containerStyle = {
          position: 'fixed',
          bottom: '50px',
          right: '50px',
          zIndex: '1'
      };

      var messageStyle = {
          width: '50px',
          height: '50px',
          borderRadius: '25px',
          backgroundColor: 'rgb(115, 156, 185)',
          color: 'white',
          display: ['flex', '-webkit-flex'],
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          float: 'right',
          margin: '3px',
          boxShadow: 'none'
      };

      var helpButtonStyle = {
          width: '550px',
          height: '45px',
          float: 'left',
          margin: '5px',
          marginRight: '-30px',
          padding: '3px',
          border: 'none'
      };

      return (
          <div style={containerStyle}>
              <input type="text" style={messageStyle} />
              <button style={helpButtonStyle} onClick={this.clickTransition()}>{this.helpButtonIcon}</button>
          </div>
      );
    }


});
