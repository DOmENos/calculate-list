"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import jsPDF from "jspdf"

interface NumberEntry {
  id: number
  value: number
}

export default function Calculator() {
  const [inputValue, setInputValue] = useState("")
  const [numbers, setNumbers] = useState<NumberEntry[]>([
    { id: 1, value: 1000.0 },
    { id: 2, value: 500.0 },
    { id: 3, value: 20.0 },
    { id: 4, value: 30.02 },
  ])
  const [nextId, setNextId] = useState(5)

  const total = numbers.reduce((sum, entry) => sum + entry.value, 0)

  const handleAdd = () => {
    const value = Number.parseFloat(inputValue)
    if (!isNaN(value) && inputValue.trim() !== "") {
      setNumbers([...numbers, { id: nextId, value }])
      setNextId(nextId + 1)
      setInputValue("")
    }
  }

  const handleDelete = (id: number) => {
    setNumbers(numbers.filter((entry) => entry.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd()
    }
  }

  const exportToPdf = () => {
    const doc = new jsPDF()

    // Set font (using default font since Thai fonts need special handling)
    doc.setFontSize(16)
    doc.text("Calculator Report", 20, 20)

    doc.setFontSize(12)
    let yPosition = 40

    // Add table headers
    doc.text("Order", 20, yPosition)
    doc.text("Number", 60, yPosition)
    yPosition += 10

    // Add line
    doc.line(20, yPosition, 180, yPosition)
    yPosition += 10

    // Add data
    numbers.forEach((entry, index) => {
      doc.text((index + 1).toString(), 20, yPosition)
      doc.text(entry.value.toFixed(2), 60, yPosition)
      yPosition += 10
    })

    // Add total
    yPosition += 5
    doc.line(20, yPosition, 180, yPosition)
    yPosition += 10
    doc.text("Total:", 20, yPosition)
    doc.text(total.toFixed(2), 60, yPosition)

    doc.save("calculator-report.pdf")
  }

  const exportToExcel = () => {
    let csvContent = "Order,Number\n"
    numbers.forEach((entry, index) => {
      csvContent += `${index + 1},${entry.value.toFixed(2)}\n`
    })
    csvContent += `Total,${total.toFixed(2)}\n`

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "calculator-report.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      {/* Input Section */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-gray-700 font-medium">ระบุตัวเลข</span>
          <div className="flex-1 flex gap-2">
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="0"
              className="text-center"
            />
            <Button onClick={handleAdd} className="bg-green-500 hover:bg-green-600 text-white px-4">
              เพิ่ม
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 mb-3 text-gray-600 font-medium">
          <div>ลำดับ</div>
          <div className="text-center">ตัวเลข</div>
          <div className="text-center">ลบ</div>
        </div>

        {/* Table Rows */}
        {numbers.map((entry, index) => (
          <div key={entry.id} className="grid grid-cols-3 gap-4 py-2 border-b border-gray-200 last:border-b-0">
            <div className="text-gray-700">{index + 1}</div>
            <div className="text-center text-gray-700">{entry.value.toFixed(2)}</div>
            <div className="text-center">
              <Button onClick={() => handleDelete(entry.id)} variant="destructive" size="sm" className="h-6 w-6 p-0">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        {/* Total Row */}
        <div className="grid grid-cols-3 gap-4 pt-3 mt-3 border-t-2 border-gray-300 font-bold">
          <div className="text-gray-700">รวม</div>
          <div className="text-center text-gray-700">{total.toFixed(2)}</div>
          <div></div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4 justify-center">
        <Button onClick={exportToPdf} className="bg-blue-500 hover:bg-blue-600 text-white">
          Export to Pdf
        </Button>
        <Button onClick={exportToExcel} className="bg-green-500 hover:bg-green-600 text-white">
          Export to excel
        </Button>
      </div>
    </div>
  )
}
