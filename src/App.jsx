import { useEffect, useRef, useState, useCallback } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

const SELECTED_PLACES = 'selectedPlaces';
const storedIds = JSON.parse(localStorage.getItem(SELECTED_PLACES)) || [];
const storedPlaces = storedIds.map((id) => AVAILABLE_PLACES.find(place => place.id === id));

function App() {
  const [ modalIsOpen, setModalIsOpen ] = useState(false);  // using declarative way
  // const modal = useRef(); // using imperative way
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [ availablePlaces, setAvailablePlaces ] = useState([])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, position.coords.latitude, position.coords.longitude);
      setAvailablePlaces(sortedPlaces)
    });
  }, []);

  function handleStartRemovePlace(id) {
    // modal.current.open();
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    // modal.current.close();
    setModalIsOpen(false)
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    const storedIds = JSON.parse(localStorage.getItem(SELECTED_PLACES)) || [];
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(SELECTED_PLACES, JSON.stringify([id, ...storedIds]));
    }
  }

  const handleRemovePlace = useCallback(
    function handleRemovePlace() {
      setPickedPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
      );

      // modal.current.close();
      setModalIsOpen(false);

      const storedIds = JSON.parse(localStorage.getItem(SELECTED_PLACES)) || [];
      localStorage.setItem(
        SELECTED_PLACES, 
        JSON.stringify(storedIds.filter((id) => selectedPlace.current !== id))
        );
    }, []);

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting Places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
