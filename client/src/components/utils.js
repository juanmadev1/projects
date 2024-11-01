export const AutocompleteInput = ({ onSelect }) => {
  // ... código existente ...

  const handleSelect = async (address) => {
    setAutocompleteValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onSelect(lat, lng);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ... resto del código ...
};
