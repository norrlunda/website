function initCaseGeoMap(){
    let sthlm = document.getElementById('sthlm');
    let sthlmList = document.getElementById('sthlm-list');
    let gbg = document.getElementById('gbg');
    let gbgList = document.getElementById('gbg-list');
    let listGroups = document.querySelectorAll('.list-group');
    let modalContent = document.querySelector('.modal-content');
    let scaffoldData = [];

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

    fetch('./src/json/scaffold.json')
    .then(response => response.json())
    .then(data => {
       scaffoldData = data; 
       console.log(scaffoldData);
    })
    .catch(error => console.error(error));

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
                modalContent.innerHTML = '';

                let modalHeader = document.createElement('div');
                modalHeader.classList.add('modal-header');
                
                let modalTitle = document.createElement('h1');
                modalTitle.id = 'job-modal-title';
                modalTitle.classList.add('modal-title', 'fs-5');
                modalTitle.innerText = `${job.name}`;

                let modalHeaderButton = document.createElement('button');
                modalHeaderButton.type = 'button';
                modalHeaderButton.classList.add('btn-close');
                modalHeaderButton.setAttribute('data-bs-dismiss', 'modal');
                modalHeaderButton.setAttribute('aria-label', 'Close');
                
                modalHeader.appendChild(modalTitle);
                modalHeader.appendChild(modalHeaderButton);

                let modalBody = document.createElement('div');
                modalBody.classList.add('modal-body');

                let table = document.createElement('table');
                table.classList.add('table', 'table-hover');

                let tableHeader = document.createElement('thead');
                
                let tableHeaderNumber = document.createElement('th');
                tableHeaderNumber.innerText = 'Artikel';

                let tableHeaderName = document.createElement('th');
                tableHeaderName.innerText = 'Beskrivning';

                let tableHeaderCount = document.createElement('th');
                tableHeaderCount.innerText = 'Antal';

                tableHeader.appendChild(tableHeaderNumber);
                tableHeader.appendChild(tableHeaderName);
                tableHeader.appendChild(tableHeaderCount);

                table.appendChild(tableHeader);
                
                let tableBody = document.createElement('tbody');

                let scaffold = scaffoldData.find(scaffold => scaffold.number === job.number);
                if(scaffold){
                    scaffold.parts.forEach(part => {
                        let tableRow = document.createElement('tr');
                        
                        let partNumberData = document.createElement('td');
                        partNumberData.innerText = '#' + part.number;

                        let partNameData = document.createElement('td');
                        partNameData.innerText = part.name;

                        let partCountData = document.createElement('td');
                        partCountData.innerText = part.count;

                        tableRow.appendChild(partNumberData);
                        tableRow.appendChild(partNameData);
                        tableRow.appendChild(partCountData);

                        tableBody.appendChild(tableRow);
                    });
                }
                table.appendChild(tableBody);                
                modalBody.appendChild(table);

                let modalFooter = document.createElement('div');
                modalFooter.classList.add('modal-footer');

                let modalCloseButton = document.createElement('button');
                modalCloseButton.type = 'button';
                modalCloseButton.classList.add('btn', 'btn-secondary');
                modalCloseButton.setAttribute('data-bs-dismiss', 'modal');
                modalCloseButton.innerText = 'Close';

                let modalSaveButton = document.createElement('button');
                modalSaveButton.type = 'button';
                modalSaveButton.classList.add('btn', 'btn-success');
                modalSaveButton.innerText = 'Save';

                modalFooter.appendChild(modalCloseButton);
                modalFooter.appendChild(modalSaveButton);

                modalContent.appendChild(modalHeader);
                modalContent.appendChild(modalBody);
                modalContent.appendChild(modalFooter);
            });

            let listitem = document.createElement('small');
            listitem.classList.add('list-group-item', 'list-group-item-action');
            listitem.innerText = `${job.name}`;

            listitem.addEventListener('mouseover', () => {
                marker.openPopup();
            });
            listitem.addEventListener('click', () => {
                let modal = new bootstrap.Modal(document.getElementById('jobModal'));
                modal.show();
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
