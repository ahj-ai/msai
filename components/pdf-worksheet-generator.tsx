'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateMathProblem } from '@/utils/generate-math-problem'
import { FileDown } from 'lucide-react'
import { jsPDF } from "jspdf"

interface PDFWorksheetGeneratorProps {
  subject: string
  topic: string
}

const PDFWorksheetGenerator: React.FC<PDFWorksheetGeneratorProps> = ({ subject, topic }) => {
  const [numProblems, setNumProblems] = useState(10)
  const [difficulty, setDifficulty] = useState<'regular' | 'honors' | 'ap'>('regular')

  const generatePDF = () => {
    const doc = new jsPDF()
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)

    let yPosition = 20

    doc.text(`${subject} - ${topic} Worksheet`, 105, yPosition, { align: 'center' })
    yPosition += 20

    for (let i = 1; i <= numProblems; i++) {
      const problem = generateMathProblem(subject, topic, difficulty)
      doc.text(`${i}. ${problem.question}`, 20, yPosition)
      yPosition += 10

      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
    }

    doc.addPage()
    yPosition = 20
    doc.text("Solutions", 105, yPosition, { align: 'center' })
    yPosition += 20

    for (let i = 1; i <= numProblems; i++) {
      const problem = generateMathProblem(subject, topic, difficulty)
      doc.text(`${i}. ${problem.solution}`, 20, yPosition)
      yPosition += 10

      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
    }

    doc.save(`${subject}_${topic}_worksheet.pdf`)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
        <div className="w-full sm:w-1/2">
          <label htmlFor="numProblems" className="block text-sm font-medium text-purple-200">
            Number of Problems
          </label>
          <Input
            id="numProblems"
            type="number"
            value={numProblems}
            onChange={(e) => setNumProblems(parseInt(e.target.value))}
            min={1}
            max={50}
            className="mt-1 w-full bg-gray-800/50 border-purple-500/30 text-purple-200"
          />
        </div>
        <div className="w-full sm:w-1/2">
          <label htmlFor="difficulty" className="block text-sm font-medium text-purple-200">
            Difficulty
          </label>
          <Select value={difficulty} onValueChange={(value: 'regular' | 'honors' | 'ap') => setDifficulty(value)}>
            <SelectTrigger id="difficulty" className="mt-1 w-full bg-gray-800/50 border-purple-500/30 text-purple-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="honors">Honors</SelectItem>
              <SelectItem value="ap">AP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={generatePDF} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
        <FileDown className="mr-2 h-4 w-4" /> Generate PDF Worksheet
      </Button>
    </div>
  )
}

export default PDFWorksheetGenerator

