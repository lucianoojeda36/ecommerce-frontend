import { useRef, useState } from 'react'

interface FileInputProps {
  multiple?: boolean
  accept?: string
  files: File[]
  onChange: (files: File[]) => void
  label?: string
  className?: string
}

export default function FileInput({ multiple = false, accept = 'image/*', files, onChange, label = 'Archivos', className = '' }: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return
    const list = Array.from(newFiles)
    onChange(multiple ? [...files, ...list] : [list[0]])
  }

  const remove = (index: number) => {
    onChange(files.filter((_, i) => i !== index))
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-2
          w-full p-6 border-2 border-dashed rounded-xl cursor-pointer
          transition-all duration-200
          ${drag
            ? 'border-blue-400 bg-blue-50'
            : files.length > 0
              ? 'border-green-300 bg-green-50/50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={e => handleFiles(e.target.files)}
          className="hidden"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${files.length > 0 ? 'text-green-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
        <span className="text-sm text-gray-600 font-medium">
          {files.length > 0 ? `${files.length} archivo(s) seleccionado(s)` : 'Arrastrá archivos o hacé clic'}
        </span>
        <span className="text-xs text-gray-400">PNG, JPG, WEBP — Max 5MB</span>
      </div>

      {files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm">
              <span className="max-w-[140px] truncate">{file.name}</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); remove(i) }} className="text-gray-400 hover:text-red-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
