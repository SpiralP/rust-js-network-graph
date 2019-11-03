declare module "react-websocket" {
  interface Props {
    url: string;
    onMessage: (msg: string) => void;
    onOpen: () => void;
    onClose: () => void;
    debug: boolean;
    reconnect: boolean;
  }
  class Websocket extends React.Component<Props, {}> {}
  export default Websocket;
}
