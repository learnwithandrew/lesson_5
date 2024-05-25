document.addEventListener('DOMContentLoaded', () => {
    let carContainer = document.getElementById('car-cards');
    let carModal = document.getElementById('myModal');
    let carForm = document.getElementById('carSubmit-form');
    let carFormImage = document.getElementById('car-image');
    let carFormName = document.getElementById('car-name');
    let carFormDetails = document.getElementById('car-details');
    let carUpdateModal = document.getElementById('updateCarModal');
    let carUpdateForm = document.getElementById('carUpdate-form');
    let searchInput = document.getElementById('search-input');


    async function displayCars() {
        try {
            let response = await fetch('http://localhost:3000/cars');
            let data = await response.json();
            data.map((car) => {
                let carCard = document.createElement('div');
                carCard.classList.add('card');
                carCard.innerHTML = `
                    <img src="${car.carImage}" alt="${car.carName}" />
                    <h5>${car.carName}</h5>
                  `;

                let pickItem = () => {
                    let carClose = document.getElementById('modal-close');
                    let modalInfo = document.getElementById('modal-info');
                    let openCarModal = () => {
                        carModal.style.display = "block";
                        modalInfo.innerHTML = `
                            <div class="image-container">
                                <img src="${car.carImage}" alt="${car.carName}" />
                            </div>
                            <div class="car-information">
                                <h5>${car.carName}</h5>
                                <p>${car.carDetails}</p>
                            </div>
                            <div class="modify-buttons" id="modify-buttons">
                                <button type="btn button" class="delete-button" id="delete-button" data-id=${car.id}>Delete</button>&nbsp;
                                <button type="btn button" class="edit-button" data-bs-toggle="modal"
                                    data-bs-target="#updateCarForm" id="edit-button" data-id=${car.id}>Edit</button>
                            </div>
                            `;
                    }
                    let closeCarModal = () => {
                        carModal.style.display = "none";
                    }
                    carCard.addEventListener('click', openCarModal);
                    carClose.addEventListener('click', closeCarModal);
                }
                pickItem(car.id)
                carContainer.appendChild(carCard)
            });
        } catch (error) {
            console.log(`${error.message}`)
        }
    }

    async function carPostForm(e) {
        e.preventDefault();

        const carName = carFormName.value;
        const carImage = carFormImage.value;
        const carDetails = carFormDetails.value;

        const newCarItem = {
            carName,
            carImage,
            carDetails
        }

        let headers = {
            'Content-Type': 'application/json'
        }

        let body = JSON.stringify(newCarItem)

        let reponse = await fetch('http://localhost:3000/cars', {
            method: 'POST',
            headers: headers,
            body: body
        });
        let data = reponse.json();
        console.log(data)
    }

    async function editCarForm(id) {
        let carUpdateModalClose = document.getElementById('updateModal-close');
        carModal.style.display = "none"
        carUpdateModal.style.display = "block"

        let response = await fetch('http://localhost:3000/cars');
        let data = await response.json();
        let carUpdateItem = data.find(car => car.id === id);
        document.getElementById('form-id').value = carUpdateItem.id
        document.getElementById('updateCar-image').value = carUpdateItem.carImage;
        document.getElementById('updateCar-name').value = carUpdateItem.carName;
        document.getElementById('updateCar-details').value = carUpdateItem.carDetails;

        let closeModal = () => {
            carUpdateModal.style.display = "none"
        }

        carUpdateModalClose.addEventListener('click', closeModal)
    }

    async function carUpdateDetails() {
        try {
            let carId = document.getElementById('form-id').value;
            let carImage = document.getElementById('updateCar-image').value;
            let carName = document.getElementById('updateCar-name').value;
            let carDetails = document.getElementById('updateCar-details').value;

            let carUpdateObject = {
                carId,
                carImage,
                carName,
                carDetails
            }

            const headers = {
                'Content-Type': 'application/json'
            }

            const body = JSON.stringify(carUpdateObject)
            let reponse = await fetch(`http://localhost:3000/cars/${carUpdateObject.carId}`, {
                method: 'PATCH',
                headers: headers,
                body: body
            })

            let data = reponse.json();
            console.log(data)
        } catch (error) {
            console.log(`${error.message}`)
            carUpdateModal.style.display = "none"
        }
    }

    async function searchCars(searchTerm) {
        let response = await fetch('http://localhost:3000/cars')
        let data = await response.json()
        let filteredCars = data.filter(car => car.carName.toLowerCase().includes(searchTerm))
        return filteredCars;
    }


    searchInput.addEventListener('keyup', async (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCars = await searchCars(searchTerm);

        carContainer.innerHTML = '';

        if (searchTerm) {
            filteredCars.forEach(item => {
                let carCard = document.createElement('div');
                carCard.classList.add('card');
                carCard.innerHTML = `
                        <img src="${item.carImage}" alt="${item.carName}" />
                        <h5>${item.carName}</h5>
                   `;
                   carContainer.appendChild(carCard)
            })
        } else {
            displayCars();
        }

    })


    carModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            const id = e.target.dataset.id
            carDeleteForm(id)
        } else {
            e.target.classList.contains('edit-button')
            const carId = e.target.dataset.id
            console.log(carId)
            editCarForm(carId)
        }
    })

    async function carDeleteForm(id) {
        const headers = {
            'Content-Type': "application/type"
        }
        let response = fetch(`http://localhost:3000/cars/${id}`, {
            method: 'DELETE',
            headers: headers
        })
    }

    carUpdateForm.addEventListener('submit', carUpdateDetails)
    carForm.addEventListener('submit', carPostForm)
    displayCars();

})