import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import NoteList from "./NoteList";
import { v4 as uuidv4 } from "uuid";
import { currentDate } from "./utils";


function Layout({ logOut, profile, user }) {
  const navigate = useNavigate();
  const mainContainerRef = useRef(null);
  const [collapse, setCollapse] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentNote, setCurrentNote] = useState(-1);

  useEffect(() => {
    const height = mainContainerRef.current.offsetHeight;
    mainContainerRef.current.style.maxHeight = `${height}px`;
    setNotes([]);
    
  }, []);

  useEffect(() => {
    if (currentNote < 0) {
      return;
    }
    if (!editMode) {
      navigate(`/notes/${currentNote + 1}`);
      return;
    }
    navigate(`/notes/${currentNote + 1}/edit`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);

  const saveNote = async (note, index) => {
    note.body = note.body.replaceAll("<p><br></p>", "");
    setNotes([
      ...notes.slice(0, index),
      { ...note },
      ...notes.slice(index + 1),
    ]);
    setCurrentNote(index);
    setEditMode(false);

    let url =`https://u4qgd34kruxzde3rmccrchree40ypegx.lambda-url.ca-central-1.on.aws/save?email=${profile.email}&id=${note.id}`
    fetch(url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          email: profile.email,
        },
        body: JSON.stringify({ ...note, email: profile.email }),
      }
    );
  }

  useEffect(() => {
    const getNoteEffect = async () => {
      if (profile.email) {
        let url =`https://hukv44j247ocyuszaw25mi3lw40plqma.lambda-url.ca-central-1.on.aws/get?email=${profile.email}`
        const rev = await fetch(
        url,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              email: profile.email,
            },
          }
        );
        const notes = await rev.json();
        
        setNotes(notes);
      }
    };
    getNoteEffect();
  }, [profile.email]);

  const deleteNote = async (id, index) => {

    const rev = await fetch(
      `https://cp45gpxafd3lpmlo44n5qak4om0kkmki.lambda-url.ca-central-1.on.aws`,
      {
        mode: 'no-cors',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          email: profile.email,
        },
        body: JSON.stringify({ email: profile.email, id: id }),
      }
    );
    if (rev.status === 200) {
      setNotes([...notes.slice(0, index), ...notes.slice(index + 1)]);
      setCurrentNote(0);
      setEditMode(false);
    }
    console.log(rev.status);
  };

  const addNote = () => {
    setNotes([
      {
        id: uuidv4(),
        title: "Untitled",
        body: "",
        when: currentDate(),
      },
      ...notes,
    ]);
    setEditMode(true);
    setCurrentNote(0);
  };

  useEffect(() => {
    localStorage.setItem("username", JSON.stringify(user));
    localStorage.setItem("userProfile", JSON.stringify(profile));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div>
      <div id="container">
        <header>
          <aside>
            <button id="menu-button" onClick={() => setCollapse(!collapse)}>
              &#9776;
            </button>
          </aside>
          <div id="app-header">
            <h1>
              <Link to="/notes">Lotion</Link>
            </h1>
            <h6 id="app-moto">Like Notion, but worse.</h6>
          </div>
          <aside>
            <button onClick={logOut}>
              <strong>{profile.name} (Log-out)</strong>
            </button>
          </aside>
        </header>
        <div id="main-container" ref={mainContainerRef}>
          <aside id="sidebar" className={collapse ? "hidden" : null}>
            <header>
              <div id="notes-list-heading">
                <h2>Notes</h2>
                <button id="new-note-button" onClick={addNote}>
                  +
                </button>
              </div>
            </header>
            <div id="notes-holder">
              <NoteList notes={notes} />
            </div>
          </aside>
          <div id="write-box">
            <Outlet context={[notes, saveNote, deleteNote]} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;






