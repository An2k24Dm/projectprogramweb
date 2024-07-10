document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("busqueda");
    const filtroSeleccionado = document.getElementById("filtro");

    function filtrarItems() {
        const filtro = input.value.toLowerCase();
        const categoria = filtroSeleccionado.value;
        const sections = document.querySelectorAll(".items");
        sections.forEach(section => {
          const items = section.querySelectorAll("figure");
          let esVisible = false;
          items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const categoriaDelItem = item.classList[0];
            if ((filtro === "" || text.includes(filtro)) && (categoria === "todas" || categoriaDelItem === categoria)) {
              item.style.display = "block";
              esVisible = true;
            } else {
              item.style.display = "none";
            }
          });
          if (esVisible) {
            section.style.display = "flex";
            section.querySelector("h3").style.display = "block";
          } else {
            section.style.display = "none";
            section.querySelector("h3").style.display = "none";
          }
        });
      }

    filtroSeleccionado.addEventListener("change", filtrarItems);
    input.addEventListener("input", filtrarItems);

    input.addEventListener("input", function () {
      const filtro = input.value.toLowerCase();
      const sections = document.querySelectorAll(".items");
      sections.forEach(section => {
        const items = section.querySelectorAll("figure");
        let esVisible = false;
        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          if (text.includes(filtro)) {
            item.style.display = "block"; 
            esVisible = true;
          } else {
            item.style.display = "none";
          }
        });
        if (esVisible || filtro === "") {
          section.style.display = "flex";
          section.querySelector("h3").style.display = "block";
        } else {
          section.style.display = "none";
          section.querySelector("h3").style.display = "none";
        }
      });
    });
});  