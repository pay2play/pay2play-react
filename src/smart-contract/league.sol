/**
 * @title Pay2Play/League Smart Contract
 * @url http://pay2play.io
 * @version 1.0.0
 */

pragma solidity ^0.4.25;

contract Registrar {
  uint public registrarStartDate;

  address public node;
  address public tokenNode;

  League[] leagues;

  constructor(address _tokenNode) public {
    registrarStartDate = now;
    node = msg.sender;
    tokenNode = _tokenNode;
  }

  event NewLeagueStarted(uint indexed index, uint numberOfParticipants);

  function start(uint _numberOfParticipants) public {
    League league = (new League)(_numberOfParticipants, msg.sender);

    leagues.push(league);

    uint index = leagues.length - 1;

    emit NewLeagueStarted(index, _numberOfParticipants);
  }

  function getLeague(uint _index) constant public returns (uint, uint, uint, address, address) {
    League league = leagues[_index];
    return (_index, league.creationDate(), league.numberOfMembers(), league.organizer(), league.winner());
  }

  function getLeagueContractAddress(uint _index) constant public returns (address) {
    return address(leagues[_index]);
  }

  function getLeagueCount() constant public returns (uint) {
    return leagues.length;
  }

  function getLeagueParticipantCount(uint _index) constant public returns (uint) {
    return leagues[_index].numberOfMembers();
  }
}

