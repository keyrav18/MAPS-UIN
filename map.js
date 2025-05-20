document.addEventListener("DOMContentLoaded", function () {
  const mymap = L.map('mymap', {
    center: [-6.306482, 106.753978],
    zoom: 19,
    minZoom: 17,
    maxZoom: 19,
    maxBoundsViscosity: 0.5
  });

const vehicleIcons = {
  foot: L.icon({
    iconUrl: 'img/orang.png',
    iconSize: [72, 72],           // ukuran ikon
    iconAnchor: [36, 72],         // titik tengah bawah ikon
    popupAnchor: [0, -72],        // letak popup di atas ikon
  }),
  motorbike: L.icon({
    iconUrl: 'img/motor.png',
    iconSize: [72, 72],
    iconAnchor: [36, 72],
    popupAnchor: [0, -72],
  }),
  car: L.icon({
    iconUrl: 'img/taxi.png',
    iconSize: [72, 72],
    iconAnchor: [36, 72],
    popupAnchor: [0, -72],
  }),
  myLocation: L.icon({
    iconUrl: 'img/mylocation.png', // Tambahkan ikon untuk lokasi saya (perlu dibuat)
    iconSize: [72, 72],
    iconAnchor: [36, 72],
    popupAnchor: [0, -72],
  })
};

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    minZoom: 17,
    maxZoom: 19,
  }).addTo(mymap);

  const locations = [
    { lat: -6.3061751, lng: 106.7522882, name: 'Sekretariat Dema FST' },
    { lat: -6.3065375, lng: 106.7526952, name: 'Fakultas Ekonomi dan Bisnis' },
    { lat: -6.3061099, lng: 106.7528085, name: 'Fakultas Sains dan Teknologi' },
    { lat: -6.3061295, lng: 106.7527921, name: 'Ruang Diskusi Dekanat FST' },
    { lat: -6.3060904, lng: 106.7532049, name: 'Pusat Laboratorium Terpadu' },
    { lat: -6.3064382, lng: 106.7532049, name: 'Ayasofya Dakwah Centre' },
    { lat: -6.3062898, lng: 106.7537124, name: 'Pusat Perpustakaan' },
    { lat: -6.3066636, lng: 106.7536929, name: 'Fakultas Ushuluddin' },
    { lat: -6.3069698, lng: 106.7538345, name: 'Fakultas Ilmu Dakwah dan Komunikasi' },
    { lat: -6.3069427, lng: 106.7535695, name: 'Dema U UIN Jakarta' },
    { lat: -6.3067054, lng: 106.7544375, name: 'Fakultas Syariah dan Hukum' },
    { lat: -6.3068222, lng: 106.7543767, name: 'Kopertais' },
    { lat: -6.3064960, lng: 106.7549559, name: 'Student Center' },
    { lat: -6.3063949, lng: 106.7546930, name: 'Masjid Al-jamiah' },
    { lat: -6.3070740, lng: 106.7552552, name: 'Fakultas Ilmu Tarbiyah dan Keguruan' },
    { lat: -6.3063026, lng: 106.7558506, name: 'Auditorium Harun Nasution' },
    { lat: -6.3062141, lng: 106.7553194, name: 'Gedung Kemahasiswaan' },
    { lat: -6.3064017, lng: 106.7553529, name: 'Aula Madya' },
    { lat: -6.3068944, lng: 106.7556109, name: 'Pusat Pelayanan Administrasi Terpadu' },
    { lat: -6.3066877, lng: 106.7561533, name: 'Rektorat' },
    { lat: -6.3061316, lng: 106.7565052, name: 'Fakultas Dirasat Islamiyah' },
    { lat: -6.3063166, lng: 106.7541905, name: 'Kantin'},
    { lat: -6.3079362, lng: 106.7564623, name: 'Rumah Sakit Syarif Hidayatullah'},
    { lat: -6.3082055, lng: 106.7562745, name: 'Masjid Fathullah UIN Syarif Hidayatullah Jakarta'},
    { lat: -6.3092273, lng: 106.7592097, name: 'Fakultas Ilmu Sosial dan Politik'},
    { lat: -6.3090387, lng: 106.7598989, name: 'Masjid Fakultas Ilmu Sosial dan Politik'},
    { lat: -6.3097457, lng: 106.7591873, name: 'Fakultas Psikologi'},
    { lat: -6.3104849, lng: 106.7597040, name: 'Wisma Syahida Inn'},
    { lat: -6.3103388, lng: 106.7591876, name: 'Gedung FKIK'},
    { lat: -6.3106025, lng: 106.7591797, name: 'Pusat Pengkajian Islam dan Masyarakat'},
    { lat: -6.3110341, lng: 106.7590843, name: 'Pusat Pengembangan Bahasa'},
    { lat: -6.3108942, lng: 106.7597190, name: 'Sekolah Pascasarjana'},
    { lat: -6.3097178, lng: 106.7599965, name: 'Laboratorium FKIK'},
    { lat: -6.3100299, lng: 106.7600945, name: 'Admininistrasi FKIK'},
    { lat: -6.3119483, lng: 106.7598555, name: 'Fakultas Kedokteran dan Ilmu Kesehatan'},
  ];

  // Variabel untuk menyimpan lokasi pengguna
  let userLocation = null;
  let userLocationMarker = null;
  let isUsingMyLocation = false;

  const markers = {};
  locations.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng]).addTo(mymap).bindPopup(loc.name);
    markers[loc.name.toLowerCase()] = marker;

    const optionTo = document.createElement('option');
    optionTo.text = loc.name;
    optionTo.value = loc.name;
    document.getElementById('to').appendChild(optionTo);

    // Masih tetap menambahkan opsi ke dropdown 'from' tapi tidak digunakan ketika 'Lokasi Saya' aktif
    const optionFrom = document.createElement('option');
    optionFrom.text = loc.name;
    optionFrom.value = loc.name;
    document.getElementById('from').appendChild(optionFrom);
  });

  // Membuat tombol lokasi saya
  const myLocationButton = L.control({ position: 'bottomright' });
  myLocationButton.onAdd = function() {
    const div = L.DomUtil.create('div', 'my-location-button');
    div.innerHTML = '<button title="Lokasi Saya" style="padding: 10px; background: white; border: 1px solid #ccc; border-radius: 5px; cursor: pointer;"><img src="img/locate.svg" alt="Lokasi Saya" style="width: 20px; height: 20px;"></button>';
    
    div.onclick = function() {
      getUserLocation();
    };
    
    return div;
  };
  myLocationButton.addTo(mymap);

  // Tambahkan checkbox untuk toggle 'Gunakan Lokasi Saya'
