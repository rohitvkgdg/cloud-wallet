import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import "./App.css"
import SendSOL from "./components/SendSOL"
import { useState } from "react"

function App() {
  const [toAddress,setToAddress] = useState("")
  const [amount,setAmount] = useState("0.0")
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-2">
      <h1 className="text-4xl mb-10 font-bold">SOL Transfer</h1>
      <div className="relative">
        <Input
        onChange ={(e) => setAmount(e.target.value)} 
        className="peer ps-3 pe-25" placeholder="0.00" type="text" />
        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
          SOL
        </span>
      </div>
      <div className="relative">
        <Input 
        onChange={(e) => setToAddress(e.target.value)}
        className="peer ps-3 pe-25" placeholder="" type="text" />
        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
          Address
        </span>
      </div>
      <Button 
      onClick={() => SendSOL(toAddress, parseFloat(amount))}>Submit</Button>
    </div>
  )
}

export default App
