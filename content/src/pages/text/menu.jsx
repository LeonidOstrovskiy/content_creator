import './styles.scss';
//import ListItem from '@tiptap/extension-list-item';
import { GoItalic, GoBold } from 'react-icons/go';
import { ImUndo, ImRedo } from 'react-icons/im';
import { AiOutlineOrderedList } from 'react-icons/ai';
import { MdFormatListBulleted } from 'react-icons/md';
//import { EditorContent, useEditor } from '@tiptap/react';
//import StarterKit from '@tiptap/starter-kit';
import React from 'react';

const Menu = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const buttonClass = 'menu-button ';

  return (
    <div className="menu">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={buttonClass}
      >
        <GoBold size={10} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={buttonClass}
      >
        <GoItalic size={10} />
      </button>

      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={buttonClass}
      >
        p
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={buttonClass}
      >
        h4
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass}
      >
        <MdFormatListBulleted size={10} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass}
      >
        <AiOutlineOrderedList size={10} />
      </button>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={buttonClass}
      >
        <ImUndo size={10} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={buttonClass}
      >
        <ImRedo size={10} />
      </button>
    </div>
  );
};

export default Menu;
