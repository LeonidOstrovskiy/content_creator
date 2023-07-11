import { useState, useEffect } from 'react';
import './styles.scss';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Menu from './menu';
import { addToDB, getTopics } from '../../firebase/routes';

import { BiSearchAlt } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { getDocById } from '../../firebase/routes';

import axios from 'axios';

export const Text = () => {
  const [text, setText] = useState('Type here');
  const [tempText, setTempText] = useState(text);
  const [error, setError] = useState('');
  const [topic, setTopic] = useState('');
  const [searchTopic, setSearchTopic] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [topics, setTopics] = useState([]);
  const [searchedTopics, setSearchedTopics] = useState(topics);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    getTopics(setTopics, setSearchedTopics);
  }, []);

  const handleOnChangeText = ({ editor }) => {
    if (!editor) {
      return;
    }
    if (!editor.isEmpty) {
      setError('');
      setText(editor?.getHTML() || '');
    }
  };

  const handleGetDocFromDb = async (id) => {
    await getDocById(id, setText, setTopic, editor);
    setTempText('');
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p> Type here </p>',
    editorProps: {
      attributes: {
        class: 'editor',
      },
    },
    isEditable: true,
    onUpdate: handleOnChangeText,
  });

  const handleCancel = () => {
    editor?.commands.setContent(tempText);
  };

  const handleSave = () => {
    if (topic === '') {
      setError('Add topic!');
      return;
    }
    // console.log(text);
    if (text.length <= 10) {
      // console.log('empty text!');
      setError('Document is empty');
      return;
    }

    addToDB({
      topic: topic,
      text: text,
    });
    setTempText('');
    setError('');
    setText('Type here');
  };

  useEffect(() => {
    const handleSearch = () => {
      if (!isSearching) {
        return;
      }
      //console.log(searchTopic);
      if (searchTopic.length < 2) {
        setSearchedTopics(topics);
        return;
      }
      setSearchedTopics(
        topics.filter((topic) => {
          return Object.values(topic)
            .join('')
            .toLowerCase()
            .includes(searchTopic.toLowerCase());
        })
      );
    };
    let debouncing = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(debouncing);
  }, [searchTopic, topics, isSearching]);

  const handleOpenAi = async () => {
    const url = `${import.meta.env.VITE_BASE_URL}/openai`;
    if (topic.length < 2) {
      return;
    }

    try {
      const result = await axios.post(url, {
        data: { role: 'system', topic: topic },
      });
      if (result.data.msg.choices[0].message.content) {
        //console.log(result.data.msg.choices[0].message.content);
        setText(result.data.msg.choices[0].message.content);
        setTempText(result.data.msg.choices[0].message.content);
        editor?.commands.setContent(result.data.msg.choices[0].message.content);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className="wrapper">
      <div className="topic-wrapper">
        <>
          <input
            className="input-topic"
            placeholder="topic"
            type="text"
            onChange={(e) => setTopic(e.target.value)}
            value={topic}
          />
          {error && <div className="error">{error}</div>}
        </>
        <div className="search">
          {isSearching ? (
            <>
              <BiSearchAlt size={30} />
              <input
                className="input-topic"
                placeholder="search topic"
                type="text"
                onChange={(e) => setSearchTopic(e.target.value)}
                value={searchTopic}
              />
              <AiFillCloseCircle
                size={30}
                onClick={() => {
                  setIsSearching(false);
                  setSearchedTopics(topics);
                  setSearchTopic('');
                }}
                style={{ cursor: 'pointer' }}
              />
            </>
          ) : (
            <button className="search-btn" onClick={() => setIsSearching(true)}>
              Search database
            </button>
          )}
        </div>
      </div>

      <div className={windowWidth > 700 ? 'main-field' : 'medium'}>
        <div className="menu-editor">
          <Menu editor={editor} />
          <div className="editor-wrapper">
            <EditorContent editor={editor} />
          </div>
          <div className="menu">
            <button className="menu-button " onClick={handleSave}>
              Save
            </button>
            <button className="menu-button " onClick={handleOpenAi}>
              Ask OpenAI
            </button>
            <button className="menu-button " onClick={handleCancel}>
              Cancel{' '}
            </button>
          </div>
        </div>
        <div className={windowWidth > 700 ? 'topics' : 'topics-row'}>
          {searchedTopics?.map((top) => (
            <p
              className="topic-div"
              key={top.id}
              onClick={() => handleGetDocFromDb(top.id)}
            >
              {' '}
              {top.topic}{' '}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
