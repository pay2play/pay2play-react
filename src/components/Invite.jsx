import React from 'react';

import {
  Link,
  withRouter
} from 'react-router-dom'

import Rules from '../components/Rules';
import EventLogs from '../components/EventLogs';
import WagerStore from '../stores/WagerStore';
import Web3Actions from '../actions/Web3Actions';
import SwarmActions from '../actions/SwarmActions';

import Helpers from "../helpers/TransactionUtils.js";

import { Intent, Spinner } from "@blueprintjs/core";

import "@blueprintjs/core/dist/blueprint.css";

var Invite = React.createClass({
  getInitialState: function() {
    return WagerStore.get();
  },
  componentWillMount: function() {
    this.setState(WagerStore.get());

    Web3Actions.retrieveWager(this.props.match.params.id);
  },
  componentDidMount: function() {
    WagerStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    WagerStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(WagerStore.get());
  },
  render: function() {
    const referenceHash = this.state.wager.referenceHash;
    const startTimestamp = this.state.wager.startTimestamp;
    const isWagerOpen = (this.state.wager.state === 'open') ;

    console.log(this.state.wager.state);

    const onSubmit = (event) => {

      event.preventDefault();

      console.log(this.state.amount);
      console.log(this.state.referenceHash);

      console.log(window.web3.version);

      const amount = window.web3.utils.toWei(0.01, 'ether');
      const gas = 650000;
      const gasPrice = window.web3.utils.toWei(20, 'shannon');

      var params = {
        value: amount,
        from: window.authorizedAccount,
        gas: gas,
        gasPrice: gasPrice
      };

      console.log(params);

      // var hash = this.state.hash;
      //
      // console.log("hash", hash);
      // console.log(typeof(this.state.hash));
      //
      // hash = 'd3ba5f21813ef1002930ba5c0c01f2f54236717e1f7a254354ac81a7d0bbfd53';

      window.contract.methods.counterWagerAndDeposit(this.props.match.params.id).send(params, Helpers.getTxHandler({
          onDone: () => {
            console.log("onDone");
          },
          onSuccess: (txid, receipt) => {
            console.log("onSuccess");
            console.log(txid, receipt);

            this.setState({
              loaded: true
            });
          },
          onError: (error) => {
            console.log("onError");

            this.setState({
              loaded: true
            });
          }
        })
      );
    };

    return (
      <div>
        <h1>Wager Invite</h1>
        <div>Wager Id: <Link to={`/wagers/${this.state.wager.index}`} replace>{this.state.wager.index}</Link></div>
        <div>Start Time: {this.state.wager.date}</div>
        <div>Amount: {this.state.wager.amount}</div>

        { referenceHash ? (
          <Rules referenceHash={referenceHash} startTimestamp={startTimestamp} />
        ) : (
          <Spinner intent={Intent.PRIMARY} />
        )}

        <h1>Players</h1>
        <div className="highlighted">Share this invite with your opponent or wait for someone to counter.</div>

        { isWagerOpen &&
          <div>
            <form onSubmit={onSubmit}>
              <input type="submit" value="Fund Wager" />

            </form>
            <br />
          </div>
        }

        <HomeButton to="/" label="Start Over" />

        <EventLogs index={this.props.match.params.id} />
      </div>
    );
  }
});

const HomeButton = withRouter(({ history, label, to }) => (
  <div>
    <button type="button" className="btn-secondary" onClick={() => history.push(to)} >
      {label}
    </button>
  </div>
));
module.exports = Invite;
