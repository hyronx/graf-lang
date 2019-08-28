import Rete from "rete"

export const anySocket = new Rete.Socket("Any")

export const iterableSocket = new Rete.Socket("Iterable")
iterableSocket.combineWith(anySocket)

export const joinableSocket = new Rete.Socket("Joinable")
joinableSocket.combineWith(anySocket)
