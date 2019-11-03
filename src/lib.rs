use error_chain::error_chain;
use futures::{channel::mpsc::*, prelude::*};
use serde::Serialize;
use std::pin::Pin;

error_chain! {
  types {
    Error, ErrorKind, ResultExt, Result;
  }
}

pub struct NetworkGraph<T> {
  sink: Pin<Box<T>>,
  receiver: UnboundedReceiver<Vec<u8>>,
}

impl<T> NetworkGraph<T>
where
  T: Sink<Vec<u8>>,
  T::Error: std::error::Error + Send + 'static,
{
  pub fn new(sink: T) -> (Self, NetworkGraphController) {
    let (sender, receiver) = unbounded();

    (
      Self {
        sink: Box::pin(sink),
        receiver,
      },
      NetworkGraphController { sender },
    )
  }

  pub async fn process(mut self) -> Result<()> {
    while let Some(bytes) = self.receiver.next().await {
      self
        .sink
        .send(bytes)
        .await
        .chain_err(|| "sink send error")?;
    }

    Ok(())
  }
}

#[derive(Clone)]
pub struct NetworkGraphController {
  sender: UnboundedSender<Vec<u8>>,
}

impl NetworkGraphController {
  pub async fn add_node(&mut self) -> Result<()> {
    #[derive(Serialize)]
    struct Node {};

    let node = Node {};
    let serialized = serde_json::to_vec(&node).chain_err(|| "serde_json serialize error")?;

    self
      .sender
      .send(serialized)
      .await
      .chain_err(|| "sink send error")?;

    Ok(())
  }
}
