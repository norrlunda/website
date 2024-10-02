function initCaseGeoMap(){
    let sthlm = document.getElementById('sthlm');
    let sthlmList = document.getElementById('sthlm-list');
    let gbg = document.getElementById('gbg');
    let gbgList = document.getElementById('gbg-list');
    let listGroups = document.querySelectorAll('.list-group');
    let modalLabel = document.getElementById('jobModalLabel');

    const map = L.map('map', {
        zoomControl: false,
        scrollWheelZoom: false
    }).setView([59.331135, 18.042297], 11);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.dragging.disable();
    
    // let popup = L.popup();

    // function onMapClick(e) {
    //     popup
    //         .setLatLng(e.latlng)
    //         .setContent("You clicked the map at " + e.latlng.toString())
    //         .openOn(map);
    // }

    // map.on('click', onMapClick);

    fetch('./src/json/marker.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(job => {

            let button = document.createElement('button');
            button.innerText = job.name;
            button.type = 'button';
            button.classList.add('btn', 'btn-sm', 'btn-outline-secondary');
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#jobModal');

            let marker = L.marker([job.lat, job.lng])
                .addTo(map)
                .bindPopup(button.outerHTML);

            marker.on('popupopen', () => {
                modalLabel.innerText = `${job.name}`;
            });

            let listitem = document.createElement('small');
            listitem.classList.add('list-group-item', 'list-group-item-action');
            listitem.innerText = `${job.name}`;

            listitem.addEventListener('mouseover', () => {
                marker.openPopup();
            });

            if(job.lat > 58){
                sthlmList.appendChild(listitem);
            }
            else{
                gbgList.appendChild(listitem);
            }
        });
    })
    .catch(error => console.error(error));

    sthlm.addEventListener('click', () => {
        map.setView([59.331135, 18.042297], 11);
        hideListGroups();
        sthlmList.classList.toggle('d-none');
    });

    gbg.addEventListener('click', () => {
        map.setView([57.70750, 11.96750], 11);
        hideListGroups();
        gbgList.classList.toggle('d-none');
    });

    function hideListGroups(){
        listGroups.forEach(group => {
            group.classList.add('d-none');
        });
    }
}
