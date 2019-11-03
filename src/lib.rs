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

  pub async fn add_edge(&mut self, from: NodeId, to: NodeId, edge: Edge) -> Result<()> {
    let id = get_edge_id(&from, &to);
    self
      .send_event(Event::AddEdge(EdgeWithId { id, from, to, edge }))
      .await
  }

  pub async fn update_node(&mut self, id: NodeId, node: Node) -> Result<()> {
    self
      .send_event(Event::UpdateNode(NodeWithId { id, node }))
      .await
  }

  pub async fn update_edge(&mut self, from: NodeId, to: NodeId, edge: Edge) -> Result<()> {
    let id = get_edge_id(&from, &to);
    self
      .send_event(Event::UpdateEdge(EdgeWithId { id, from, to, edge }))
      .await
  }

  pub async fn remove_node(&mut self, id: NodeId) -> Result<()> {
    self.send_event(Event::RemoveNode(id)).await
  }

  pub async fn remove_edge(&mut self, id: EdgeId) -> Result<()> {
    self.send_event(Event::RemoveEdge(id)).await
  }
}

pub fn get_edge_id(a: &str, b: &str) -> EdgeId {
  if a >= b {
    format!("{}{}", a, b)
  } else {
    format!("{}{}", b, a)
  }
}

pub type NodeId = String;
pub type EdgeId = String;

#[derive(Debug, Serialize)]
pub struct Node {
  pub label: String,
  pub title: String,
  pub icon: Option<Icon>,
}

impl Default for Node {
  fn default() -> Self {
    Self {
      label: "".to_string(),
      title: "".to_string(),
      icon: None,
    }
  }
}

#[derive(Debug, Serialize)]
pub struct Icon {
  pub code: String,
  pub size: u8,
  pub color: String,
}

#[derive(Debug, Serialize)]
pub struct Edge {
  pub label: String,
  pub title: String,
  pub dashes: bool,
  pub width: u8,
  pub color: Color,
}

impl Default for Edge {
  fn default() -> Self {
    Self {
      label: "".to_string(),
      title: "".to_string(),
      dashes: false,
      width: 3,
      color: Default::default(),
    }
  }
}

#[derive(Debug, Serialize)]
pub struct Color {
  pub color: String,
  pub highlight: String,
  pub hover: String,
}

impl Default for Color {
  fn default() -> Self {
    Self {
      color: "#2B7CE9".to_string(),
      highlight: "#2B7CE9".to_string(),
      hover: "#2B7CE9".to_string(),
    }
  }
}

#[derive(Serialize)]
pub struct NodeWithId {
  id: NodeId,

  #[serde(flatten)]
  node: Node,
}

#[derive(Serialize)]
pub struct EdgeWithId {
  id: EdgeId,

  from: EdgeId,
  to: EdgeId,

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
