"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { useState, useEffect } from 'react'
import { Button } from './button'
import { ColorPicker } from './color-picker'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-react'

interface TipTapEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function TipTapEditor({
  value,
  onChange,
  className = ""
}: TipTapEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [color, setColor] = useState('#000000')
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextStyle,
      Color
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const addLink = () => {
    if (!editor) return
    
    const url = window.prompt('URL')
    
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    if (!editor) return
    
    const url = window.prompt('Image URL')
    
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setTextColor = (newColor: string) => {
    if (!editor) return
    
    setColor(newColor)
    editor.chain().focus().setColor(newColor).run()
  }

  if (!isMounted) {
    return <div className={`min-h-[300px] border rounded-md bg-white ${className}`} />
  }

  return (
    <div className={`border rounded-md ${className}`}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-white">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'bg-muted text-white' : 'text-black'}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'bg-muted text-white' : 'text-black'}
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor?.isActive('heading', { level: 1 }) ? 'bg-muted text-white' : 'text-black'}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor?.isActive('heading', { level: 2 }) ? 'bg-muted text-white' : 'text-black'}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? 'bg-muted text-white' : 'text-black'}
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive('orderedList') ? 'bg-muted text-white' : 'text-black'}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={addLink}
          className={editor?.isActive('link') ? 'bg-muted text-white' : 'text-black'}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={addImage}
          className="text-black"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        
        <ColorPicker 
          value={color} 
          onChange={setTextColor} 
        />
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
          className="text-black"
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
          className="text-black"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none p-4 min-h-[250px] focus:outline-none bg-white text-black" 
      />
    </div>
  )
} 