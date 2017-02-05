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
           message: ''
        };
    },

    sendMessage: function(message) {
        var data = {
          message: message
        };

        var onSuccess = function(data, status, jqXHR) {
            console.log("success!");
            console.log(data);
            this.messageSentTransition(true);
        }.bind(this);

        var onError = function(jqHXR, status, error) {
            console.log("error");
            console.log(error);
            this.messageSentTransition(false);
        }.bind(this);

        $.ajax({
            url: '/rest/help/',
            data: JSON.stringify(data),
            contentType: 'application/json',
            type: 'POST',
            success: onSuccess,
            error: onError
        });
    },

    messageSentTransition: function(isSuccess) {
        var TIMEOUT_TIME = 3000;
        switch (this.state.state) {
            case HELP_STATES.SENDING:
                var nextState;
                if (isSuccess) {
                    nextState = HELP_STATES.SUCCESS;
                } else {
                    nextState = HELP_STATES.FAILED;
                }

                this.setState(
                    {state: nextState},
                    function() {
                        setTimeout(this.timerTransition, TIMEOUT_TIME);
                    }.bind(this)
                );
                break;
            default:
                console.log("Error: The messageSentTransition() should only be called when the program is in the SENDING state");
                return;
        }
    },

    clickTransition: function(e) {
        console.log("clickTransition");
        switch (this.state.state) {
            case HELP_STATES.INITIAL:
                this.setState({state: HELP_STATES.OPEN});
                break;
            case HELP_STATES.OPEN:
                if (this.state.message) {
                    this.sendMessage(this.state.message);
                    this.setState({state: HELP_STATES.SENDING});
                } else {
                    this.setState({state: HELP_STATES.INITIAL});
                }
                break;
            default:
                return;
        }
    },

    timerTransition: function() {
        switch (this.state.state) {
            case HELP_STATES.FAILED:
                this.setState({state: HELP_STATES.OPEN});
                break;
            case HELP_STATES.SUCCESS:
                this.setState({
                    state: HELP_STATES.INITIAL,
                    message: ''
                });
                break;
            default:
                return;
        }
    },

    onMessageChange: function(e) {
        this.setState({message: e.target.value});
    },

    helpButtonIcon: function() {
        switch (this.state.state) {
            case HELP_STATES.INITIAL:
                return '?';
            case HELP_STATES.OPEN:
                if (this.state.message) {
                    return '>';
                } else {
                    return 'X';
                }
            case HELP_STATES.SENDING:
                return '...';
            case HELP_STATES.FAILURE:
                return ':(';
            case HELP_STATES.SUCCESS:
                return '\u2713';
            default:
                console.log("Error: Invalid state", this.state.state);
                return HELP_STATE.INITIAL;
        }
    },

    helpTextMessage: function() {
        switch (this.state.state) {
            case HELP_STATES.OPEN:
                return 'Questions/Comments? Send us an email here or at codalab@gmail.com';
            case HELP_STATES.SENDING:
                return 'Sending...';
            case HELP_STATES.FAILURE:
                return 'Something went wrong, please try again';
            case HELP_STATES.SUCCESS:
                return 'Message sent! We\'ll get back to you soon!';
            default:
                return '';
        }
    },

    render: function() {
      // TODO refactor into less
      var containerStyle = {
          position: 'fixed',
          bottom: '50px',
          right: '50px',
          zIndex: '1',
          backgroundColor: 'rgba(115, 156, 185, 0.5)',
          borderRadius: '5px',
          paddingLeft: '10px'
      };
      if (this.state.state === HELP_STATES.INITIAL) {
          containerStyle.backgroundColor = '';
      }

      var helpButtonStyle = {
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


      var messageStyle = {
          width: '550px',
          height: '45px',
          float: 'left',
          margin: '5px',
          marginRight: '-30px',
          padding: '3px',
          border: 'none',
          borderRadius: '15px'
      };
      if (this.state.state === HELP_STATES.INITIAL) {
          messageStyle.visibility = 'hidden';
      }

      var helpTextStyle = {
          padding: '7px',
          paddingLeft: '20px'
      };
      if (this.state.state === HELP_STATES.INITIAL) {
          helpTextStyle.visibility = 'hidden';
      }

/*
      return (
          <div style={containerStyle}>
              <input type="text" style={messageStyle} />
              <button style={helpButtonStyle} onClick={this.clickTransition()}>{this.helpButtonIcon}</button>
          </div>
      );
    */

      return (
          <div style={containerStyle}>
              <div style={helpTextStyle}>{this.helpTextMessage()}</div>
              <div>
                  <input type="text" value={this.state.message} onChange={this.onMessageChange} style={messageStyle}/>
                  <button style={helpButtonStyle} onClick={this.clickTransition}>{this.helpButtonIcon()}</button>
              </div>
          </div>
      );
    }

});
