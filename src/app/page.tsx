import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert""use client"

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

              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
