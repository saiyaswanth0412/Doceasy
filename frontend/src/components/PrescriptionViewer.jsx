import React from 'react'
import jsPDF from 'jspdf'
import { toast } from 'react-toastify'

const PrescriptionViewer = ({ appointment, currencySymbol }) => {
  const { prescription, docData, userData } = appointment

  const downloadPDF = () => {
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 15

      // Header
      doc.setFontSize(24)
      doc.setTextColor(41, 128, 185)
      doc.text('PRESCRIPTION', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 15

      // Doctor Info
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`Dr. ${docData.name}`, 20, yPosition)
      yPosition += 6
      doc.setFontSize(10)
      doc.text(`Speciality: ${docData.speciality}`, 20, yPosition)
      yPosition += 10

      // Patient Info
      doc.setFontSize(10)
      doc.text(`Patient: ${userData.name}`, 20, yPosition)
      yPosition += 5
      doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`, 20, yPosition)
      yPosition += 10

      // Medicines Section
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('MEDICINES:', 20, yPosition)

      yPosition += 7

      // Table headers
      const medicineData = prescription.medicines.map((med, idx) => [
        idx + 1,
        med.name,
        med.dosage,
        med.frequency,
        med.duration,
        med.instructions
      ])

      const startY = yPosition
      const cellPadding = 3
      const rowHeight = 8

      // Draw medicines table
      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)

      // Column widths
      const colWidths = [8, 30, 20, 25, 20, 30]
      const xPositions = [20, 30, 60, 85, 110, 140]
      const headers = ['#', 'Medicine', 'Dosage', 'Frequency', 'Duration', 'Instructions']

      // Draw headers
      doc.setFont(undefined, 'bold')
      headers.forEach((header, i) => {
        doc.text(header, xPositions[i], yPosition)
      })
      yPosition += rowHeight

      // Draw rows
      doc.setFont(undefined, 'normal')
      medicineData.forEach((row) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage()
          yPosition = 15
        }
        row.forEach((cell, i) => {
          doc.text(cell.toString(), xPositions[i], yPosition)
        })
        yPosition += rowHeight
      })

      // Notes Section
      if (prescription.notes) {
        yPosition += 5
        doc.setFont(undefined, 'bold')
        doc.text('NOTES:', 20, yPosition)
        yPosition += 5

        doc.setFont(undefined, 'normal')
        const noteLines = doc.splitTextToSize(prescription.notes, 170)
        doc.text(noteLines, 20, yPosition)
        yPosition += noteLines.length * 5 + 5
      }

      // Footer
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text('This prescription is generated digitally and is valid without signature.', pageWidth / 2, pageHeight - 10, { align: 'center' })

      // Save PDF
      doc.save(`prescription_${userData.name}_${Date.now()}.pdf`)
      toast.success('Prescription downloaded successfully')
    } catch (error) {
      console.log(error)
      toast.error('Failed to download prescription')
    }
  }

  if (!prescription || !prescription.medicines || prescription.medicines.length === 0) {
    return null
  }

  return (
    <div className='bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 mb-6 shadow-md'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-2xl font-bold text-gray-800 dark:text-white'>Prescription</h3>
        <button
          onClick={downloadPDF}
          className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
          </svg>
          Download PDF
        </button>
      </div>

      {/* Doctor Info */}
      <div className='grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700'>
        <div>
          <p className='text-sm font-semibold text-gray-600 dark:text-gray-400'>Doctor</p>
          <p className='text-lg font-bold text-gray-800 dark:text-white'>{docData.name}</p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>{docData.speciality}</p>
        </div>
        <div>
          <p className='text-sm font-semibold text-gray-600 dark:text-gray-400'>Date Issued</p>
          <p className='text-lg font-bold text-gray-800 dark:text-white'>
            {new Date(prescription.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Medicines */}
      <div className='mb-6'>
        <h4 className='text-lg font-bold text-gray-800 dark:text-white mb-4'>Medicines</h4>
        <div className='space-y-3'>
          {prescription.medicines.map((medicine, index) => (
            <div key={index} className='bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600'>
              <div className='grid grid-cols-2 gap-3 mb-2'>
                <div>
                  <p className='text-xs font-semibold text-gray-600 dark:text-gray-400'>Medicine</p>
                  <p className='text-base font-bold text-gray-800 dark:text-white'>{medicine.name}</p>
                </div>
                <div>
                  <p className='text-xs font-semibold text-gray-600 dark:text-gray-400'>Dosage</p>
                  <p className='text-base font-bold text-gray-800 dark:text-white'>{medicine.dosage}</p>
                </div>
              </div>
              <div className='grid grid-cols-3 gap-3'>
                <div>
                  <p className='text-xs font-semibold text-gray-600 dark:text-gray-400'>Frequency</p>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>{medicine.frequency}</p>
                </div>
                <div>
                  <p className='text-xs font-semibold text-gray-600 dark:text-gray-400'>Duration</p>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>{medicine.duration}</p>
                </div>
                <div>
                  <p className='text-xs font-semibold text-gray-600 dark:text-gray-400'>Instructions</p>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>{medicine.instructions || '-'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {prescription.notes && (
        <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4'>
          <p className='text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2'>Additional Notes</p>
          <p className='text-sm text-yellow-700 dark:text-yellow-200'>{prescription.notes}</p>
        </div>
      )}
    </div>
  )
}

export default PrescriptionViewer
