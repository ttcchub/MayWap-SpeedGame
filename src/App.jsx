import "./App.css";
import { Component } from "react";
import Circle from "./Circle";
import Modal from "./Modal";
import Life from "./Life";
import click from "./assets/sounds/start.mp3";
import mwapLogo from "./assets/img/mwap-logo.png";
import startSound from "./assets/sounds/start.mp3";
import { TonConnectUIProvider, TonConnectButton, useTonAddress, useTonWallet } from '@tonconnect/ui-react'; // Import necessary hooks

let clickSound = new Audio(click);
let gameOver = new Audio(startSound);

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function component to display user's Ton address
const Address = () => {
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);

  return (
    userFriendlyAddress && (
      <div>
        <p>User-friendly address: {userFriendlyAddress}</p>
        <p>Raw address: {rawAddress}</p>
      </div>
    )
  );
};

// Function component to display wallet information
const WalletInfo = () => {
  const wallet = useTonWallet();

  return (
    wallet && (
      <div>
        <p>Connected wallet: {wallet.name}</p>
        <p>Device: {wallet.device.appName}</p>
      </div>
    )
  );
};

class App extends Component {
  state = {
    score: 0,
    lives: 3,
    circlesNum: 4,
    livesArray: [],
    circles: [],
    gameInProgress: false,
    modalActive: false,
    startButtonActive: true,
    current: undefined,
    correctClicked: true,
    pace: 1000,
    gameOverMessage: "",
    gameOverSubmessage: "",
    soundOn:
      localStorage.getItem("soundOn") === null
        ? true
        : JSON.parse(localStorage.getItem("soundOn")),
  };

  timer;

  initLivesArray = () => {
    let lives = [];
    for (let i = 0; i < this.state.lives; i++) lives.push(i);
    this.setState({ livesArray: lives });
  };

  toggleSound = (soundOn) => {
    this.setState({ soundOn: !soundOn });
    localStorage.setItem("soundOn", !soundOn);
  };

  closeModal = () => {
    this.setState({ modalActive: false });
    this.resetGame();
  };

  toggleButtons = () => {
    this.setState({ gameInProgress: !this.state.gameInProgress });
    this.setState({ startButtonActive: !this.state.startButtonActive });
  };

  startGame = () => {
    this.toggleButtons();
    if (this.state.soundOn) clickSound.play();
    this.nextCircle();
  };

  setGameOverMessage = () => {
    if (this.state.score < 199) {
      this.setState({ gameOverMessage: "Total combination" });
    }
  };

  endGame = () => {
    if (this.state.soundOn) gameOver.play();
    this.toggleButtons();
    this.setGameOverMessage();
    this.setState({ modalActive: true });
    clearTimeout(this.timer);
  };

  resetGame = () => {
    window.location.reload();
  };

  componentDidMount() {
    let res = [];
    for (let i = 0; i < this.state.circlesNum; i++) res.push(i);
    this.setState({ circles: res });
    this.initLivesArray();
  }

  clickCircle = (key) => {
    if (!this.state.gameInProgress || this.state.correctClicked) return;

    if (key !== this.state.current) {
      this.endGame();
    } else {
      this.setState({
        score: this.state.score + 1,
        correctClicked: true,
      });
    }
  };

  nextCircle = () => {
    console.log(`pace: ${this.state.pace}ms`);

    if (!this.state.correctClicked) {
      this.setState({
        lives: this.state.lives - 1,
        livesArray: this.state.livesArray.slice(1),
      });
      if (this.state.lives <= 1) {
        this.endGame();
        return;
      }
    }

    let nextActive;
    do {
      nextActive = getRandomInt(0, this.state.circlesNum - 1);
    } while (nextActive === this.state.current);

    this.setState({
      current: nextActive,
      pace: this.state.pace - 20,
    });

    this.setState({ correctClicked: false });

    this.timer = setTimeout(
      this.nextCircle,
      this.state.pace,
      this.state.correctClicked
    );
  };

  render() {
    const circles = this.state.circles.map((circle, i) => (
      <Circle
        key={i}
        id={i}
        clickHandler={() => this.clickCircle(i)}
        active={this.state.current === i}
      />
    ));

    const lives = this.state.livesArray.map((life, i) => <Life key={i} />);

    return (
      // Wrap the app with TonConnectUIProvider and add the actionsConfiguration prop
      <TonConnectUIProvider
        manifestUrl="https://www.maywap.xyz/tonconnect-manifest.json"
        actionsConfiguration={{
          twaReturnUrl: 'https://t.me/maywap_game_bot/mwapspeedgame'
        }}
      >
        <div className="App">
          <div className="header-container"></div>
          <div className="button-row">
            <img src={mwapLogo} alt="MWAP Logo" className="logo" />
            {/* Replace div with the actual TonConnectButton */}
            <TonConnectButton className="ton-btn" />
          </div>

          <div>
            {this.state.modalActive && (
              <Modal
                score={this.state.score}
                closeModal={this.closeModal}
                message={this.state.gameOverMessage}
                submessage={this.state.gameOverSubmessage}
              />
            )}

            <div className="status-bar">
              <p className="lives">{lives}</p>
              <div className="game-info-bar">
                <p className="game-score">
                  <span>{this.state.score}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="container circle-container">
            <div className="circle-wrapper circle-1">
              <Circle
                key={0}
                id={0}
                clickHandler={() => this.clickCircle(0)}
                active={this.state.current === 0}
              />
            </div>

            <div className="circle-wrapper circle-2">
              <Circle
                key={1}
                id={1}
                clickHandler={() => this.clickCircle(1)}
                active={this.state.current === 1}
              />
            </div>

            <div className="circle-wrapper circle-3">
              <Circle
                key={2}
                id={2}
                clickHandler={() => this.clickCircle(2)}
                active={this.state.current === 2}
              />
            </div>

            <div className="circle-wrapper circle-4">
              <Circle
                key={3}
                id={3}
                clickHandler={() => this.clickCircle(3)}
                active={this.state.current === 3}
              />
            </div>
          </div>

          <div className="game-buttons">
            {this.state.startButtonActive && (
              <button className="start-btn" onClick={this.startGame}>
                START
              </button>
            )}
            {this.state.gameInProgress && (
              <button className="end-btn" onClick={this.endGame}>
                STOP
              </button>
            )}
          </div>

          {/* Display wallet address and wallet information */}
          <div className="wallet-info">
            <h3>Wallet Information</h3>
            <Address />
            <WalletInfo />
          </div>
        </div>
      </TonConnectUIProvider>
    );
  }
}

export default App;