const locationToggleDiv = document.createElement('div');
locationToggleDiv.className = 'use-my-location';
locationToggleDiv.style.display = 'flex';
locationToggleDiv.style.alignItems = 'center';
locationToggleDiv.style.height = '60px';


// Checkbox setelah teks
locationToggleDiv.innerHTML = `
  <label for="use-my-location">Ingin melihat titik anda berada?</label>
  <input type="checkbox" id="use-my-location" name="use-my-location" style="transform: scale(1.0); width: 20px; height: 20px; margin-left: 10px; cursor: pointer;">
`;
  
  // Masukkan di atas dropdown from
  const fromDropdown = document.getElementById('from').parentNode;
  fromDropdown.parentNode.insertBefore(locationToggleDiv, fromDropdown);

  // Event listener untuk checkbox lokasi saya
  document.getElementById('use-my-location').addEventListener('change', function(e) {
    isUsingMyLocation = e.target.checked;
    
    // Tampilkan atau sembunyikan dropdown 'from' berdasarkan pilihan
    document.getElementById('from').parentNode.style.display = isUsingMyLocation ? 'none' : 'block';
    
    // Jika dicentang dan lokasi belum dideteksi, coba deteksi lokasi
    if (isUsingMyLocation && !userLocation) {
      getUserLocation();
    }
  });

  // Fungsi untuk mendapatkan lokasi pengguna
  function getUserLocation() {
    if (navigator.geolocation) {
      // Tampilkan indikator loading
      const loadingDiv = document.createElement('div');
      loadingDiv.id = 'location-loading';
      loadingDiv.innerHTML = 'Mendapatkan lokasi Anda...';
      loadingDiv.style.position = 'fixed';
      loadingDiv.style.top = '50%';
      loadingDiv.style.left = '50%';
      loadingDiv.style.transform = 'translate(-50%, -50%)';
      loadingDiv.style.background = 'rgba(0, 0, 0, 0.7)';
      loadingDiv.style.color = 'white';
      loadingDiv.style.padding = '15px';
      loadingDiv.style.borderRadius = '5px';
      loadingDiv.style.zIndex = '1000';
      document.body.appendChild(loadingDiv);
      
      navigator.geolocation.getCurrentPosition(
        // Success callback
        function(position) {
          // Hapus loading
          document.getElementById('location-loading').remove();
          
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Centang otomatis checkbox 'Gunakan Lokasi Saya'
          document.getElementById('use-my-location').checked = true;
          isUsingMyLocation = true;
          document.getElementById('from').parentNode.style.display = 'none';
          
          // Hapus marker lama jika ada
          if (userLocationMarker) {
            mymap.removeLayer(userLocationMarker);
          }
          
          // Tambahkan marker untuk lokasi pengguna
          userLocationMarker = L.marker([userLocation.lat, userLocation.lng], {
            icon: vehicleIcons.myLocation
          }).addTo(mymap).bindPopup('Lokasi Saya').openPopup();
          
          // Zoom ke lokasi pengguna
          mymap.setView([userLocation.lat, userLocation.lng], 19);
          
          // Tambahkan akurasi sebagai lingkaran
          if (position.coords.accuracy) {
            // Hapus circle lama kalau ada
            if (window.accuracyCircle) {
              mymap.removeLayer(window.accuracyCircle);
            }
            
            // Buat circle baru
            window.accuracyCircle = L.circle([userLocation.lat, userLocation.lng], {
              radius: position.coords.accuracy,
              color: 'blue',
              fillColor: '#30c',
              fillOpacity: 0.15
            }).addTo(mymap);
          }
        },
        // Error callback
        function(error) {
          // Hapus loading
          document.getElementById('location-loading').remove();
          
          let errorMsg = '';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = "Anda menolak permintaan geolokasi.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Informasi lokasi tidak tersedia.";
              break;
            case error.TIMEOUT:
              errorMsg = "Permintaan untuk mendapatkan lokasi timed out.";
              break;
            case error.UNKNOWN_ERROR:
              errorMsg = "Terjadi kesalahan yang tidak diketahui.";
              break;
          }
          alert(errorMsg);
          
          // Reset checkbox
          document.getElementById('use-my-location').checked = false;
          isUsingMyLocation = false;
          document.getElementById('from').parentNode.style.display = 'block';
        },
        // Options
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert("Geolocation tidak didukung oleh browser Anda.");
    }
  }

  // Search koordinat / nama
  let lastMarker = null;
  document.getElementById('search-button').addEventListener('click', () => {
    const input = document.getElementById('search-input').value.trim();
    const coordRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;

    if (lastMarker) {
      mymap.removeLayer(lastMarker);
      lastMarker = null;
    }

    if (coordRegex.test(input)) {
      const [lat, lng] = input.split(',').map(Number);
      lastMarker = L.marker([lat, lng]).addTo(mymap)
        .bindPopup(`Koordinat: ${lat}, ${lng}`).openPopup();
      mymap.setView([lat, lng], 19);
    } else {
      const matched = locations.find(loc =>
        loc.name.toLowerCase().includes(input.toLowerCase())
      );

      if (matched) {
        mymap.setView([matched.lat, matched.lng], 19);
        mymap.once('moveend', () => {
          const matchedMarker = markers[matched.name.toLowerCase()];
          if (matchedMarker) matchedMarker.openPopup();
        });
      } else {
        alert('Lokasi atau koordinat tidak ditemukan.');
      }
    }
  });

  // Variabel untuk route dan info panel
  let currentRoute = null;
  let routeLayer = null;
  let directionsPanel = null;

  // Membuat panel petunjuk arah yang bisa dibuka tutup
  function createDirectionsPanel() {
    if (directionsPanel) {
      directionsPanel.remove();
    }
    
    directionsPanel = L.control({ position: 'topright' });
    directionsPanel.onAdd = function() {
      const div = L.DomUtil.create('div', 'directions-panel');
      
      // Tombol untuk buka/tutup panel
      const toggleButton = L.DomUtil.create('button', 'toggle-panel', div);
      toggleButton.innerHTML = '&lt;&lt;';
      toggleButton.title = 'Sembunyikan/Tampilkan panel petunjuk';
      
      // Konten petunjuk arah dalam div terpisah
      const contentDiv = L.DomUtil.create('div', 'directions-content', div);
      contentDiv.id = 'directions-content';
      
      // Menambahkan event listener untuk toggle panel
      L.DomEvent.on(toggleButton, 'click', function() {
        div.classList.toggle('collapsed');
        toggleButton.innerHTML = div.classList.contains('collapsed') ? '&gt;&gt;' : '&lt;&lt;';
      });
      
      // Mencegah klik pada panel mempengaruhi peta di bawahnya
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);
      
      return div;
    };
    
    return directionsPanel.addTo(mymap);
  }

  // Routing logic dengan OpenRouteService API
  document.getElementById('route-button').addEventListener('click', async () => {
    // Periksa apakah menggunakan lokasi saya
    if (isUsingMyLocation && !userLocation) {
      alert("Lokasi Anda belum terdeteksi. Silakan coba lagi.");
      getUserLocation();
      return;
    }

    const to = document.getElementById('to').value;
    const vehicle = document.getElementById("vehicle-select").value;
    
    let locFrom;
    
    // Jika menggunakan lokasi saya
    if (isUsingMyLocation) {
      locFrom = userLocation;
      // Tambahkan nama untuk tampilan di panel
      locFrom.name = "Lokasi Saya";
    } else {
      const from = document.getElementById('from').value;
      locFrom = locations.find(l => l.name === from);
      
      if (from === to) {
        alert("Pilih dua lokasi yang berbeda.");
        return;
      }
    }
    
    const locTo = locations.find(l => l.name === to);

    // Hapus rute sebelumnya jika ada
    if (routeLayer) {
      mymap.removeLayer(routeLayer);
    }
    
    // Hapus routing control jika ada
    if (currentRoute) {
      mymap.removeControl(currentRoute);
    }

    // Buat panel petunjuk arah jika belum ada
    if (!directionsPanel) {
      createDirectionsPanel();
    } else {
      // Jika panel sudah ada, tampilkan pesan loading
      document.getElementById('directions-content').innerHTML = '<p>Sedang memuat rute...</p>';
      
      // Pastikan panel terlihat
      const panel = document.querySelector('.directions-panel');
      if (panel && panel.classList.contains('collapsed')) {
        panel.classList.remove('collapsed');
        document.querySelector('.toggle-panel').innerHTML = '&lt;&lt;';
      }
    }
    
    // Set warna dan mode transportasi berdasarkan kendaraan
    let routeColor = 'blue'; // default jalan kaki
    let profile = 'foot-walking';
    let speed = 5; // km/h untuk perhitungan estimasi

    if (vehicle === 'motorbike') {
      routeColor = 'green';
      profile = 'driving-car'; // OpenRouteService tidak memiliki profil khusus untuk motor
      speed = 40;
    } else if (vehicle === 'car') {
      routeColor = 'red';
      profile = 'driving-car';
      speed = 60;
    }

    try {
      // Format koordinat untuk OpenRouteService [lng, lat]
      const startCoords = [locFrom.lng, locFrom.lat];
      const endCoords = [locTo.lng, locTo.lat];
      
      // Fetch rute dari OpenRouteService
      const response = await fetch(`https://api.openrouteservice.org/v2/directions/${profile}/geojson`, {
        method: 'POST',
        headers: {
          'Authorization': '5b3ce3597851110001cf624883510d7db77e4151bbea2e322f532880', // API key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coordinates: [startCoords, endCoords],
          instructions: true
        })
      });

      const data = await response.json();
      
      // Jika terjadi error dari API
      if (data.error) {
        alert(`Error: ${data.error.message}`);
        return;
      }

      // Gambar garis rute
      routeLayer = L.geoJSON(data, {
        style: { color: routeColor, weight: 5 }
      }).addTo(mymap);
      
      mymap.fitBounds(routeLayer.getBounds());

      // Tambahkan animasi marker kendaraan
      if (window.vehicleMarker) {
        mymap.removeLayer(window.vehicleMarker);
        clearInterval(window.animationInterval);
      }

      const coords = data.features[0].geometry.coordinates; // [lng, lat]
      let i = 0;

      // Buat marker kendaraan di posisi awal
      window.vehicleMarker = L.marker([coords[0][1], coords[0][0]], {
        icon: vehicle === 'car' ? vehicleIcons.car :
              vehicle === 'motorbike' ? vehicleIcons.motorbike :
              vehicleIcons.foot
      }).addTo(mymap);

      // Animasi marker sepanjang rute
      window.animationInterval = setInterval(() => {
        if (i < coords.length) {
          const latlng = [coords[i][1], coords[i][0]];
          window.vehicleMarker.setLatLng(latlng);
          i++;
        } else {
          clearInterval(window.animationInterval);
        }
      }, 100); // kecepatan animasi


      // Ekstrak informasi rute
      const routeInfo = data.features[0].properties;
      const distanceInKm = routeInfo.summary.distance / 1000;
      const durationMinutes = routeInfo.summary.duration / 60;
      
      // Dapatkan petunjuk langkah demi langkah
      const steps = routeInfo.segments[0].steps;
      
      // Pemformatan petunjuk arah
      let directionsHTML = `
        <h3>${locFrom.name} ke ${to}</h3>
        <p>${distanceInKm.toFixed(1)} km, ${Math.ceil(durationMinutes)} menit (${vehicle})</p>
        <hr>
      `;
      
      // Menambahkan petunjuk langkah demi langkah
      directionsHTML += '<ol style="padding-left: 20px;">';
      steps.forEach((step, index) => {
        directionsHTML += `<li>${step.instruction} (${(step.distance / 1000).toFixed(2)} km)</li>`;
      });
      directionsHTML += '</ol>';
      
      // Tampilkan petunjuk di panel
      document.getElementById('directions-content').innerHTML = directionsHTML;
      
      // Pastikan panel terlihat (tidak collapsed) saat rute ditampilkan
      const directionsPanel = document.querySelector('.directions-panel');
      if (directionsPanel && directionsPanel.classList.contains('collapsed')) {
        directionsPanel.classList.remove('collapsed');
        document.querySelector('.toggle-panel').innerHTML = '&lt;&lt;';
      }
      
    } catch (error) {
      console.error('Error fetching route:', error);
      alert('Terjadi kesalahan saat mengambil rute. Silakan coba lagi.');
    }
  });
      // Cleanup marker dan animasi jika tombol route ditekan ulang
    if (window.vehicleMarker) {
      mymap.removeLayer(window.vehicleMarker);
      clearInterval(window.animationInterval);
      window.vehicleMarker = null;
    }
});


     function toggleSidebar(show) {
      const controls = document.getElementById('routeControls');
      const showBtn = document.getElementById('showSidebarBtn');
      
      if (show) {
        controls.classList.add('show');
        showBtn.style.display = 'none';
      } else {
        controls.classList.remove('show');
        setTimeout(() => {
          showBtn.style.display = 'flex';
        }, 400); // Match the transition time
      }
    }

    // Check if it's a mobile device
    function isMobile() {
      return window.innerWidth <= 768;
    }

    // Update UI based on screen size
    function updateUIForScreenSize() {
      const controls = document.getElementById('routeControls');
      
      // Reset classes and styles first
      controls.classList.remove('show');
      document.getElementById('showSidebarBtn').style.display = 'flex';
    }

    // Variables for drag functionality
    let startY = 0;
    let startHeight = 0;
    let isDragging = false;
    const controls = document.getElementById('routeControls');
    const dragHandle = document.querySelector('.drag-handle');

    // Initialize drag functionality for mobile
    function initDragFunctionality() {
      if (!dragHandle) return;
      
      // Mouse events
      dragHandle.addEventListener('mousedown', startDrag);
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', endDrag);
      
      // Touch events for mobile
      dragHandle.addEventListener('touchstart', startDrag, { passive: false });
      document.addEventListener('touchmove', drag, { passive: false });
      document.addEventListener('touchend', endDrag);
    }

    function startDrag(e) {
      // Prevent default only for touch events to avoid scrolling issues
      if (e.type === 'touchstart') {
        e.preventDefault();
      }
      
      isDragging = true;
      startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      
      // Get the current height of the sidebar
      const height = window.getComputedStyle(controls).height;
      startHeight = parseInt(height, 10);
      
      // Add dragging class
      dragHandle.classList.add('dragging');
    }

    function drag(e) {
      if (!isDragging || !isMobile()) return;
      
      // Prevent default to avoid page scrolling while dragging
      e.preventDefault();
      
      // Get current position
      const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const deltaY = startY - currentY;
      
      // Calculate new height (minimum 150px, maximum 90% of viewport)
      let newHeight = Math.max(150, Math.min(window.innerHeight * 0.9, startHeight + deltaY));
      
      // Apply new height
      controls.style.height = newHeight + 'px';
    }

    function endDrag() {
      if (!isDragging) return;
      
      isDragging = false;
      dragHandle.classList.remove('dragging');
      
      // If dragged to less than 25% of screen height, close it
      const height = parseInt(window.getComputedStyle(controls).height, 10);
      if (height < window.innerHeight * 0.25) {
        toggleSidebar(false);
        // Reset height to default after animation
        setTimeout(() => {
          controls.style.height = '60%';
        }, 400);
      }
    }

    // Call on load and resize
    window.addEventListener('load', function() {
      updateUIForScreenSize();
      initDragFunctionality();
      
      // Deteksi lokasi saat halaman dimuat (opsional)
      // getUserLocation();
    });
    window.addEventListener('resize', updateUIForScreenSize);
