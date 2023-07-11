import './style.scss';
import { useState, useEffect } from 'react';

import { BiSearchAlt } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import axios from 'axios';
import { uploadImage, getAllImageTopics } from '../../firebase/images';

export const ImagePage = () => {
  const [topic, setTopic] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTopic, setSearchTopic] = useState('');
  const [topics, setTopics] = useState([]);
  const [searchedTopics, setSearchedTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imgurl, setImgurl] = useState('');

  const [fileToSend, setFileToSend] = useState({});

  const [saveDisabled, setSaveDisabled] = useState(true);

  const handleCreateImage = async () => {
    if (topic.length < 3) {
      setError('Please be more precise');
      return;
    }
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/openai/getimage`;
      const imageLink = await axios.post(url, { data: { topic: topic } });
      setImgurl(imageLink.data.msg.data[0].url);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  function download() {
    if (topic === '') {
      return;
    }
    if (
      fileToSend === undefined ||
      fileToSend?.name === undefined ||
      !fileToSend.name
    ) {
      setSaveDisabled(true);
      return;
    }
    uploadImage(fileToSend, topic);
    setFileToSend({});
    setSaveDisabled(true);

    /* axios({
      url: aiLink,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'image.png');
      document.body.appendChild(link);
      link.click();
    }); */
  }

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleWindowResize);

    return () => removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    getAllImageTopics(setTopics, setSearchedTopics);
  }, []);

  useEffect(() => {
    const handleSearch = () => {
      if (searchTopic.length < 2) {
        setSearchedTopics(topics);
        return;
      }
      setSearchedTopics(
        topics.filter((val) => {
          return Object.values(val)
            .join('')
            .toLowerCase()
            .includes(searchTopic.toLowerCase());
        })
      );
    };

    let debounce = setTimeout(() => {
      return handleSearch();
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchTopic, topics]);

  const handleGetImgFromDb = (top) => {
    setImgurl(top.imageUrl);
    setTopic(top.topic);
  };

  return (
    <div className="wrapper-image">
      <div
        className={
          windowWidth > 670
            ? 'topic-search-wrapper-image'
            : 'topic-search-wrapper-image-col'
        }
      >
        <div
          className={windowWidth > 670 ? 'topic-image' : 'topic-image-small'}
        >
          <input
            className={windowWidth > 670 ? 'input-topic' : 'input-small'}
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            className={windowWidth > 670 ? 'menu-button' : 'menu-button-small'}
            onClick={handleCreateImage}
          >
            {' '}
            Ask OpenAI
          </button>
          {error && <p> {error} </p>}
        </div>
        <div
          className={
            windowWidth > 670 ? 'search-btn-image' : 'search-btn-image-small'
          }
        >
          {isSearching ? (
            <div className="search-db-input">
              <BiSearchAlt size={30} />
              <input
                className={
                  windowWidth > 670 ? 'input-topic' : 'input-search-small'
                }
                placeholder="search topic"
                type="text"
                onChange={(e) => {
                  setSearchTopic(e.target.value);
                }}
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
            </div>
          ) : (
            <button
              className={windowWidth > 670 ? 'search-btn' : 'search-btn-small'}
              onClick={() => {
                setIsSearching(true);
              }}
            >
              {' '}
              Search Database{' '}
            </button>
          )}
        </div>
      </div>
      <div className="image-menu-wrapper-image">
        <div
          className={
            windowWidth > 670 ? 'image-and-topics' : 'image-and-topics-vertical'
          }
        >
          <div className="ai-image">
            {isLoading && <div>LOADING</div>}
            {imgurl !== '' && (
              <img
                src={imgurl}
                alt="ai-image"
                style={{
                  objectFit: 'contain',
                  maxWidth: '80%',
                  maxHeight: '80%',
                  paddingInline: '10px',
                }}
              />
            )}
          </div>
          <div className="topics">
            {searchedTopics.map((top) => {
              return (
                <p
                  className="topic-div"
                  key={top.id}
                  onClick={() => handleGetImgFromDb(top)}
                >
                  {' '}
                  {top.topic}{' '}
                </p>
              );
            })}
          </div>
        </div>
        <>
          <h3>
            Right click on the image to save it on your computer. Then click{' '}
            <span> Choose Image To Save </span> to send the saved picture to the
            database{' '}
          </h3>
          <label
            htmlFor="choose-file"
            style={{
              cursor: 'pointer',
              border: '2px solid black',
              width: '240px',
              height: '60px',
              borderRadius: '5px',
              textAlign: 'center',
              lineHeight: '1.5rem',
            }}
          >
            {' '}
            Choose Image To Save{' '}
          </label>
          <input
            type="file"
            id="choose-file"
            style={{ display: 'none' }}
            onChange={(e) => {
              setFileToSend({});
              setFileToSend(e.target.files[0]);
              setSaveDisabled(false);
            }}
          />
        </>
        <button
          className="menu-button-save"
          onClick={download}
          disabled={saveDisabled}
        >
          {' '}
          Save{' '}
        </button>
      </div>
    </div>
  );
};