contract League {
  bool public active;
  uint public creationDate;
  uint public numberOfMembers;

  uint constant minPrice = 0.01 ether;

  address public registrar;
  address public winner;
  address public organizer;

  address[] members;

  Round[] rounds;

  struct Round {
    address[] participants;
    uint[2][] opponents;
    uint[2][] points;
    uint[] losers;
  }

  constructor(uint _numberOfMembers, address _organizer) public {
    active = true;
    creationDate = now;
    numberOfMembers = _numberOfMembers;
    organizer = _organizer;

    activate();
  }

  event PlayerExists(address player);
  event PlayerJoined(uint index);
  event MatchClosed(uint roundIndex, uint matchIndex);
  event RoundClosed(uint roundIndex, uint[] losers);

  modifier onlyOrganizer {
      if (msg.sender != organizer) revert();
      _;
  }

  function activate() public {
    for (uint i = 0; i < numberOfMembers; i++) {
      members.push(address(0));
    }
  }

  function getNumberOfMembers() constant public returns (uint256) {
    return numberOfMembers;
  }

  function getMembers() constant public returns (address[]) {
      return (members);
  }

  function joinLeague() payable public {
    uint openSlotIndex = uint(-1);

    for (uint i = 0; i < numberOfMembers; i++) {
      if (members[i] == msg.sender) {
        emit PlayerExists(msg.sender);
        revert();
      }

      if (members[i] == address(0)) {
        openSlotIndex = i;
      }
    }

    if (openSlotIndex != uint(-1)) {
      members[openSlotIndex] = msg.sender;
      emit PlayerJoined(openSlotIndex);
    }
  }

  function startLeague() onlyOrganizer payable public {
    startRound(members);
  }

  function calculateMatchCount(uint _length) constant public returns (uint) {
    uint matchCount = 0;

    if (_length % 2 == 0) {
    } else {
        _length += 1;
    }

    matchCount = _length * 10 / 2 * (_length - 1) / 10; // division by float issue

    return (matchCount);
  }

  function startRound(address[] participants) onlyOrganizer payable public {
    rounds.length += 1;
    Round storage r = rounds[rounds.length - 1];
    r.participants = participants;

    uint placeholder = participants.length + 1;

    uint matchCount = calculateMatchCount(participants.length);

    //participants.length * 10 / 2 * (participants.length - 1) / 10; // division by float issue

    for (uint i = 0; i < matchCount; i++) {
        r.opponents.push([placeholder, placeholder]);
        r.points.push([uint(0), uint(0)]);
    }
  }

  function nextRound() onlyOrganizer payable public {

    // uint participantCount = rounds[roundCount - 1].participants.length - rounds[roundCount - 1].losers.length;
    uint i = 0;
    uint j = 0;

    bool isLoser = false;

    // address[] memory participants = new address[](participantCount);

    rounds.length += 1;
    Round storage r = rounds[rounds.length - 1];
    // r.participants = participants;

    uint roundCount = rounds.length;
    for (i = 0; i < rounds[roundCount - 1].participants.length; i++) {
        isLoser = false;
        for (j = 0; j < rounds[roundCount - 1].losers.length; j++) {
            if (rounds[roundCount - 1].losers[j] == i) {
                isLoser = true;
            }
        }

        if (isLoser == false) {
            r.participants.push(rounds[roundCount - 1].participants[i]);
        }
    }

    uint placeholder = r.participants.length + 1;

    uint matchCount = calculateMatchCount(r.participants.length);

    for (i = 0; i < matchCount; i++) {
        r.opponents.push([placeholder, placeholder]);
        r.points.push([uint(0), uint(0)]);
    }
  }

  function schedule(uint _roundIndex) onlyOrganizer payable public {
      uint[] memory temp = new uint[](rounds[_roundIndex].participants.length - 2 + 1);

      uint n = 2;
      uint i = 0;

      for (n = 2; n <= rounds[_roundIndex].participants.length; n++) {
          temp[n - 2] = n;
      }

      uint[] memory buffer = new uint[](temp.length);

      uint[][] memory tables = new uint[][](rounds[_roundIndex].participants.length - 1);

      for (n = 0; n < rounds[_roundIndex].participants.length - 1; n++) {
          for (i = 0; i <= temp.length - 1; i++) {
              buffer[(i + n) % temp.length] = temp[i];
          }

          uint[] memory table = new uint[](rounds[_roundIndex].participants.length);
          table[0] = 1;

          for (i = 1; i < rounds[_roundIndex].participants.length; i++) {
              table[i] = buffer[i - 1];
          }

          tables[n] = table;
      }

      uint size = 0;

      if (rounds[_roundIndex].participants.length % 2 == 0) {
        size = rounds[_roundIndex].participants.length / 2;
      } else {
        size = (rounds[_roundIndex].participants.length + 1) / 2;
      }

      for (n = 0; n < tables.length; n++) {
          table = tables[n];

          for (i = 0; i < size; i++) {
            rounds[_roundIndex].opponents[n * size + i][0] = table[i];
            rounds[_roundIndex].opponents[n * size + i][1] = table[(rounds[_roundIndex].participants.length - 1) - i];
          }
      }
  }

  function closeMatch(uint _roundIndex, uint _matchIndex, uint _points_SideA, uint _points_SideB) onlyOrganizer payable public {
    rounds[_roundIndex].points[_matchIndex][0] = _points_SideA;
    rounds[_roundIndex].points[_matchIndex][1] = _points_SideB;

    emit MatchClosed(_roundIndex, _matchIndex);
  }

  function closeRound(uint _roundIndex) onlyOrganizer payable public {
    uint matchCount = rounds[_roundIndex].opponents.length;
    uint i = 0;

    uint[] memory scores = new uint[](rounds[_roundIndex].participants.length);

    for (i = 0; i < matchCount; i++) {
        if (rounds[_roundIndex].points[i][0] > rounds[_roundIndex].points[i][1]) {
            scores[rounds[_roundIndex].opponents[i][0] - 1] += rounds[_roundIndex].points[i][0];
        }

        if (rounds[_roundIndex].points[i][0] < rounds[_roundIndex].points[i][1]) {
            scores[rounds[_roundIndex].opponents[i][1] - 1] += rounds[_roundIndex].points[i][1];
        }
    }

    // min
    uint index = 0;

    uint min = scores[0];

    for (i = 1; i < scores.length; i++) {
        if (scores[i] < min) {
            min = scores[i];
            index = i;
        }
    }

    // max
    index = 0;

    uint counter = 1;
    uint max = scores[0];

    for(counter; counter < scores.length; counter++) {
        if(scores[index] < scores[counter]) {
            index = counter;
            max = scores[index];
        }
    }

    if (max == min) {
    } else {
        for (i = 0; i < scores.length; i++) {
          if (scores[i] == min) {
            rounds[_roundIndex].losers.push(i);
          }
        }
    }

    emit RoundClosed(_roundIndex, rounds[_roundIndex].losers);
  }

  function getRoundOpponents(uint _roundIndex) constant public returns (uint[2][]) {
    return (rounds[_roundIndex].opponents);
  }

  function getRoundPoints(uint _roundIndex) constant public returns (uint[2][]) {
    return (rounds[_roundIndex].points);
  }

  function getRoundLosers(uint _roundIndex) constant public returns (uint[]) {
    return (rounds[_roundIndex].losers);
  }

  function getMatches(uint _roundIndex) constant public returns (uint[2][], uint[2][]) {
    return (rounds[_roundIndex].opponents, rounds[_roundIndex].points);
  }

  function getMatch(uint _roundIndex, uint _matchIndex) constant public returns (uint[2], uint[2]) {
    return (rounds[_roundIndex].opponents[_matchIndex], rounds[_roundIndex].points[_matchIndex]);
  }

  function getRoundCount() constant public returns (uint256) {
    return rounds.length;
  }

  function getMatchCount(uint _roundIndex) constant public returns (uint256) {
    return rounds[_roundIndex].opponents.length;
  }
}
