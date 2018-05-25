import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';

const tutorialSteps = [
  {
    label: 'How to be happy :)',
    imgPath: '/static/images/steppers/1-happy.jpg',
  },
  {
    label: '1. Work with something that you like, like…',
    imgPath: '/static/images/steppers/2-work.jpg',
  },
  {
    label: '2. Keep your friends close to you and hangout with them',
    imgPath: '/static/images/steppers/3-friends.jpg',
  },
  {
    label: '3. Travel everytime that you have a chance',
    imgPath: '/static/images/steppers/4-travel.jpg',
  },
  {
    label: '4. And contribute to Material-UI :D',
    imgPath: '/static/images/steppers/5-mui.png',
  },
];

const styles = theme => ({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing.unit * 4,
    marginBottom: 20,
    backgroundColor: theme.palette.background.default,
  },
  img: {
    height: 255,
    maxWidth: 400,
    overflow: 'hidden',
    width: '100%',
  },
});

class SwipeableTextMobileStepper extends React.Component {
  constructor(props)
  {
    super(props);

    console.log("props", props);

    this.state = {
      activeStep: 0,
    };
  }

  componentWillReceiveProps(nextProps)
  {
    console.log("componentWillReceiveProps");
    console.log("nextProps", nextProps);
  }

  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }));
  };

  handleStepChange = activeStep => {
    this.setState({ activeStep });
  };

  render() {
    const {
      classes,
      theme,
      bracket_SideA_Transpose,
      bracket_SideB_Transpose
    } = this.props;

    var bracket_Transpose = bracket_SideA_Transpose.concat(bracket_SideB_Transpose);

    const {
      activeStep
    } = this.state;

    const maxSteps = bracket_Transpose.length;

    return (
      <div className={classes.root}>

        {/*<Paper square elevation={0} className={classes.header}>
          <Typography>{tutorialSteps[activeStep].label}</Typography>
        </Paper>*/}

        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.activeStep}
          onChangeIndex={this.handleStepChange}
          enableMouseEvents
        >
          {
            bracket_Transpose.map((column, index) => (
              <Column
                key={index}
                column={column}
              />
            ))
          }
        </SwipeableViews>

        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          className={classes.mobileStepper}
          nextButton={
            <Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />

      </div>
    );
  }
}

function Column(props)
{
  const {
    column
  } = props;

  return (
    <div>
      {
        column.map((cell, index) => (
          <Cell
            key={index}
            cell={cell}
          />
        ))
      }
    </div>
  );
}

function Cell(props)
{
  const {
    cell
  } = props;

  let enabled = true;
  let address = '';

  if (cell == "X")
  {
    enabled = false;
  }
  else
  {
    address = cell.value;
    let head = address.substring(0, 8);
    let tail = address.substring(address.length - 8, address.length);
    address = head + '...' + tail;
  }

  console.log(cell.value);

  return (
    enabled ? (
      <div>
        {cell.index} : {address}
      </div>
    ) : (
      <div>
        {cell}
      </div>
    )
  );
}

SwipeableTextMobileStepper.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SwipeableTextMobileStepper);
