const url = "https://rickandmortyapi.com/api/character/?name=";

function Search(url) {
  const name = document.getElementById("searching-character").value;
  const docker = document.getElementById("characters-section");
  fetch(`${url}${name}`)
    .then((res) => res.json())
    .then(async (data) => {
        docker.innerHTML = ``;
        data.results.map((character) => {
        docker.innerHTML += `
            <article class="characters">
                <figure class="char-docker">
                    <img
                        class="char"
                        src="${character.image}"
                        alt="Personaje"
                    />
                </figure>
                <h2>${character.name}</h2>
                <p>Status: ${character.status}</p>
            </article>
            `;
      });
    });
}