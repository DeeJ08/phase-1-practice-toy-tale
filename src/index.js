let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollectionDiv = document.getElementById('toy-collection');
  const addToyForm = document.querySelector('.add-toy-form');

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(dataReceived => {
      dataReceived.forEach(toy => {
        createToyCard(toy, toyCollectionDiv);
      });
    })
    .catch(error => {
      console.error('Error fetching toys:', error);
    });

  addToyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(addToyForm);
    const toyData = {
      name: formData.get('name'),
      image: formData.get('image'),
      likes: 0
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(toyData)
    })
      .then(response => response.json())
      .then(newToy => {
        createToyCard(newToy, toyCollectionDiv);
      })
      .catch(error => {
        console.error('Error adding the new toy:', error);
      });
  });
});

function createToyCard(toy, container) {
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card');

  const addedTags = document.createElement('h2');
  addedTags.textContent = toy.name;
  cardDiv.appendChild(addedTags);

  const addedImg = document.createElement('img');
  addedImg.src = toy.image;
  addedImg.className = 'toy-avatar';
  addedImg.alt = toy.name;
  cardDiv.appendChild(addedImg);

  const addedP = document.createElement('p');
  addedP.textContent = `${toy.likes} Likes`;
  cardDiv.appendChild(addedP);

  const addedBtn = document.createElement('button');
  addedBtn.className = 'like-btn';
  addedBtn.id = toy.id;
  addedBtn.textContent = 'Like ❤️';
  cardDiv.appendChild(addedBtn);

  addedBtn.addEventListener('click', () => {
    const newLikes = toy.likes + 1;
    updateToyLikes(toy.id, newLikes, addedP);
  });

  container.appendChild(cardDiv);
}

function updateToyLikes(id, newLikes, likesElement) {
  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ likes: newLikes })
  })
    .then(response => response.json())
    .then(updatedToy => {
      likesElement.textContent = `${updatedToy.likes} Likes`;
    })
    .catch(error => {
      console.error('Error updating toy likes:', error);
    });
}