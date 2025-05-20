document.getElementById('searchButton').addEventListener('click', function () {
const input = document.getElementById('searchInput').value.toLowerCase().trim();
  const marker = markerMap[input];

  if (marker) {
    mymap.setView(marker.getLatLng(), 19);
    marker.openPopup();
  } else {
    alert('Lokasi tidak ditemukan');
  }
});
