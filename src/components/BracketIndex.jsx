import React from 'react';
import BracketBulkStore from '../stores/BracketBulkStore';
import Web3Actions from '../actions/Web3Actions';

import {
  Link,
  Route,
  HashRouter as Router,
  browserHistory, Redirect
} from 'react-router-dom'

import * as moment from 'moment';
import 'moment-duration-format';

var validator = require('validator');

var loading_captions = [
  "Pending Payment...",
  "Pending Confirmation..."
]

var BracketIndex = React.createClass({
  getInitialState: function() {
    return BracketBulkStore.getList();
  },
  componentWillMount: function()
  {
    this.setState(BracketBulkStore.getList());

    this.setState({
      error: '',
      size: ''
    });

    Web3Actions.retrieveBrackets();
  },
  componentWillReceiveProps: function(nextProps)
  {
    // GameActions.retrieveRules(this.props.referenceHash, this.props.startTimestamp);
  },
  componentDidMount: function()
  {
    BracketBulkStore.addChangeListener(this._onChange);

    BracketBulkStore.addTransactionHashListener(this.onEvent_TransactionHash);
    BracketBulkStore.addConfirmationListener(this.onEvent_Confirmation);
    BracketBulkStore.addReceiptListener(this.onEvent_Receipt);
    BracketBulkStore.addErrorListener(this.onEvent_Error);
  },
  componentWillUnmount: function()
  {
    BracketBulkStore.removeChangeListener(this._onChange);

    BracketBulkStore.removeTransactionHashListener(this.onEvent_TransactionHash);
    BracketBulkStore.removeConfirmationListener(this.onEvent_Confirmation);
    BracketBulkStore.removeReceiptListener(this.onEvent_Receipt);
    BracketBulkStore.removeErrorListener(this.onEvent_Error);
  },
  onEvent_TransactionHash: function()
  {
    console.log("onEvent_TransactionHash");

    // this.setState({
    //     loading_caption: loading_captions[2]
    // });
  },
  onEvent_Confirmation: function()
  {
    console.log("onEvent_Confirmation");

    // this.setState({
    //   loaded: true,
    //   processing: true
    // });
  },
  onEvent_Receipt: function()
  {
    console.log("onEvent_Receipt");
  },
  onEvent_Error: function()
  {
    console.log("onEvent_Error");

    // this.setState({
    //   loaded: true
    // });

    this.forceUpdate();
  },
  forceUpdate()
  {
    this.setState(BracketBulkStore.getList());
  },
  _onChange: function()
  {
    this.setState(BracketBulkStore.getList());
  },
  render: function() {
    const {error} = this.state;

    const onChange = (event) =>
    {
      console.log(event.target.value);

      this.setState({
        size: event.target.value,
        error: ''
      });
    };

    const onSubmit = (event) => {

      event.preventDefault();

      console.log(this.state.size);

      this.setState({
        loaded: false,
        error: '',
        loading_caption: loading_captions[1]
      });

      var size = this.state.size;

      if (!validator.isDecimal(size)) {
        console.log("Incorrect bracket size");

        this.setState({
          loaded: true,
          error: 'Please enter correct size.'
        });

        return;
      }

      size = Number(size);

      // if (amount < 0.01) {
      //   console.log("Minimum bet is 0.01");
      //
      //   this.setState({
      //     loaded: true,
      //     error: 'Please bet more than or equal to 0.01.'
      //   });
      //
      //   return;
      // }

      if (window.authorizedAccount === undefined) {
        this.setState({
          loaded: true,
          error: 'Please connect an account with balance first.'
        });
        return;
      }

      // amount = window.web3.utils.toWei(amount.toString(), 'ether');
      const gas = 2000000;
      const gasPrice = window.web3.utils.toWei("20", 'shannon');

      var params = {
        // value: amount,
        from: window.authorizedAccount,
        gas: gas,
        gasPrice: gasPrice
      };

      Web3Actions.startBracket(size, params);
    };

    return (
      <div>
        <p className="highlighted">Brackets</p>
        <table className="wagers">
          <thead>
            <tr>
              <td>
                Id
              </td>
              <td>
                Start Date
              </td>
              <td>
                Winner
              </td>
              <td>
                Organizer
              </td>
              <td>
                Player Count
              </td>
            </tr>
          </thead>
          <tbody>
            {this.state.list.map(item => (
              <BracketItem
                key={item.id}
                item={item}
              />
            ))}
          </tbody>
        </table>
        <br />
        <form onSubmit={onSubmit}>
          <label>
            <input type="text" placeholder="Bracket Size (4, 8, 16, 32)" value={this.state.size} onChange={onChange} />
          </label>
          <br />
          <br />

          { error ? (
            <div>
              <div><input type="submit" value="Start Bracket" /></div>
              <br />
              <div className="error">{this.state.error}</div>
            </div>
          ) : (
            <div><input type="submit" value="Start Bracket" /></div>
          ) }

          <br />
        </form>
      </div>
    );
  }
});

function BracketItem(props) {
  const {item} = props;

  return (
    <tr>
      <td>
        <Link to={`/brackets/${item.index}`} replace>
          {item.index}
        </Link>
      </td>
      <td>
        {item.startTimestamp}
      </td>
      <td>
        {item.winner}
      </td>
      <td>
        {item.owner}
      </td>
      <td>
        {item.playerCount}
      </td>
    </tr>
  );
}

// function BracketItem(props) {
//   const {item} = props;
//
//   var isOpen = true;
//   var isClosed = false;
//
//   if (item.state != "open")
//   {
//       isOpen = false;
//   }
//
//   if (item.state == "closed")
//   {
//       isClosed = true;
//   }
//
//   var isCreator = (item.players[0] === window.authorizedAccount && window.authorizedAccount != undefined);
//   var isCounter = (item.players[1] === window.authorizedAccount && window.authorizedAccount != undefined);
//
//   // console.log(window.authorizedAccount);
//
//   var style = "";
//
//   if (isCreator)
//   {
//     style = "highlight-creator";
//   }
//
//   if (isCounter)
//   {
//     style = "highlight-player";
//   }
//
//   return (
//     <tr className={style}>
//       <td>
//         {
//           isOpen ?
//           (
//               <Link to={`/invites/${item.index}`} replace>
//                 {item.index}
//               </Link>
//           )
//           :
//           (
//               <Link to={`/wagers/${item.index}`} replace>
//                 {item.index}
//               </Link>
//           )
//         }
//       </td>
//       <td>
//         <div>
//           { isClosed ? (
//             <div>
//               {
//                 isCreator || isCounter ? (
//                   <div>
//                     funded
//                   </div>
//                 ) : (
//                   <div>
//                     { item.state }
//                   </div>
//                 )
//               }
//             </div>
//           ) : (
//             <div>
//               { item.state }
//             </div>
//           )}
//         </div>
//       </td>
//       <td>
//         {item.players[0]}
//       </td>
//       <td>
//         {item.date}
//       </td>
//       <td>
//         {item.amount / 1000000000000000000}
//       </td>
//     </tr>
//   );
// }

module.exports = BracketIndex;