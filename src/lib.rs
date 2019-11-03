use error_chain::error_chain;
use futures::{
  channel::mpsc::{unbounded, UnboundedReceiver, UnboundedSender},
  prelude::*,
};
use serde::Serialize;
use std::pin::Pin;

error_chain! {
  types {
    Error, ErrorKind, ResultExt, Result;
  }
}

pub struct NetworkGraph<T> {
  sink: Pin<Box<T>>,
  receiver: UnboundedReceiver<String>,
}

impl<T> NetworkGraph<T>
where
  T: Sink<String>,
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

  pub async fn process_events(mut self) -> Result<()> {
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
  sender: UnboundedSender<String>,
}

impl NetworkGraphController {
  async fn send_event(&mut self, event: Event) -> Result<()> {
    let serialized = serde_json::to_string(&event).chain_err(|| "serde_json serialize error")?;

    self
      .sender
      .send(serialized)
      .await
      .chain_err(|| "sink send error")?;

    Ok(())
  }

  pub async fn add_node(&mut self, id: NodeId, node: Node) -> Result<()> {
    self
      .send_event(Event::AddNode(NodeWithId { id, node }))
      .await
  }

  pub async fn add_edge(&mut self, from_id: NodeId, to_id: NodeId, edge: Edge) -> Result<()> {
    let id = get_edge_id(from_id, to_id);
    self
      .send_event(Event::AddEdge(EdgeWithId { id, edge }))
      .await
  }

  pub async fn update_node(&mut self, id: NodeId, node: Node) -> Result<()> {
    self
      .send_event(Event::UpdateNode(NodeWithId { id, node }))
      .await
  }

  pub async fn update_edge(&mut self, from_id: NodeId, to_id: NodeId, edge: Edge) -> Result<()> {
    let id = get_edge_id(from_id, to_id);
    self
      .send_event(Event::UpdateEdge(EdgeWithId { id, edge }))
      .await
  }

  pub async fn remove_node(&mut self, id: NodeId) -> Result<()> {
    self.send_event(Event::RemoveNode(id)).await
  }

  pub async fn remove_edge(&mut self, id: EdgeId) -> Result<()> {
    self.send_event(Event::RemoveEdge(id)).await
  }
}

pub fn get_edge_id(a: NodeId, b: NodeId) -> EdgeId {
  if a >= b {
    format!("{}{}", a, b)
  } else {
    format!("{}{}", b, a)
  }
}

pub type NodeId = String;
pub type EdgeId = String;

#[derive(Serialize)]
pub struct Node {}

#[derive(Serialize)]
pub struct Edge {}

#[derive(Serialize)]
pub struct NodeWithId {
  id: NodeId,

  #[serde(flatten)]
  node: Node,
}

#[derive(Serialize)]
pub struct EdgeWithId {
  id: EdgeId,

  #[serde(flatten)]
  edge: Edge,
}

#[derive(Serialize)]
#[serde(tag = "type", content = "data")] // {type: "AddNode", data: "{ id: 'a' }"}
enum Event {
  AddNode(NodeWithId),
  AddEdge(EdgeWithId),
  UpdateNode(NodeWithId),
  UpdateEdge(EdgeWithId),
  RemoveNode(NodeId),
  RemoveEdge(EdgeId),
}
