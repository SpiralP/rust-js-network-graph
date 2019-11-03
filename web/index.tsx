import React from "react";
import Websocket from "react-websocket";

interface NetworkGraphState {
  connected: boolean;
}

export class NetworkGraph extends React.Component<{}, NetworkGraphState> {
  state: NetworkGraphState = {
    connected: false,
  };

  handleMessage(msg: string) {}

  render() {
    return (
      <Websocket
        url={`ws://${location.host}/ws`}
        onMessage={(msg: string) => this.handleMessage(msg)}
        onOpen={() => {
          // status("websocket opened");
          this.setState({ connected: true });
        }}
        onClose={() => {
          // status("websocket closed");
          // toaster.show({
          //   message: "websocket closed",
          //   intent: "danger",
          //   timeout: 10000,
          // });

          this.setState({ connected: false });
        }}
        debug={true}
        reconnect={false}
      />
    );
  }
}
