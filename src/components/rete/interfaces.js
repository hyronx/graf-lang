import Rete from "rete"

export const anySocket = new Rete.Socket("Any")

export const messageSocket = new Rete.Socket("Message")
messageSocket.combineWith(anySocket)

export const iterableSocket = new Rete.Socket("Iterable")
iterableSocket.combineWith(anySocket)

export const joinableSocket = new Rete.Socket("Joinable")
joinableSocket.combineWith(anySocket)
